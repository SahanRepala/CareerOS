# Interview Agent

**Status:** architecture placeholder — no AI logic implemented.

## Responsibility

Generates and grades interview questions personalized to the candidate.

## Contract

Implements `Agent<InterviewAgentInput, InterviewAgentOutput>` from `/contracts/agent.contract.ts`.
See `types.ts` for the concrete input/output shapes.

## Upstream dependencies

- `resume-parser`
- `jd-parser`

## Wiring this up for real

1. Replace the `createPlaceholderAgent(...)` call in `index.ts` with a real
   `Agent<InterviewAgentInput, InterviewAgentOutput>` implementation (a hand-written object or class
   is fine — the contract doesn't care).
2. Add prompt content to `/prompts/interview-agent.md`.
3. Add provider/model routing for this agent in `/config/model-routing.config.ts`.
4. Add this agent's node to the relevant workflow(s) in `/workflows`.
5. Flip its flag on in `/config/feature-flags.ts`.

## Note

A non-agent heuristic version of this already exists at lib/ai/interview-questions.ts and lib/ai/interview-feedback.ts. This placeholder defines where it becomes an Agent-contract-compliant module; it does not replace the existing route yet.
