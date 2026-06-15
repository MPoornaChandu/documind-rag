function normalizeWhitespace(text: string) {
  return text.replace(/\s+/g, " ").trim()
}

function decodePdfEscapes(value: string) {
  return value
    .replace(/\\([nrtbf()\\])/g, (_, escape: string) => {
      const map: Record<string, string> = {
        n: "\n",
        r: "\r",
        t: "\t",
        b: "\b",
        f: "\f",
        "(": "(",
        ")": ")",
        "\\": "\\",
      }

      return map[escape] ?? escape
    })
    .replace(/\\([0-7]{1,3})/g, (_, octal: string) => String.fromCharCode(Number.parseInt(octal, 8)))
}

function extractRawPdfText(buffer: Buffer) {
  const source = buffer.toString("latin1")
  const matches = source.matchAll(/\((?:\\.|[^\\)])*\)/g)
  const parts: string[] = []

  for (const match of matches) {
    const value = decodePdfEscapes(match[0].slice(1, -1))

    if (/[A-Za-z0-9]/.test(value)) {
      parts.push(value)
    }
  }

  return normalizeWhitespace(parts.join(" "))
}

function getSafeParserReason(error: unknown) {
  if (!(error instanceof Error)) {
    return "PDF parser failed for an unknown reason."
  }

  if (/password|encrypted/i.test(error.message)) {
    return "PDF parser failed because the PDF appears to be encrypted or password protected."
  }

  if (/invalid|corrupt|damaged|bad xref|xref|format/i.test(error.message)) {
    return "PDF parser failed because the PDF appears to be damaged or unsupported."
  }

  return "PDF parser failed before readable text could be extracted."
}

export async function extractPdfText(buffer: Buffer): Promise<string> {
  let parserError: unknown = null

  try {
    const pdfParse = require("pdf-parse") as (dataBuffer: Buffer) => Promise<{ text?: string }>
    const pdfData = await pdfParse(buffer)
    const parsedText = normalizeWhitespace(pdfData.text || "")

    if (parsedText.length > 50) {
      return parsedText
    }
  } catch (error) {
    parserError = error
  }

  const fallbackText = extractRawPdfText(buffer)

  if (fallbackText.length > 50) {
    return fallbackText
  }

  if (parserError) {
    throw new Error(getSafeParserReason(parserError))
  }

  throw new Error("No readable text found. This PDF may be scanned or image-based.")
}
