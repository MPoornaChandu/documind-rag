"use client"

import { motion } from "framer-motion"
import { Bot, FileText, UserRound } from "lucide-react"

import { GlassCard } from "@/components/GlassCard"

const sourceChunks = ["Chunk #2", "Chunk #4", "Chunk #6"]

export function ChatPreview() {
  return (
    <GlassCard className="overflow-hidden p-5">
      <div className="mb-5 flex items-center justify-between border-b border-white/[0.12] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#BA3AD3]/[0.15] text-[#F69CEB] shadow-glow">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-white">DocuMind RAG</p>
            <p className="text-xs text-[#A7A7C7]">OCR-grounded assistant</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">Ready</span>
      </div>

      <div className="space-y-4">
        <motion.div
          className="ml-auto max-w-[82%] rounded-lg bg-gradient-to-br from-[#5C14BB] via-[#BA3AD3] to-[#F69CEB] px-5 py-4 text-sm leading-6 text-white shadow-glow"
          initial={{ opacity: 0, x: 26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#F7D7F4]">
            <UserRound className="h-3.5 w-3.5" />
            User
          </div>
          What is this document about?
        </motion.div>

        <motion.div
          className="max-w-[90%] rounded-lg border border-white/[0.12] bg-white/[0.06] px-5 py-4 text-sm leading-6 text-slate-200 backdrop-blur-xl"
          initial={{ opacity: 0, x: -26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#F7D7F4]">
            <FileText className="h-3.5 w-3.5" />
            AI
          </div>
          Gemini OCR extracted readable text from the PDF, retrieval found the most relevant chunks, and this answer
          stays grounded in that context with source citations.
          <div className="mt-4 flex flex-wrap gap-2">
            {sourceChunks.map((chunk) => (
              <span
                key={chunk}
                className="rounded-full border border-[#F69CEB]/20 bg-[#BA3AD3]/10 px-3 py-1 text-xs text-[#F7D7F4]"
              >
                {chunk}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </GlassCard>
  )
}
