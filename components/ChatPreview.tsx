"use client"

import { motion } from "framer-motion"
import { Bot, FileText, UserRound } from "lucide-react"

import { GlassCard } from "@/components/GlassCard"

const sourceChunks = ["Chunk #2", "Chunk #4", "Chunk #6"]

export function ChatPreview() {
  return (
    <GlassCard className="overflow-hidden p-5">
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-400/15 text-blue-100 shadow-glow">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-white">DocuMind RAG</p>
            <p className="text-xs text-slate-400">Document-only assistant</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">Ready</span>
      </div>

      <div className="space-y-4">
        <motion.div
          className="ml-auto max-w-[82%] rounded-3xl rounded-br-lg bg-gradient-to-br from-blue-500 to-cyan-500 px-5 py-4 text-sm leading-6 text-white shadow-glow"
          initial={{ opacity: 0, x: 26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-blue-50">
            <UserRound className="h-3.5 w-3.5" />
            User
          </div>
          Summarize this PDF
        </motion.div>

        <motion.div
          className="max-w-[90%] rounded-3xl rounded-bl-lg border border-white/10 bg-white/[0.06] px-5 py-4 text-sm leading-6 text-slate-200 backdrop-blur-xl"
          initial={{ opacity: 0, x: -26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-cyan-100">
            <FileText className="h-3.5 w-3.5" />
            AI
          </div>
          Based on the uploaded document, here are the key points from the most relevant chunks. The answer stays
          grounded in the retrieved context and avoids unsupported details.
          <div className="mt-4 flex flex-wrap gap-2">
            {sourceChunks.map((chunk) => (
              <span
                key={chunk}
                className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100"
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
