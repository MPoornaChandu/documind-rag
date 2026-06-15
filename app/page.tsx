import Link from "next/link"
import { ArrowRight, FileText, ShieldCheck, Sparkles } from "lucide-react"

import { AnimatedBackground } from "@/components/AnimatedBackground"
import { ChatPreview } from "@/components/ChatPreview"
import { FeatureCards } from "@/components/FeatureCards"
import { Footer } from "@/components/Footer"
import { FuturisticProjectCard } from "@/components/FuturisticProjectCard"
import { GlassCard } from "@/components/GlassCard"
import { PortalHero } from "@/components/PortalHero"
import { RagPipeline } from "@/components/RagPipeline"
import { TechBadges } from "@/components/TechBadges"

const architectureSteps = [
  "PDF Upload",
  "Text Extraction",
  "Chunking",
  "Embeddings",
  "Supabase pgvector",
  "Semantic Search",
  "Gemini Answer",
]

export default function HomePage() {
  return (
    <main data-page-scroll className="relative h-screen overflow-x-hidden overflow-y-auto">
      <AnimatedBackground />
      <PortalHero />

      <section id="project-card" className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-semibold text-cyan-200">Portfolio-grade AI build</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">A RAG project that looks as sharp as it works</h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              The app pairs a production-style retrieval pipeline with a polished interface that feels built for modern
              AI teams.
            </p>
          </div>
          <FuturisticProjectCard />
        </div>
      </section>

      <section id="pipeline" className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-semibold text-blue-200">RAG pipeline story</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">PDF Upload to Gemini Answer</h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Every answer flows through retrieval first, so the model responds from the uploaded PDF instead of
              general memory.
            </p>
          </div>
          <RagPipeline />
        </div>
      </section>

      <section id="architecture" className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-semibold text-cyan-200">Architecture and build</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">How the private-document answer loop works</h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              The app keeps generation behind retrieval, so the final answer is grounded in the user-uploaded PDF.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <GlassCard className="p-6 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-100">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">RAG architecture</h3>
                  <p className="text-sm text-slate-400">Upload to grounded answer</p>
                </div>
              </div>

              <ol className="grid gap-3 sm:grid-cols-2">
                {architectureSteps.map((step, index) => (
                  <li
                    key={step}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-200"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-400/10 text-xs font-bold text-blue-100">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">{step}</span>
                    {index < architectureSteps.length - 1 ? <ArrowRight className="hidden h-4 w-4 text-cyan-200 sm:block" /> : null}
                  </li>
                ))}
              </ol>
            </GlassCard>

            <GlassCard className="p-6 sm:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-violet-100">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-violet-200">Why this project matters</p>
              <p className="mt-4 text-lg font-semibold leading-8 text-white">
                RAG is one of the most in-demand AI engineering skills because companies need AI systems that answer
                from private documents instead of general internet knowledge.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-violet-200">Interactive chat preview</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">Answers with receipts, not guesses</h2>
            <p className="mt-4 text-base leading-7 text-slate-400">
              The UI keeps source citations visible without making the conversation feel clinical.
            </p>
          </div>

          <ChatPreview />
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-cyan-200">Core features</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">Built for the full RAG loop</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Strict context-first behavior
            </div>
          </div>
          <FeatureCards />
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-3xl border border-violet-300/20 bg-violet-400/10 text-violet-100">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-violet-200">Tech stack</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">Modern tools, production-minded architecture</h2>
          <TechBadges className="mt-10" />
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.16),transparent_24rem),rgba(255,255,255,0.055)] p-8 text-center shadow-violet-glow backdrop-blur-xl sm:p-14">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-3xl border border-blue-300/20 bg-blue-400/10 text-blue-100">
            <FileText className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-5xl">Ready to chat with your documents?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400">
            Open the app, upload a PDF, and ask grounded questions with chunk-level citations.
          </p>
          <Link
            href="/app"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-glow transition hover:bg-cyan-100"
          >
            Open App
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
