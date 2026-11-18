# Integrity Rising — Project Documentation

**Project:** Integrity Rising — The Wellness & Growth App  
**Community:** The Integrity Movement  
**Motto:** United by Truth, Driven by Purpose  
**Academy tagline:** Learn • Grow • Heal • Rise

This folder contains the project's planning, operating, technical, testing, and release documentation. Keep project records here rather than scattering new planning files through the application source folders.

## Start here

| Document | Use it for |
|---|---|
| [Master Development and Launch Plan](INTEGRITY_RISING_APP_DEVELOPMENT_AND_LAUNCH_PLAN/README.md) | Product vision, feature map, current status, priorities, launch gates, and testing plan |
| [Detailed App To-Do List](INTEGRITY_RISING_APP_TODO.md) | Actionable tasks and dated development history |
| [Secure AI Backend Guide](SECURE_AI_BACKEND.md) | AI Edge Function setup, secrets, privacy, and security requirements |
| [Community Chat Rooms Release Checklist](CHAT_ROOMS_RELEASE_CHECKLIST.md) | Community chat readiness and release checks |

## Repository map

| Location | Purpose |
|---|---|
| `src/App.jsx` | Main React application shell and navigation |
| `src/components/` | Reusable app features and their component styles |
| `src/pages/` | Page-level UI modules, where used |
| `src/lib/` | Shared integrations and client configuration, including Supabase |
| `src/utils/` | Shared helper functions |
| `src/assets/` | App assets |
| `public/` | Static files served by Vite |
| `supabase/migrations/` | Ordered database schema and policy changes |
| `supabase/functions/` | Supabase Edge Functions |
| `.github/workflows/` | Automated quality checks and GitHub Pages deployment |
| `.github/ISSUE_TEMPLATE/` | Templates for consistent work requests |
| `docs/` | Project plans, checklists, technical guidance, and progress records |

## Where new information belongs

- Product direction, feature scope, roadmap, and launch decisions → Master Development and Launch Plan.
- Tasks, verification status, and dated work completed → Detailed App To-Do List.
- Database changes → a new, reviewed SQL migration in `supabase/migrations/`.
- AI security and deployment instructions → Secure AI Backend Guide.
- Community moderation and chat release testing → Community Chat Rooms Release Checklist.
- Bugs and actionable improvements → GitHub Issues.
- General questions and development conversations → GitHub Discussions.

## GitHub work-tracking conventions

Use Issues for work that needs an owner, a decision, implementation, or verification. Use Discussions for questions, ideas, and updates. Apply labels consistently by priority, status, project area, and task type.

Do not mark a task complete just because code or a checklist item exists. Record the test performed and the result. Keep security, privacy, and launch-blocking work visible.

## Database migration safety note

The current repository contains two migration files beginning with `005_`:

- `005_auto_create_member_profiles.sql`
- `005_topic_based_member_chat_rooms.sql`

This is a migration naming collision. Do not rename, delete, or reorder migrations casually: a filename may already be recorded in a Supabase project's migration history. Before adding or applying another migration, compare the repository files with the target project's migration history and resolve the numbering strategy deliberately.

## Safe contribution workflow

1. Identify the exact app area or document being changed.
2. Read the existing implementation and related documentation first.
3. Make the smallest focused change possible.
4. Run `npm run check` and review the GitHub Actions result.
5. Test the affected user journey in the deployed app when relevant.
6. Update the appropriate task record with the actual result.
7. Never commit secrets, service-role keys, private member data, or confidential reports.

---

**Founder:** Christina Engel  
**Integrity Rising — United by Truth, Driven by Purpose.**
