/* =====================================================================
   DMC01 website Worker
   ---------------------------------------------------------------------
   Serves webflow/ as static assets (unchanged — assets are matched
   first), plus one endpoint:

     POST /consent   records a cookie-consent choice in KV (CONSENT_LOG)

   Called by the consent banner in sections/chrome-footer.html with
   navigator.sendBeacon (Content-Type text/plain, so no CORS preflight).

   What is stored — deliberately minimal, no IP address, no user agent:
     key    <ISO timestamp>:<consent id>
     value  { id, v, analytics, path, ts }
     TTL    2 years (then KV deletes it automatically)
   The consent id is a random UUID kept in the visitor's dmc01_consent
   cookie, so a visitor's record can be found if they ask for it.
   ===================================================================== */

const ALLOWED_ORIGINS = new Set([
  'https://www.dmc01.com',
  'https://dmc01.com',
  'https://dmc01-ltd-staging.webflow.io',
]);
const RETENTION_SECONDS = 2 * 365 * 24 * 3600;

function cors(origin) {
  return ALLOWED_ORIGINS.has(origin)
    ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' }
    : {};
}

async function recordConsent(request, env) {
  const origin = request.headers.get('Origin') || '';
  if (!ALLOWED_ORIGINS.has(origin)) return new Response('Forbidden', { status: 403 });

  const text = await request.text();
  if (text.length > 1000) return new Response('Too large', { status: 413, headers: cors(origin) });
  let body;
  try { body = JSON.parse(text); } catch { return new Response('Bad JSON', { status: 400, headers: cors(origin) }); }

  const { id, v, analytics, path } = body || {};
  const valid =
    typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id) &&
    Number.isInteger(v) && v > 0 && v < 1000 &&
    typeof analytics === 'boolean' &&
    typeof path === 'string' && path.startsWith('/') && path.length <= 200;
  if (!valid) return new Response('Invalid', { status: 400, headers: cors(origin) });

  const ts = new Date().toISOString();
  const record = { id, v, analytics, path, ts };
  await env.CONSENT_LOG.put(`${ts}:${id}`, JSON.stringify(record), { expirationTtl: RETENTION_SECONDS });
  return new Response(null, { status: 204, headers: cors(origin) });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/consent') {
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(request.headers.get('Origin') || '') });
      if (request.method === 'POST') return recordConsent(request, env);
      return new Response('Method not allowed', { status: 405 });
    }
    // Anything else that isn't a file in webflow/ → the assets 404.
    return env.ASSETS.fetch(request);
  },
};
