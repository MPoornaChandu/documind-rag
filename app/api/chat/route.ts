import { NextResponse } from "next/server"

import { withTimeout } from "@/lib/timeout"
import type { ChatRequest, MatchedChunk } from "@/lib/types"

export const runtime = "nodejs"
export const maxDuration = 60

const NO_RELEVANT_CHUNKS_ANSWER =
  "I could not find relevant information in the uploaded document for this question. Try asking about the document summary, key points, dates, skills, or requirements."
const ANSWER_MISSING_MESSAGE = "I found relevant document sections, but the AI response was empty. Please try again."
const ANSWER_NOT_FOUND_MESSAGE = "I could not find this information in the uploaded document."
const GEMINI_RESPONSE_FAILED_MESSAGE = "Gemini response failed. Please try again in a moment."
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
      message: GEMINI_RESPONSE_FAILED_MESSAGE,
      status: 429,
    }
  }

  if (message.includes("EMPTY_GEMINI_RESPONSE") || message.includes("INVALID_GEMINI_EMBEDDING_RESPONSE")) {
    return {
      message: GEMINI_RESPONSE_FAILED_MESSAGE,
      status: 502,
    }
  }

  return {
    message: GEMINI_RESPONSE_FAILED_MESSAGE,
    status: 500,
  }
}

function buildPrompt(question: string, chunks: MatchedChunk[]) {
  const lowerQuestion = question.toLowerCase()
  const wantsSummary =
    lowerQuestion.includes("summary") ||
    lowerQuestion.includes("summarize") ||
    lowerQuestion.includes("what is this document about") ||
    lowerQuestion.includes("what is there inside") ||
    lowerQuestion.includes("explain this document")
  const wantsList =
    lowerQuestion.includes("list") ||
    lowerQuestion.includes("points") ||
    lowerQuestion.includes("key points") ||
    lowerQuestion.includes("skills") ||
    lowerQuestion.includes("requirements") ||
    lowerQuestion.includes("dates")
  const answerStyle = [
    wantsSummary ? "Give a short summary followed by 4-6 bullet points." : "",
    wantsList ? "Use clear bullet points." : "",
    !wantsSummary && !wantsList ? "Answer in a clear paragraph with only necessary bullet points if helpful." : "",
  ]
    .filter(Boolean)
    .join("\n")
  const context = chunks
    .map((chunk, index) => `Source ${index + 1}:\n${chunk.content}`)
    .join("\n\n---\n\n")

  return `You are DocuMind RAG, a professional OCR-powered document assistant.

Your job:
Answer the user's question using ONLY the provided retrieved document context.

Rules:

1. Do NOT copy raw chunks directly.
2. Do NOT mention chunk numbers in the main answer.
3. Do NOT say "according to chunk 1" or "based on chunk 2" in the main answer.
4. Write a clean, human-friendly answer.
5. If the user asks "what is this document about?", give a short summary first, then key points.
6. If the user asks for summary, use bullet points.
7. If the user asks for details, organize the answer with headings or bullets.
8. If the answer is not clearly present in the context, say:
"${ANSWER_NOT_FOUND_MESSAGE}"
9. Do not use outside knowledge.
10. Do not invent facts, dates, names, numbers, or conclusions.
11. Keep the answer useful and polished.

Formatting:

* For general questions: answer in 1-2 short paragraphs.
* For summaries: use 4-6 bullet points.
* For lists: use clean bullet points.
* For comparisons or steps: use numbered points.
* Avoid raw OCR noise.
* Avoid overly long answers unless the user asks for detail.

Answer style:
${answerStyle}

Document context:
${context}

User question:
${question}

Final answer:`
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
      return jsonError(GEMINI_RESPONSE_FAILED_MESSAGE, 502)
    }

    if (!Array.isArray(queryEmbedding) || queryEmbedding.length !== EMBEDDING_DIMENSIONS) {
      console.error("QUERY_EMBEDDING_ERROR", {
        isArray: Array.isArray(queryEmbedding),
        length: Array.isArray(queryEmbedding) ? queryEmbedding.length : null,
      })

      return jsonError(GEMINI_RESPONSE_FAILED_MESSAGE, 502)
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

      return jsonError("Vector search failed. Please try re-uploading the document.", 500)
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
          answer: ANSWER_MISSING_MESSAGE,
          sources: matchedChunks,
        })
      }

      return jsonError(GEMINI_RESPONSE_FAILED_MESSAGE, 502)
    }

    const groundedAnswer = answer.trim()

    if (!groundedAnswer) {
      return NextResponse.json({
        answer: ANSWER_MISSING_MESSAGE,
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
