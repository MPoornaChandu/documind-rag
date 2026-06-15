import { NextResponse } from "next/server"

import { chunkText, type Chunk } from "@/lib/chunker"
import { embedDocument, extractTextFromPdfWithGemini } from "@/lib/gemini"
import { countReadableWords, getReadableTextScore, isReadableExtractedText } from "@/lib/textQuality"
import { sanitizeTextForDatabase } from "@/lib/textSanitizer"
import { withTimeout } from "@/lib/timeout"

export const runtime = "nodejs"
export const maxDuration = 60

const MAX_FILE_SIZE = 10 * 1024 * 1024
const MVP_CHUNK_LIMIT = 5
const EMBEDDING_DIMENSIONS = 768

type EmbeddedChunk = {
  chunk: Chunk
  embedding: number[]
}

function jsonError(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status })
}

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
}

function getEnvCheck() {
  return {
    gemini: Boolean(process.env.GEMINI_API_KEY),
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  }
}

function hasMissingEnv() {
  const envCheck = getEnvCheck()
  console.log("ENV_CHECK", envCheck)

  return !envCheck.gemini || !envCheck.supabaseUrl || !envCheck.supabaseServiceKey
}

export async function POST(request: Request) {
  try {
    console.log("UPLOAD_STAGE: start")

    if (hasMissingEnv()) {
      return jsonError(
        "Missing environment variables. Check GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY.",
        500,
      )
    }

    let formData: FormData

    try {
      formData = await request.formData()
    } catch {
      return jsonError("Please upload a valid PDF file.")
    }

    const file = formData.get("file")

    if (!(file instanceof File)) {
      return jsonError("Please upload a valid PDF file.")
    }

    console.log("UPLOAD_STAGE: file received", file.name, file.type, file.size)

    if (!isPdf(file)) {
      return jsonError("Please upload a PDF file. Other file types are not supported.", 415)
    }

    if (file.size > MAX_FILE_SIZE) {
      return jsonError("File too large. Please upload a PDF under 10MB.", 413)
    }

    if (file.size === 0) {
      return jsonError("This PDF is empty. Please upload a different file.")
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    console.log("UPLOAD_STAGE: buffer created", buffer.length)

    console.log("UPLOAD_STAGE: gemini ocr start")
    const rawOcrText = await withTimeout(
      extractTextFromPdfWithGemini(buffer, file.name),
      60000,
      "Gemini OCR timed out. Try a smaller or clearer PDF.",
    )

    const extractedText = sanitizeTextForDatabase(rawOcrText)
    console.log("UPLOAD_STAGE: gemini ocr done", extractedText.length)

    const score = getReadableTextScore(extractedText)
    const words = countReadableWords(extractedText)
    const readable = isReadableExtractedText(extractedText)

    console.log("UPLOAD_STAGE: readability", {
      score,
      words,
      readable,
    })

    if (!readable) {
      return Response.json(
        {
          error:
            "Gemini OCR extracted text, but it was not readable enough. Try a clearer PDF.",
        },
        { status: 400 },
      )
    }

    const chunks = chunkText(extractedText)
    console.log("UPLOAD_STAGE: chunks created", chunks.length)

    const cleanChunks = chunks
      .map((chunk) => ({
        ...chunk,
        content: sanitizeTextForDatabase(chunk.content),
      }))
      .filter((chunk) => chunk.content.length > 20)

    console.log("UPLOAD_STAGE: clean chunks", cleanChunks.length)

    const limitedChunks = cleanChunks.slice(0, MVP_CHUNK_LIMIT)

    if (limitedChunks.length === 0) {
      return Response.json(
        {
          error: "No readable chunks could be created after OCR.",
        },
        { status: 400 },
      )
    }

    const { supabase } = await import("@/lib/supabase")

    console.log("UPLOAD_STAGE: document insert start")
    const { data: document, error: documentError } = await withTimeout(
      (async () =>
        supabase
          .from("documents")
          .insert({
            name: file.name,
            size: file.size,
            total_chunks: limitedChunks.length,
          })
          .select("id, name, size, total_chunks")
          .single())(),
      15000,
      "Supabase document insert timed out.",
    )

    if (documentError) {
      console.error("SUPABASE_DOCUMENT_INSERT_ERROR", {
        message: documentError.message,
        details: documentError.details,
        hint: documentError.hint,
        code: documentError.code,
      })

      return Response.json(
        {
          error: `Supabase document insert failed: ${documentError.message}`,
        },
        { status: 500 },
      )
    }

    console.log("UPLOAD_STAGE: document inserted", document.id)

    try {
      const embeddedChunks: EmbeddedChunk[] = []

      for (const chunk of limitedChunks) {
        console.log("UPLOAD_STAGE: embedding chunk", chunk.chunkIndex)

        const embedding = await withTimeout(
          embedDocument(chunk.content),
          25000,
          `Gemini embedding timed out for chunk ${chunk.chunkIndex}`,
        )

        if (!Array.isArray(embedding) || embedding.length !== EMBEDDING_DIMENSIONS) {
          throw new Error(`Embedding dimension mismatch: ${embedding?.length}`)
        }

        console.log("UPLOAD_STAGE: embedding done", embedding.length)

        embeddedChunks.push({ chunk, embedding })

        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      const rows = embeddedChunks.map(({ chunk, embedding }) => ({
        document_id: document.id,
        content: sanitizeTextForDatabase(chunk.content),
        chunk_index: chunk.chunkIndex,
        start_char: chunk.startChar,
        end_char: chunk.endChar,
        embedding: `[${embedding.map(Number).join(",")}]`,
      }))

      console.log("UPLOAD_STAGE: chunks insert start", rows.length)
      const { error: chunksError } = await withTimeout(
        (async () => supabase.from("document_chunks").insert(rows))(),
        20000,
        "Supabase chunks insert timed out.",
      )

      if (chunksError) {
        console.error("SUPABASE_CHUNKS_INSERT_ERROR", {
          message: chunksError.message,
          details: chunksError.details,
          hint: chunksError.hint,
          code: chunksError.code,
        })

        await supabase.from("documents").delete().eq("id", document.id)

        return Response.json(
          {
            error: `Supabase chunks insert failed: ${chunksError.message}`,
          },
          { status: 500 },
        )
      }

      console.log("UPLOAD_STAGE: chunks inserted")
      console.log("UPLOAD_STAGE: upload complete")

      return Response.json({
        success: true,
        documentId: document.id,
        documentName: file.name,
        totalChunks: limitedChunks.length,
        extractionMethod: "gemini-ocr",
      })
    } catch (error) {
      const { error: cleanupError } = await supabase.from("documents").delete().eq("id", document.id)

      if (cleanupError) {
        console.error("DocuMind upload cleanup error:", cleanupError)
      }

      throw error
    }
  } catch (error) {
    console.error("UPLOAD_ROUTE_ERROR", error)

    const message = error instanceof Error ? error.message : "Upload failed"

    return Response.json(
      {
        error: message,
      },
      { status: 500 },
    )
  }
}
