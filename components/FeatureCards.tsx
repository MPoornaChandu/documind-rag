"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { FileUp, MessageSquareQuote, Search, ShieldCheck } from "lucide-react"

const features: Array<{
  title: string
  description: string
  icon: LucideIcon
}> = [
  {
    title: "PDF Upload",
    description: "Drop in a document and move from static pages to a searchable AI workspace.",
    icon: FileUp,
  },
  {
    title: "Semantic Vector Search",
    description: "Gemini embeddings and pgvector find the chunks that actually match the question.",
    icon: Search,
  },
  {
    title: "Source Citations",
    description: "Every answer returns the document chunks used, with similarity scores and previews.",
    icon: MessageSquareQuote,
  },
  {
    title: "Strict Document-Only Answers",
    description: "The assistant is prompted to stay inside the uploaded PDF and refuse unsupported claims.",
    icon: ShieldCheck,
  },
]

export function FeatureCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => {
        const Icon = feature.icon

        return (
          <motion.article
            key={feature.title}
            className="group rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/[0.08]"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            whileHover={{ y: -6, scale: 1.015 }}
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.14)]">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
          </motion.article>
        )
      })}
    </div>
  )
}
