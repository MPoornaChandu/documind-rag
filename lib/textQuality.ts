export function getReadableTextScore(text: string): number {
  if (!text || text.length === 0) return 0

  const sample = text.slice(0, 4000)
  const readableChars = sample.match(/[a-zA-Z0-9 .,;:'"!?()@#%&+\-/\n]/g)?.length ?? 0

  return readableChars / sample.length
}

export function countReadableWords(text: string): number {
  return (text.match(/[a-zA-Z]{3,}/g) ?? []).length
}

export function isReadableExtractedText(text: string): boolean {
  const score = getReadableTextScore(text)
  const words = countReadableWords(text)

  return score > 0.55 && words >= 10
}
