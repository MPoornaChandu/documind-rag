"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft, RotateCcw } from "lucide-react"

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
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <AnimatedBackground />

      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to landing
            </Link>
            <h1 className="text-3xl font-black text-white sm:text-5xl">DocuMind RAG</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Upload a text-based PDF, then ask questions answered strictly from retrieved document chunks.
            </p>
          </div>

          {document ? (
            <button
              type="button"
              onClick={clearDocument}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-300/40 hover:bg-white/[0.08]"
            >
              <RotateCcw className="h-4 w-4" />
              Reset document
            </button>
          ) : null}
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
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
