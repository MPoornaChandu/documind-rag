# RAG Workflow

## What RAG Means

Retrieval-Augmented Generation combines search with AI generation. Instead of asking the model to answer from memory, the app first retrieves relevant document passages and then asks the model to answer from those passages.

For DocuMind RAG, this means the assistant should answer from uploaded PDF content and avoid claims that are not supported by the retrieved document context.

## How This Project Processes Documents

1. A user uploads a PDF.
2. The upload route validates that the file is a supported PDF under 10MB.
3. Gemini OCR extracts readable text.
4. The text is cleaned and checked for readability.
5. The text is split into smaller retrieval chunks.
6. Gemini embeddings are generated for each chunk.
7. Supabase stores the document record, chunk text, chunk metadata, and pgvector embedding.

## How Chunks Are Retrieved

When the user asks a question:

1. The question is embedded with Gemini.
2. The app calls the Supabase `match_document_chunks` RPC.
3. pgvector compares the question embedding with stored chunk embeddings.
4. The most similar chunks are returned with similarity scores.
5. These chunks become the context for the answer prompt.

## How the Answer Is Generated

The chat route sends Gemini:

- The user's question
- The retrieved document chunks
- Instructions to answer only from the provided context
- Formatting guidance for summaries, bullet points, lists, and general answers

The response is returned with the retrieved source chunks so users can inspect the evidence behind the answer.

## How Hallucination Is Reduced

DocuMind RAG reduces unsupported answers by:

- Retrieving document chunks before generation
- Sending Gemini only the relevant context
- Using a strict prompt that rejects outside knowledge
- Returning a fallback answer when no relevant chunks are found
- Showing source previews and match scores in the UI

This does not guarantee perfect factuality, but it gives the model a narrower, document-grounded context and gives users a way to review the supporting text.

## Current Limitations

- The current demo indexes a limited number of readable chunks for speed.
- PDFs must be under 10MB.
- Very blurry scans may fail OCR or be rejected as unreadable.
- Source citations are chunk-level, not page-level.
- There is no user authentication or persistent document history yet.
- The app is optimized for single-document chat rather than multi-document collections.

## Future Improvements

- Multi-document chat
- Full-document background indexing
- Page-level source references
- Better citation highlighting
- Persistent chat and document history
- User accounts and private workspaces
- Larger-file processing queues
- Automated RAG evaluation metrics
