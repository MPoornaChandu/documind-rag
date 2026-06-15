"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Quote } from "lucide-react"

import type { MatchedChunk } from "@/lib/types"
import { cn } from "@/lib/utils"

function sourcePreview(content: string) {
  const preview = content.replace(/\s+/g, " ").trim()

  return preview.length > 120 ? `${preview.slice(0, 120)}...` : preview
}

export function SourceCitations({ sources }: { sources: MatchedChunk[] }) {
  const [isOpen, setIsOpen] = useState(true)

  if (sources.length === 0) {
    return null
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-200"
      >
        <span className="inline-flex items-center gap-2">
          <Quote className="h-4 w-4 text-cyan-200" />
          Sources used
          <span className="rounded-full bg-cyan-300/10 px-2 py-0.5 text-xs text-cyan-100">{sources.length}</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-white/10 p-4">
              {sources.map((source) => {
                const similarity = Math.max(0, Math.min(100, Math.round(source.similarity * 100)))

                return (
                  <div key={source.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-white">Chunk #{source.chunkIndex + 1}</span>
                      <span className="rounded-full bg-blue-400/10 px-2 py-1 text-blue-100">{similarity}% match</span>
                    </div>
                    <p className="text-xs leading-5 text-slate-400">{sourcePreview(source.content)}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
