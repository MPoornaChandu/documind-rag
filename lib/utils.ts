import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return "0 B"
  }

  const units = ["B", "KB", "MB", "GB"]
  const sizeIndex = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / 1024 ** sizeIndex

  return `${size.toFixed(size >= 10 || sizeIndex === 0 ? 0 : 1)} ${units[sizeIndex]}`
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
