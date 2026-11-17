# Integrity Rising App — Launch To-Do List

This checklist tracks work still required before the Integrity Rising / The Integrity Movement app can be safely launched. Items are not complete until they have been configured, tested, and verified.

## Supabase setup and secure AI backend

- [x] Create/access the Supabase account using the owner's GitHub sign-in. — **Completed: Nov 5, 2026 (owner-confirmed)**
- [x] Create the Integrity Rising Supabase project. — **Completed: Nov 5, 2026 (owner-confirmed)**
- [ ] Connect the project to the GitHub app configuration.
- [ ] Add the Supabase project URL and public anon key to the app's deployment environment.
- [x] Apply database migrations in order: 001 schema, 002 moderation hardening, 003 member blocking. — **Completed: Nov 5, 2026 (owner-confirmed).**
- [ ] Confirm migration history for community chat setup (migration 008); the four community tables exist, but table existence alone does not prove which migration created them. — **Checked: Nov 16, 2026**
- [ ] Apply migration 012 only after reviewing the migration history and confirming it has not already been applied. — **Not yet applied/verified: Nov 16, 2026**
- [x] Confirm a moderator record exists in `community_moderators`. — **Verified: Nov 16, 2026** (one record found)
- [ ] Verify the assigned moderator is recognized in an authenticated app session; SQL Editor returned `auth.uid() = NULL` and `is_community_moderator() = false`, so this check is inconclusive. — **Open: Nov 16, 2026**
- [ ] Assign any additional trusted moderators through a secure admin process; never expose service-role credentials in the app.
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
- [ ] Test member blocking, reporting, moderator review, and content removal with separate test accounts. — **Open**
- [x] Confirm the Community Review Dashboard is visible in the live app. — **Owner-confirmed: Nov 16, 2026**
- [ ] Test confidential report visibility and moderator status updates in an authenticated moderator session. — **Open: Nov 16, 2026**
- [ ] Confirm the app clearly states that it is not an emergency service, therapy provider, or clinical diagnosis tool.

## Final launch checks

- [x] Reconcile `package-lock.json` with `package.json`; verified `@supabase/supabase-js` is present in the committed lockfile. — **Completed: Nov 5, 2026**
- [x] Add the combined `npm run check` script (lint + production build) to `package.json`.
- [x] Run `npm run check` in GitHub Actions; lint and production build passed. — **Completed: Nov 5, 2026**
- [x] Create the GitHub Actions quality-check workflow for automated checks. — **Created: Nov 5, 2026**
- [x] Confirm the quality-check workflow succeeds and the lockfile synchronization workflow completes successfully. — **Completed: Nov 5, 2026**
- [ ] Inspect/download the generated lockfile artifact if one is produced; artifact listing returned no downloadable artifact.
- [ ] Test the app on Android mobile and desktop.
- [ ] Review accessibility, navigation, empty states, and error messages.
- [ ] Publish terms of use, privacy policy, community guidelines, and support/contact information.
- [ ] Complete a final security and launch-readiness review before inviting the public.

## Current status

**Build verification (Nov 5, 2026):** The latest quality-check workflow passed, including dependency installation, lint, and production build. The committed `package-lock.json` now contains `@supabase/supabase-js`. GitHub Pages deployment attempt 2 also completed successfully. Android and desktop user-journey testing remain open.

**Supabase and secure AI backend (Nov 5, 2026):** The owner reports that the Supabase account and Integrity Rising project have been created, and migrations 001, 002, and 003 ran successfully on Nov 5, 2026. The project is not yet connected to the app, RLS has not been tested with separate accounts, and no AI function/provider is deployed. Do not connect member data or enable community posting until access policies are tested with separate member accounts and a moderator account.


## Daily progress tracker

### Thursday, November 5, 2026 — App reliability and database foundation

