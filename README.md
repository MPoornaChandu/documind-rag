# DocuMind RAG — OCR-powered Document Chat App

An OCR-first Retrieval-Augmented Generation application that lets users upload PDFs and ask questions answered from retrieved document chunks with source citations.

![DocuMind RAG preview](./public/images/documind-portal.png)

## Live Demo

- Live app: [https://documind-rag.vercel.app](https://documind-rag.vercel.app)
- App workspace: [https://documind-rag.vercel.app/app](https://documind-rag.vercel.app/app)
- GitHub repository: [https://github.com/MPoornaChandu/documind-rag](https://github.com/MPoornaChandu/documind-rag)

## Problem Statement

Most AI chatbots answer from general knowledge. Real companies need AI systems that can understand private documents, scanned files, resumes, reports, invoices, and internal PDFs. DocuMind RAG solves this by combining Gemini OCR, vector embeddings, Supabase pgvector retrieval, and source-grounded answers.

## Features

- PDF upload
- Gemini OCR document extraction
- Text sanitization and readability checks
- Chunking
- 768-dimensional Gemini embeddings
- Supabase pgvector semantic search
- Source-grounded answers
- Source citations
- Dark premium UI
- Vercel deployment
- Timeout/error handling

## Tech Stack

- Next.js App Router
- TypeScript
- Gemini OCR with `gemini-2.5-flash`
- Gemini embeddings with `gemini-embedding-2`
- Supabase PostgreSQL
- pgvector
- Tailwind CSS
- Framer Motion and GSAP
- Vercel

## Architecture

PDF Upload → Gemini OCR → Text Sanitization → Chunking → Gemini Embeddings → Supabase pgvector → Semantic Retrieval → Gemini Answer + Sources

## How It Works

1. A user uploads a PDF through the app workspace.
2. Gemini OCR extracts readable text from the PDF.
3. The extracted text is sanitized to remove invalid Unicode/control characters.
4. Readability checks prevent bad OCR output from being indexed.
5. The clean text is split into chunks.
6. Each chunk is embedded with Gemini into a 768-dimensional vector.
7. Chunks and embeddings are stored in Supabase with pgvector.
8. User questions are embedded and matched against document chunks.
9. Gemini answers only from retrieved context and returns source chunks.

## Setup Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Copy the project URL and service role key.
5. Add the values to `.env.local`.

The service role key is used only in server-side API routes and must never be exposed in client components.

## Environment Variables

Create `.env.local`:

```bash
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Important security note: `SUPABASE_SERVICE_ROLE_KEY` must stay server-side only. Do not import it into client components or expose it through `NEXT_PUBLIC_` variables.

## Deployment

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Add `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel project settings.
4. Deploy.

## Known Limitations

- Current demo indexes the first few readable chunks for fast testing.
- Very blurry/scanned PDFs may still fail OCR.
- No user authentication yet.
- No persistent chat history yet.

## Future Improvements

- Full-document background indexing
- Multi-document collections
- User authentication
- Streaming answers
- Highlight source pages
- Chat history
- RLS policies for production multi-user use

## Resume Bullet

Built DocuMind RAG, an OCR-powered Retrieval-Augmented Generation app using Next.js, Gemini OCR, Gemini embeddings, Supabase pgvector, and Vercel, enabling users to upload PDFs and ask source-grounded questions over retrieved document chunks.
