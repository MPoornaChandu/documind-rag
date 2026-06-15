import "server-only"

import { GoogleGenAI } from "@google/genai"

const ANSWER_MODEL = "gemini-2.5-flash"
const EMBEDDING_MODEL = "gemini-embedding-2"
const EMBEDDING_DIMENSIONS = 768

let ai: GoogleGenAI | null = null

function getAi() {
  const apiKey = process.env.GEMINI_API_KEY?.trim()

  if (!apiKey) {
    throw new Error("MISSING_GEMINI_API_KEY")
  }

  ai ??= new GoogleGenAI({ apiKey })

  return ai
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

function isRetryableGeminiError(error: unknown) {
  return /429|503|UNAVAILABLE|RESOURCE_EXHAUSTED|rate|quota|high demand/i.test(getErrorMessage(error))
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function generateAnswer(prompt: string) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await getAi().models.generateContent({
        model: ANSWER_MODEL,
        contents: prompt,
        config: {
          temperature: 0,
          topP: 0.9,
          maxOutputTokens: 900,
        },
      })
      const text = response.text?.trim()

      if (!text) {
        throw new Error("EMPTY_GEMINI_RESPONSE")
      }

      return text
    } catch (error) {
      if (attempt < 3 && isRetryableGeminiError(error)) {
        console.warn("GEMINI_CHAT_RETRY", {
          attempt,
          reason: getErrorMessage(error),
        })
        await wait(attempt * 1000)
        continue
      }

      throw error
    }
  }

  throw new Error("EMPTY_GEMINI_RESPONSE")
}

export async function extractTextFromPdfWithGemini(buffer: Buffer, fileName: string): Promise<string> {
  try {
    console.log("GEMINI_OCR_START", {
      fileName,
      bufferSize: buffer.length,
      base64Size: buffer.toString("base64").length,
    })

    const base64Pdf = buffer.toString("base64")
    const prompt = `
You are an OCR and document text extraction engine.

Extract all visible readable text from this PDF.

Rules:
- Return only clean plain text.
- Do not summarize.
- Do not explain.
- Do not add commentary.
- Preserve names, headings, bullet points, education, skills, projects, dates, links, and contact details.
- Preserve section order as much as possible.
- If the PDF is a resume/CV, extract all resume text clearly.
- If no readable text is visible, return exactly: NO_READABLE_TEXT_FOUND
`

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const response = await getAi().models.generateContent({
          model: ANSWER_MODEL,
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: "application/pdf",
                    data: base64Pdf,
                  },
                },
              ],
            },
          ],
        })

        const text = response.text || ""

        console.log("GEMINI_OCR_RESPONSE_DEBUG", {
          length: text.length,
          preview: text.slice(0, 500),
        })

        if (!text || text.includes("NO_READABLE_TEXT_FOUND")) {
          throw new Error("Gemini OCR returned no readable text")
        }

        return text
      } catch (error) {
        if (attempt < 3 && isRetryableGeminiError(error)) {
          console.warn("GEMINI_OCR_RETRY", {
            attempt,
            reason: getErrorMessage(error),
          })
          await wait(attempt * 1000)
          continue
        }

        throw error
      }
    }

    throw new Error("Gemini OCR returned no readable text")
  } catch (error) {
    console.error("GEMINI_OCR_REAL_ERROR", error)

    if (error instanceof Error) {
      throw new Error(`Gemini OCR failed: ${error.message}`)
    }

    throw new Error("Gemini OCR failed with unknown error")
  }
}

export async function embedDocument(text: string): Promise<number[]> {
  const response = await getAi().models.embedContent({
    model: EMBEDDING_MODEL,
    contents: `Document passage for retrieval:\n${text}`,
    config: {
      outputDimensionality: EMBEDDING_DIMENSIONS,
    },
  })

  const values = response.embeddings?.[0]?.values

  if (!values || values.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(`Invalid document embedding dimension: ${values?.length}`)
  }

  return values
}

export async function embedQuery(text: string): Promise<number[]> {
  const response = await getAi().models.embedContent({
    model: EMBEDDING_MODEL,
    contents: `Search query for retrieving relevant document passages:\n${text}`,
    config: {
      outputDimensionality: EMBEDDING_DIMENSIONS,
    },
  })

  const values = response.embeddings?.[0]?.values

  if (!values || values.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(`Invalid query embedding dimension: ${values?.length}`)
  }

  return values
}
