-- CareerOS AI-platform foundation: agent execution history
--
-- Purely additive: no existing table is altered or dropped. These tables
-- give the orchestrator (see /orchestrator) somewhere to persist what it
-- already produces in memory today (WorkflowExecutionResult, AgentResult,
-- FinalReport) once persistence is wanted. Nothing in the app writes to
-- these tables yet — the orchestrator currently returns results directly to
-- the caller without persisting them.

-- ---------------------------------------------------------------------------
-- workflow_executions: one row per orchestrator.runWorkflow() call
-- ---------------------------------------------------------------------------
create table if not exists public.workflow_executions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workflow_id text not null,                 -- e.g. 'resume-analysis', matches WorkflowGraph.id
  status text not null,                       -- WorkflowExecutionStatus
  trace jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index if not exists workflow_executions_user_id_idx on public.workflow_executions(user_id);
create index if not exists workflow_executions_workflow_id_idx on public.workflow_executions(workflow_id);

-- ---------------------------------------------------------------------------
-- agent_executions: one row per agent.run() call within a workflow execution
-- ---------------------------------------------------------------------------
create table if not exists public.agent_executions (
  id uuid primary key default gen_random_uuid(),
  workflow_execution_id uuid references public.workflow_executions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  agent_id text not null,                     -- matches AgentId
  agent_version text not null,
  prompt_version text,                        -- matches /prompts/<agent-id>.md version, once versioned
  provider text,
  model text,
  status text not null,                       -- AgentStatus
  input jsonb,
  output jsonb,
  confidence_score numeric,
  confidence_rationale text,
  estimated_tokens integer,
  estimated_usd numeric,
  execution_time_ms integer,
  errors jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create index if not exists agent_executions_workflow_execution_id_idx on public.agent_executions(workflow_execution_id);
create index if not exists agent_executions_user_id_idx on public.agent_executions(user_id);
create index if not exists agent_executions_agent_id_idx on public.agent_executions(agent_id);

-- ---------------------------------------------------------------------------
-- generated_reports: persisted FinalReport snapshots (report-builders output)
-- ---------------------------------------------------------------------------
create table if not exists public.generated_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workflow_execution_id uuid references public.workflow_executions(id) on delete set null,
  report jsonb not null,                      -- serialized FinalReport
  created_at timestamptz not null default now()
);

create index if not exists generated_reports_user_id_idx on public.generated_reports(user_id);

-- ---------------------------------------------------------------------------
-- quality_scores: evaluator results attached to a single agent execution
-- ---------------------------------------------------------------------------
create table if not exists public.quality_scores (
  id uuid primary key default gen_random_uuid(),
  agent_execution_id uuid not null references public.agent_executions(id) on delete cascade,
  evaluator_id text not null,                 -- matches evaluators/index.ts EVALUATOR_REGISTRY key
  score numeric,
  passed boolean,
  notes jsonb,
  created_at timestamptz not null default now()
);

create index if not exists quality_scores_agent_execution_id_idx on public.quality_scores(agent_execution_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — same owner-column pattern as every existing table
-- ---------------------------------------------------------------------------
alter table public.workflow_executions enable row level security;
alter table public.agent_executions enable row level security;
alter table public.generated_reports enable row level security;
alter table public.quality_scores enable row level security;

create policy "workflow_executions_select_own"
  on public.workflow_executions for select
  using (auth.uid() = user_id);
create policy "workflow_executions_insert_own"
  on public.workflow_executions for insert
  with check (auth.uid() = user_id);
create policy "workflow_executions_update_own"
  on public.workflow_executions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "workflow_executions_delete_own"
  on public.workflow_executions for delete
  using (auth.uid() = user_id);

create policy "agent_executions_select_own"
  on public.agent_executions for select
  using (auth.uid() = user_id);
create policy "agent_executions_insert_own"
  on public.agent_executions for insert
  with check (auth.uid() = user_id);
create policy "agent_executions_update_own"
  on public.agent_executions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "agent_executions_delete_own"
  on public.agent_executions for delete
  using (auth.uid() = user_id);

create policy "generated_reports_select_own"
  on public.generated_reports for select
  using (auth.uid() = user_id);
create policy "generated_reports_insert_own"
  on public.generated_reports for insert
  with check (auth.uid() = user_id);
create policy "generated_reports_delete_own"
  on public.generated_reports for delete
  using (auth.uid() = user_id);

-- quality_scores has no user_id column directly; ownership is via its parent agent_execution.
create policy "quality_scores_select_own"
  on public.quality_scores for select
  using (
    exists (
      select 1 from public.agent_executions ae
      where ae.id = quality_scores.agent_execution_id and ae.user_id = auth.uid()
    )
  );
create policy "quality_scores_insert_own"
  on public.quality_scores for insert
  with check (
    exists (
      select 1 from public.agent_executions ae
      where ae.id = quality_scores.agent_execution_id and ae.user_id = auth.uid()
    )
  );

-- Note: resume_versions, job_descriptions, ats_results already exist and
-- already serve the "Resume Versions" / "Job Descriptions" / partial
-- "Generated Reports" prep called for in the architecture brief — this
-- migration only adds what's missing (execution history + quality scores),
-- it does not duplicate them.
