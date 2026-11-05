# Integrity Rising — The Wellness & Growth App

**The Integrity Movement**  
*Learn • Grow • Heal • Rise*  
**United by Truth, Driven by Purpose**

Integrity Rising is a wellness, personal-growth, education, community, and support platform. The app is designed to make practical tools and resources easier to find in one welcoming place.

## App areas

- **Member dashboard:** account access, personal wellness check-ins, and daily practices.
- **Quick Access Directory:** searchable shortcuts to the app's main tools and resources.
- **Wellness & AI:** guided wellness tools, AI provider directory, privacy information, and a prototype support chat.
- **Community:** member discussions and moderation workflows.
- **Integrity Rising Academy:** educational content for learning and personal growth.
- **Safety & Support:** mental health services, state-by-state domestic violence resources, local support search, personal safety planning, and incident documentation.

## Brand

- App name: **Integrity Rising — The Wellness & Growth App**
- Community: **The Integrity Movement**
- Colors: teal and gold, with light neutral backgrounds for readability.
- Slogan: **United by Truth, Driven by Purpose**

## Technology

- React
- Vite
- Supabase client for planned authentication and private data services
- Supabase Edge Function scaffold for a future authenticated AI endpoint

## Local development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Configuration and launch status

The repository includes a launch checklist at [docs/INTEGRITY_RISING_APP_TODO.md](docs/INTEGRITY_RISING_APP_TODO.md) and secure AI setup notes at [docs/SECURE_AI_BACKEND.md](docs/SECURE_AI_BACKEND.md).

The Supabase project, database migrations, authentication configuration, moderator access, and AI provider connection must be configured and tested before their related features can be treated as production-ready. The current guided wellness and chat experiences are prototypes; they are not clinical services or emergency monitoring.

Never commit API keys, service-role keys, passwords, or private member information. Use server-side secrets for backend integrations. Review privacy, consent, access controls, and crisis guidance before launch.

## Safety note

This app offers educational and peer-support resources. It is not a substitute for emergency services, professional mental health care, legal advice, or individualized safety planning. The app is not monitored for emergencies.
