# Integrity Rising — Community Chat Rooms Release Checklist

## Current implementation

The app contains six topic-based member chat rooms:

1. Trauma & Healing
2. Addiction Recovery
3. Mental Wellness
4. Toxic Relationships
5. Personal Growth
6. Purpose & Legacy

The chat component supports signed-in members, room selection, message history, realtime message updates, and private message reports with a reason and optional details.

## Required database setup

The chat feature depends on the Supabase migration:

`supabase/migrations/005_topic_based_member_chat_rooms.sql`

Apply it to the correct Integrity Rising Supabase project before testing chat:

1. Sign in to the Supabase dashboard and open the Integrity Rising project.
2. Open **SQL Editor** and create a new query.
3. Open the migration file in this repository and copy its complete contents.
4. Paste the SQL into the editor and run it once.
5. Confirm the query completes without errors.

If SQL reports an error, stop and capture the exact error text. Do not repeatedly rerun a partially applied migration without checking which statements succeeded.

## Post-migration verification

- Confirm the `community_rooms`, `community_room_messages`, and `community_room_reports` tables exist.
- Confirm the six seeded rooms appear in `community_rooms`.
- Confirm row-level security is enabled on all three tables.
- Confirm `community_room_messages` is included in the `supabase_realtime` publication.
- Sign in with a test member account and confirm the six rooms load.
- Send a harmless test message and confirm it appears after refresh and in a second signed-in browser session.
- Submit a test report and confirm a row is stored in `community_room_reports`.
- Sign out and confirm the chat composer is not available.

## Moderation and launch blockers

**Do not announce the chat rooms as fully launched until these items are completed:**

- The current Community Review Dashboard handles the existing post/reply/report workflow. It has not yet been connected to `community_room_reports`.
- A secure moderator-only read/update policy and a chat-report review queue must be implemented using the repository's established moderator authorization mechanism. Never grant all authenticated members access to every report.
- A documented response process and staffed coverage expectations must be established. The app must not imply that reports are monitored 24/7.
- Test reporting, duplicate reports, unauthorized access, and mobile layouts with separate member accounts.

## Member safety language

Chat is peer conversation, not therapy, emergency response, or crisis care. Members should avoid posting addresses, phone numbers, passwords, identifying details, or graphic descriptions. For immediate danger, call 911. For emotional crisis support in the United States, call or text 988.

## Deployment

The GitHub Pages workflow builds the app on pushes to `main`. After code changes, verify the latest workflow run is green and then test the deployed app. A successful code commit alone does not prove that the site deployed or that the Supabase migration was applied.
