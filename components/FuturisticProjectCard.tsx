"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, FileSearch, Sparkles } from "lucide-react"

const tags = ["OCR", "RAG", "Gemini", "pgvector", "Next.js", "TypeScript"]

export function FuturisticProjectCard() {
  return (
    <motion.article
      className="premium-sweep glow-border mx-auto max-w-3xl rounded-lg border border-[#F69CEB]/[0.18] bg-[linear-gradient(135deg,rgba(255,255,255,0.095),rgba(255,255,255,0.035)),rgba(8,0,20,0.88)] p-7 shadow-[0_28px_100px_rgba(0,0,0,0.44),0_0_55px_rgba(186,58,211,0.16)] backdrop-blur-2xl sm:p-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.012 }}
    >
      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-[#F69CEB]/25 bg-[#BA3AD3]/[0.12] text-[#F69CEB] shadow-[0_0_34px_rgba(186,58,211,0.28)]">
          <FileSearch className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F69CEB]/25 bg-[#5C14BB]/20 px-3 py-1 text-xs font-semibold text-[#F7D7F4]">
            <Sparkles className="h-3.5 w-3.5" />
            Very in-demand
          </div>

          <h3 className="text-2xl font-bold text-white sm:text-3xl">OCR + RAG Document Chat App</h3>
          <p className="mt-3 text-sm leading-6 text-[#A7A7C7] sm:text-base">
            Upload PDFs, extract text with Gemini OCR, retrieve relevant chunks with Supabase pgvector, and get
            source-grounded answers.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.12] bg-white/[0.06] px-3 py-1 text-xs font-medium text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A7A7C7]">Hiring impact</p>
              <div className="flex items-center gap-2" aria-label="Hiring impact score: five out of five">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className="h-2.5 w-2.5 rounded-full bg-[#F69CEB] shadow-[0_0_16px_rgba(246,156,235,0.95)]"
                  />
                ))}
              </div>
            </div>

            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_0_30px_rgba(246,156,235,0.28)] transition hover:bg-[#F7D7F4] hover:shadow-glow"
            >
              Open project workspace
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
