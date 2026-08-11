# JD Parser

**Status:** architecture placeholder — no AI logic implemented.

## Responsibility

Turns a pasted/uploaded job description into a structured ParsedJobDescription.

## Contract

Implements `Agent<JdParserInput, JdParserOutput>` from `/contracts/agent.contract.ts`.
See `types.ts` for the concrete input/output shapes.

## Upstream dependencies

None. This agent can run as soon as raw input is available.

## Wiring this up for real

1. Replace the `createPlaceholderAgent(...)` call in `index.ts` with a real
   `Agent<JdParserInput, JdParserOutput>` implementation (a hand-written object or class
   is fine — the contract doesn't care).
2. Add prompt content to `/prompts/jd-parser.md`.
3. Add provider/model routing for this agent in `/config/model-routing.config.ts`.
4. Add this agent's node to the relevant workflow(s) in `/workflows`.
5. Flip its flag on in `/config/feature-flags.ts`.

