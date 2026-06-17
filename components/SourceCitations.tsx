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
    <div className="mt-4 rounded-lg border border-white/[0.12] bg-black/25">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-200"
      >
        <span className="inline-flex items-center gap-2">
          <Quote className="h-4 w-4 text-[#F69CEB]" />
          Sources used
          <span className="rounded-full bg-[#BA3AD3]/10 px-2 py-0.5 text-xs text-[#F7D7F4]">{sources.length}</span>
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
            <div className="space-y-3 border-t border-white/[0.12] p-4">
              {sources.map((source) => {
                const similarity = Math.max(0, Math.min(100, Math.round(source.similarity * 100)))

                return (
                  <div key={source.id} className="rounded-lg border border-white/[0.12] bg-white/[0.045] p-3">
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold text-white">Chunk #{source.chunkIndex + 1}</span>
                      <span className="rounded-full bg-[#5C14BB]/25 px-2 py-1 text-[#F7D7F4]">
                        {similarity}% match
                      </span>
                    </div>
                    <p className="text-xs leading-5 text-[#A7A7C7]">{sourcePreview(source.content)}</p>
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
