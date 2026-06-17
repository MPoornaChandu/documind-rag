"use client"

import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { Bot, Database, FileUp, Layers3, MessageSquareQuote, ScanText, Search, ShieldCheck } from "lucide-react"

const steps: Array<{
  title: string
  description: string
  icon: LucideIcon
}> = [
  {
    title: "PDF Upload",
    description: "A PDF enters the secure server route for OCR intake and size validation.",
    icon: FileUp,
  },
  {
    title: "Gemini OCR",
    description: "Gemini OCR extracts readable text from PDFs, including scanned or designed pages when clear.",
    icon: ScanText,
  },
  {
    title: "Text Cleaning",
    description: "Unicode cleanup, spacing normalization, and control-character removal prepare text for storage.",
    icon: ShieldCheck,
  },
  {
    title: "Chunking",
    description: "Readable sections are split into focused retrieval units with stable chunk metadata.",
    icon: Layers3,
  },
  {
    title: "Gemini Embeddings",
    description: "Each chunk becomes a 768-dimensional Gemini vector for semantic matching.",
    icon: Bot,
  },
  {
    title: "Supabase pgvector",
    description: "Vectors and source text are stored in PostgreSQL with pgvector retrieval support.",
    icon: Database,
  },
  {
    title: "Semantic Retrieval",
    description: "The question embedding finds the most relevant readable sections first.",
    icon: Search,
  },
  {
    title: "Source-Grounded Answer",
    description: "Gemini answers only from retrieved context and returns the supporting source chunks.",
    icon: MessageSquareQuote,
  },
]

export function RagPipeline() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-1/2 top-12 hidden h-px w-[82%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#F69CEB]/50 to-transparent lg:block" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon

          return (
            <motion.article
              key={step.title}
              className="glow-border group relative rounded-lg border border-white/[0.12] bg-white/[0.055] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#F69CEB]/45 hover:bg-white/[0.08] xl:min-h-[17rem]"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
            >
              {index < steps.length - 1 ? (
                <div className="pointer-events-none absolute left-1/2 top-full h-4 w-px bg-gradient-to-b from-[#F69CEB]/55 to-transparent md:left-full md:top-1/2 md:h-px md:w-4 md:bg-gradient-to-r" />
              ) : null}

              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#F69CEB]/25 bg-[#BA3AD3]/10 text-[#F69CEB] shadow-[0_0_24px_rgba(186,58,211,0.22)]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-white/[0.12] bg-black/25 px-3 py-1 text-xs font-semibold text-[#F7D7F4]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#A7A7C7]">{step.description}</p>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
