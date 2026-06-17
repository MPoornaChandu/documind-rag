"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft, Database, MessageSquareQuote, RotateCcw, ScanText } from "lucide-react"

import { AnimatedBackground } from "@/components/AnimatedBackground"
import { ChatPanel } from "@/components/ChatPanel"
import { EmptyState } from "@/components/EmptyState"
import { GlassCard } from "@/components/GlassCard"
import { UploadPanel } from "@/components/UploadPanel"

const STORAGE_KEY = "documind.latestDocument"
const SAVED_DOCUMENT_KEYS = [STORAGE_KEY, "documind.documentId", "documind.documentName", "documind.totalChunks"]

type StoredDocument = {
  documentId: string
  documentName: string
  totalChunks: number | null
}

function clearSavedDocument() {
  for (const key of SAVED_DOCUMENT_KEYS) {
    localStorage.removeItem(key)
  }
}

export default function AppPage() {
  const [document, setDocument] = useState<StoredDocument | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return
    }

    try {
      const parsed = JSON.parse(stored) as StoredDocument

      if (parsed.documentId && parsed.documentName) {
        setDocument({
          documentId: parsed.documentId,
          documentName: parsed.documentName,
          totalChunks: parsed.totalChunks ?? null,
        })
      }
    } catch {
      clearSavedDocument()
    }
  }, [])

  function handleUploadComplete(nextDocumentId: string, nextDocumentName: string, nextTotalChunks: number | null) {
    const nextDocument = {
      documentId: nextDocumentId,
      documentName: nextDocumentName,
      totalChunks: nextTotalChunks,
    }

    setDocument(nextDocument)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDocument))
  }

  function clearDocument() {
    setDocument(null)
    clearSavedDocument()
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-6 sm:px-6 lg:px-8">
      <AnimatedBackground />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(186,58,211,0.18),transparent_34rem)]" />

      <div className="relative mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm text-[#A7A7C7] transition hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to landing
            </Link>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F69CEB]/20 bg-[#5C14BB]/20 px-3 py-1 text-xs font-semibold text-[#F7D7F4]">
              Source-grounded chat
            </div>
            <h1 className="text-3xl font-black text-white sm:text-5xl">AI document workspace</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#A7A7C7]">
              Upload a PDF and let DocuMind build a searchable OCR knowledge layer before Gemini answers from retrieved
              source context.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              {[
                { label: "OCR intake", icon: ScanText },
                { label: "Vector workspace", icon: Database },
                { label: "Source-grounded chat", icon: MessageSquareQuote },
              ].map((item) => {
                const Icon = item.icon

                return (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.055] px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur-xl"
                  >
                    <Icon className="h-3.5 w-3.5 text-[#F69CEB]" />
                    {item.label}
                  </span>
                )
              })}
            </div>

            {document ? (
              <button
                type="button"
                onClick={clearDocument}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.055] px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-[#F69CEB]/50 hover:bg-white/[0.08] hover:shadow-glow"
              >
                <RotateCcw className="h-4 w-4" />
                Reset document
              </button>
            ) : null}
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.42fr]">
          <UploadPanel
            onUploadComplete={handleUploadComplete}
            onUploadFailed={clearDocument}
            documentName={document?.documentName ?? null}
            totalChunks={document?.totalChunks ?? null}
          />

          {document ? (
            <ChatPanel
              key={document.documentId}
              documentId={document.documentId}
              documentName={document.documentName}
              totalChunks={document.totalChunks}
            />
          ) : (
            <GlassCard className="min-h-[42rem]">
              <EmptyState variant="document" />
            </GlassCard>
          )}
        </div>
      </div>
    </main>
  )
}
