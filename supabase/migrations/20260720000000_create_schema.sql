-- CareerOS database foundation: schema
-- Tables, foreign keys, indexes, and updated_at triggers.
-- RLS is enabled separately in 20260720000001_enable_rls.sql.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- updated_at helper: shared by every table below that has an updated_at column
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- One row per authenticated user. Primary key IS the auth.users id, so this
-- is a 1:1 extension of Supabase Auth, not a separate identity.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  headline text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- resumes
-- A resume "document" a user is building. Content itself lives in
-- resume_versions so edits are versioned rather than destructive.
-- ---------------------------------------------------------------------------
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null default 'Untitled Resume',
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resumes_user_id_idx on public.resumes (user_id);

create trigger set_resumes_updated_at
  before update on public.resumes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- resume_versions
-- Immutable-ish snapshots of a resume's content. user_id is duplicated from
-- the parent resume so RLS policies don't need a join to enforce ownership.
-- ---------------------------------------------------------------------------
create table if not exists public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  version_number integer not null default 1,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resume_versions_resume_version_unique unique (resume_id, version_number)
);

create index if not exists resume_versions_resume_id_idx on public.resume_versions (resume_id);
create index if not exists resume_versions_user_id_idx on public.resume_versions (user_id);

create trigger set_resume_versions_updated_at
  before update on public.resume_versions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- job_descriptions
-- A job posting the user is targeting (pasted/typed text, not fetched here).
-- ---------------------------------------------------------------------------
create table if not exists public.job_descriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  company text,
  description text,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists job_descriptions_user_id_idx on public.job_descriptions (user_id);

create trigger set_job_descriptions_updated_at
  before update on public.job_descriptions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- ats_results
-- One analysis snapshot pairing a resume_version against a job_description.
-- Treated as an immutable result record: created_at only, no updated_at.
-- ---------------------------------------------------------------------------
create table if not exists public.ats_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  resume_version_id uuid not null references public.resume_versions (id) on delete cascade,
  job_description_id uuid not null references public.job_descriptions (id) on delete cascade,
  score numeric(5, 2),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ats_results_user_id_idx on public.ats_results (user_id);
create index if not exists ats_results_resume_version_id_idx on public.ats_results (resume_version_id);
create index if not exists ats_results_job_description_id_idx on public.ats_results (job_description_id);

-- ---------------------------------------------------------------------------
-- interview_sessions
-- job_description_id is optional: a session can be general practice or tied
-- to a specific role. on delete set null so a session survives its target
-- job posting being removed.
-- ---------------------------------------------------------------------------
create table if not exists public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  job_description_id uuid references public.job_descriptions (id) on delete set null,
  session_type text not null default 'behavioral'
    check (session_type in ('behavioral', 'technical', 'mixed')),
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  summary jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists interview_sessions_user_id_idx on public.interview_sessions (user_id);
create index if not exists interview_sessions_job_description_id_idx
  on public.interview_sessions (job_description_id);

create trigger set_interview_sessions_updated_at
  before update on public.interview_sessions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- learning_roadmaps
-- Skill-gap roadmap for a user, optionally tied to a target job. Individual
-- roadmap steps live in the `items` jsonb array rather than a separate table
-- since the requirements don't call out a roadmap_items entity.
-- ---------------------------------------------------------------------------
create table if not exists public.learning_roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  job_description_id uuid references public.job_descriptions (id) on delete set null,
  title text not null default 'Learning Roadmap',
  status text not null default 'active'
    check (status in ('active', 'completed', 'archived')),
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists learning_roadmaps_user_id_idx on public.learning_roadmaps (user_id);
create index if not exists learning_roadmaps_job_description_id_idx
  on public.learning_roadmaps (job_description_id);

create trigger set_learning_roadmaps_updated_at
  before update on public.learning_roadmaps
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- applications
-- Job application tracker. job_description_id is optional so a user can log
-- an application without having stored the full posting text.
-- ---------------------------------------------------------------------------
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  job_description_id uuid references public.job_descriptions (id) on delete set null,
  company text not null,
  role_title text not null,
  status text not null default 'saved'
    check (status in ('saved', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn')),
  applied_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists applications_user_id_idx on public.applications (user_id);
create index if not exists applications_job_description_id_idx on public.applications (job_description_id);

create trigger set_applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();
