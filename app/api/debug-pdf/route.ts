import { extractPdfText } from "@/lib/pdfExtractor"
import { extractTextFromPdfWithGemini } from "@/lib/gemini"
import { countReadableWords, getReadableTextScore, isReadableExtractedText } from "@/lib/textQuality"
import { sanitizeTextForDatabase } from "@/lib/textSanitizer"

export const runtime = "nodejs"
export const maxDuration = 60

const MAX_FILE_SIZE = 10 * 1024 * 1024

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Debug route disabled in production." }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return Response.json({ success: false, error: "Please upload a valid PDF file." }, { status: 400 })
    }

    if (!isPdf(file)) {
      return Response.json({ success: false, error: "Please upload a PDF file." }, { status: 415 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let method: "pdf-parse" | "gemini-ocr" = "pdf-parse"
    let extractedText = ""

    try {
      const rawText = await extractPdfText(buffer)
      extractedText = sanitizeTextForDatabase(rawText)
    } catch (error) {
      console.error("DEBUG_PDF_PARSE_FAILED:", error)
    }

    if (!isReadableExtractedText(extractedText)) {
      method = "gemini-ocr"

      if (!process.env.GEMINI_API_KEY) {
        return Response.json(
          { success: false, error: "Missing Gemini API key. Add GEMINI_API_KEY to .env.local and restart the dev server." },
          { status: 500 },
        )
      }

      if (buffer.length > MAX_FILE_SIZE) {
        return Response.json(
          {
            success: false,
            error: "This PDF is too large for the current OCR demo mode. Try a PDF under 10MB.",
          },
          { status: 400 },
        )
      }

      extractedText = sanitizeTextForDatabase(await extractTextFromPdfWithGemini(buffer, file.name))
    }

    const score = getReadableTextScore(extractedText)
    const words = countReadableWords(extractedText)
    const readable = isReadableExtractedText(extractedText)

    return Response.json({
      success: true,
      method,
      length: extractedText.length,
      readable,
      score,
      words,
      preview: extractedText.slice(0, 1000),
    })
  } catch (error) {
    console.error("DEBUG_PDF_ROUTE_ERROR:", error)

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "PDF parser failed before readable text could be extracted.",
      },
      { status: 400 },
    )
  }
}
