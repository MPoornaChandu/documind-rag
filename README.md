# DocuMind RAG

DocuMind RAG is a premium full-stack document chat app that lets users upload a PDF, ask questions, and receive answers grounded strictly in the uploaded document with chunk-level source citations.

![DocuMind RAG screenshot placeholder](./public/images/documind-portal.png)

Live demo: _Add your deployed Vercel URL here._

## Problem Statement

Most chatbots rely on general knowledge. DocuMind RAG answers strictly from your uploaded document with chunk-level source citations.

## Features

- PDF upload
- Text extraction
- Sentence-aware chunking
- Gemini embeddings
- Supabase pgvector storage
- Semantic search
- Strict document-only answers
- Source citations
- Futuristic animated UI

## Tech Stack

- Next.js 14 App Router
- TypeScript strict mode
- Tailwind CSS
- Supabase PostgreSQL with pgvector
- Gemini API through `@google/genai`
- `gemini-2.5-flash` for answers
- `gemini-embedding-2` with 768 dimensions for embeddings
- `pdf-parse` for PDF text extraction
- Framer Motion, GSAP, and lucide-react for the interface

## Architecture Flow

PDF Upload -> Text Extraction -> Chunking -> Embeddings -> pgvector Storage -> Semantic Search -> Gemini Answer

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Copy the project URL and service role key.

The service role key is used only in server-side code and must never be exposed to the browser.

## Environment Setup

Copy `.env.example` to `.env.local` and fill in:

```bash
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npx tsc --noEmit
```

## Deploy To Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel project settings.
4. Deploy.

## Known Limitations

- Scanned or image-based PDFs need OCR, planned later.
- Large PDFs may hit serverless timeout limits.
- This MVP supports one active document at a time in the UI.

## Future Improvements

- Multi-document collections
- OCR support
- Streaming responses
- User auth
- Chat history
- Highlight exact PDF source pages

## Resume Bullet

Built DocuMind RAG, a full-stack Retrieval-Augmented Generation application using Next.js 14, Supabase pgvector, and Gemini API that lets users upload PDFs and ask questions answered strictly from document context with chunk-level source citations.
