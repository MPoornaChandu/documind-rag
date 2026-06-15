import { chunkText, type Chunk } from "@/lib/chunker"
import { embedDocument } from "@/lib/gemini"
import { supabase } from "@/lib/supabase"
import { isReadableExtractedText } from "@/lib/textQuality"
import { sanitizeTextForDatabase } from "@/lib/textSanitizer"
import { withTimeout } from "@/lib/timeout"

export const runtime = "nodejs"
export const maxDuration = 60

const MVP_CHUNK_LIMIT = 8
const EMBEDDING_DIMENSIONS = 768
const SAMPLE_DOCUMENT = `
DocuMind RAG is an AI document chat app that lets users upload PDFs and ask questions using Gemini embeddings, Supabase pgvector, semantic search, and source-backed answers.
It allows users to upload PDFs and ask questions about the document.
It uses text extraction, chunking, Gemini embeddings, Supabase pgvector, semantic search, and Gemini answers.
The project is useful for AI internships because RAG is an in-demand skill.

DocuMind RAG accepts readable text documents, splits the content into chunks, creates Gemini embeddings,
stores those vectors in Supabase pgvector, and retrieves the most relevant source chunks before asking Gemini
to answer. The system is designed to avoid unsupported claims by grounding answers in retrieved passages.

The upload pipeline validates PDF type and size, extracts text, sanitizes unsafe characters,
checks readability, chunks the clean text, embeds each chunk, and stores only readable content.
If a PDF is scanned, image-based, exported from a design tool, or encoded in a way that produces
garbage characters, DocuMind rejects it instead of indexing broken text.

Good demo questions include: What does DocuMind do? How does the upload pipeline work? Why does
the app reject unreadable PDFs? What database feature stores vectors? How does the assistant keep
answers grounded in source text?
`

type EmbeddedChunk = {
  chunk: Chunk
  embedding: number[]
}

export async function POST() {
  let documentId: string | null = null

  try {
    const cleanText = sanitizeTextForDatabase(SAMPLE_DOCUMENT)

    if (!isReadableExtractedText(cleanText)) {
      return Response.json({ success: false, error: "Demo document text is not readable." }, { status: 500 })
    }

    const cleanChunks = chunkText(cleanText)
      .map((chunk) => ({
        ...chunk,
        content: sanitizeTextForDatabase(chunk.content),
      }))
      .filter((chunk) => chunk.content.length > 20 && isReadableExtractedText(chunk.content))
      .slice(0, MVP_CHUNK_LIMIT)

    if (cleanChunks.length === 0) {
      return Response.json({ success: false, error: "Demo document chunks could not be created." }, { status: 500 })
    }

    const { data: document, error: documentError } = await withTimeout(
      (async () =>
        supabase
          .from("documents")
          .insert({
            name: "DocuMind demo sample",
            size: cleanText.length,
            total_chunks: cleanChunks.length,
          })
          .select("id, name, total_chunks")
          .single())(),
      15000,
      "Supabase document insert timed out.",
    )

    if (documentError) {
      console.error("SUPABASE_DEMO_DOCUMENT_INSERT_ERROR", {
        message: documentError.message,
        details: documentError.details,
        hint: documentError.hint,
        code: documentError.code,
      })

      return Response.json(
        { success: false, error: `Supabase demo document insert failed: ${documentError.message}` },
        { status: 500 },
      )
    }

    documentId = document.id

    const embeddedChunks: EmbeddedChunk[] = []

    for (const chunk of cleanChunks) {
      const embedding = await withTimeout(
        embedDocument(chunk.content),
        25000,
        `Gemini embedding timed out for chunk ${chunk.chunkIndex}`,
      )

      if (!Array.isArray(embedding)) {
        throw new Error("Embedding is not an array")
      }

      if (embedding.length !== EMBEDDING_DIMENSIONS) {
        throw new Error(`Embedding dimension mismatch. Expected ${EMBEDDING_DIMENSIONS}, got ${embedding.length}`)
      }

      embeddedChunks.push({ chunk, embedding })
    }

    const rows = embeddedChunks.map(({ chunk, embedding }) => ({
      document_id: document.id,
      content: sanitizeTextForDatabase(chunk.content),
      chunk_index: chunk.chunkIndex,
      start_char: chunk.startChar,
      end_char: chunk.endChar,
      embedding: `[${embedding.map(Number).join(",")}]`,
    }))

    const { error: chunksError } = await withTimeout(
      (async () => supabase.from("document_chunks").insert(rows))(),
      20000,
      "Supabase chunks insert timed out.",
    )

    if (chunksError) {
      console.error("SUPABASE_DEMO_CHUNKS_INSERT_ERROR", {
        message: chunksError.message,
        details: chunksError.details,
        hint: chunksError.hint,
        code: chunksError.code,
      })

      await supabase.from("documents").delete().eq("id", document.id)

      return Response.json(
        { success: false, error: `Supabase demo chunks insert failed: ${chunksError.message}` },
        { status: 500 },
      )
    }

    return Response.json({
      success: true,
      documentId: document.id,
      documentName: document.name,
      totalChunks: document.total_chunks,
    })
  } catch (error) {
    if (documentId) {
      await supabase.from("documents").delete().eq("id", documentId)
    }

    console.error("DEMO_DOCUMENT_ROUTE_ERROR:", error)

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Could not create demo document.",
      },
      { status: 500 },
    )
  }
}
