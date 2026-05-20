// api/drafts.js
// GET    /api/drafts              — list all drafts
// GET    /api/drafts?id=x         — single draft
// POST   /api/drafts              — create draft (body: draft object)
// PATCH  /api/drafts?id=x         — update draft (body: partial draft)
// DELETE /api/drafts?id=x         — delete draft

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

async function supabase(path, method = 'GET', body = null, prefer = 'return=representation') {
  const opts = {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: prefer,
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, opts);
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const id = req.query?.id;

  if (req.method === 'GET') {
    const path = id
      ? `slick_drafts?id=eq.${id}&select=*,slick_contacts(*)&limit=1`
      : `slick_drafts?select=*,slick_contacts(name,phone,email)&order=updated_at.desc`;
    const { status, body } = await supabase(path);
    return res.status(status).json(id ? (body?.[0] ?? null) : body);
  }

  if (req.method === 'POST') {
    const draft = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { status, body } = await supabase('slick_drafts', 'POST', draft);
    return res.status(status).json(body?.[0] ?? body);
  }

  if (req.method === 'PATCH') {
    if (!id) return res.status(400).json({ error: 'id required' });
    const patch = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { status, body } = await supabase(`slick_drafts?id=eq.${id}`, 'PATCH', patch);
    return res.status(status).json(body?.[0] ?? body);
  }

  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ error: 'id required' });
    const { status } = await supabase(`slick_drafts?id=eq.${id}`, 'DELETE', null, 'return=minimal');
    return res.status(status).end();
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
