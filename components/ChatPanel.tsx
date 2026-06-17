"use client"

import { KeyboardEvent, useEffect, useRef, useState } from "react"
import { AlertCircle, FileText, SendHorizontal } from "lucide-react"

import { EmptyState } from "@/components/EmptyState"
import { GlassCard } from "@/components/GlassCard"
import { LoadingDots } from "@/components/LoadingDots"
import { MessageBubble } from "@/components/MessageBubble"
import type { ChatResponse, Message } from "@/lib/types"

type ChatPanelProps = {
  documentId: string
  documentName: string | null
  totalChunks: number | null
}

function createMessageId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
}

function normalizeChatErrorMessage(message: string) {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("vector search failed")) {
    return "Vector search failed. Please try re-uploading the document."
  }

  if (lowerMessage.includes("could not find relevant information") || lowerMessage.includes("could not find relevant chunks")) {
    return "I could not find relevant information in the uploaded document for this question. Try asking about the document summary, key points, dates, skills, or requirements."
  }

  if (lowerMessage.includes("could not find this information")) {
    return "I could not find this information in the uploaded document."
  }

  if (lowerMessage.includes("ai response was empty")) {
    return "I found relevant document sections, but the AI response was empty. Please try again."
  }

  if (
    lowerMessage.includes("gemini") ||
    lowerMessage.includes("quota") ||
    lowerMessage.includes("rate") ||
    lowerMessage.includes("timed out")
  ) {
    return "Gemini response failed. Please try again in a moment."
  }

  return message || "Gemini response failed. Please try again in a moment."
}

export function ChatPanel({ documentId, documentName, totalChunks }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  async function sendQuestion(questionText = input) {
    const question = questionText.trim()

    if (!question || isLoading) {
      return
    }

    setError(null)
    setInput("")
    setIsLoading(true)

    const userMessage: Message = {
      id: createMessageId(),
      role: "user",
      content: question,
      timestamp: new Date(),
    }

    setMessages((current) => [...current, userMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, documentId }),
      })
      let data: ChatResponse

      try {
        data = (await response.json()) as ChatResponse
      } catch {
        data = {
          answer: "",
          sources: [],
          error: "Gemini response failed. Please try again in a moment.",
        }
      }

      if (!response.ok) {
        throw new Error(data.error || "Gemini response failed. Please try again in a moment.")
      }

      if (!data.answer) {
        throw new Error(data.error || "Gemini response failed. Please try again in a moment.")
      }

      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: data.answer,
          sources: data.sources ?? [],
          timestamp: new Date(),
        },
      ])
    } catch (chatError) {
      const message =
        chatError instanceof TypeError
          ? "Network error. Please check that the local dev server is running and try again."
          : chatError instanceof Error
            ? normalizeChatErrorMessage(chatError.message)
            : "Gemini response failed. Please try again in a moment."
      setError(message)
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: message,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void sendQuestion()
    }
  }

  return (
    <GlassCard className="flex min-h-[42rem] flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.12] p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#BA3AD3]/10 text-[#F69CEB] shadow-glow">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F69CEB]">Vector workspace</p>
            <p className="truncate font-semibold text-white">{documentName ?? "Uploaded document"}</p>
            <p className="text-xs text-[#A7A7C7]">
              {totalChunks
                ? `${totalChunks} chunks indexed for source-grounded chat`
                : "Ask grounded questions with source citations"}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">Indexed</span>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <EmptyState variant="chat" onExampleClick={(question) => void sendQuestion(question)} />
        ) : null}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading ? (
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F69CEB]/25 bg-[#BA3AD3]/10 shadow-glow">
              <LoadingDots />
            </div>
            Retrieving source chunks and asking Gemini
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      {error ? (
        <div className="mx-5 mb-4 flex gap-3 rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : null}

      <div className="border-t border-white/[0.12] p-5">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={2}
            maxLength={1000}
            placeholder="Ask a source-grounded question about the uploaded PDF..."
            className="min-h-12 flex-1 resize-none rounded-lg border border-white/[0.12] bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#F69CEB]/55 focus:ring-2 focus:ring-[#BA3AD3]/20 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => void sendQuestion()}
            disabled={isLoading || !input.trim()}
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#5C14BB] to-[#BA3AD3] px-4 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
            aria-label="Ask AI"
          >
            <SendHorizontal className="h-5 w-5" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </div>
      </div>
    </GlassCard>
  )
}
