# Integrity Rising — Community Chat Rooms Release Checklist

## Current implementation

The app contains six topic-based member chat rooms:

1. Trauma & Healing
2. Addiction Recovery
3. Toxic Relationships
4. Mental Wellness
5. Personal Growth
6. Accountability & Leadership

The chat component supports signed-in members, room selection, message history, realtime message updates, and private message reports with a reason and optional details.

## Required database setup

Apply `supabase/migrations/008_community_chat_rooms.sql` to the correct Integrity Rising Supabase project. This migration uses the existing moderator authorization function established in `002_community_moderation_hardening.sql`.

1. Sign in to the Supabase dashboard and open the Integrity Rising project.
2. Open **SQL Editor** and create a new query.
3. Open `supabase/migrations/008_community_chat_rooms.sql` in this repository and copy its complete contents.
4. Paste the SQL into the editor and run it once.
5. Confirm the query completes without errors. If it fails, capture the exact error and inspect which statements succeeded before retrying.

## Post-migration verification

- Confirm the `community_rooms`, `community_room_messages`, and `community_room_reports` tables exist.
- Confirm the six room names above appear in `community_rooms`.
- Confirm row-level security is enabled on all three tables.
- Confirm `community_room_messages` is included in the `supabase_realtime` publication.
- Sign in with a test member account and confirm the six rooms load.
- Send a harmless test message and confirm it appears after refresh and in a second signed-in browser session.
- Submit a test report and confirm a row is stored in `community_room_reports`.
- Sign out and confirm the chat composer is not available.
- Test that one member cannot read another member's private report unless they are an authorized moderator.

## Moderation and launch blockers

**Do not announce the chat rooms as fully launched until these items are completed:**

- The current Community Review Dashboard has not yet been connected to `community_room_reports`.
- Implement a moderator-only chat-report review queue using the established `public.is_community_moderator()` authorization function. Never grant all authenticated members access to every report.
- Establish a documented response process and staffed coverage expectations. The app must not imply that reports are monitored 24/7.
- Test reporting, duplicate reports, unauthorized access, and mobile layouts with separate member accounts.

## Member safety language

Chat is peer conversation, not therapy, emergency response, or crisis care. Members should avoid posting addresses, phone numbers, passwords, identifying details, or graphic descriptions. For immediate danger, call 911. For emotional crisis support in the United States, call or text 988.

## Deployment

The GitHub Pages workflow builds the app on pushes to `main`. After code changes, verify the latest workflow run is green and then test the deployed app. A successful code commit alone does not prove that the site deployed or that the Supabase migration was applied.
