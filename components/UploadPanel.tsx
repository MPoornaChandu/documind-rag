"use client"

import { DragEvent, useEffect, useRef, useState } from "react"
import { AlertCircle, CheckCircle2, FileText, FileUp, Loader2, UploadCloud } from "lucide-react"

import { GlassCard } from "@/components/GlassCard"
import { UploadStatus } from "@/components/UploadStatus"
import type { UploadResponse, UploadStatus as UploadStatusType } from "@/lib/types"
import { cn, formatFileSize } from "@/lib/utils"

const MAX_FILE_SIZE = 10 * 1024 * 1024
const busyStatuses: UploadStatusType[] = ["uploading", "extracting", "ocr", "chunking", "embedding", "storing"]

type UploadPanelProps = {
  onUploadComplete: (documentId: string, documentName: string, totalChunks: number | null) => void
  onUploadFailed: () => void
  documentName: string | null
  totalChunks: number | null
}

function validatePdf(file: File) {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

  if (!isPdf) {
    return "Please upload a valid PDF file."
  }

  if (file.size > MAX_FILE_SIZE) {
    return "File too large. Please upload a PDF under 10MB."
  }

  return null
}

function normalizeUploadErrorMessage(message: string) {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("gemini ocr timed out")) {
    return "Gemini OCR timed out. Try a smaller or clearer PDF."
  }

  if (
    lowerMessage.includes("no readable") ||
    lowerMessage.includes("not readable enough") ||
    lowerMessage.includes("readable chunks")
  ) {
    return "No readable text could be extracted. Try a clearer PDF."
  }

  if (
    lowerMessage.includes("supabase") ||
    lowerMessage.includes("vector") ||
    lowerMessage.includes("embedding") ||
    lowerMessage.includes("insert failed")
  ) {
    return "Vector storage failed. Please retry."
  }

  if (lowerMessage.includes("timed out") || lowerMessage.includes("abort")) {
    return "Upload took too long. Try a smaller PDF."
  }

  return message || "Could not process this PDF. Please try again."
}

function getUploadErrorMessage(error: unknown) {
  if (error instanceof Error && error.name === "AbortError") {
    return "Upload took too long. Try a smaller PDF."
  }

  if (error instanceof TypeError) {
    return "Upload request was interrupted. Try a smaller PDF or retry."
  }

  if (error instanceof Error) {
    return normalizeUploadErrorMessage(error.message)
  }

  return "Could not process this PDF. Please try again."
}

