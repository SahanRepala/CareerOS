# Resume Parser

**Status:** architecture placeholder — no AI logic implemented.

## Responsibility

Turns an uploaded resume file/text into a structured ParsedResume.

## Contract

Implements `Agent<ResumeParserInput, ResumeParserOutput>` from `/contracts/agent.contract.ts`.
See `types.ts` for the concrete input/output shapes.

## Upstream dependencies

None. This agent can run as soon as raw input is available.

## Wiring this up for real

1. Replace the `createPlaceholderAgent(...)` call in `index.ts` with a real
   `Agent<ResumeParserInput, ResumeParserOutput>` implementation (a hand-written object or class
   is fine — the contract doesn't care).
2. Add prompt content to `/prompts/resume-parser.md`.
3. Add provider/model routing for this agent in `/config/model-routing.config.ts`.
4. Add this agent's node to the relevant workflow(s) in `/workflows`.
5. Flip its flag on in `/config/feature-flags.ts`.

