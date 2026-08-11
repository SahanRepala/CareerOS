# FOLDER_STRUCTURE.md

```
/app                    Next.js App Router — pages and the 3 existing API routes. Unchanged.
/components              Existing UI components. Unchanged.
/hooks                    Existing data hooks. Unchanged.

/types
  agent-id.ts             Single source of truth for every AgentId.
  database.types.ts        Existing generated Supabase types. Unchanged.

/contracts                 Domain + agent-interface schemas. The vocabulary every
                            layer (agents, orchestrator, workflows, report-builders,
                            eventually API routes) speaks.
  agent.contract.ts          The Agent<TInput, TOutput> interface.
  final-report.contract.ts   The merged report-builders output shape.
  domain/                    Resume, JobDescription, AtsReport, CoverLetter,
                              Interview, GithubReport, Portfolio, Career schemas.

/agents                    One folder per AI capability. Every folder: README.md,
                            types.ts, index.ts. All currently implement the contract
                            via the shared placeholder factory.
  _shared/placeholder-agent.ts  The only place placeholder boilerplate lives.
  registry.ts                    AgentId -> implementation lookup for the orchestrator.
  resume-parser/  jd-parser/  ats-agent/  resume-rewrite-agent/
  bullet-improvement-agent/  recruiter-review-agent/  skill-gap-agent/
  cover-letter-agent/  interview-agent/  github-review-agent/  portfolio-agent/
  linkedin-agent/  career-strategy-agent/  salary-agent/  quality-agent/  report-agent/

/orchestrator               Dependency-graph execution engine. No AI logic.
  types.ts                    WorkflowGraph/Node, retry policy, error codes.
  graph.ts                     Topological sort + cycle detection.
  retry.ts                      Timeout + retry-with-backoff helpers.
  executor.ts                    runWorkflow() — the only caller of agent.run().

/workflows                  Declarative execution-order definitions. No logic.
  _shared.ts                  node() helper.
  resume-analysis.workflow.ts  interview.workflow.ts  github.workflow.ts
  career.workflow.ts  complete-analysis.workflow.ts
  index.ts                     WORKFLOW_REGISTRY.

/evaluators                 Quality layer. Pure scoring functions, currently neutral.
  types.ts  accuracy / consistency / hallucination / duplicate-detection /
  grammar / resume-quality / jd-matching / coverage .evaluator.ts
  index.ts                     EVALUATOR_REGISTRY.

/report-builders             Merges a WorkflowExecutionResult into a FinalReport.
  build-final-report.ts        Dedupe, prioritize, format. No AI logic.

/prompts                     One .md placeholder per agent. No prompt content yet.

/config
  feature-flags.ts             Per-agent + quality-layer + future-agents flags.
  model-routing.config.ts      Per-agent provider/model/temperature routing (all null).

/modules                    Reserved folders for future non-agent product features
                              (company-research, referral-assistant, networking-coach,
                              offer-negotiation, learning-planner, company-comparison)
                              that will combine agents + their own UI/data layer.

/lib
  ai/                          Existing heuristic implementations. Unchanged; see
                                AGENT_GUIDE.md for how these relate to /agents.
  db/  supabase/  github/  interview/  recruiter/  mock/   Existing. Unchanged.
  logging/execution-logger.ts   Structured logging for the AI layer.
  errors/app-error.ts           Unified error envelope for API routes.

/supabase/migrations         Existing migrations, unchanged, plus one new additive
                              migration (20260811000000_ai_execution_history.sql)
                              adding workflow_executions, agent_executions,
                              generated_reports, quality_scores.

/scripts/generate-agents.py  Re-runnable scaffolder that produced every /agents/*
                              placeholder from one manifest. Keep the manifest and
                              the folders in sync when adding an agent.
```

## Why some things aren't where the original brief listed them

- **`/types` already existed** (`types/database.types.ts`) — new shared types
  (`agent-id.ts`) were added there instead of creating a second, competing
  types root.
- **No `interface.ts` per agent** — the brief's "interface" file would just
  re-declare `Agent<TInput, TOutput>` per agent, which is exactly the
  duplication the brief also asks to avoid. The one interface lives in
  `contracts/agent.contract.ts`; each agent only adds its own `types.ts`.
