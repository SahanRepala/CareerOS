-- Adds columns to store file metadata for uploaded resumes.
alter table public.resumes
  add column if not exists file_path text,
  add column if not exists file_name text;
