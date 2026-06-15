import { NextResponse } from "next/server"

import { withTimeout } from "@/lib/timeout"
import type { ChatRequest, MatchedChunk } from "@/lib/types"

export const runtime = "nodejs"
export const maxDuration = 60

const NO_RELEVANT_CHUNKS_ANSWER =
  "I could not find relevant chunks for this question."
const MATCH_THRESHOLD = 0.2
const MATCH_COUNT = 6
const EMBEDDING_DIMENSIONS = 768
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type MatchedChunkRow = {
  id: string
  content: string
  chunk_index: number
  similarity: number | string | null
}

function jsonError(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

function getEnvCheck() {
  return {
    gemini: Boolean(process.env.GEMINI_API_KEY),
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

function classifyChatError(error: unknown) {
  const message = getErrorMessage(error)

  if (message.includes("MISSING_GEMINI_API_KEY")) {
    return {
      message: "Missing Gemini API key. Add GEMINI_API_KEY to .env.local and restart the dev server.",
      status: 500,
    }
  }

  if (message.includes("MISSING_SUPABASE_ENV")) {
    return {
      message:
        "Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local.",
      status: 500,
    }
  }

  if (/PGRST202|42P01|42883|schema cache|match_document_chunks|document_chunks|documents|extension.*vector/i.test(message)) {
    return {
      message: "Supabase schema is not ready. Run supabase/schema.sql in your Supabase SQL editor, then try again.",
      status: 500,
    }
  }

  if (/rate|quota|429|resource_exhausted/i.test(message)) {
    return {
      message: "Gemini is busy or rate limited. Please try again in a minute.",
      status: 429,
    }
  }

  if (message.includes("EMPTY_GEMINI_RESPONSE") || message.includes("INVALID_GEMINI_EMBEDDING_RESPONSE")) {
    return {
      message: "Gemini did not return a usable response. Please try again.",
      status: 502,
    }
  }

  return {
    message: "Could not answer this question. Please try again.",
    status: 500,
  }
}

function buildPrompt(question: string, chunks: MatchedChunk[]) {
  const context = chunks
    .map((chunk, index) => `Chunk #${chunk.chunkIndex ?? index + 1}:\n${chunk.content}`)
    .join("\n\n---\n\n")

  return `You are DocuMind RAG, a careful document assistant.

Answer ONLY using the provided context.
If the answer is not in the context, say:
"I could not find this information in the uploaded document."

Context:
${context}

Question:
${question}

Answer:`
}

function toMatchedChunk(chunk: MatchedChunkRow): MatchedChunk {
  const similarity = typeof chunk.similarity === "number" ? chunk.similarity : Number(chunk.similarity)

  return {
    id: chunk.id,
    content: chunk.content,
    chunkIndex: chunk.chunk_index,
    similarity: Number.isFinite(similarity) ? similarity : 0,
  }
}

export async function POST(request: Request) {
  try {
    console.log("CHAT_STAGE: start")
    const envCheck = getEnvCheck()
    console.log("ENV_CHECK", envCheck)

    if (!envCheck.gemini || !envCheck.supabaseUrl || !envCheck.supabaseServiceKey) {
      return jsonError(
        "Missing environment variables. Check GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY.",
        500,
      )
    }

    let body: Partial<ChatRequest>

    try {
      body = (await request.json()) as Partial<ChatRequest>
    } catch {
      return jsonError("Invalid JSON body.")
    }

    const question = body.question?.trim()
    const documentId = body.documentId?.trim()
    console.log("CHAT_STAGE: body", { questionLength: question?.length, documentId })

    if (!question || question.length > 1000) {
      return jsonError("Question must be between 1 and 1000 characters.")
    }

    if (!documentId) {
      return jsonError("Document ID is required.")
    }

    if (!UUID_PATTERN.test(documentId)) {
      return jsonError("Document ID is invalid.")
    }

    const [{ supabase }, { embedQuery, generateAnswer }] = await Promise.all([
      import("@/lib/supabase"),
      import("@/lib/gemini"),
    ])

    console.log("CHAT_STAGE: query embedding start")
    let queryEmbedding: number[]

    try {
      queryEmbedding = await embedQuery(question)
    } catch (error) {
      console.error("QUERY_EMBEDDING_ERROR", error)
      return jsonError("Query embedding failed. Check Gemini embedding setup.", 502)
    }

    if (!Array.isArray(queryEmbedding) || queryEmbedding.length !== EMBEDDING_DIMENSIONS) {
      console.error("QUERY_EMBEDDING_ERROR", {
        isArray: Array.isArray(queryEmbedding),
        length: Array.isArray(queryEmbedding) ? queryEmbedding.length : null,
      })

      return jsonError("Query embedding failed. Check Gemini embedding setup.", 502)
    }

    console.log("CHAT_STAGE: query embedding done", queryEmbedding.length)
    console.log("CHAT_STAGE: rpc search start")

    const { data: chunks, error: matchError } = await supabase.rpc("match_document_chunks", {
      query_embedding: `[${queryEmbedding.map(Number).join(",")}]`,
      match_document_id: documentId,
      match_threshold: MATCH_THRESHOLD,
      match_count: MATCH_COUNT,
    })

    if (matchError) {
      console.error("SUPABASE_MATCH_ERROR", {
        message: matchError.message,
        details: matchError.details,
        hint: matchError.hint,
        code: matchError.code,
      })

      return jsonError(`Vector search failed: ${matchError.message}`, 500)
    }

    console.log("CHAT_STAGE: rpc chunks found", chunks?.length)
    console.log("CHAT_STAGE: chunks found", chunks?.length)

    const matchedChunks: MatchedChunk[] = ((chunks ?? []) as MatchedChunkRow[]).map(toMatchedChunk)

    if (matchedChunks.length === 0) {
      return NextResponse.json({
        answer: NO_RELEVANT_CHUNKS_ANSWER,
        sources: [],
      })
    }

    let answer = ""

    try {
      answer = await withTimeout(
        generateAnswer(buildPrompt(question, matchedChunks)),
        45000,
        "Gemini chat timed out. Try again.",
      )
    } catch (error) {
      console.error("GEMINI_CHAT_ERROR", error)

      if (error instanceof Error && error.message.includes("EMPTY_GEMINI_RESPONSE")) {
        return NextResponse.json({
          answer: "Gemini returned an empty response.",
          sources: matchedChunks,
        })
      }

      const message = error instanceof Error ? error.message : "Gemini chat failed"
      return jsonError(`Gemini chat failed: ${message}`, 502)
    }

    const groundedAnswer = answer.trim()

    if (!groundedAnswer) {
      return NextResponse.json({
        answer: "Gemini returned an empty response.",
        sources: matchedChunks,
      })
    }

    return NextResponse.json({
      answer: groundedAnswer,
      sources: matchedChunks,
    })
  } catch (error) {
    console.error("CHAT_ROUTE_ERROR", error)
    const classified = classifyChatError(error)

    return jsonError(classified.message, classified.status)
  }
}
