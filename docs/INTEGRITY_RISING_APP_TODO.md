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
- [x] Inspected the existing app configuration, package manifest, lockfile, Vite configuration, and launch checklist. — **Completed: Nov 5, 2026**
- [x] Confirmed that `package.json` declares `@supabase/supabase-js`, but `package-lock.json` does not contain it. — **Completed: Nov 5, 2026**
- [x] Added the `npm run check` script to run linting and the production build together. — **Completed: Nov 5, 2026**
- [x] Updated this launch checklist to track completed work and remaining launch blockers. — **Completed: Nov 5, 2026**
- [x] Investigated the GitHub Actions folder conflict and removed the empty `.github/workflows` path placeholder so workflow creation can be retried. — **Completed: Nov 5, 2026**

**Still in progress / next**
- [ ] Generate a correct `package-lock.json` using npm; do not hand-write dependency integrity data.
- [ ] Create the GitHub Actions quality-check workflow and confirm it runs.
- [ ] Run lint and production build; record actual results.
- [ ] Continue the remaining Priority 1 reliability checks.

**Daily record:** Progress is recorded by date. At the end of each work session, completed items will be checked off and unfinished items will remain open for the next day.


## Room to grow — ongoing improvement log

This section is for improvements beyond the launch blockers: ideas, enhancements, member feedback, accessibility, new learning and wellness content, partnerships, and future features. Add an item here when it is a worthwhile opportunity but not required to finish today's task. Move it into the active checklist when it becomes a priority.

| Improvement opportunity | Why it matters | Status / notes | Added |
|---|---|---|---|
| Gather feedback from a small group of trusted test users | Find confusing screens and missing support needs before public launch | Future improvement; schedule after a safe test version is ready | Nov 5, 2026 |
| Continue improving mobile accessibility and ease of navigation | Make the app easier to use on phones and with assistive technology | Recheck during launch testing | Nov 5, 2026 |
| Expand wellness and learning resources based on member needs | Keep the app useful, practical, and relevant | Future improvement; review after initial launch | Nov 5, 2026 |

### Daily completion-date rule
- Every completed checklist item gets its actual completion date beside it.
- If work spans multiple days, record the date it was truly finished—not the date it was started.
- Keep unfinished items unchecked and carry them forward.
- Record worthwhile ideas in **Room to grow** so they are not lost or confused with launch blockers.


## Goals and progress dashboard

Progress is counted from verified checklist items—not estimates. A task only moves to complete after the work is done and checked. Percentages are recalculated as tasks are completed or the scope changes.

### Goal 1 — Make the app reliable and buildable

**Target:** A clean install, automated quality checks, and a verified production build.

<text>**Progress: 4 of 8 steps complete — 50%**</text>

`[████░░░░] 50%`

- [x] Inspect app configuration and project files — completed Nov 5, 2026.
- [x] Identify the package manifest / lockfile mismatch — completed Nov 5, 2026.
- [x] Add the combined lint-and-build command — completed Nov 5, 2026.
- [x] Clear the empty GitHub workflow-folder obstruction — completed Nov 5, 2026.
- [ ] Regenerate and verify the dependency lockfile.
- [ ] Add the automated GitHub Actions workflow.
- [ ] Run lint and production build; fix any failures.
- [ ] Test core app navigation and behavior on Android and desktop.

**Make this goal easier to reach**
1. Work on one blocker at a time; do not mix app features with build repairs.
2. Generate the lockfile with npm in a real Node/npm environment rather than editing dependency hashes by hand.
3. Let GitHub Actions run the same checks automatically on each update.
4. Test one user journey at a time: open app → navigate → use a feature → return home.
5. Record errors with the exact file and message, then fix and retest.

### Goal 2 — Make member accounts and data safe

**Target:** Authentication, database rules, privacy controls, and moderator permissions are configured and tested before member data is stored.

<text>**Progress: Not yet scored — verification steps remain open.**</text>

`[░░░░░░░░░░] Pending`

**Reachable steps**
- [ ] Confirm the Supabase project and connect app environment variables.
- [ ] Apply migrations 001, 002, and 003 in order.
- [ ] Test member and moderator access with separate test accounts.
- [ ] Confirm sensitive records are private and not sent to AI.
- [ ] Publish privacy, consent, and data-deletion information.

**Make this goal easier to reach:** Complete the database setup first, then test one permission scenario at a time. Never put service-role keys in the browser or repository.

### Goal 3 — Make wellness and AI features honest, useful, and safe

**Target:** Members understand which tools are prototypes, which are live, what data is shared, and where to get human help.

<text>**Progress: Not yet scored — verification steps remain open.**</text>

`[░░░░░░░░░░] Pending`

**Reachable steps**
- [ ] Review the current rule-based wellness tools and their limits.
- [ ] Review and test the secure AI endpoint before deployment.
- [ ] Add provider secrets only in the secure server environment.
- [ ] Add rate limits, cost controls, monitoring, and failure handling.
- [ ] Test crisis guidance and clearly direct emergencies to human services.

**Make this goal easier to reach:** Launch the useful non-AI wellness tools first. Add live AI only after privacy, consent, security, and crisis safeguards are ready.

### Goal 4 — Verify safety resources and moderation

**Target:** Support links work, safety limitations are clear, and community reports and moderation are tested before public use.

<text>**Progress: Not yet scored — verification steps remain open.**</text>

`[░░░░░░░░░░] Pending`

**Reachable steps**
- [ ] Verify state resource links in manageable batches.
- [ ] Test local support finder links.
- [ ] Test reporting, blocking, review, and removal with test accounts.
- [ ] Review safety disclaimers and quick-exit limitations.

**Make this goal easier to reach:** Verify a small group of states and features per work session, record the date and source checked, and keep unverified resources clearly marked.

### Goal 5 — Prepare a controlled public launch

**Target:** A polished, accessible app with clear policies, tested user journeys, and a small feedback round before wider promotion.

<text>**Progress: Not yet scored — verification steps remain open.**</text>

`[░░░░░░░░░░] Pending`

**Reachable steps**
- [ ] Complete mobile and desktop testing.
- [ ] Review accessibility and navigation.
- [ ] Publish terms, privacy policy, community guidelines, and contact details.
- [ ] Complete final security review.
- [ ] Invite a small trusted test group and resolve priority feedback.

**Make this goal easier to reach:** Use a limited pilot before public promotion. Ask testers to complete a few specific tasks and report what was confusing.

### How we'll use this dashboard
- Update progress at the end of each work session.
- Add the actual completion date to every checked-off item.
- Keep pending goals unscored until their steps are defined and verified.
- Break any task that feels too large into smaller steps that can be finished in one session.
- Keep new ideas in **Room to grow** until we decide they are part of a goal.
- Progress bars show checklist completion, not a guarantee that the app is launch-ready.
