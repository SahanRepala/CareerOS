# ARCHITECTURE.md

## Why this exists

CareerOS today ships real product value through a handful of heuristic
"AI-shaped" features (`lib/ai/*`, called from 3 API routes) plus a lot of UI
built ahead of the backend (`lib/mock/*` powering several dashboard pages).
That's the right way to build a v1. It is not a shape that scales past a
handful of features: every new capability would mean another one-off
`lib/ai/whatever.ts` file, another bespoke API route, no shared error format,
no shared way to say "this feature isn't ready yet," and no way to run
several AI steps together with retries, timeouts, or partial failure.

This restructure doesn't rebuild any of that — the frontend, the 3 live API
routes, `lib/ai/*`, `lib/mock/*`, and the whole `lib/db` layer are untouched.
It adds one consistent skeleton *around* that code so the next 5, 20, or 100
AI capabilities all snap into the same slots instead of each reinventing
input validation, error handling, retries, and result shape.

## The dependency rule

```
Frontend → API → Workflow → Orchestrator → Agent → Provider
```

Enforced by import discipline, not a linter (yet):

- Pages/components never import from `/agents`, `/orchestrator`, or
  `/workflows` directly. They call an API route.
- API routes call a workflow (`/workflows`) via the orchestrator
  (`orchestrator/executor.ts`), never an agent directly.
- Workflows only declare execution order (`/workflows/*.workflow.ts`) — they
  never call `agent.run()` themselves.
- The orchestrator (`/orchestrator`) is the only code that calls
  `agent.run()`.
- Agents (`/agents/*`) are the only code that will eventually call a model
  provider. Right now none of them do — see `agents/_shared/placeholder-agent.ts`.

## The core abstraction: `Agent<TInput, TOutput>`

Every current and future AI capability — resume parsing, ATS scoring, cover
letters, salary benchmarking, the 12 other ideas in the "placeholders"
section of `FOLDER_STRUCTURE.md` — implements the exact same contract,
defined once in `contracts/agent.contract.ts`:

```
run(input, context) -> AgentResult<TOutput>
validateInput(input) -> AgentError[]
validateOutput(output) -> AgentError[]
confidence() -> AgentConfidence
metadata() -> AgentMetadata
version() -> string
costEstimate(input) -> AgentCostEstimate
executionTime() -> number | null
```

Nothing downstream (orchestrator, workflows, report-builders, API routes)
branches on *which* agent it's talking to beyond looking one up by id. That's
what lets the graph scale from 16 agents to 100 without the orchestrator,
workflow definitions, or report-builder changing shape — only
`types/agent-id.ts` and `agents/registry.ts` grow by one line each.

## Why placeholders instead of stubs that throw

Every agent today is `createPlaceholderAgent(...)` — it validates input,
returns instantly, and reports `status: 'not_implemented'` in a fully
well-formed `AgentResult`. This matters for two reasons:

1. The orchestrator, workflows, and report-builder can be exercised
   end-to-end *right now*, before a single provider is wired up, which
   means the plumbing is tested by the time real logic lands instead of
   being untested new surface area at the same time as new AI logic.
2. Callers (API routes, the future frontend) get a real, typed
   "not ready yet" response instead of a 500 or an exception, so partial
   rollouts (some agents live, most not) behave predictably.

## What's deliberately NOT here

- No LLM provider SDKs, no API keys, no prompt content beyond a version
  placeholder in `/prompts/*.md`.
- No RAG, no embeddings, no memory store.
- No agent framework (LangChain/LangGraph/CrewAI/AutoGen) — the orchestrator
  is ~250 lines of plain TypeScript on purpose. It's small enough to read in
  one sitting and doesn't ask the team to learn a framework's abstractions
  before they can add agent #17.

See `SYSTEM_DESIGN.md` for the execution graph and data flow, `AGENT_GUIDE.md`
for how to graduate a placeholder into a real agent, and `WORKFLOW_GUIDE.md`
for how to add or modify a workflow.
