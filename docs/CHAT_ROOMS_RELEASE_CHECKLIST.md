# Integrity Rising — Community Chat Rooms Release Checklist

## Current implementation

The app contains seven topic-based member chat rooms:

1. Trauma & Healing
2. Addiction Recovery
3. Toxic Relationships
4. Mental Wellness
5. Personal Growth
6. Purpose & Legacy
7. Accountability & Leadership

The chat component supports signed-in members, room selection, message history, realtime message updates, and private message reports with a reason and optional details.

## Required database setup

Apply migrations `008_community_chat_rooms.sql` and `012_chat_room_consistency.sql` to the correct Integrity Rising Supabase project, after checking the database migration history. Migration 012 adds the Purpose & Legacy room and a row-level-security policy allowing members to delete only their own messages. It does not allow message editing.

1. Sign in to the Supabase dashboard and open the Integrity Rising project.
2. Open **SQL Editor** and create a new query.
3. Check whether migrations 008 and 012 have already been applied; do not rerun blindly.
4. If not applied, run migration 008 first, then migration 012, using the complete contents of each file.
5. Confirm each query completes without errors. If one fails, capture the exact error and inspect which statements succeeded before retrying.

## Post-migration verification

- Confirm the `community_rooms`, `community_room_messages`, and `community_room_reports` tables exist.
- Confirm all seven room names above appear in `community_rooms`.
- Confirm row-level security is enabled on all three tables.
- Confirm `community_room_messages` is included in the `supabase_realtime` publication.
- Sign in with a test member account and confirm all seven rooms load.
- Send a harmless test message and confirm it appears after refresh and in a second signed-in browser session.
- Submit a test report and confirm a row is stored in `community_room_reports`.
- Sign out and confirm the chat composer is not available.
- Test that one member cannot read another member's private report unless they are an authorized moderator.
- Test that a member can delete their own message and cannot delete another member's message.
- Confirm members cannot edit published messages.

## Moderation and launch blockers

**Do not announce the chat rooms as fully launched until these items are completed:**

- The `ModerationDashboard` component already queries `community_room_reports` and provides moderator status actions in the repository. This is code-level integration, not proof of live permissions.
- Verify the moderator-only queue using a trusted moderator account and a regular member account; confirm regular members cannot read or update reports.
- Establish a documented response process and staffed coverage expectations. The app must not imply that reports are monitored 24/7.
- Test reporting, duplicate reports, unauthorized access, and mobile layouts with separate member accounts.

## Member safety language

Chat is peer conversation, not therapy, emergency response, or crisis care. Members should avoid posting addresses, phone numbers, passwords, identifying details, or graphic descriptions. For immediate danger, call 911. For emotional crisis support in the United States, call or text 988.

## Deployment

The GitHub Pages workflow builds the app on pushes to `main`. After code changes, verify the latest workflow run is green and then test the deployed app. A successful code commit alone does not prove that the site deployed or that the Supabase migration was applied.
