import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const headers = {
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin");
  const allowedOrigin = Deno.env.get("APP_ORIGIN") ?? "";
  const cors = { ...headers, ...(origin && origin === allowedOrigin ? { "Access-Control-Allow-Origin": allowedOrigin } : {}) };

  if (request.method === "OPTIONS") {
    if (!origin || !allowedOrigin || origin !== allowedOrigin) return new Response(null, { status: 403 });
    return new Response("ok", { headers: cors });
  }
  if (request.method !== "POST") return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: cors });
  if (origin && (!allowedOrigin || origin !== allowedOrigin)) return new Response(JSON.stringify({ error: "origin_not_allowed" }), { status: 403, headers });

  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  if (!token || !url || !anon) return new Response(JSON.stringify({ error: "authentication_required" }), { status: 401, headers: cors });

  const supabase = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return new Response(JSON.stringify({ error: "invalid_session" }), { status: 401, headers: cors });

  let body: { message?: unknown };
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400, headers: cors });
  }
  if (typeof body.message !== "string" || !body.message.trim()) return new Response(JSON.stringify({ error: "message_required" }), { status: 400, headers: cors });
  if (body.message.length > 4000) return new Response(JSON.stringify({ error: "message_too_long" }), { status: 413, headers: cors });

  const apiKey = Deno.env.get("AI_API_KEY");
  const apiUrl = Deno.env.get("AI_API_URL");
  const model = Deno.env.get("AI_MODEL");
  if (!apiKey || !apiUrl || !model) {
    return new Response(JSON.stringify({ error: "ai_provider_not_configured" }), { status: 503, headers: cors });
  }

  let endpoint: URL;
  try {
    endpoint = new URL(apiUrl);
    if (endpoint.protocol !== "https:") throw new Error("HTTPS required");
  } catch {
    return new Response(JSON.stringify({ error: "invalid_provider_configuration" }), { status: 500, headers: cors });
  }

  try {
    const response = await fetch(endpoint.toString(), {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a supportive general wellness information assistant. Do not diagnose or prescribe. You are not a therapist or emergency service. Encourage qualified professional support for medical, legal, and safety decisions. For immediate danger, advise contacting local emergency services when safe. For US suicide or emotional crisis, suggest call or text 988. For US domestic violence support, suggest 1-800-799-7233 or text START to 88788. Do not ask for identifying details." },
          { role: "user", content: body.message.trim() },
        ],
        temperature: 0.4,
        max_tokens: 700,
      }),
    });
    if (!response.ok) return new Response(JSON.stringify({ error: "provider_request_failed" }), { status: 502, headers: cors });
    const result = await response.json();
    const reply = result?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) return new Response(JSON.stringify({ error: "provider_invalid_response" }), { status: 502, headers: cors });
    return new Response(JSON.stringify({ reply: reply.trim() }), { status: 200, headers: cors });
  } catch {
    // Never log message text, session tokens, or provider credentials.
    return new Response(JSON.stringify({ error: "ai_service_unavailable" }), { status: 502, headers: cors });
  }
});
