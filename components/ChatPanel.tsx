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
      const data = (await response.json()) as ChatResponse

      if (!response.ok) {
        throw new Error(data.error || "Could not answer this question. Please try again.")
      }

      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: data.answer,
          sources: data.sources,
          timestamp: new Date(),
        },
      ])
    } catch (chatError) {
      const message =
        chatError instanceof TypeError
          ? "Network error. Please check that the local dev server is running and try again."
          : chatError instanceof Error
            ? chatError.message
            : "Could not answer this question. Please try again."
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
      <div className="flex items-center justify-between gap-4 border-b border-white/10 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-100">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{documentName ?? "Uploaded document"}</p>
            <p className="text-xs text-slate-400">
              {totalChunks ? `${totalChunks} chunks indexed for source-backed answers` : "Ask grounded questions with source citations"}
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
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10">
              <LoadingDots />
            </div>
            Searching chunks and asking Gemini
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      {error ? (
        <div className="mx-5 mb-4 flex gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : null}

      <div className="border-t border-white/10 p-5">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={2}
            maxLength={1000}
            placeholder="Ask a question about the uploaded PDF..."
            className="min-h-12 flex-1 resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => void sendQuestion()}
            disabled={isLoading || !input.trim()}
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 text-sm font-bold text-white shadow-glow transition hover:bg-blue-400 disabled:opacity-50"
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
