"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowDown, ArrowRight, ExternalLink, Sparkles } from "lucide-react"

import { AIAssistantVisual } from "@/components/AIAssistantVisual"

export function PortalHero() {
  return (
    <section className="relative flex min-h-screen overflow-hidden px-6 pb-10 pt-20 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_58%_48%,rgba(186,58,211,0.18),transparent_30rem),linear-gradient(90deg,rgba(0,0,0,0.96),rgba(0,0,0,0.68)_48%,rgba(0,0,0,0.34))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-[52%] z-0 w-[min(92vw,43rem)] -translate-x-1/2 -translate-y-1/2 opacity-95 lg:left-[63%] lg:w-[44rem]">
        <AIAssistantVisual />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col">
        <nav className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F69CEB] shadow-[0_0_18px_rgba(246,156,235,0.9)]" />
            DocuMind RAG
          </Link>
          <Link
            href="/app"
            className="rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm font-medium text-white backdrop-blur-xl transition hover:border-[#F69CEB]/50 hover:bg-white/[0.1] hover:shadow-glow"
          >
            Open Live App
          </Link>
        </nav>

        <div className="flex flex-1 items-center py-16 sm:py-20">
          <div className="max-w-3xl">
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F69CEB]/25 bg-[#5C14BB]/20 px-4 py-2 text-sm font-semibold text-[#F7D7F4] backdrop-blur-xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <Sparkles className="h-4 w-4" />
              OCR-powered RAG AI
            </motion.div>

            <motion.h1
              className="max-w-4xl text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
            >
              Chat with any PDF using <span className="gradient-text">OCR-powered RAG</span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-2xl text-lg leading-8 text-[#A7A7C7] sm:text-xl"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
            >
              Gemini OCR extracts readable text from PDFs, DocuMind stores embeddings in Supabase pgvector, and Gemini
              answers with source-backed context.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
            >
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_36px_rgba(246,156,235,0.38)] transition hover:bg-[#F7D7F4] hover:shadow-glow"
              >
                Open Live App
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/MPoornaChandu/documind-rag"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:border-[#F69CEB]/55 hover:bg-white/[0.1] hover:shadow-glow"
              >
                View GitHub
                <ExternalLink className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>

        <motion.a
          href="#pipeline"
          className="mb-3 inline-flex w-fit items-center gap-2 text-sm font-medium text-[#A7A7C7] transition hover:text-white"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Explore the pipeline
          <ArrowDown className="h-4 w-4" />
        </motion.a>
      </div>
    </section>
  )
}
