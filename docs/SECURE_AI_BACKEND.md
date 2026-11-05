# Secure AI assistant backend (initial scaffold)

The Supabase project configuration includes an authenticated Edge Function slot named ai-assistant. The function source is not deployed or connected yet.

## Planned behavior

- Require a signed-in Supabase user.
- Accept one user message with a strict character limit.
- Send the message to one server-configured provider endpoint.
- Read provider URL, model, and API key only from Supabase Edge Function secrets.
- Do not write prompts or responses to the database.
- Do not log message text, access tokens, or provider credentials.
- Return a clear unavailable response until provider secrets are configured.

## Required Supabase secrets

Configure these in the Supabase project before enabling the function:

- APP_ORIGIN: exact deployed app origin, without a trailing slash.
- AI_API_URL: HTTPS chat-completions endpoint for the selected compatible provider.
- AI_API_KEY: provider API key. Keep it in Supabase secrets only.
- AI_MODEL: model identifier accepted by that provider.

Supabase supplies SUPABASE_URL and SUPABASE_ANON_KEY to Edge Functions. Do not use or expose a service-role key for this user-facing function.

## Important limitations before production

1. The first adapter should support only providers compatible with the OpenAI chat-completions request/response shape. It will not directly integrate Meta AI/Muse, Gemini, or Manus APIs.
2. Add per-user rate limits, abuse controls, provider-specific error handling, cost limits, and operational monitoring before public launch.
3. Complete a privacy review and publish a clear AI data notice/consent flow before sending member messages to any provider.
4. Do not send safety plans, incident reports, journal entries, women's health records, or community reports to this endpoint.
5. Add tested crisis escalation and clinical/safety review. A system prompt is not a reliable crisis detector and cannot replace human support.
6. Configure the exact production origin and test sign-in, CORS, authentication, failure modes, and data handling in a non-production project first.

## Deployment

After the function source has been reviewed and a Supabase project is configured, deploy with the Supabase CLI:

```sh
supabase functions deploy ai-assistant
```

Never add API keys to GitHub, source files, frontend environment variables, or browser storage.
