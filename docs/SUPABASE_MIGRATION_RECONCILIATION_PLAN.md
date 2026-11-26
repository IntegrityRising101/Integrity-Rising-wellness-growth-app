# Supabase Migration Reconciliation Plan

**Project:** Integrity Rising — The Wellness & Growth App  
**Supabase project ref:** `racbeizgytecxrnsewpn`  
**Status:** Planning and review only — no database changes authorized  
**Audit date:** 2026-11-26

## Purpose

Safely reconcile the repository's migration files with the live Supabase database before any migration is applied. This plan is not an instruction to run `supabase db push` or paste migration SQL into the SQL Editor.

## Non-negotiable safeguards

- Do not run `supabase db push`, `supabase migration repair`, or manually apply migration SQL until the migration history and every migration's effects are verified.
- Do not rename or renumber migration files based on assumptions.
- Back up/export the database schema and confirm a recovery path before approved changes.
- Review each proposed SQL change and its rollback implications with the owner.
- Test changes in a separate staging project first whenever possible.
- Keep private member data private by database policy, not merely by hiding UI elements.
- Obtain explicit owner approval before any schema, data, RLS, permission, or deployment change.

## Repository findings

The migration directory contains duplicate prefixes:

- Two `005` files: automatic member profiles and topic-based chat rooms.
- Two `008` files: community chat rooms and security hardening.

Files also include migrations 001–004 and 006–012. The duplicate prefixes make a blind CLI push unsafe until the actual CLI migration ledger is inspected and reconciled.

## Live database findings from read-only inspection

- RLS is enabled on all 21 public tables included in the audit inventory.
- The live database contains the core profile, wellness, community, blocking, chat, progress, private-vault, and connection tables.
- The live database contains moderator structures and moderator helper functions.
- The live database's profile SELECT policy permits signed-in members to read profile rows. Since `profiles.member_goals` is a column on that table, it is exposed under that row policy. The owner's requirement is that member goals remain private unless a member explicitly chooses to share them.
- Active community rooms and their messages are currently readable by signed-in members. There is no approved-member private-room authorization model yet.
- The seven existing rooms are intended to remain public in the first mixed-room release.
- The `member_milestones` table was not present in the earlier live table inventory; confirm whether it is needed by the current app before deciding whether to add it.
- Migration history could not be read from the SQL Editor using the attempted `supabase_migrations.schema_migrations` query. The absence of that relation in the SQL Editor is not proof that the CLI migration ledger is empty or absent.

## Migration-by-migration review

| File(s) | Review finding | Required action before deployment |
|---|---|---|
| 001 | Core tables, triggers, RLS, and policies; overlaps live objects. Its broad profile SELECT policy conflicts with the private-goals requirement. | Do not replay. Design profile privacy correction separately and verify existing triggers/policies. |
| 002 | Moderator structures and moderation policies substantially overlap live objects. | Compare exact definitions and grants; do not replay blindly. |
| 003 | Blocking table and policies substantially overlap live objects. | Compare exact policy expressions and test both directions of blocking. |
| 004 | Member progress/private-vault tables and owner policies are present. | Verify exact schema and ownership policies; do not replay blindly. |
| 005 automatic profiles | Duplicate prefix. Trigger inserts required profile fields; live `bio` is NOT NULL. | Test signup/trigger behavior against the actual live definition and a disposable account in staging. |
| 005 topic chat rooms | Duplicate prefix; room/chat tables and policies overlap live objects. | Reconcile ledger and verify seed data; preserve existing rooms. |
| 006 avatars | Private bucket; read policy appears to permit signed-in members to read avatars broadly. | Confirm intended avatar visibility and test storage object policies. |
| 007 connections | Connection table and requester/recipient policies exist. | Test whether recipient updates can change only the allowed status and cannot alter participant IDs or other protected fields. |
| 008 chat rooms | Duplicate prefix; broad active-room access. | Do not treat this as private-room support. Preserve the seven existing public rooms. |
| 008 security hardening | Some function/grant hardening appears already present. | Compare exact function definitions, owners, grants, and search paths. |
| 009 report moderation | Reworks report policies and adds report status. | Verify whether the status column/check/index exist. Review column-level update privileges; avoid granting broader row updates than moderators need. |
| 010 message deletion | Allows owners and moderators to delete messages. | Reconcile with 012 and test moderator/owner behavior. |
| 011 milestones | Table was absent from the earlier live table inventory. | Confirm app usage and whether table is needed; if needed, add only after migration history and schema are verified. |
| 012 room consistency | Adds Purpose & Legacy, adjusts ordering, and replaces a differently named delete policy. | Resolve policy overlap with 010; ensure no permissive moderator-delete policy remains unintentionally. |

## Priority remediation design

### 1. Private member goals

The current broad profile-row SELECT policy makes every column on a visible profile row readable to signed-in members. Row-level security is not column-level privacy.

Preferred design:
- Move private goals into a dedicated owner-protected table, or another carefully reviewed private data structure.
- Store explicitly shared goals separately or expose them through a narrowly controlled sharing mechanism.
- Do not expose private goals through a general profile query, public view, or client-side filtering.
- Test with two ordinary accounts and an account with moderator privileges.

### 2. Mixed public and private community rooms

Preserve the seven existing rooms as public. Introduce an explicit room visibility field and a room-membership/approval model only after the schema is reviewed.

Required authorization behavior:
- Public rooms: visible and usable by signed-in members.
- Private rooms: visible and usable only by approved members and authorized moderators.
- Pending, declined, or revoked members must not discover private rooms, read or post messages, or receive realtime messages.
- Membership rosters are not public by default.
- Moderator approval/revocation must be enforced in the database.
- Apply equivalent authorization to room rows, message rows, reports as appropriate, and realtime subscriptions.
- Test direct database/API access, not just the UI.

### 3. Report moderation and message deletion

- Confirm the report table's actual columns and constraints before altering it.
- Use least-privilege column grants or a narrowly scoped database function for moderator status changes, after careful security review.
- Consolidate message-delete policies into one intentional policy with clear owner and moderator behavior.
- Remember that permissive PostgreSQL RLS policies are OR-combined; leaving an older permissive policy can preserve access unintentionally.

### 4. Profile creation and avatar access

- Verify the signup trigger against all NOT NULL profile columns and defaults.
- Test a fresh signup in staging.
- Confirm whether avatars are intentionally visible to all signed-in members; align bucket and object policies with that decision.

## Required verification sequence

1. Capture a current schema-only backup and record the current deployed app commit.
2. Inspect the repository's `supabase/config.toml`, `.gitignore`, and local CLI migration ledger without exposing credentials or connection secrets.
3. Use the Supabase CLI's migration list/status workflow against the confirmed project to identify the actual remote migration versions. Do not push changes during this inspection.
4. Compare remote migration history with every repository file, especially duplicate 005 and 008 prefixes.
5. Inspect exact live table definitions, constraints, indexes, triggers, policies, function definitions, grants, storage policies, and realtime publication membership.
6. Prepare a corrected, uniquely ordered migration set only after the ledger is understood. Preserve an auditable mapping from old filenames to new migration versions; never rewrite history casually.
7. Test on staging with separate ordinary-member and moderator accounts, including pending/declined/revoked private-room access and realtime revocation.
8. Obtain owner approval of the final SQL and test results.
9. Apply only the approved migration sequence, verify the resulting schema and RLS behavior, and then deploy matching application code.

## Current decision

**No migrations are approved to run.** The immediate next task is read-only reconciliation of the actual Supabase CLI migration ledger and the live schema. The owner has not authorized database changes or deployment.
