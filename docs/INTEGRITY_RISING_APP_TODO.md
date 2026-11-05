# Integrity Rising App — Launch To-Do List

This checklist tracks work still required before the Integrity Rising / The Integrity Movement app can be safely launched. Items are not complete until they have been configured, tested, and verified.

## Supabase setup and secure AI backend

- [ ] Create or access the Supabase account.
- [ ] Create the Integrity Rising Supabase project.
- [ ] Connect the project to the GitHub app configuration.
- [ ] Add the Supabase project URL and public anon key to the app's deployment environment.
- [ ] Apply database migrations in order: 001 schema, 002 moderation hardening, 003 member blocking.
- [ ] Verify row-level security and test member-versus-moderator permissions.
- [ ] Assign trusted moderators through a secure admin process; never expose service-role credentials in the app.
- [ ] Configure Edge Function secrets: APP_ORIGIN, AI_API_URL, AI_API_KEY, and AI_MODEL.
- [ ] Review, deploy, and test the authenticated ai-assistant Edge Function.
- [ ] Add per-user rate limits, abuse controls, cost limits, monitoring, and provider error handling before enabling AI for members.
- [ ] Complete privacy review and publish the privacy policy and informed AI consent flow before sending member messages to an AI provider.
- [ ] Keep safety plans, incident reports, journal entries, women's wellness records, and community reports out of the AI endpoint.
- [ ] Test authentication, CORS, privacy, failure handling, crisis guidance, and data deletion in a non-production environment.
- [ ] Connect additional AI providers only after each provider's API, privacy terms, security, and cost have been reviewed.

## Safety, moderation, and resource verification

- [ ] Verify all state-by-state domestic violence resource links and contact details.
- [ ] Test local support finder links and clearly communicate that live shelter availability is not verified.
- [ ] Complete safety and privacy review of Quick Exit, personal safety planning, and incident tools.
- [ ] Test member blocking, reporting, moderator review, and content removal with separate test accounts.
- [ ] Confirm the app clearly states that it is not an emergency service, therapy provider, or clinical diagnosis tool.

## Final launch checks

- [ ] Reconcile `package-lock.json` with `package.json`; the current lockfile does not contain `@supabase/supabase-js` even though it is declared as an app dependency.
- [x] Add the combined `npm run check` script (lint + production build) to `package.json`.
- [ ] Run `npm run check` and resolve all errors.
- [ ] Add and verify a GitHub Actions workflow for automated checks. An empty `.github/workflows` path placeholder was removed on November 5 so the workflow file can be retried.
- [ ] Test the app on Android mobile and desktop.
- [ ] Review accessibility, navigation, empty states, and error messages.
- [ ] Publish terms of use, privacy policy, community guidelines, and support/contact information.
- [ ] Complete a final security and launch-readiness review before inviting the public.

## Current status

**Build verification:** A combined `npm run check` script has been added to `package.json`. The production build has not yet been executed. A package-lock mismatch was identified and must be corrected before relying on clean CI installs.

**Supabase and secure AI backend:** Not configured or deployed yet. The repository contains an initial Edge Function scaffold and setup documentation only. No live AI provider connection or production database is confirmed.


## Daily progress tracker

### Thursday, November 5, 2026 — App reliability (Priority 1)

**Completed today**
- [x] Inspected the existing app configuration, package manifest, lockfile, Vite configuration, and launch checklist.
- [x] Confirmed that `package.json` declares `@supabase/supabase-js`, but `package-lock.json` does not contain it.
- [x] Added the `npm run check` script to run linting and the production build together.
- [x] Updated this launch checklist to track completed work and remaining launch blockers.
- [x] Investigated the GitHub Actions folder conflict and removed the empty `.github/workflows` path placeholder so workflow creation can be retried.

**Still in progress / next**
- [ ] Generate a correct `package-lock.json` using npm; do not hand-write dependency integrity data.
- [ ] Create the GitHub Actions quality-check workflow and confirm it runs.
- [ ] Run lint and production build; record actual results.
- [ ] Continue the remaining Priority 1 reliability checks.

**Daily record:** Progress is recorded by date. At the end of each work session, completed items will be checked off and unfinished items will remain open for the next day.
