# CareerOS (Next.js) — Code Quality Audit

Scope: architecture review, duplication, dead code, naming, reusability, App Router
conventions, TypeScript quality, Tailwind organization, and page-splitting opportunities.
No features, UI, or styling were changed. No packages were installed or removed.

## Architecture overview

- Next.js 13.5 App Router, TypeScript, Tailwind + shadcn/ui, Framer Motion, Recharts,
  React Hook Form + Zod, Sonner for toasts.
- Marketing site (`app/page.tsx`) + auth (`login`, `register`) + a client-rendered
  `dashboard` section with 10 feature pages, all backed by static mock data in `lib/mock/*`
  (no real data fetching/back end wired up yet).
- Component structure is sensibly split into `components/ui` (shadcn primitives),
  `components/shared` (cross-cutting app components), `components/landing`, and
  `components/dashboard`. Naming is consistently kebab-case throughout.

---

## Critical Issues — ✅ Implemented

1. **Duplicate/dead Toast system.** `components/ui/toast.tsx`, `components/ui/toaster.tsx`,
   and `hooks/use-toast.ts` formed a complete Radix-based toast implementation that was
   never rendered anywhere — the app exclusively uses `sonner`. Removed all three files.
2. **Duplicate `Skeleton` component (naming collision).** `components/ui/skeleton.tsx`
   and `components/shared/skeleton.tsx` both exported a `Skeleton` component; neither was
   imported anywhere. Removed both files.
3. **Unsafe, duplicated dynamic-icon lookup.** The identical, unguarded
   `(Icons as any)[name] as Icons.LucideIcon` cast was repeated in 5 files
   (`app/dashboard/page.tsx`, `app/dashboard/interview-prep/page.tsx`,
   `components/dashboard/sidebar.tsx`, `components/landing/features.tsx`,
   `components/landing/how-it-works.tsx`). A mistyped icon name would have crashed at
   render with no fallback. Centralized into a single typed, defensive
   `components/shared/dynamic-icon.tsx` (`<DynamicIcon name="..." className="..." />`)
   and updated all 5 call sites. Two *static* icon references in `interview-prep/page.tsx`
   that depended on the removed namespace import (`Icons.Check`, `Icons.ArrowUpRight`)
   were switched to direct named imports.
4. **Remaining `as any` casts.** Two Radix `Tabs` `onValueChange` handlers in
   `interview-prep/page.tsx` cast to `any`; changed to the real union types
   (`QuestionCategory | 'all'`, `Difficulty | 'all'`).
5. **Dead exported function.** `DashboardBackLink` in `components/dashboard/sidebar.tsx`
   was defined and exported but never imported anywhere. Removed it, along with the
   `ChevronLeft` import that only it used.
6. **Unused imports** (pre-existing, found via a project-wide sweep and confirmed against
   a real `tsc --noEmit` pass): unused `useState` in `app/dashboard/page.tsx`; unused
   `motion` in `app/dashboard/profile/page.tsx`, `app/dashboard/settings/page.tsx`, and
   `components/landing/how-it-works.tsx`; unused `Badge` in
   `app/dashboard/applications/page.tsx`. All removed.

**Verification performed:** ran `tsc --noEmit` (clean, zero errors) and `eslint` (only one
pre-existing, unrelated warning remains — see Recommended #5) against the updated project
in an isolated scratch copy, so the real `package.json`/lockfile in your project were never
touched. No visual/behavioral output changes — every edit either deleted unreachable code
or swapped an unsafe cast for an equivalent, type-safe call.

---

## Recommended Improvements — not implemented, for your review

1. **Unused custom components.** `components/shared/empty-state.tsx` and
   `error-state.tsx` are fully built but never imported anywhere. Either wire them into
   pages that list/fetch data, or remove them if not planned.
2. **Dead prop in `ToggleRow`** (`app/dashboard/settings/page.tsx`) — the type declares a
   `defaultChecked` prop that is never destructured/used in the function body.
3. **Unused dependency.** `@supabase/supabase-js` is in `package.json` but has zero
   imports anywhere in the codebase — likely leftover scaffolding.
4. **~26 unused shadcn/ui primitives** (avatar, calendar, carousel, chart, command,
   drawer, sheet, tooltip, table, toggle-group, etc.) are present but never imported.
   Standard scaffold bloat; safe to prune later, low priority.
5. **One pre-existing lint error** (unrelated to anything above): an unescaped quote
   character in `components/landing/testimonials.tsx` (`react/no-unescaped-entities`).
   Cosmetic, doesn't affect the build (`next.config.js` already has
   `eslint.ignoreDuringBuilds: true`).
6. **All 10 dashboard pages are entirely `'use client'`**, even ones with little/no
   interactivity. Since they're all static-mock-data-driven today this isn't urgent, but
   splitting server-rendered shells from client "islands" would pay off once real data
   fetching is introduced.
7. **Large monolithic pages** — `app/dashboard/resume/page.tsx` (382 lines) mixes an
   upload widget and six tab panels in one file; `skill-gap`, `ats-analysis`, and
   `settings` pages are similarly dense. Good candidates for extraction into smaller,
   reusable components (e.g. one component per resume tab).
8. **No `loading.tsx`, `error.tsx`, or `not-found.tsx`** anywhere under `app/` — an App
   Router convention gap worth adopting once real async data fetching exists.
9. **Minor naming drift** — `lib/mock/ats.ts` backs the `/dashboard/ats-analysis` route;
   consider renaming to `ats-analysis.ts` for consistency with the route/file elsewhere.

## Nice-to-have Improvements

1. Custom Tailwind utilities `.glass-dark` and `.no-scrollbar` in `globals.css` appear
   unused (`.glass`, `.text-gradient`, `.bg-grid`, `.bg-dots` are all used elsewhere).
2. `SectionHeading`'s optional `icon` prop is never passed by any of its 5 callers —
   intentional flexibility, but worth a one-line comment if it's meant for future use.
