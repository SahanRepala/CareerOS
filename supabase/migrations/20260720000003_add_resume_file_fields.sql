-- CareerOS database foundation: resume file metadata fields
-- Adds the columns the Resume upload feature needs to track an uploaded
-- file (PDF/DOCX) stored in Supabase Storage, on top of the base `resumes`
-- table from the initial schema. RLS policies from
-- 20260720000001_enable_rls.sql already cover these columns since they
-- apply at the row level, not per-column.

alter table public.resumes
  add column if not exists filename text,
  add column if not exists original_filename text,
  add column if not exists file_type text,
  add column if not exists file_size bigint,
  add column if not exists storage_path text,
  add column if not exists uploaded_at timestamptz;
