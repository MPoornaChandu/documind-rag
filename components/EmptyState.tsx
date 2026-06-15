"use client"

import { Bot, FileUp, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

const exampleQuestions = [
  "Summarize this PDF",
  "What are the key points?",
  "Explain this document simply",
  "List important dates or numbers",
]

type EmptyStateProps = {
  variant?: "document" | "chat"
  onExampleClick?: (question: string) => void
  className?: string
}

export function EmptyState({ variant = "document", onExampleClick, className }: EmptyStateProps) {
  const isChat = variant === "chat"
  const Icon = isChat ? Bot : FileUp

  return (
    <div className={cn("flex min-h-[24rem] flex-col items-center justify-center px-6 py-10 text-center", className)}>
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-blue-300/20 bg-blue-400/10 text-blue-100 shadow-glow">
        <Icon className="h-7 w-7" />
      </div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-slate-300">
        <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
        {isChat ? "Ask with context" : "Document workspace"}
      </div>
      <h2 className="gradient-text max-w-md text-2xl font-bold">
        {isChat ? "Ask anything about your document" : "Upload a PDF to start chatting"}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
        {isChat
          ? "Questions are matched against your PDF chunks before Gemini writes an answer."
          : "Drop a text-based PDF on the left. DocuMind will extract, chunk, embed, and store it for retrieval."}
      </p>

      {isChat ? (
        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase text-cyan-100/70">Try demo questions</p>
          <div className="flex flex-wrap justify-center gap-2">
            {exampleQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onExampleClick?.(question)}
                className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
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
