# Supabase Migration Repair Plan

**Project:** Integrity Rising — The Wellness & Growth App  
**Supabase project ref confirmed by owner:** `racbeizgytecxrnsewpn`  
**Audit date:** 2026-11-26  
**Status:** Planning only — no migration files renamed, no SQL applied, and no live database changes made.

## 1. Findings confirmed

- The GitHub migration directory currently contains migrations numbered 001 through 012, with duplicate versions:
  - `005_auto_create_member_profiles.sql`
  - `005_topic_based_member_chat_rooms.sql`
  - `008_community_chat_rooms.sql`
  - `008_security_hardening.sql`
- `011_member_milestones.sql` exists.
- The two 005 files perform different work. One installs an Auth signup trigger that creates a profile; the other creates chat-room tables, policies, and six initial rooms.
- The two 008 files also perform different work. One defines chat-room tables/policies and six rooms; the other hardens function privileges and search paths.
- Migration 009 refers to migration 005 and the moderator helper from 002. Migration 012 says it follows 001–011.
- The SQL Editor could not find `supabase_migrations.schema_migrations`. A read-only inventory found only Supabase service tables in `auth`, `realtime`, and `storage`. This does **not** establish which app migrations have been applied.
- The live database audit found RLS enabled on all 21 listed public tables. This is not proof that every policy is correct or that cross-account isolation has passed.
- The live `profiles` table has a broad authenticated SELECT policy. The owner confirmed that member goals must remain private unless explicitly shared. A `member_goals` text column was observed on `profiles`; because row-level security does not hide individual columns, this field must not contain private goals while the broad profile-read policy remains.
- Current chat-room client code loads all active rooms for a signed-in member and subscribes to messages for the selected room. It has no private-room membership filtering. Existing room-message policies also authorize access based on an active room, not room membership.

## 2. Non-negotiable safety rules

1. Do not run `supabase db push`, apply SQL, rename migration files, or change migration history until the applied state is known.
2. Do not treat `auth.schema_migrations`, `realtime.schema_migrations`, or `storage.migrations` as the app's migration ledger.
3. Do not guess that a migration ran because its tables or policies exist; inspect the actual schema and compare each migration's effects.
4. Preserve existing member data and the seven current community rooms.
5. Keep all seven existing rooms public in the first mixed-visibility release.
6. Private rooms must be protected by database RLS on both room rows and messages; frontend hiding alone is insufficient.
7. Member goals stay private by default. Sharing must be an explicit, separate opt-in.
8. Owner review is required before any production SQL, migration-history repair, permissions change, or deployment.

## 3. Repair sequence

### Phase A — Establish the real applied state

- Confirm the target project ref (owner confirmed `racbeizgytecxrnsewpn`).
- Inspect repository workflow files and deployment history for any documented migration application process.
- Determine whether migrations were applied through Supabase CLI, SQL Editor, or another process.
- If no reliable migration ledger exists, build a verified state inventory from actual tables, columns, constraints, indexes, triggers, functions, grants, policies, and publication membership.
- Produce a per-file status: confirmed applied, confirmed not applied, partially applied, or unknown. Do not mark unknown files as applied.

### Phase B — Repair versioning without rewriting history

- Preserve the original migration files and their Git history.
- Prepare a corrected, unique sequence for future migrations only after Phase A.
- If the project has a valid remote migration ledger, reconcile the local files against it using the supported Supabase migration workflow; never change remote history merely to make numbering look tidy.
- If migrations were manually applied and no ledger exists, document that fact and create a deliberate baseline/reconciliation plan. Do not blindly mark all files as applied.
- Keep any compatibility or corrective SQL additive and idempotent where practical; inspect every dependency before proposing it.

### Phase C — Protect member goals

- Trace all frontend reads/writes of `profiles.member_goals` and identify whether the column contains member data.
- Stop exposing private goal text through the broadly readable profile row.
- Preferred design: store private goals in a dedicated owner-only table, with an explicit opt-in sharing mechanism kept separate from private records.
- Plan any data copy and removal only after confirming actual values, client dependencies, backups, and owner approval.
- Test with two ordinary accounts: neither can read or modify the other's private goals; sharing is off by default and only exposes the exact item the owner selected.

### Phase D — Implement mixed public/private rooms

- Add a room visibility attribute (`public` or `private`) while preserving the seven existing rooms as public.
- Add a room-membership relation with controlled states such as pending, approved, declined, and revoked.
- Use moderator-controlled approval; members cannot grant themselves access.
- Apply RLS to room discovery, message reads, message inserts, and realtime visibility. Private rooms are accessible only to approved members and authorized moderators.
- Do not expose private-room rosters by default.
- Update the chat component, queries, subscriptions, error states, and safety notice to match the database policy.
- Verify revocation immediately stops message reads, posting, discovery, and realtime delivery.

### Phase E — Verification and release

- Test with at least three separate accounts: member A, member B, and moderator C.
- Test public access, pending/declined/revoked private access, approval/revocation authority, direct API requests, message posting/deletion, reporting, and realtime events.
- Confirm existing seven rooms and their messages remain intact and public.
- Run Supabase Security Advisor and a cross-account isolation test matrix.
- Deploy only after owner approval and successful tests.

## 4. Current blockers

- The app migration ledger / applied versions are not yet established.
- Duplicate migration versions 005 and 008 make an unreviewed CLI push unsafe.
- Private-goal data flow needs a code search and dependency review.
- Mixed room visibility is not implemented in the current client or database policies.

## 5. Next concrete action

Continue the read-only repository review: inspect Supabase-related GitHub Actions/workflows and all code references to `member_goals`. Then prepare a per-migration reconciliation table. Do not ask the owner to repeat SQL queries already completed.

## 6. Owner decisions already confirmed

- `profiles.member_goals` must be private unless a member explicitly chooses to share.
- Community rooms should be a mixture of public and private.
- Existing seven rooms remain public.
- Private rooms are limited to approved members and authorized moderators.
- No production database changes without review and explicit approval.


## 7. Additional read-only repository findings (2026-11-26)

- The current GitHub Actions workflows include GitHub Pages build/deploy and quality checks. Neither workflow runs Supabase migrations or `supabase db push`. Therefore GitHub Actions history does not establish which database migrations were applied.
- `src/components/GoalCenter.jsx` reads and writes goals through the dedicated `public.member_goals` table and `public.goal_tasks`, not through `profiles.member_goals`.
- A repository code search for `member_goals` returned the Goal Center and migration 004 references; no app usage of `profiles.member_goals` was found in that search. Treat this as a strong indication the profile column is unnecessary, but confirm with a full repository search before dropping it.
- Migration 004 creates `member_goals` with owner-only RLS and creates `goal_tasks` with an owner check plus a parent-goal ownership check. This is the intended private-goal storage path.
- Because the separate `member_goals` table already exists in the live database and has owner-only RLS according to the audit, the repair should prioritize safely removing any private content from the broadly readable profile column, not rebuilding the Goal Center's data model.

### Updated next action

Perform a full repository search for any references to `profiles.member_goals` or profile goal serialization, then inspect the actual profile column's values/counts using a carefully scoped, read-only query before proposing its removal. Do not select or print private goal text into chat. In parallel, prepare a verified schema-vs-migration reconciliation table for migrations 001–012.
