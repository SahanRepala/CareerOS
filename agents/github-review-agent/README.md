# GitHub Review Agent

**Status:** architecture placeholder — no AI logic implemented.

## Responsibility

Produces qualitative engineering-maturity insights for a repository.

## Contract

Implements `Agent<GithubReviewAgentInput, GithubReviewAgentOutput>` from `/contracts/agent.contract.ts`.
See `types.ts` for the concrete input/output shapes.

## Upstream dependencies

None. This agent can run as soon as raw input is available.

## Wiring this up for real

1. Replace the `createPlaceholderAgent(...)` call in `index.ts` with a real
   `Agent<GithubReviewAgentInput, GithubReviewAgentOutput>` implementation (a hand-written object or class
   is fine — the contract doesn't care).
2. Add prompt content to `/prompts/github-review-agent.md`.
3. Add provider/model routing for this agent in `/config/model-routing.config.ts`.
4. Add this agent's node to the relevant workflow(s) in `/workflows`.
5. Flip its flag on in `/config/feature-flags.ts`.

## Note

A non-agent heuristic version of this already exists at lib/ai/github-insights.ts and lib/ai/heuristic-insights.ts, called from app/api/github-intelligence. This placeholder defines where it becomes an Agent-contract-compliant module; it does not replace the existing route yet.
