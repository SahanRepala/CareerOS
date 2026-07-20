create table if not exists public.interview_questions (
  id uuid primary key default gen_random_uuid(),
  interview_session_id uuid not null references public.interview_sessions(id) on delete cascade,
  category text not null,
  difficulty text not null,
  content jsonb not null,
  is_completed boolean not null default false,
  is_bookmarked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists interview_questions_session_id_idx on public.interview_questions(interview_session_id);

create trigger set_interview_questions_updated_at
  before update on public.interview_questions
  for each row execute function public.set_updated_at();
