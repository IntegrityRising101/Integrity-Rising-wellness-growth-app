# Integrity Rising App Development and Launch Plan

**Project:** Integrity Rising — The Wellness & Growth App  
**Community:** The Integrity Movement  
**Founder:** Christina Engel  
**Tagline:** Learn • Grow • Heal • Rise  
**Slogan:** United by Truth, Driven by Purpose  
**Plan owner:** Christina Engel  
**Last consolidated:** November 16, 2026  
**Repository:** [Integrity-Rising-wellness-growth-app](https://github.com/IntegrityRising101/Integrity-Rising-wellness-growth-app)  
**Live app:** [GitHub Pages app](https://integrityrising101.github.io/Integrity-Rising-wellness-growth-app/)

> This is the master project record. It gathers the product vision, current implementation map, development priorities, launch gates, testing plan, and links to the detailed technical records. A feature is not considered launch-ready merely because a component exists in the code.

---

## 1. Why this app exists

Integrity Rising was created to make practical wellness education, personal growth, supportive community, and pathways to help easier to access in one welcoming place.

People may arrive while rebuilding after difficult relationships, addiction, trauma, loss, stress, or major life changes. The app should meet people with dignity and encouragement—not judgment—and help them find useful next steps at their own pace.

The app is part of a larger movement. Its purpose is to support learning, healing, accountability, leadership, and a stronger future. It is not a substitute for professional care, emergency services, or individualized safety planning.

### Founder message

I created Integrity Rising because I believe everyone deserves an opportunity to change their life, regardless of where they've been or what they've experienced.

Life isn't always easy. People face addiction, trauma, unhealthy relationships, mental health challenges, financial struggles, loss, and moments when they feel alone or uncertain about their future.

I wanted to build something meaningful—something that could reach people beyond traditional conversations and provide practical resources, encouragement, education, and opportunities for personal development.

I believe our past does not have to determine our future. We do not have to be perfect to make a difference. We can still be learning, healing, and rebuilding while helping others find hope.

Integrity Rising is my commitment to creating something bigger than myself: a movement that encourages people to take responsibility for their growth, recognize their worth, and discover what is possible when they refuse to give up.

**This isn't just an app. It's a movement built around the belief that people can grow, heal, change, and rise.**

---

## 2. Product mission, vision, and values

### Mission
Empower individuals through accessible wellness resources, personal development, education, supportive community connections, and opportunities for positive change.

### Vision
Build a worldwide community where people feel supported, respected, encouraged, and empowered to create healthier lives and stronger futures.

### Core values
- **Integrity:** honesty with ourselves and others.
- **Accountability:** responsibility for our choices and actions.
- **Compassion:** dignity and understanding without judgment.
- **Growth:** remaining open to learning and improvement.
- **Purpose:** creating meaningful, lasting change.
- **Community:** encouraging one another while respecting boundaries.

### Product principles
1. Make the next helpful action easy to find.
2. Design mobile-first, accessible, and understandable screens.
3. Keep personal wellness information private by default.
4. Be transparent about what is live, in development, or only a prototype.
5. Never imply that the app is monitored around the clock.
6. Never promise emergency response, therapy, diagnosis, or guaranteed outcomes.
7. Record real completion dates; do not mark work complete based only on plans.

---

## 3. App scope and feature map

The current app shell in `src/App.jsx` organizes the product into these areas. The listed components are present in the app shell; each feature still needs the relevant user-journey and backend checks below.

| App area | Current scope | Launch verification |
|---|---|---|
| Dashboard | Personal home, shortcuts, weekly encouragement | Check links, empty states, responsive layout |
| Community | Topic rooms, discussions, member directory, resource library, moderation dashboard | Verify sign-in, posting, reports, moderator-only access, blocking, and removal |
| Wellness Center | Personal wellness dashboard, guided practices, stress relief, self-reflection, women's wellness, AI tools and privacy notice | Verify persistence/privacy; clearly label prototypes; test crisis language |
| Academy | Learning and personal development content | Check every course/resource link and mobile reading experience |
| Safety & Support | Mental health services, state resource directory, local support finder, safety plan, incident tools, Quick Exit | Verify contacts and links; test privacy and device-safety warnings |
| My Growth | Goals, gratitude journal, achievements, 30-day challenge | Test save/load, dates, account separation, and browser fallback |
| My Account | Member account, profile directory, personalization | Test authentication, profile privacy, update, and sign-out |

### Existing implementation notes
- The React/Vite app shell imports the feature components from `src/components`.
- The main navigation currently includes Home, Community, Wellness, Academy, Safety, My Growth, and Account.
- Quick Exit is mounted within the Safety & Support section in the current `src/App.jsx`.
- The Supabase browser client is in `src/lib/supabase.js` and reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- The authenticated `ai-assistant` Supabase Edge Function has a source scaffold in `supabase/functions/ai-assistant/index.ts`; source code alone does not mean the function is deployed or connected to a provider.
- GitHub Pages deployment is configured in `.github/workflows/deploy-pages.yml`.

---

## 4. Technology and repository map

### Technology
- React
- Vite
- JavaScript and CSS
- Supabase Auth, Postgres, Row Level Security, and Edge Functions (where configured)
- GitHub for source control and project history
- GitHub Actions and GitHub Pages for automated build/deployment

### Important repository locations
| Location | Purpose |
|---|---|
| `src/App.jsx` | Main app shell, navigation, and feature composition |
| `src/components/` | Individual app features |
| `src/lib/supabase.js` | Supabase browser client configuration |
| `src/App.css`, `src/index.css` | App and global styling |
| `supabase/migrations/` | Database schema and security changes |
| `supabase/functions/ai-assistant/` | Authenticated AI function scaffold |
| `.github/workflows/deploy-pages.yml` | GitHub Pages build and deployment |
| `docs/INTEGRITY_RISING_APP_TODO.md` | Detailed task checklist and dated work history |
| `docs/SECURE_AI_BACKEND.md` | AI backend setup and security requirements |
| `docs/CHAT_ROOMS_RELEASE_CHECKLIST.md` | Community chat database and release checks |

---

## 5. Current project status — November 16, 2026

This status distinguishes repository evidence, owner-reported actions, and work that still needs verification.

### Confirmed in the repository
- [x] Main React app shell and seven primary navigation areas are present.
- [x] Wellness, community, academy, safety, account, and growth components are composed in the app.
- [x] Supabase client reads the two public Vite environment variables.
- [x] GitHub Pages deployment workflow exists and uses Node.js 22.
- [x] The deployment workflow uses `actions/deploy-pages@v5.0.1`.
- [x] An authenticated AI Edge Function scaffold exists.
- [x] Existing detailed launch, AI security, and chat-room release documents exist.

### Previously recorded as completed (historical; recheck before public launch)
- [x] Owner reported creating the Supabase project and successfully applying migrations 001–003 on November 5, 2026.
- [x] The November 5 project log records successful lint, production build, and GitHub Pages deployment.
- [x] The November 10 project log records password-recovery redirect and password-reset handling work.
- [x] The owner reported community moderation/dashboard work and successful publishing steps during November 15.

### Not yet verified as production-ready
- [ ] Current deployed site passes a fresh end-to-end smoke test.
- [ ] Latest GitHub Actions run is green after the most recent code changes.
- [ ] All migrations required by the current components have been applied to the intended Supabase project, in order.
- [ ] RLS is tested using separate member, second-member, and moderator accounts.
- [ ] App secrets and environment variables are configured correctly in GitHub/Supabase.
- [ ] Member authentication, password reset, profile updates, and sign-out work end to end.
- [ ] Community posting, chat, reports, moderation, blocking, and deletion have verified permissions.
- [ ] Privacy policy, terms, community guidelines, consent, retention, and deletion process are published.
- [ ] Safety contacts and resource links are verified.
- [ ] AI provider is configured, deployed, cost-limited, privacy-reviewed, and tested—or the feature remains clearly labelled unavailable/prototype.
- [ ] Android and desktop testing is complete.

**Launch status: IN DEVELOPMENT — NOT CLEARED FOR PUBLIC LAUNCH.**  
The project has substantial implemented work, but security, backend, resource verification, and real-user testing gates remain.

---

## 6. Priority 1 — finish the safe core

Work through these in order. Do not skip a security gate just to make the launch date sooner.

### A. Fresh build and deployment check
- [ ] Open GitHub Actions and inspect the latest run for the `main` branch.
- [ ] Confirm dependency installation, lint, production build, artifact upload, and Pages deployment succeed.
- [ ] Open the deployed app in a private/incognito browser window.
- [ ] Test top navigation and every major section.
- [ ] Check Android-sized and desktop-sized layouts.
- [ ] Record the run date, result, and any error in the daily progress log.

**Acceptance:** latest workflow is green and the deployed app loads and navigates without a blocking error.

### B. Supabase configuration and database audit
- [ ] Confirm the correct Integrity Rising Supabase project is selected.
- [ ] Inventory every SQL migration in `supabase/migrations/`; compare it with the database migration history before running anything.
- [ ] Do not rerun migrations blindly. Review existing tables, policies, triggers, and functions first.
- [ ] Confirm the current app-required tables exist.
- [ ] Confirm Row Level Security is enabled on all member/private tables.
- [ ] Test a member can read/update only their own private records.
- [ ] Test a second member cannot access the first member's private records.
- [ ] Test only an authorized moderator can access moderation queues and private reports.
- [ ] Test signed-out users cannot access member-only features or private data.
- [ ] Confirm storage buckets and avatar access policies are appropriately restricted.

**Acceptance:** a written permission test matrix passes with separate test accounts. A successful SQL query alone is not sufficient.

### C. Authentication and member profiles
- [ ] Confirm sign-up, sign-in, sign-out, and session persistence.
- [ ] Confirm password reset email and return link work on the deployed GitHub Pages URL.
- [ ] Confirm a member can create and update their own profile.
- [ ] Confirm member directory visibility matches the published privacy notice.
- [ ] Confirm account deletion/data deletion procedure is documented and tested.
- [ ] Test expired sessions and error messages.

**Acceptance:** a test member can complete the entire account journey without seeing another member's private information.

### D. Community and moderation
- [ ] Verify chat-room migration and discussion schema against the actual Supabase migration history.
- [ ] Test a member can read rooms and create allowed messages.
- [ ] Test members can edit/delete only their own permitted content.
- [ ] Test reports are private to the reporting member and authorized moderators.
- [ ] Connect the moderation dashboard to the actual report queues; verify approve, reject, publish, remove, and close actions.
- [ ] Test moderator authorization server-side—not just by hiding controls in the UI.
- [ ] Test blocking and report handling with separate accounts.
- [ ] Publish community guidelines, prohibited content rules, and realistic moderation coverage hours.
- [ ] State clearly that the community is not monitored 24/7 and is not emergency support.

**Acceptance:** member and moderator test cases pass, including negative permission tests.

### E. Wellness and personal growth data
- [ ] Test check-ins, goals, gratitude entries, achievements, and challenge progress.
- [ ] Confirm whether each feature saves locally, to Supabase, or both; label this honestly.
- [ ] Verify records remain associated with the correct signed-in user.
- [ ] Verify sign-out on a shared device does not expose the previous member's private content.
- [ ] Keep sensitive notes and records private; do not send them to AI by default.
- [ ] Check that completion dates use the actual date of completion.

**Acceptance:** saving, reloading, account separation, and deletion behavior are tested and documented.

---

## 7. Priority 2 — safety, privacy, and AI readiness

### A. Safety resources and Quick Exit
- [ ] Check all emergency and crisis contact details against authoritative sources.
- [ ] Verify every state resource link and record the date checked.
- [ ] Test local support links and explain that live shelter capacity/availability is not confirmed.
- [ ] Review Quick Exit behavior on desktop and Android; explain that it cannot erase browser history or guarantee device safety.
- [ ] Review safety-plan and incident-documentation storage, access, and deletion.
- [ ] Avoid collecting unnecessary identifying details.
- [ ] Keep a clear route to emergency services and qualified human support.

**Acceptance:** resource links work, limitations are visible, and sensitive features pass a privacy review.

### B. AI assistant
The current Edge Function is an initial authenticated scaffold. It expects a compatible HTTPS chat-completions provider and server-side secrets. It is not evidence of a live AI service.

- [ ] Decide which single provider will be used for the first controlled test.
- [ ] Review provider data retention, training use, terms, security, and costs.
- [ ] Publish an AI notice and obtain informed consent before sending a member message to the provider.
- [ ] Configure `APP_ORIGIN`, `AI_API_URL`, `AI_API_KEY`, and `AI_MODEL` as Supabase Edge Function secrets.
- [ ] Deploy `ai-assistant` only after source and configuration review.
- [ ] Add per-user rate limits, abuse controls, budget limits, monitoring, and safe error handling.
- [ ] Test authentication, origin/CORS, invalid input, oversized input, provider outage, and cost controls.
- [ ] Keep journal entries, safety plans, incident reports, women's wellness records, and community reports out of the AI endpoint.
- [ ] Review crisis handling with qualified human input; a system prompt is not a reliable crisis detector.
- [ ] Clearly label the assistant as general information—not therapy, diagnosis, or emergency response.

**Acceptance:** documented privacy approval, consent, successful security tests, rate limits, and a tested provider outage path. Until then, AI must remain disabled or clearly marked as a prototype/unavailable.

### C. Policies and trust
- [ ] Publish a plain-language Privacy Policy.
- [ ] Publish Terms of Use.
- [ ] Publish Community Guidelines and moderation expectations.
- [ ] Publish contact/support information.
- [ ] Explain what data is collected, why, where it is stored, who can access it, and how to request deletion.
- [ ] Document data retention and incident response.
- [ ] Review accessibility and plain-language wording.

**Acceptance:** all policy links are live, readable on mobile, and match the actual app behavior.

---

## 8. Priority 3 — user experience and release quality

- [ ] Test all primary navigation links and in-page anchors.
- [ ] Test every button, form, filter, modal, and external link.
- [ ] Add useful empty, loading, success, and error states.
- [ ] Check keyboard navigation and visible focus.
- [ ] Check contrast, headings, labels, and screen-reader names.
- [ ] Check reduced-motion preferences.
- [ ] Review mobile navigation and horizontal overflow.
- [ ] Confirm Quick Exit appears only in the Safety & Support area.
- [ ] Confirm no placeholder links, sample-only content, or misleading live-status claims remain.
- [ ] Review the teal/gold visual identity for consistency.
- [ ] Test current Android browser and at least one desktop browser.
- [ ] Collect feedback from a small trusted pilot group before public promotion.

**Acceptance:** all critical user journeys can be completed on mobile and desktop without a blocker.

---

## 9. Launch plan and release gates

### Gate 1 — Internal build
**Goal:** stable app and clean deployment.
- Complete Priority 1A.
- Fix all build/deployment blockers.
- Confirm the deployed build matches the latest main branch.

### Gate 2 — Private backend test
**Goal:** safe member accounts and data.
- Complete database audit, RLS tests, authentication tests, and community permission tests.
- Use test accounts and non-sensitive sample data only.
- Do not invite public members yet.

### Gate 3 — Safety and policy review
**Goal:** trustworthy resource and privacy experience.
- Complete resource verification, Quick Exit review, privacy/terms/community policies, and deletion process.
- Keep unverified features clearly labelled.

### Gate 4 — Controlled pilot
**Goal:** learn from a small group before public release.
- Invite only trusted testers.
- Provide a short test script covering sign-up, navigation, wellness tools, community, safety links, and sign-out.
- Collect feedback without asking testers to submit sensitive personal stories.
- Fix critical and high-priority issues; retest.

### Gate 5 — Public launch decision
**Goal:** launch only when the release gates pass.
- Review the checklist with the founder.
- Confirm no unresolved critical security, privacy, safety, or data-loss issue.
- Confirm support and moderation expectations are realistic.
- Tag the release and record the deployment date.
- Publish the launch announcement only after the decision is documented.

**No fixed public launch date is promised in this plan.** The date should be selected after the gates pass, not before.

---

## 10. Test matrix

| Test | Account / device | Expected result | Status |
|---|---|---|---|
| Public app loads | Signed out, Android | Home screen loads; no private data shown | Not rechecked |
| Navigation | Signed out, desktop | All seven main areas open | Not rechecked |
| Sign up / sign in | Test member A | Account works and session persists | Not rechecked |
| Password reset | Test member A, Android | Reset link returns to app and allows new password | Recheck |
| Profile update | Test member A | Own profile updates | Not rechecked |
| Private data isolation | Members A and B | B cannot read A's private records | Not tested |
| Moderator access | Member and moderator accounts | Only authorized moderator can review reports | Not tested |
| Community report | Member A | Report is private and reaches authorized queue | Not tested |
| Own message removal | Member A | Member can remove only permitted own content | Not tested |
| Wellness save/load | Member A | Correct account's data persists as documented | Not rechecked |
| Safety resource links | Android and desktop | Link opens correct current resource | Not rechecked |
| Quick Exit | Android and desktop | Behavior and limitations are clear | Not rechecked |
| AI unavailable path | Signed-in test account | Clear unavailable state; no secret leakage | Not tested |
| Sign out | Member A | Private member data is no longer accessible | Not rechecked |

Record the actual date, tester role, device/browser, result, and any issue before changing a test to Passed.

---

## 11. Daily development and completion log

Use the existing detailed log in [INTEGRITY_RISING_APP_TODO.md](../INTEGRITY_RISING_APP_TODO.md) for daily task-by-task tracking. Keep this master plan as the overview and launch decision record.

### November 16, 2026 — Project consolidation
- [x] Review the current README, app shell, Supabase client, AI function scaffold, Pages workflow, existing launch checklist, secure AI notes, and chat-room release checklist. — **Completed: Nov 16, 2026**
- [x] Create this master Development and Launch Plan as the central project index. — **Completed: Nov 16, 2026**
- [x] Link the master plan from the repository README. — **Completed: Nov 16, 2026**
- [ ] Freshly verify the latest GitHub Actions run and live app.
- [ ] Continue with Priority 1A, then work down the launch gates.

### Daily completion rules
- Check off an item only after the work is complete and verified.
- Add the real completion date beside each completed item.
- Keep unfinished tasks unchecked and carry them forward.
- Record blockers with the exact file, screen, error, or permission test.
- Keep future ideas in the Room to Grow section below; do not confuse ideas with launch blockers.

---

## 12. Room to grow — future roadmap

These are future opportunities, not promises for the first public release.

- [ ] Expand Academy courses and practical downloadable learning resources.
- [ ] Add more guided wellness practices based on member feedback.
- [ ] Improve daily task and goal tracking with clear completion dates.
- [ ] Add optional member achievements and progress summaries.
- [ ] Improve accessibility and language support.
- [ ] Explore partnerships with qualified support organizations.
- [ ] Add carefully reviewed independent AI integrations only where privacy and provider terms allow.
- [ ] Build a regular process for reviewing safety resource links.
- [ ] Gather community suggestions and prioritize improvements transparently.

---

## 13. Related project documents

These detailed documents remain in the repository and should be maintained alongside this master plan:

- [Detailed app launch checklist and dated progress log](../INTEGRITY_RISING_APP_TODO.md)
- [Secure AI backend setup and limitations](../SECURE_AI_BACKEND.md)
- [Community chat rooms release checklist](../CHAT_ROOMS_RELEASE_CHECKLIST.md)
- [Repository README](../../README.md)
- [Supabase migrations](../../supabase/migrations/)
- [App source and feature components](../../src/components/)
- [GitHub Pages deployment workflow](../../.github/workflows/deploy-pages.yml)

---

## 14. Definition of done

The app is ready for a public launch decision only when:
1. The latest build and deployment pass.
2. All critical user journeys pass on Android and desktop.
3. Authentication and database permissions pass tests with separate member and moderator accounts.
4. Sensitive records are private, and data deletion/retention behavior is documented.
5. Community moderation and reporting permissions are verified.
6. Safety resources and Quick Exit limitations are reviewed.
7. Privacy, terms, consent, community guidelines, and support information are published.
8. AI is either safely configured and reviewed or remains clearly disabled/unavailable.
9. No unresolved critical security, privacy, safety, or data-loss issue remains.
10. The founder records the go/no-go decision.

**Integrity Rising — United by Truth, Driven by Purpose.**  
*Learn • Grow • Heal • Rise.*
