# Referral Assistant

**Status:** architecture placeholder — folder reserved, no code yet.

This is a future product module rather than a single AI agent — when it's
built, it will likely combine one or more agents from /agents with its own
UI and (if needed) its own /lib/db repository, the same way the existing
interview-prep and github-intelligence dashboard pages combine an agent-ish
lib/ai/* module with their own UI and data layer today.

Nothing to wire up yet. Adding this module for real means:
1. Decide whether it needs a new agent (add to /agents + types/agent-id.ts)
   or reuses existing agents.
2. Add any new persisted data to lib/db (repository) and a migration under
   supabase/migrations, following the pattern in lib/db/applications.ts.
3. Add a dashboard page under app/dashboard, following the existing pages'
   structure.
