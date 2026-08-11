# SYSTEM_DESIGN.md

## Execution graph (complete-analysis workflow)

```
resume-parser        jd-parser
      \                  /
       \________________/
                |
    ┌───────────┼──────────────┬──────────────┬───────────────┐
    ▼           ▼               ▼              ▼               ▼
ats-agent  recruiter-review  skill-gap    resume-rewrite   bullet-improve
    │       -agent               │              │               │
    │           │                │              │               │
    ▼           ▼                ▼              ▼               ▼
cover-letter  interview-agent  linkedin-agent  github-review  portfolio
                                                                 │
                                                              salary-agent
                                                                 │
                                                          career-strategy
                                                                 │
    └───────────┴────────────────┴──────────────┴───────────────┘
                                |
                          quality-agent
                                |
                          report-agent
                                |
                          FinalReport
```

This is `workflows/complete-analysis.workflow.ts`. The other four workflows
(`resume-analysis`, `interview`, `github`, `career`) are narrower slices of
the same graph — see each file in `/workflows` for its own diagram.

## Request lifecycle

1. A future `/api/analyze` (or similar) route receives a request, validates
   the HTTP-level shape, and picks a workflow from `workflows/index.ts`'s
   `WORKFLOW_REGISTRY`.
2. It builds the initial per-agent inputs (e.g. raw resume text for
   `resume-parser`) and calls `orchestrator/executor.ts#runWorkflow(graph, { userId, inputs })`.
3. `runWorkflow`:
   - Calls `orchestrator/graph.ts#buildExecutionLevels` to turn the flat
     `dependsOn` edges into ordered batches of agents that can run in
     parallel (throws `CycleDetectedError` if the graph is malformed).
   - For each level, runs every node's agent via `agents/registry.ts#getAgent`,
     wrapped in `orchestrator/retry.ts#withTimeout` + `withRetry` per that
     node's `timeoutMs`/`retryPolicy`.
   - Logs `workflow_started`, `agent_error` (on timeout/failure), and
     `workflow_finished` events through `lib/logging/execution-logger.ts`.
   - Stops starting new levels once a *required* node fails; optional-node
     failures are recorded but don't block downstream levels.
4. The route passes the resulting `WorkflowExecutionResult` into
   `report-builders/build-final-report.ts#buildFinalReport`, which pulls each
   agent's `output` out of the execution result, dedupes/prioritizes
   recommendations, and returns a `FinalReport`.
5. The route serializes `FinalReport` (or an `AppError` from
   `lib/errors/app-error.ts` on failure) back to the frontend.

Today, every agent is a placeholder, so step 3 always produces
`status: 'not_implemented'` results and step 4 produces a `FinalReport` with
every section `null` — but the *plumbing* for all five steps is real and
runnable.

## Error handling

Three layers of error type, narrowing as they cross a boundary:

- `AgentError` (`contracts/agent.contract.ts`) — what an individual agent
  reports about its own run (`VALIDATION_ERROR`, `PROVIDER_ERROR`, `TIMEOUT`,
  `NOT_IMPLEMENTED`, `UNKNOWN`).
- `OrchestratorError` (`orchestrator/types.ts`) — adds workflow-level
  concerns (`CYCLE_DETECTED`, `UNKNOWN_AGENT`, `WORKFLOW_ERROR`).
- `AppError` (`lib/errors/app-error.ts`) — the one shape an API route
  actually throws/catches, with an HTTP status attached, so every AI-backed
  route returns the same `{ error: { code, message, details } }` envelope.

## Logging

`lib/logging/execution-logger.ts#logExecutionEvent` is the single call site
used by the orchestrator (and, later, agents themselves) to emit structured
JSON log lines tagged `source: "careeros.ai-execution"` with
`workflowId`, `workflowExecutionId`, `agentId`, `executionTimeMs`, `status`,
and `errors` where relevant. It currently writes to `console.log`; swapping
that for a real log pipeline or the `agent_executions` table (see the
`20260811000000_ai_execution_history.sql` migration) is a one-file change.

## Feature flags

`config/feature-flags.ts` exposes one boolean per agent plus
`qualityLayerEnabled` and `futureAgentsEnabled`, resolved from
`FEATURE_AGENT_<ID>` / `FEATURE_QUALITY_LAYER` / `FEATURE_FUTURE_AGENTS` env
vars. All default `false`. Nothing currently reads these flags to gate
execution — wiring `orchestrator/executor.ts` to skip disabled agents (and
have `report-builders` treat them as "not requested" rather than "failed")
is the natural next step once the first real agent ships.

## Model routing

`config/model-routing.config.ts` gives every agent a routing entry
(`provider`, `model`, `temperature`, `maxTokens`, `timeoutMs`), all currently
`provider: null, model: null`. No provider SDK is imported anywhere in this
codebase.
