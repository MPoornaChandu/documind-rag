"use client"

import { Sparkles } from "lucide-react"

import { AIAssistantVisual } from "@/components/AIAssistantVisual"
import { cn } from "@/lib/utils"

const exampleQuestions = [
  "What is this document about?",
  "Summarize the key points",
  "List important dates and numbers",
  "What requirements are mentioned?",
  "Explain this in simple words",
]

type EmptyStateProps = {
  variant?: "document" | "chat"
  onExampleClick?: (question: string) => void
  className?: string
}

export function EmptyState({ variant = "document", onExampleClick, className }: EmptyStateProps) {
  const isChat = variant === "chat"

  return (
    <div className={cn("flex min-h-[24rem] flex-col items-center justify-center px-6 py-10 text-center", className)}>
      <AIAssistantVisual compact className="mb-5" />
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F69CEB]/20 bg-white/[0.06] px-3 py-1 text-xs font-medium text-[#F7D7F4]">
        <Sparkles className="h-3.5 w-3.5 text-[#F69CEB]" />
        {isChat ? "Vector workspace" : "OCR intake"}
      </div>
      <h2 className="gradient-text max-w-md text-2xl font-bold">
        {isChat ? "Ask your PDF with source-backed context" : "Upload a PDF and let DocuMind build a searchable OCR knowledge layer."}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-[#A7A7C7]">
        {isChat
          ? "Questions are embedded, matched against retrieved chunks, and answered by Gemini from document context."
          : "Gemini OCR extracts readable text from PDFs, creates embeddings, and prepares source-grounded chat."}
      </p>

      {isChat ? (
        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F69CEB]/80">
            Suggested questions
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {exampleQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onExampleClick?.(question)}
                className="rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm text-slate-200 transition hover:border-[#F69CEB]/50 hover:bg-[#BA3AD3]/10 hover:text-white hover:shadow-glow"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
