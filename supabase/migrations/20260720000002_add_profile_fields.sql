-- CareerOS database foundation: profile detail fields
-- Adds the columns the Profile page needs (bio, location, skills, social
-- links) on top of the base `profiles` table from the initial schema.
-- RLS policies from 20260720000001_enable_rls.sql already cover these
-- columns since they apply at the row level, not per-column.

alter table public.profiles
  add column if not exists bio text,
  add column if not exists location text,
  add column if not exists linkedin_url text,
  add column if not exists github_url text,
  add column if not exists portfolio_url text,
  add column if not exists skills text[] not null default '{}';
