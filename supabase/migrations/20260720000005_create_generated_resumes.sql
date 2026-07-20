create table if not exists public.generated_resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  resume_version_id uuid not null references public.resume_versions(id) on delete cascade,
  template_name text not null,
  file_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists generated_resumes_user_id_idx on public.generated_resumes(user_id);
create index if not exists generated_resumes_resume_version_id_idx on public.generated_resumes(resume_version_id);
