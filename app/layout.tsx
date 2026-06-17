import type { Metadata } from "next"

import { HashScrollController } from "@/components/HashScrollController"

import "./globals.css"

export const metadata: Metadata = {
  title: "DocuMind RAG | OCR-powered PDF Chat",
  description:
    "An OCR-first RAG document chat app built with Next.js, Gemini OCR, Supabase pgvector, and TypeScript.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <HashScrollController />
        {children}
      </body>
    </html>
  )
}
