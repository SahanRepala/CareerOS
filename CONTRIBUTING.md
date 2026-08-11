# CONTRIBUTING.md

## Dependency direction

`Frontend → API → Workflow → Orchestrator → Agent → Provider`. Never import
"backwards" across this chain (e.g. a component importing from
`/orchestrator`, or an agent importing another agent directly instead of
going through a workflow). See `ARCHITECTURE.md` for the reasoning.

## Adding an AI capability

- New agent: follow `AGENT_GUIDE.md`.
- New workflow: follow `WORKFLOW_GUIDE.md`.
- New domain shape (a new kind of report/result): add it to
  `/contracts/domain`, export it from `contracts/index.ts`, and reuse it —
  don't redeclare an existing contract's fields in an agent's `types.ts`.

## No duplicated types

If a shape already exists in `/contracts` or in an existing `lib/*/types.ts`
(e.g. `lib/interview/types.ts`, `lib/github/types.ts`), import and re-export
it rather than writing a second copy. `contracts/domain/interview.contract.ts`
and `contracts/domain/github-report.contract.ts` are the pattern to follow —
both just re-export the existing `lib/*` types.

## Placeholders must stay honest

A placeholder agent must never report `status: 'success'` — it reports
`'not_implemented'` (see `agents/_shared/placeholder-agent.ts`) so a partial
rollout is visibly partial, not silently wrong. When you do implement an
agent for real, make sure `run()` only reports `'success'` when it actually
produced trustworthy output, and `'partial'` when it produced *some* output
it's less confident in — `confidence()` should reflect that difference.

## Database changes

Additive migrations only — see
`supabase/migrations/20260811000000_ai_execution_history.sql` for the
pattern (new tables, RLS policies matching the existing owner-column
convention, no `alter`/`drop` of existing tables). If a change to an
existing table is genuinely required, it needs its own explicit discussion,
not a drive-by column add inside an unrelated migration.

## Don't break existing functionality

The 3 live API routes (`app/api/github-intelligence`, `app/api/interview-questions`,
`app/api/interview-feedback`) and their `lib/ai/*` implementations keep
working as-is. Moving a capability from `lib/ai/*` to its `agents/*`
placeholder is a deliberate, separate migration (see `AGENT_GUIDE.md`), not
a side effect of adding the architecture around it.

## Code style

- Match the existing codebase: TypeScript strict types, no `any` outside of
  registries that are inherently heterogeneous (see the documented exception
  in `agents/registry.ts`), JSDoc block at the top of each file explaining
  *why* the file exists, not just what it does.
- Run `npm run typecheck` and `npm run lint` before opening a PR that touches
  `/agents`, `/orchestrator`, `/workflows`, `/contracts`, `/evaluators`, or
  `/report-builders`.
