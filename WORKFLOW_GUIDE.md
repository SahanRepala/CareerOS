# WORKFLOW_GUIDE.md

A workflow is a `WorkflowGraph` (`orchestrator/types.ts`): an id plus a flat
list of `WorkflowNode`s, each naming an `agentId`, which other agentIds it
`dependsOn`, a `timeoutMs`, a `retryPolicy`, and whether it's `required`.
Workflows contain **no logic** — they don't call agents, don't transform
data, and don't know how the orchestrator executes them. They're purely
"run these agents, in this order, with these policies."

## Adding a new workflow

1. Create `workflows/<name>.workflow.ts`:

```ts
import type { WorkflowGraph } from '../orchestrator/types';
import { node } from './_shared';

export const myWorkflow: WorkflowGraph = {
  id: 'my-workflow',
  nodes: [
    node('resume-parser'),
    node('ats-agent', ['resume-parser']),
    node('quality-agent', ['ats-agent']),
    node('report-agent', ['quality-agent']),
  ],
};
```

2. Register it in `workflows/index.ts` (`WORKFLOW_REGISTRY`).
3. Draw its graph as a comment at the top of the file, the way the other
   five workflows do — the diagram is the fastest way for the next person to
   sanity-check the `dependsOn` edges.

## `node()` options

```ts
node(agentId, dependsOn = [], { timeoutMs, retryPolicy, required })
```

- `required: false` — a failure here is recorded but does not stop the
  workflow or fail downstream-dependent nodes' *ability to run* (though
  those downstream nodes will receive whatever input the caller built for
  them, which may be incomplete — see the note in `report-builders`).
- `timeoutMs` — defaults to 30s; bump for agents expected to take longer
  (interview and github agents currently use 45s as a placeholder estimate).
- `retryPolicy` — defaults to `DEFAULT_RETRY_POLICY` (2 attempts, 500ms
  backoff, 2x multiplier). Override per-node for agents that shouldn't be
  retried (e.g. ones with side effects) or that need more attempts.

## Execution semantics (enforced by `orchestrator/executor.ts`, not by workflows/)

- Nodes with no unmet dependencies run in parallel, grouped into "levels" by
  `orchestrator/graph.ts#buildExecutionLevels`.
- A cycle in `dependsOn` throws `CycleDetectedError` before anything runs.
- If a `required: true` node fails (after retries/timeout), the orchestrator
  does not start the next level — nodes that already started in the current
  level still finish.
- If only `required: false` nodes fail, the workflow finishes with status
  `partially_failed` rather than `failed`.

## Building inputs

Workflows don't build agent inputs — that's the caller's job (an API route,
today; the workflow definition intentionally stays free of any knowledge of
where `resume-parser`'s raw text comes from). Call
`orchestrator/executor.ts#runWorkflow(graph, { userId, inputs })` where
`inputs` is `Record<AgentId, unknown>` covering every node in the graph.
