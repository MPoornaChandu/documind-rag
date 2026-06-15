export type Document = {
  id: string
  name: string
  size: number
  totalChunks: number
  createdAt: string
}

export type DocumentChunk = {
  id: string
  documentId: string
  content: string
  chunkIndex: number
  startChar: number
  endChar: number
}

export type MatchedChunk = {
  id: string
  content: string
  chunkIndex: number
  similarity: number
}

export type UploadResponse = {
  success: boolean
  documentId?: string
  documentName?: string
  totalChunks?: number
  extractionMethod?: "pdf-parse" | "gemini-ocr"
  error?: string
}

export type ChatRequest = {
  question: string
  documentId: string
}

export type ChatResponse = {
  answer: string
  sources: MatchedChunk[]
  error?: string
}

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: MatchedChunk[]
  timestamp: Date
}

export type UploadStatus =
  | "idle"
  | "uploading"
  | "extracting"
  | "ocr"
  | "chunking"
  | "embedding"
  | "storing"
  | "complete"
  | "error"
