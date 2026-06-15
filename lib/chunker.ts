export type Chunk = {
  content: string
  chunkIndex: number
  startChar: number
  endChar: number
}

const SENTENCE_BOUNDARIES = [". ", "? ", "! ", "\n"]

function normalizeText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function findSplitPoint(text: string, start: number, chunkSize: number, overlap: number) {
  const target = Math.min(start + chunkSize, text.length)
  const minBoundary = start + Math.floor(chunkSize * 0.55)
  const maxBoundary = Math.min(text.length, target + Math.floor(overlap * 0.5))

  let bestBefore = -1

  for (const boundary of SENTENCE_BOUNDARIES) {
    const candidate = text.lastIndexOf(boundary, target)

    if (candidate >= minBoundary && candidate > bestBefore) {
      bestBefore = candidate + boundary.length
    }
  }

  if (bestBefore > start) {
    return bestBefore
  }

  let bestAfter = Number.POSITIVE_INFINITY

  for (const boundary of SENTENCE_BOUNDARIES) {
    const candidate = text.indexOf(boundary, target)

    if (candidate !== -1 && candidate <= maxBoundary) {
      bestAfter = Math.min(bestAfter, candidate + boundary.length)
    }
  }

  if (Number.isFinite(bestAfter)) {
    return bestAfter
  }

  return target
}

export function chunkText(text: string, chunkSize = 800, overlap = 150): Chunk[] {
  const normalized = normalizeText(text)

  if (!normalized) {
    return []
  }

  const chunks: Chunk[] = []
  let start = 0

  while (start < normalized.length) {
    const end = findSplitPoint(normalized, start, chunkSize, overlap)
    const content = normalized.slice(start, end).trim()

    if (content) {
      chunks.push({
        content,
        chunkIndex: chunks.length,
        startChar: start,
        endChar: end,
      })
    }

    if (end >= normalized.length) {
      break
    }

    const nextStart = Math.max(0, end - overlap)
    start = nextStart <= start ? end : nextStart

    while (start < normalized.length && /\s/.test(normalized[start])) {
      start += 1
    }
  }

  return chunks
}
