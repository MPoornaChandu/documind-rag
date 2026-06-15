"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ArrowDown, ArrowRight, FileText, Sparkles } from "lucide-react"

const floatingDocs = [
  { label: "PDF", className: "left-[8%] top-[22%] rotate-[-7deg]", delay: 0 },
  { label: "Chunks", className: "right-[12%] top-[18%] rotate-[6deg]", delay: 0.4 },
  { label: "Sources", className: "right-[18%] bottom-[20%] rotate-[-5deg]", delay: 0.8 },
]

export function PortalHero() {
  const portalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!portalRef.current) {
      return
    }

    const context = gsap.context(() => {
      gsap.to(".portal-ring", {
        rotate: 360,
        duration: 34,
        ease: "none",
        repeat: -1,
      })
      gsap.to(".portal-core", {
        scale: 1.08,
        opacity: 0.72,
        duration: 3.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    }, portalRef)

    return () => context.revert()
  }, [])

  return (
    <section className="relative min-h-[88vh] overflow-hidden px-6 pb-10 pt-20 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 opacity-55">
        <Image
          src="/images/documind-portal.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,15,0.96),rgba(10,10,15,0.72)_44%,rgba(10,10,15,0.3)),linear-gradient(0deg,rgba(10,10,15,1),transparent_32%,rgba(10,10,15,0.62))]" />

      <div ref={portalRef} className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="portal-core absolute right-[4%] top-[18%] h-[36rem] w-[36rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="portal-ring portal-glow absolute right-[8%] top-[21%] h-[28rem] w-[28rem] rounded-full border border-cyan-300/25" />
        {floatingDocs.map((doc) => (
          <motion.div
            key={doc.label}
            className={`floating-card absolute hidden rounded-2xl px-4 py-3 text-sm text-white md:flex ${doc.className}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: [0, -14, 0] }}
            transition={{ opacity: { duration: 0.8, delay: doc.delay }, y: { duration: 6, repeat: Infinity, delay: doc.delay } }}
          >
            <FileText className="mr-2 h-4 w-4 text-cyan-200" />
            {doc.label}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-white">
            DocuMind RAG
          </Link>
          <Link
            href="/app"
            className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur-xl transition hover:border-cyan-300/50 hover:bg-white/[0.1]"
          >
            Open App
          </Link>
        </nav>

        <div className="max-w-3xl pt-12">
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/25 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <Sparkles className="h-4 w-4" />
            Very in-demand AI skill
          </motion.div>

          <motion.h1
            className="max-w-3xl text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            Chat with any PDF using <span className="gradient-text">RAG AI</span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
          >
            Upload documents, ask questions, and get source-backed answers powered by embeddings, vector search, and
            Gemini.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
          >
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-glow transition hover:bg-cyan-100"
            >
              Launch DocuMind
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#pipeline"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:border-blue-300/50 hover:bg-white/[0.1]"
            >
              View RAG Pipeline
            </Link>
          </motion.div>
        </div>

        <motion.a
          href="#project-card"
          className="mt-auto inline-flex w-fit items-center gap-2 text-sm text-slate-400"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll to explore
          <ArrowDown className="h-4 w-4" />
        </motion.a>
      </div>
    </section>
  )
}
