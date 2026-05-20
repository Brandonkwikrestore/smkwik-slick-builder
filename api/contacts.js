// api/contacts.js
// GET /api/contacts — list all contacts

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/slick_contacts?select=*&order=is_default.desc,name.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const body = await r.json();
    return res.status(r.status).json(body);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
