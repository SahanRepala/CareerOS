# Skill Gap Agent

**Status:** architecture placeholder — no AI logic implemented.

## Responsibility

Diffs a candidate's current skills against a target role to find gaps.

## Contract

Implements `Agent<SkillGapAgentInput, SkillGapAgentOutput>` from `/contracts/agent.contract.ts`.
See `types.ts` for the concrete input/output shapes.

## Upstream dependencies

- `resume-parser`

## Wiring this up for real

1. Replace the `createPlaceholderAgent(...)` call in `index.ts` with a real
   `Agent<SkillGapAgentInput, SkillGapAgentOutput>` implementation (a hand-written object or class
   is fine — the contract doesn't care).
2. Add prompt content to `/prompts/skill-gap-agent.md`.
3. Add provider/model routing for this agent in `/config/model-routing.config.ts`.
4. Add this agent's node to the relevant workflow(s) in `/workflows`.
5. Flip its flag on in `/config/feature-flags.ts`.

