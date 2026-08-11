# AGENT_GUIDE.md

## Adding a brand-new agent

1. Add its id to `types/agent-id.ts`'s `AGENT_IDS` array.
2. Add an entry to the `AGENTS` manifest in `scripts/generate-agents.py`
   (id, title, description, input shape, output type, upstream deps) and run
   `python3 scripts/generate-agents.py`. This scaffolds
   `agents/<id>/{README.md,types.ts,index.ts}` consistently with every other
   agent — don't hand-copy an existing folder, the script is the source of
   truth for the boilerplate shape.
3. Add the new import + registry entry in `agents/registry.ts`.
4. Add a `.md` file to `/prompts/<id>.md`.
5. Add a routing entry to `config/model-routing.config.ts` (optional — falls
   back to `DEFAULT_ROUTING`).
6. Add a flag to `config/feature-flags.ts`'s `agents` map.
7. Wire it into whichever workflow(s) in `/workflows` should call it.

## Graduating a placeholder into a real agent

Every agent currently looks like this (`agents/<id>/index.ts`):

```ts
import { createPlaceholderAgent } from '../_shared/placeholder-agent';
const fooAgent = createPlaceholderAgent<FooInput, FooOutput>({ id: 'foo', version: '0.1.0-placeholder' });
export default fooAgent;
```

To make it real, replace the body of `index.ts` with a hand-written object
implementing `Agent<FooInput, FooOutput>` from `contracts/agent.contract.ts`
— nothing else changes shape, because everything downstream (the
orchestrator, workflows, report-builder) only ever depends on that interface:

```ts
import type { Agent, AgentResult } from '../../contracts/agent.contract';
import type { FooInput, FooOutput } from './types';

const fooAgent: Agent<FooInput, FooOutput> = {
  id: 'foo',
  validateInput(input) { /* real validation */ return []; },
  validateOutput(output) { /* real validation */ return []; },
  confidence() { return { score: 0.8, rationale: '...' }; },
  metadata() { return { agentId: 'foo', version: '1.0.0', promptVersion: '1.0.0', provider: 'anthropic', model: '...' }; },
  version() { return '1.0.0'; },
  costEstimate(input) { return { estimatedTokens: 0, estimatedUsd: 0 }; },
  executionTime() { return null; },
  async run(input, context): Promise<AgentResult<FooOutput>> {
    // real provider call goes here, using config/model-routing.config.ts
    // and /prompts/foo.md for routing + prompt content
  },
};

export default fooAgent;
```

Then:
- Flip `config/feature-flags.ts`'s `agents.foo` to `true` (or set
  `FEATURE_AGENT_FOO=true`).
- Fill in `/prompts/foo.md` and bump its `version` to match
  `metadata().promptVersion`.
- Implement any evaluators in `/evaluators` this agent's output should be
  checked against, and make sure `quality-agent` includes them.

## Relationship to the existing `lib/ai/*` heuristic code

`lib/ai/interview-questions.ts`, `lib/ai/interview-feedback.ts`,
`lib/ai/github-insights.ts`, and `lib/ai/heuristic-insights.ts` are real,
working, non-agent implementations already used by the 3 live API routes.
They are **not** touched by this restructure and keep working exactly as
they do today.

`agents/interview-agent` and `agents/github-review-agent` exist as the
future Agent-contract-compliant homes for that same capability — their
READMEs call this out explicitly. Migrating them means the *route* switches
from calling `lib/ai/*` directly to calling the orchestrator with the
`interview`/`github` workflow; it does not mean deleting `lib/ai/*` on day
one, since that would be a functional regression until the agent version is
proven equivalent.

## Standard agent interface, quick reference

| Method            | Returns                              | Notes |
|--------------------|---------------------------------------|-------|
| `validateInput`    | `AgentError[]`                        | Empty array = valid |
| `run`              | `Promise<AgentResult<TOutput>>`       | Never throws for expected failure modes — returns `status: 'failed'` with `errors` populated instead |
| `validateOutput`   | `AgentError[]`                        | Called by the caller before trusting `output`, not by `run()` itself |
| `confidence`       | `AgentConfidence`                     | Static policy; placeholders always return `{ score: 0, ... }` |
| `metadata`         | `AgentMetadata`                       | Includes `provider`/`model`, both `null` until wired up |
| `version`          | `string`                              | Semver of the agent implementation |
| `costEstimate`     | `AgentCostEstimate`                   | `{ estimatedTokens: 0, estimatedUsd: 0 }` until a provider exists |
| `executionTime`    | `number \| null`                      | Wall-clock ms of the most recent `run()`, `null` before any run |
