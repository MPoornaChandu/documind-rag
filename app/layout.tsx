import type { Metadata } from "next"

import { HashScrollController } from "@/components/HashScrollController"

import "./globals.css"

export const metadata: Metadata = {
  title: "DocuMind RAG | PDF Chat with Source Citations",
  description:
    "A premium full-stack RAG document chat app built with Next.js 14, Supabase pgvector, Gemini, and TypeScript.",
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
