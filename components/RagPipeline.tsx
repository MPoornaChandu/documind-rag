"use client"

import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { Bot, Database, FileUp, Layers3, ScanText, Search, Sparkles } from "lucide-react"

const steps: Array<{
  title: string
  description: string
  icon: LucideIcon
}> = [
  {
    title: "PDF Upload",
    description: "The file lands in a node runtime route built for binary form data.",
    icon: FileUp,
  },
  {
    title: "Text Extraction",
    description: "pdf-parse extracts searchable text and rejects scanned image PDFs cleanly.",
    icon: ScanText,
  },
  {
    title: "Chunking",
    description: "Text is split into overlapping chunks with sentence-aware boundaries.",
    icon: Layers3,
  },
  {
    title: "Embeddings",
    description: "Gemini turns every passage into a 768-dimensional retrieval vector.",
    icon: Bot,
  },
  {
    title: "Supabase pgvector",
    description: "Chunks and vectors are stored in Postgres with pgvector indexing.",
    icon: Database,
  },
  {
    title: "Semantic Search",
    description: "The question vector retrieves the most relevant private document chunks.",
    icon: Search,
  },
  {
    title: "Gemini Answer",
    description: "The model answers only from retrieved context and returns sources.",
    icon: Sparkles,
  },
]

export function RagPipeline() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-blue-400 via-cyan-300 to-violet-400 opacity-60 lg:left-1/2 lg:block" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-7">
        {steps.map((step, index) => {
          const Icon = step.icon

          return (
            <motion.article
              key={step.title}
              className="glow-border group relative rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-white/[0.08] xl:min-h-[18rem]"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
            >
              {index < steps.length - 1 ? (
                <div className="pointer-events-none absolute left-1/2 top-full h-5 w-px bg-gradient-to-b from-cyan-300/60 to-transparent md:left-full md:top-1/2 md:h-px md:w-5 md:bg-gradient-to-r xl:block" />
              ) : null}
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-300/25 bg-blue-400/10 text-blue-100 shadow-[0_0_24px_rgba(59,130,246,0.18)]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-slate-300">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{step.description}</p>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
