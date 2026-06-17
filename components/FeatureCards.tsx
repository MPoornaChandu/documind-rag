"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { FileUp, MessageSquareQuote, ScanText, Search } from "lucide-react"

const features: Array<{
  title: string
  description: string
  icon: LucideIcon
}> = [
  {
    title: "Gemini OCR Extraction",
    description: "Upload clear PDFs and let Gemini OCR extract readable text before indexing.",
    icon: FileUp,
  },
  {
    title: "Supabase pgvector Search",
    description: "768-dimensional Gemini embeddings and pgvector find the chunks that actually match the question.",
    icon: Search,
  },
  {
    title: "Source-Grounded Answers",
    description: "Every response is written from retrieved document chunks and returned with citations.",
    icon: MessageSquareQuote,
  },
  {
    title: "Reliable Text Handling",
    description: "Sanitization, readability checks, and timeouts keep bad PDF text out of the vector store.",
    icon: ScanText,
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
            className="group rounded-lg border border-white/[0.12] bg-white/[0.055] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#F69CEB]/45 hover:bg-white/[0.08] hover:shadow-glow"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            whileHover={{ y: -6, scale: 1.015 }}
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-[#F69CEB]/20 bg-[#BA3AD3]/10 text-[#F69CEB] shadow-[0_0_22px_rgba(186,58,211,0.18)]">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#A7A7C7]">{feature.description}</p>
          </motion.article>
        )
      })}
    </div>
  )
}
