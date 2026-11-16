# Integrity Rising — The Wellness & Growth App

**The Integrity Movement**  
*Learn • Grow • Heal • Rise*  
**United by Truth, Driven by Purpose**

Integrity Rising is a wellness, personal-growth, education, community, and support platform. It is designed to make practical tools and resources easier to find in one welcoming place.

## Why I created Integrity Rising

I created Integrity Rising because I believe everyone deserves an opportunity to change their life, regardless of where they've been or what they've experienced.

Life isn't always easy. People face addiction, trauma, unhealthy relationships, mental health challenges, financial struggles, loss, and moments when they feel alone or uncertain about their future.

I wanted to build something meaningful—something that could provide practical resources, encouragement, education, and opportunities for personal development. I believe our past does not have to determine our future. We do not have to be perfect to make a difference; we can still be learning, healing, and rebuilding while helping others find hope.

Integrity Rising is my commitment to creating something bigger than myself: a movement that encourages people to take responsibility for their growth, recognize their worth, and discover what is possible when they refuse to give up.

**This isn't just an app. It's a movement built around the belief that people can grow, heal, change, and rise.**

## App areas

- **Dashboard:** personal home, shortcuts, encouragement, and progress.
- **Community:** topic rooms, discussions, member connections, resources, and moderation.
- **Wellness Center:** guided wellness tools, self-reflection, stress relief, and AI resources.
- **Integrity Rising Academy:** education and personal development.
- **Safety & Support:** mental health resources, domestic violence support links, safety planning, and incident tools.
- **My Growth:** goals, gratitude, achievements, and challenges.
- **My Account:** member profile and personalization.

## Technology

- React and Vite
- JavaScript and CSS
- Supabase client, database, authentication, and Edge Functions (where configured)
- GitHub Actions and GitHub Pages

## Development and launch plan

The master project record is maintained here:

**[Integrity Rising App Development and Launch Plan](docs/INTEGRITY_RISING_APP_DEVELOPMENT_AND_LAUNCH_PLAN/README.md)**

It includes the founder vision, feature map, current status, development priorities, launch gates, test matrix, daily progress record, and links to detailed technical documents.

Supporting documents:
- [Detailed task checklist and progress log](docs/INTEGRITY_RISING_APP_TODO.md)
- [Secure AI backend setup](docs/SECURE_AI_BACKEND.md)
- [Community chat rooms release checklist](docs/CHAT_ROOMS_RELEASE_CHECKLIST.md)

## Local development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run quality checks and create a production build:

```bash
npm run check
```

## Configuration and safety

The Supabase browser client reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. These are public client configuration values; never place a service-role key or AI provider secret in frontend code, GitHub source files, or browser storage.

The `ai-assistant` Edge Function is an initial authenticated scaffold. It must be configured, deployed, privacy-reviewed, rate-limited, and tested before being treated as a live service. Guided wellness and chat features must be described accurately as tools or prototypes where applicable.

The app provides educational and peer-support resources. It is not a substitute for emergency services, professional mental health care, legal advice, or individualized safety planning. The app is not monitored for emergencies.

## Launch status

**In development — not cleared for public launch.** See the master plan for the verified status and remaining launch gates. A successful code commit or build does not by itself prove that Supabase policies, member permissions, safety resources, or live services are ready.

---

**Founder:** Christina Engel  
**Integrity Rising — United by Truth, Driven by Purpose.**
