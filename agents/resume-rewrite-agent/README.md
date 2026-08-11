# Resume Rewrite Agent

**Status:** architecture placeholder — no AI logic implemented.

## Responsibility

Proposes a rewritten ParsedResume optimized for a target job description.

## Contract

Implements `Agent<ResumeRewriteAgentInput, ResumeRewriteAgentOutput>` from `/contracts/agent.contract.ts`.
See `types.ts` for the concrete input/output shapes.

## Upstream dependencies

- `resume-parser`
- `jd-parser`

## Wiring this up for real

1. Replace the `createPlaceholderAgent(...)` call in `index.ts` with a real
   `Agent<ResumeRewriteAgentInput, ResumeRewriteAgentOutput>` implementation (a hand-written object or class
   is fine — the contract doesn't care).
2. Add prompt content to `/prompts/resume-rewrite-agent.md`.
3. Add provider/model routing for this agent in `/config/model-routing.config.ts`.
4. Add this agent's node to the relevant workflow(s) in `/workflows`.
5. Flip its flag on in `/config/feature-flags.ts`.

