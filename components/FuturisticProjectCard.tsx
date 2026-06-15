"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, FileSearch, Sparkles } from "lucide-react"

const tags = ["RAG", "Next.js", "Supabase / pgvector", "Gemini", "TypeScript"]

export function FuturisticProjectCard() {
  return (
    <motion.article
      className="glow-border mx-auto max-w-2xl rounded-3xl border border-blue-300/20 bg-[#0d1220]/86 p-7 shadow-glow backdrop-blur-2xl"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.015 }}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.22)]">
          <FileSearch className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-100">
            <Sparkles className="h-3.5 w-3.5" />
            Very in-demand
          </div>

          <h3 className="text-2xl font-bold text-white sm:text-3xl">RAG Document Chat App</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
            Upload any PDF, ask questions about it. Uses embeddings + vector search. Every AI company is hiring for
            RAG skills right now.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs text-slate-200">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2" aria-label="Hiring impact score: five out of five">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className="h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_14px_rgba(59,130,246,0.9)]" />
              ))}
            </div>

            <Link
              href="#architecture"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              How to build this
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
