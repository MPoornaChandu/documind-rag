create extension if not exists vector;
create extension if not exists pgcrypto;

create table if not exists documents (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  size integer not null,
  total_chunks integer not null default 0,
  created_at timestamp with time zone default now()
);

create table if not exists document_chunks (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references documents(id) on delete cascade,
  content text not null,
  chunk_index integer not null,
  start_char integer,
  end_char integer,
  embedding vector(768),
  created_at timestamp with time zone default now()
);

create index if not exists document_chunks_embedding_idx
on document_chunks
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create index if not exists document_chunks_document_id_idx
on document_chunks(document_id);

create or replace function match_document_chunks(
  query_embedding vector(768),
  match_document_id uuid,
  match_threshold float default 0.45,
  match_count int default 6
)
returns table (
  id uuid,
  content text,
  chunk_index integer,
  similarity float
)
language sql stable
set search_path = public
as $$
  select
    document_chunks.id,
    document_chunks.content,
    document_chunks.chunk_index,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  where
    document_chunks.document_id = match_document_id
    and document_chunks.embedding is not null
    and 1 - (document_chunks.embedding <=> query_embedding) >= match_threshold
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
$$;
