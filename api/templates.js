// api/templates.js
// GET  /api/templates        — list all templates
// GET  /api/templates?slug=x — single template

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

async function supabase(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: opts.prefer || 'return=representation',
      ...opts.headers,
    },
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const slug = req.query?.slug;
    const path = slug
      ? `slick_templates?slug=eq.${encodeURIComponent(slug)}&select=*`
      : `slick_templates?select=*&order=vertical.asc,label.asc`;
    const { status, body } = await supabase(path);
    return res.status(status).json(slug ? (body?.[0] ?? null) : body);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