export function UploadPanel({ onUploadComplete, onUploadFailed, documentName, totalChunks }: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatusType>("idle")
  const [error, setError] = useState<string | null>(null)
  const [extractionMethod, setExtractionMethod] = useState<UploadResponse["extractionMethod"] | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const uploadTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const isBusy = busyStatuses.includes(status)

  function clearUploadTimers() {
    for (const timer of uploadTimersRef.current) {
      clearTimeout(timer)
    }

    uploadTimersRef.current = []
  }

  function startUploadStatusTimers() {
    clearUploadTimers()
    uploadTimersRef.current = [
      setTimeout(() => setStatus("extracting"), 500),
      setTimeout(() => setStatus("ocr"), 3500),
      setTimeout(() => setStatus("chunking"), 8000),
      setTimeout(() => setStatus("embedding"), 10000),
      setTimeout(() => setStatus("storing"), 13000),
    ]
  }

  useEffect(() => clearUploadTimers, [])

  function chooseFile(file: File | undefined) {
    if (!file || isBusy) {
      return
    }

    const validationError = validatePdf(file)

    if (validationError) {
      setSelectedFile(null)
      setStatus("error")
      setError(validationError)
      setExtractionMethod(null)
      onUploadFailed()
      return
    }

    setSelectedFile(file)
    setError(null)
    setExtractionMethod(null)
    setStatus("idle")
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    chooseFile(event.dataTransfer.files[0])
  }

  async function handleUpload() {
    if (!selectedFile || isBusy) {
      return
    }

    setError(null)
    setExtractionMethod(null)
    setStatus("uploading")
    startUploadStatusTimers()

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      const controller = new AbortController()
      const uploadTimeout = setTimeout(() => controller.abort(), 90000)

      let response: Response

      try {
        response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        })
      } finally {
        clearTimeout(uploadTimeout)
      }

      let data: UploadResponse

      try {
        data = (await response.json()) as UploadResponse
      } catch {
        data = { success: false, error: "Could not read upload response. Please try again." }
      }

      if (!response.ok || !data.success || !data.documentId || !data.documentName) {
        throw new Error(data.error || "Could not process this PDF. Please try again.")
      }

      clearUploadTimers()
      setStatus("complete")
      setExtractionMethod(data.extractionMethod ?? null)
      setSelectedFile(null)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
      onUploadComplete(data.documentId, data.documentName, data.totalChunks ?? null)
    } catch (uploadError) {
      clearUploadTimers()
      onUploadFailed()
      setStatus("error")
      setExtractionMethod(null)
      setError(getUploadErrorMessage(uploadError))
    }
  }

  async function handleDemoDocument() {
    if (isBusy) {
      return
    }

    setError(null)
    setExtractionMethod(null)
    setStatus("embedding")

    try {
      const response = await fetch("/api/demo-document", {
        method: "POST",
      })
      let data: UploadResponse

      try {
        data = (await response.json()) as UploadResponse
      } catch {
        data = { success: false, error: "Could not read demo response. Please try again." }
      }

      if (!response.ok || !data.success || !data.documentId || !data.documentName) {
        throw new Error(data.error || "Could not create demo document. Please try again.")
      }

      setStatus("complete")
      setExtractionMethod(null)
      setSelectedFile(null)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
      onUploadComplete(data.documentId, data.documentName, data.totalChunks ?? null)
    } catch (demoError) {
      onUploadFailed()
      setStatus("error")
      setExtractionMethod(null)
      setError(getUploadErrorMessage(demoError))
    }
  }

  function openFileSelector() {
    if (!isBusy) {
      inputRef.current?.click()
    }
  }

  return (
    <GlassCard className="relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_50%_0%,rgba(246,156,235,0.16),transparent_18rem)]" />
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#F69CEB]">OCR intake</p>
          <h1 className="mt-2 text-2xl font-bold text-white">OCR intake station</h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[#A7A7C7]">
            Gemini OCR supports scanned/design PDFs. Clear files under 10MB work best.
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#BA3AD3]/10 text-[#F69CEB] shadow-glow">
          <FileUp className="h-5 w-5" />
        </div>
      </div>

      <div
        onClick={openFileSelector}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "cursor-pointer rounded-lg border border-dashed border-white/[0.15] bg-white/[0.035] p-6 text-center transition",
          "hover:border-[#F69CEB]/50 hover:bg-[#BA3AD3]/[0.06]",
          isDragging && "border-[#F69CEB]/70 bg-[#BA3AD3]/10 shadow-glow",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(event) => chooseFile(event.target.files?.[0])}
          disabled={isBusy}
        />
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-lg border border-[#F69CEB]/20 bg-[#BA3AD3]/10 text-[#F69CEB]">
          <UploadCloud className="h-7 w-7" />
        </div>
        <p className="font-semibold text-white">Drag and drop a PDF here</p>
        <p className="mt-2 text-sm text-[#A7A7C7]">or click to select a file under 10MB</p>
        <p className="mx-auto mt-3 max-w-sm text-xs leading-5 text-[#A7A7C7]/75">
          Upload a PDF and let DocuMind build a searchable OCR knowledge layer.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#A7A7C7]/75">
          Fast demo mode indexes the most relevant readable sections first.
        </p>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            openFileSelector()
          }}
          disabled={isBusy}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-[#F69CEB]/30 bg-[#BA3AD3]/10 px-4 py-2 text-sm font-semibold text-[#F7D7F4] transition hover:border-[#F69CEB]/60 hover:bg-[#BA3AD3]/[0.15] disabled:opacity-50"
        >
          <FileUp className="h-4 w-4" />
          Upload PDF
        </button>
      </div>

      {selectedFile ? (
        <div className="mt-5 rounded-lg border border-white/[0.12] bg-white/[0.04] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#BA3AD3]/10 text-[#F69CEB]">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!selectedFile || isBusy}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_0_32px_rgba(246,156,235,0.28)] transition hover:bg-[#F7D7F4] hover:shadow-glow disabled:opacity-50"
      >
        {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
        {isBusy ? "Building OCR layer" : "Build OCR knowledge layer"}
      </button>

      <button
        type="button"
        onClick={handleDemoDocument}
        disabled={isBusy}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#F69CEB]/30 bg-[#BA3AD3]/10 px-5 py-3 text-sm font-semibold text-[#F7D7F4] transition hover:border-[#F69CEB]/60 hover:bg-[#BA3AD3]/[0.15] disabled:opacity-50"
      >
        <FileText className="h-4 w-4" />
        Use sample OCR document
      </button>

      <div className="mt-6">
        <UploadStatus status={status} />
      </div>

      {error ? (
        <div className="mt-5 flex gap-3 rounded-lg border border-red-400/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : null}

      {documentName && !error ? (
        <div className="mt-5 rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-200" />
            <div>
              <p className="text-sm font-semibold text-white">{documentName}</p>
              <p className="mt-1 text-xs text-emerald-100/80">
                {totalChunks ? `${totalChunks} chunks stored and ready for retrieval.` : "Ready for document chat."}
              </p>
              {extractionMethod === "gemini-ocr" ? (
                <p className="mt-1 text-xs text-emerald-100/80">Text extracted using Gemini OCR.</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </GlassCard>
  )
}
