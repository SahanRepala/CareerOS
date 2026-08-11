# ATS Agent

**Status:** architecture placeholder — no AI logic implemented.

## Responsibility

Scores a ParsedResume against a ParsedJobDescription the way an ATS keyword scan would.

## Contract

Implements `Agent<AtsAgentInput, AtsAgentOutput>` from `/contracts/agent.contract.ts`.
See `types.ts` for the concrete input/output shapes.

## Upstream dependencies

- `resume-parser`
- `jd-parser`

## Wiring this up for real

1. Replace the `createPlaceholderAgent(...)` call in `index.ts` with a real
   `Agent<AtsAgentInput, AtsAgentOutput>` implementation (a hand-written object or class
   is fine — the contract doesn't care).
2. Add prompt content to `/prompts/ats-agent.md`.
3. Add provider/model routing for this agent in `/config/model-routing.config.ts`.
4. Add this agent's node to the relevant workflow(s) in `/workflows`.
5. Flip its flag on in `/config/feature-flags.ts`.