**Completed today**
- [x] Inspected the existing app configuration, package manifest, lockfile, Vite configuration, and launch checklist. — **Completed: Nov 5, 2026**
- [x] Confirmed that `package.json` declares `@supabase/supabase-js`, but `package-lock.json` does not contain it. — **Completed: Nov 5, 2026**
- [x] Added the `npm run check` script to run linting and the production build together. — **Completed: Nov 5, 2026**
- [x] Updated this launch checklist to track completed work and remaining launch blockers. — **Completed: Nov 5, 2026**
- [x] Investigated the GitHub Actions folder conflict and removed the empty `.github/workflows` path placeholder so workflow creation can be retried. — **Completed: Nov 5, 2026**

**Also completed today — Supabase foundation (owner-confirmed)**
- [x] Create the Supabase account and Integrity Rising project. — **Completed: Nov 5, 2026**
- [x] Run migrations 001, 002, and 003 successfully. — **Completed: Nov 5, 2026**

**Still in progress / next**
- [x] Generate and verify a correct `package-lock.json` using npm in CI; do not hand-write dependency integrity data. — **Completed: Nov 5, 2026**
- [x] Create `.github/workflows/quality-checks.yml` to regenerate the lockfile in CI, install from it, run lint/build, and save the generated lockfile as an artifact. — **Created: Nov 5, 2026**
- [x] Confirm the workflow run succeeds; artifact listing returned no downloadable artifact. — **Completed: Nov 5, 2026**
- [x] Run lint and production build; record actual results. — **Passed: Nov 5, 2026**
- [x] Verify the GitHub Pages deployment. — **Passed: Nov 5, 2026**
- [ ] Test core app navigation and behavior on Android and desktop.

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

<text>**Progress: 7 of 8 steps complete — 88%**</text>

`[███████░] 88%`

- [x] Inspect app configuration and project files — completed Nov 5, 2026.
- [x] Identify the package manifest / lockfile mismatch — completed Nov 5, 2026.
- [x] Add the combined lint-and-build command — completed Nov 5, 2026.
- [x] Clear the empty GitHub workflow-folder obstruction — completed Nov 5, 2026.
- [x] Regenerate and verify the dependency lockfile — completed Nov 5, 2026.
- [x] Add the automated GitHub Actions workflow — completed Nov 5, 2026.
- [x] Run lint and production build; fix any failures — passed Nov 5, 2026.
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
- [x] Create the Supabase project — completed Nov 5, 2026 (owner-confirmed).
- [x] Apply migrations 001, 002, and 003 in order. — **Completed: Nov 5, 2026 (owner-confirmed)**
- [ ] Connect app environment variables after database policies are fully applied and tested.
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


### Thursday, November 5, 2026 — Priority 1 reliability verified; database migrations owner-confirmed

**Completed today**
- [x] Confirmed the latest quality-check run passed, including npm install, lint, and production build. — **Completed: Nov 5, 2026**
- [x] Confirmed the lockfile synchronization workflow completed successfully. — **Completed: Nov 5, 2026**
- [x] Verified the committed package lockfile contains `@supabase/supabase-js`. — **Completed: Nov 5, 2026**
- [x] Confirmed GitHub Pages deployment attempt 2 completed successfully. — **Completed: Nov 5, 2026**
- [x] Reviewed migrations 001–003, Supabase client configuration, AI privacy notice, and secure AI backend setup notes. — **Reviewed: Nov 5, 2026**

**Priority 2 — still open**
- [x] Create the Supabase account and project. — **Completed: Nov 5, 2026 (owner-confirmed)**
- [x] Apply migrations 001, 002, and 003 successfully. — **Completed: Nov 5, 2026 (owner-confirmed)**
- [ ] Verify row-level security with separate member accounts, including owner-only wellness records and moderator-only report access.
- [ ] Confirm no service-role key or AI provider secret is exposed in frontend code, Git history, or public configuration.
- [ ] Keep community posting disabled until RLS and moderator workflows are tested.
- [ ] Complete privacy policy, consent, retention, and deletion review before collecting sensitive member data or enabling live AI.

