-- Adds structured_content column to job_descriptions for parsing results.
alter table public.job_descriptions
  add column if not exists structured_content jsonb;
