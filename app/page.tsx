import Link from "next/link"
import { ArrowRight, CheckCircle2, Code, ExternalLink, FileText, ShieldCheck, Sparkles } from "lucide-react"

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
  "Gemini OCR",
  "Text Sanitization",
  "Chunking",
  "Gemini Embeddings",
  "Supabase pgvector",
  "Semantic Retrieval",
  "Gemini Answer + Sources",
]

const engineeredItems = [
  {
    title: "Gemini OCR extraction",
    detail: "PDF bytes are sent through Gemini OCR so readable text can be recovered from normal, scanned, or designed files.",
  },
  {
    title: "Unicode/text sanitization",
    detail: "Control characters, invalid Unicode, and noisy spacing are normalized before the database ever sees the text.",
  },
  {
    title: "Readability checks before indexing",
    detail: "Bad OCR output is rejected early, which keeps broken text out of the vector layer.",
  },
  {
    title: "768-dimensional Gemini embeddings",
    detail: "Each readable section is embedded into the vector shape expected by the pgvector search function.",
  },
  {
    title: "Supabase pgvector retrieval",
    detail: "Document chunks are matched semantically against the question embedding inside PostgreSQL.",
  },
  {
    title: "Source citations",
    detail: "Answers carry chunk-level sources so the user can inspect what context was used.",
  },
  {
    title: "Timeout handling",
    detail: "OCR, embedding, storage, and chat calls have bounded waits with clear recovery messages.",
  },
  {
    title: "Server-side secret protection",
    detail: "Gemini and Supabase service credentials stay inside server routes, never client components.",
  },
  {
    title: "Vercel deployment",
    detail: "The app is ready for the hosted demo workflow with production route protections in place.",
  },
]

export default function HomePage() {
  return (
    <main data-page-scroll className="relative h-screen overflow-x-hidden overflow-y-auto bg-black">
      <AnimatedBackground />
      <PortalHero />

      <section id="project-card" className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-semibold text-[#F69CEB]">Portfolio-grade AI product</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
              OCR-powered RAG with a premium assistant interface
            </h2>
            <p className="mt-4 text-base leading-7 text-[#A7A7C7]">
              DocuMind combines Gemini OCR, Supabase pgvector, and source-grounded answers inside a polished document
              workspace.
            </p>
          </div>
          <FuturisticProjectCard />
        </div>
      </section>

      <section id="pipeline" className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-semibold text-[#F69CEB]">RAG pipeline</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
              From messy PDF to source-grounded answer
            </h2>
            <p className="mt-4 text-base leading-7 text-[#A7A7C7]">
              DocuMind turns unstructured PDFs into searchable vector knowledge and answers only from retrieved context.
            </p>
          </div>
          <RagPipeline />
        </div>
      </section>

      <section id="engineered" className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#F69CEB]">Engineering showcase</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">What I engineered</h2>
              <p className="mt-4 text-base leading-7 text-[#A7A7C7]">
                The project is built around the practical parts that make OCR-powered RAG reliable: text quality,
                bounded server work, vector retrieval, and source-backed UX.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#F69CEB]/20 bg-white/[0.06] px-4 py-2 text-sm text-[#F7D7F4]">
              <ShieldCheck className="h-4 w-4" />
              Server-side secrets protected
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {engineeredItems.map((item, index) => (
              <article
                key={item.title}
                className="group rounded-lg border border-white/[0.12] bg-white/[0.055] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#F69CEB]/45 hover:bg-white/[0.08] hover:shadow-glow"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F69CEB]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#A7A7C7]">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture" className="relative px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <GlassCard className="p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#BA3AD3]/10 text-[#F69CEB]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Architecture flow</h3>
                <p className="text-sm text-[#A7A7C7]">OCR-only upload pipeline powered by Gemini</p>
              </div>
            </div>

            <ol className="grid gap-3 sm:grid-cols-2">
              {architectureSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.12] bg-white/[0.045] p-3 text-sm text-slate-200"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5C14BB]/30 text-xs font-bold text-[#F7D7F4]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">{step}</span>
                  {index < architectureSteps.length - 1 ? (
                    <ArrowRight className="hidden h-4 w-4 text-[#F69CEB] sm:block" />
                  ) : null}
                </li>
              ))}
            </ol>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-[#F69CEB]/20 bg-[#5C14BB]/20 text-[#F69CEB]">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-[#F69CEB]">Production-minded guardrails</p>
            <p className="mt-4 text-base font-semibold leading-7 text-white">
              Fast demo mode indexes the most relevant readable sections first. Clear PDFs under 10MB work best, and
              very blurry scans may still fail OCR.
            </p>
          </GlassCard>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-[#F69CEB]">Source-grounded chat preview</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">Answers with receipts, not guesses</h2>
            <p className="mt-4 text-base leading-7 text-[#A7A7C7]">
              The chat workspace keeps source citations close to the answer while preserving a smooth AI assistant feel.
            </p>
          </div>

          <ChatPreview />
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#F69CEB]">Core capabilities</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">Built for the full OCR-RAG loop</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Context-first answer behavior
            </div>
          </div>
          <FeatureCards />
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-[#F69CEB]/20 bg-[#BA3AD3]/10 text-[#F69CEB]">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-[#F69CEB]">Tech stack</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
            Modern tools, production-minded architecture
          </h2>
          <TechBadges className="mt-10" />
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-white/[0.12] bg-[radial-gradient(circle_at_24%_18%,rgba(246,156,235,0.18),transparent_24rem),rgba(255,255,255,0.06)] p-8 text-center shadow-violet-glow backdrop-blur-xl sm:p-14">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-[#F69CEB]/20 bg-[#5C14BB]/20 text-[#F69CEB]">
            <FileText className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-5xl">Ready to chat with your documents?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#A7A7C7]">
            Open the app, upload a PDF, and ask OCR-powered questions with chunk-level citations.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_34px_rgba(246,156,235,0.34)] transition hover:bg-[#F7D7F4] hover:shadow-glow"
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
              <Code className="h-4 w-4" />
              View GitHub
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
