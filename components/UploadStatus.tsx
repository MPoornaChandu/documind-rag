import { CheckCircle2, Loader2 } from "lucide-react"

import type { UploadStatus as UploadStatusType } from "@/lib/types"
import { cn } from "@/lib/utils"

const statusLabels: Partial<Record<UploadStatusType, string>> = {
  uploading: "Uploading PDF...",
  extracting: "Extracting text...",
  ocr: "Running Gemini OCR fallback...",
  chunking: "Splitting into chunks...",
  embedding: "Generating embeddings...",
  storing: "Storing vectors...",
  complete: "Ready to chat!",
}

export function UploadStatus({ status }: { status: UploadStatusType }) {
  if (status === "idle" || status === "error") {
    return null
  }

  const isComplete = status === "complete"
  const label = statusLabels[status] ?? "Processing PDF..."

  return (
    <div className="flex items-center gap-3 text-sm">
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full border",
          isComplete
            ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-200"
            : "border-cyan-300/40 bg-cyan-400/15 text-cyan-100",
        )}
      >
        {isComplete ? <CheckCircle2 className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
      </span>
      <span className="text-slate-200">{label}</span>
    </div>
  )
}
