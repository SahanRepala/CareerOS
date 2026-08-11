# LinkedIn Agent

**Status:** architecture placeholder — no AI logic implemented.

## Responsibility

Reviews a LinkedIn profile for consistency with the resume and role targets.

## Contract

Implements `Agent<LinkedinAgentInput, LinkedinAgentOutput>` from `/contracts/agent.contract.ts`.
See `types.ts` for the concrete input/output shapes.

## Upstream dependencies

- `resume-parser`

## Wiring this up for real

1. Replace the `createPlaceholderAgent(...)` call in `index.ts` with a real
   `Agent<LinkedinAgentInput, LinkedinAgentOutput>` implementation (a hand-written object or class
   is fine — the contract doesn't care).
2. Add prompt content to `/prompts/linkedin-agent.md`.
3. Add provider/model routing for this agent in `/config/model-routing.config.ts`.
4. Add this agent's node to the relevant workflow(s) in `/workflows`.
5. Flip its flag on in `/config/feature-flags.ts`.