**Important security finding**
- Migration 001 creates owner-only policies for mood, journal, and women's wellness records. Migration 002 changes new community posts and comments to pending moderator review and adds a moderator role table with no client-facing assignment policy. Migration 003 adds block-aware read policies.
- The owner reports that all three migrations ran successfully. This is not the same as verifying row-level security: separate member and moderator accounts must still be used to test access boundaries.

**Daily record:** Priority 1 CI/build/deployment verification is complete. Priority 2 is active; the Supabase project and migrations are owner-confirmed, but app connection, RLS tests, and live AI service remain unconfigured.


### Thursday, November 5, 2026 — Goal Center refinement

**Completed today**
- [x] Reconciled the launch checklist: all three Supabase migrations are recorded as owner-confirmed successful; RLS testing remains open. — **Completed: Nov 5, 2026**
- [x] Removed an unused React hook import from Goal Center to keep the component lint-clean. — **Completed: Nov 5, 2026**

**Next build steps**
- [ ] Verify the latest GitHub Actions quality-check run after this change.
- [ ] Improve dashboard usability and mobile navigation.


## Authentication user-journey checks — November 10, 2026

- [x] Add an explicit Supabase password-recovery redirect to the GitHub Pages app base path. — **Completed: Nov 10, 2026**
- [x] Handle Supabase's `PASSWORD_RECOVERY` auth event and show a form for setting a new password. — **Completed: Nov 10, 2026**
- [ ] In Supabase Authentication → URL Configuration, set the Site URL to `https://integrityrising101.github.io/Integrity-Rising-wellness-growth-app/` and add that exact URL to the Redirect URLs allowlist.
- [ ] Verify the GitHub repository Actions secrets `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present; never reveal or commit their values.
- [ ] Test the full journey with a test account: create account and confirm email, sign in, sign out, sign in again, request a password reset, open the email link, set a new password, and sign in with the new password.
- [ ] Test invalid credentials, expired/used reset links, missing email, and mobile/desktop layouts; confirm messages are clear and do not expose whether an email address has an account.
- [ ] Confirm the production GitHub Pages build succeeds after the authentication changes.

**Verification note:** The source code now includes the password-recovery form and callback handling. This is a code-level correction, not proof that Supabase email delivery, redirect allowlisting, or live account flows have been tested. Complete the dashboard configuration and real test-account checks before calling authentication production-ready.


### Monday, November 16, 2026 — Development and launch plan consolidated

**Completed**
- [x] Reviewed the repository README, main app shell, Supabase client, AI Edge Function scaffold, GitHub Pages workflow, existing launch checklist, secure AI notes, and community chat release checklist. — **Completed: Nov 16, 2026**
- [x] Created the master [Integrity Rising App Development and Launch Plan](INTEGRITY_RISING_APP_DEVELOPMENT_AND_LAUNCH_PLAN/README.md), including the founder message, product scope, architecture map, status, priority work, launch gates, test matrix, and roadmap. — **Completed: Nov 16, 2026**
- [x] Updated the repository README to introduce the founder mission and link the master plan. — **Completed: Nov 16, 2026**
- [x] Re-opened the committed README and master plan through GitHub to verify both files were saved. — **Completed: Nov 16, 2026**

**Still open**
- [ ] Inspect the latest GitHub Actions run and perform a fresh live-app smoke test.
- [ ] Continue Priority 1 work in the master plan: Supabase migration audit, RLS tests, authentication, and community permission verification.
- [ ] Complete safety-resource, privacy, AI, accessibility, mobile, and controlled-pilot launch gates.

**Daily record:** Documentation has been consolidated and linked in GitHub. This is a project-organization milestone, not a declaration that the app is fully tested or ready for public launch.

### Monday, November 16, 2026 — Community chat consistency improvements

**Completed in GitHub**
- [x] Added the missing Purpose & Legacy room to the client fallback room list. — **Committed: Nov 16, 2026**
- [x] Added migration 012 to seed Purpose & Legacy and allow members to delete only their own chat messages under RLS. — **Committed: Nov 16, 2026**
- [x] Updated the chat-room release checklist to cover seven rooms, migration order, own-message deletion, and no-edit permissions. — **Committed: Nov 16, 2026**

**Still required before this feature is launch-ready**
- [ ] Review the Supabase migration history; apply migration 012 only if it has not already been applied.
- [ ] Confirm all seven rooms load for a signed-in test member.
- [ ] Test realtime delivery with two separate member accounts.
- [ ] Test own-message deletion and confirm another member cannot delete it.
- [ ] Connect chat reports to the moderator-only review queue and test moderator permissions.
- [ ] Run the GitHub Actions quality check and verify the deployed app.

**Daily record:** These are repository code and documentation changes only. The Supabase migration has not been run, and live chat permissions, realtime behavior, and deployment have not yet been verified.


### Monday, November 16, 2026 — Supabase community setup and policy checks

- [x] Applied and verified migration 007 `member_connections` in Supabase: table exists, RLS enabled, four policies installed, and update trigger present. — **Verified: Nov 16, 2026**

**Completed and verified in Supabase**
- [x] Confirmed the four community tables exist: `community_rooms`, `community_room_messages`, `community_room_reports`, and `community_moderators`. — **Verified: Nov 16, 2026**
- [x] Checked the `community_rooms` schema and confirmed the expected columns: `id`, `name`, `description`, `guidelines`, `sort_order`, `is_active`, and `created_at`. — **Verified: Nov 16, 2026**
- [x] Added `accountability-leadership` / **Accountability & Leadership** as room 7 using an upsert. — **Success: Nov 16, 2026**
- [x] Queried the room list and verified all seven rooms are present and active, ordered 1–7. — **Verified: Nov 16, 2026**
- [x] Inspected chat-message RLS policies: authenticated INSERT, SELECT, and DELETE policies are present; no UPDATE policy is listed. — **Verified: Nov 16, 2026**
- [x] Inspected chat-report RLS policies: authenticated INSERT, UPDATE, and SELECT policies are present. — **Verified: Nov 16, 2026**
- [x] Confirmed one moderator record exists in `community_moderators`. — **Verified: Nov 16, 2026**
- [x] Owner confirmed the Community Review Dashboard is visible in the live app. — **Nov 16, 2026**

- [x] Tested member connection request flow with two member accounts: sender saw **Request sent**, and recipient-side request controls appeared. — **Owner-confirmed: Nov 16, 2026**
- [ ] Complete the recipient response test by accepting or declining a request and verifying the resulting status on both accounts.

**Still open / not yet proven**
- [ ] Test the report policies' actual row-level restrictions using separate reporter and moderator accounts; policy names and commands alone do not prove the expressions are correct.
- [ ] Verify moderator recognition from a real authenticated app session. The SQL Editor returned `auth.uid() = NULL` and `is_community_moderator() = false`; this is inconclusive because the SQL Editor query did not run as the app user.
- [ ] Open Confidential Safety Reports in the dashboard and test report visibility and status changes without exposing reports to unauthorized members.
- [ ] Test sending, realtime delivery, and own-message deletion with separate member accounts.
- [ ] Confirm migration history before applying migration 012; do not rerun SQL or migrations blindly.
- [ ] Run GitHub Actions quality checks and confirm the current live deployment after the repository changes.

**Daily record:** Seven community rooms and the listed RLS policy commands were verified in Supabase. The dashboard is visible. Authenticated moderator behavior, report confidentiality, cross-account chat permissions, migration history, and deployment checks remain open. No claim is made that the complete community security workflow has passed end-to-end testing.
