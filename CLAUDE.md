# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A mobile-friendly single-page app for attendees of Freed-Hardeman University's University Scholars' Day (April 24, 2026). It is a pure client-side app — no backend, no API, no database. All session data is hardcoded in TypeScript.

## Commands

```bash
npm run dev        # Dev server at http://localhost:5173
npm run build      # Production build → ./dist
npm run preview    # Preview production build locally
npm run typecheck  # Type-check without emitting (tsc --noEmit)
```

There are no tests. `npm run typecheck` is the primary quality gate.

## Architecture

**State & navigation:** `App.tsx` owns a single `tab` state that toggles between two views (`ScheduleView` and `MyScheduleView`). No router. No Redux/Zustand/Context — just `useState` and one custom hook.

**Selection persistence:** `useSelections` (src/hooks/useSelections.ts) manages the set of starred session IDs. Persisted to `localStorage` under the key `fhu-scholars-day-2026:selections`.

**Data:** All sessions live in `src/data/sessions.ts` as a typed array (`SESSIONS`). Times are ISO 8601 strings with CDT offset (`-05:00`). A local helper `t("HH:MM")` stamps the date `2026-04-24` automatically.

**Business logic in `src/lib/`:**
- `conflicts.ts` — O(n²) overlap detection, returns `Map<string, Set<string>>` of conflicting session ID pairs
- `format.ts` — `date-fns` wrappers for human-readable time ranges
- `ics.ts` — RFC 5545-compliant `.ics` file builder; triggers a browser download for calendar export

**Styling:** Plain CSS with custom properties. `src/styles/theme.css` defines FHU brand tokens; `src/styles/globals.css` contains all component styles (~700 lines). No Tailwind, no CSS modules.

## Key Files

| File | Role |
|------|------|
| `src/types.ts` | `Session` and `SessionType` types — single source of truth |
| `src/data/sessions.ts` | All session records for the event |
| `src/components/ScheduleView.tsx` | Main browse view: search, room filtering, time-block grouping |
| `src/components/MyScheduleView.tsx` | Personal schedule view: conflict detection, ICS export |
| `src/lib/ics.ts` | Most algorithmically complex file; hardcoded `America/Chicago` VTIMEZONE |

## Deployment

Configured for both Netlify (`netlify.toml`) and Vercel (`vercel.json`). Both build `dist/` and include SPA catch-all rewrites. No CI/CD pipeline — deploys happen via platform git integration.
