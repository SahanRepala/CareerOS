-- CareerOS database foundation: Row Level Security
-- Every table is owned by exactly one auth user. Policies restrict all
-- operations to rows whose owner column matches auth.uid().

alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.resume_versions enable row level security;
alter table public.job_descriptions enable row level security;
alter table public.ats_results enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.learning_roadmaps enable row level security;
alter table public.applications enable row level security;

-- ---------------------------------------------------------------------------
-- profiles (owner column is `id`, not `user_id`)
-- ---------------------------------------------------------------------------
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- resumes
-- ---------------------------------------------------------------------------
create policy "resumes_select_own"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "resumes_insert_own"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "resumes_update_own"
  on public.resumes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "resumes_delete_own"
  on public.resumes for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- resume_versions
-- ---------------------------------------------------------------------------
create policy "resume_versions_select_own"
  on public.resume_versions for select
  using (auth.uid() = user_id);

create policy "resume_versions_insert_own"
  on public.resume_versions for insert
  with check (auth.uid() = user_id);

create policy "resume_versions_update_own"
  on public.resume_versions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "resume_versions_delete_own"
  on public.resume_versions for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- job_descriptions
-- ---------------------------------------------------------------------------
create policy "job_descriptions_select_own"
  on public.job_descriptions for select
  using (auth.uid() = user_id);

create policy "job_descriptions_insert_own"
  on public.job_descriptions for insert
  with check (auth.uid() = user_id);

create policy "job_descriptions_update_own"
  on public.job_descriptions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "job_descriptions_delete_own"
  on public.job_descriptions for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- ats_results (no update policy: results are treated as immutable)
-- ---------------------------------------------------------------------------
create policy "ats_results_select_own"
  on public.ats_results for select
  using (auth.uid() = user_id);

create policy "ats_results_insert_own"
  on public.ats_results for insert
  with check (auth.uid() = user_id);

create policy "ats_results_delete_own"
  on public.ats_results for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- interview_sessions
-- ---------------------------------------------------------------------------
create policy "interview_sessions_select_own"
  on public.interview_sessions for select
  using (auth.uid() = user_id);

create policy "interview_sessions_insert_own"
  on public.interview_sessions for insert
  with check (auth.uid() = user_id);

create policy "interview_sessions_update_own"
  on public.interview_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "interview_sessions_delete_own"
  on public.interview_sessions for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- learning_roadmaps
-- ---------------------------------------------------------------------------
create policy "learning_roadmaps_select_own"
  on public.learning_roadmaps for select
  using (auth.uid() = user_id);

create policy "learning_roadmaps_insert_own"
  on public.learning_roadmaps for insert
  with check (auth.uid() = user_id);

create policy "learning_roadmaps_update_own"
  on public.learning_roadmaps for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "learning_roadmaps_delete_own"
  on public.learning_roadmaps for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- applications
-- ---------------------------------------------------------------------------
create policy "applications_select_own"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "applications_insert_own"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "applications_update_own"
  on public.applications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "applications_delete_own"
  on public.applications for delete
  using (auth.uid() = user_id);
