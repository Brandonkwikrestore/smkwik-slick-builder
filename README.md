# SMKWIK Slick Builder — Vercel Deployment

## Structure
```
slick-vercel/
├── public/
│   └── index.html          ← The Slick Builder app
├── api/
│   ├── contacts.js         ← GET /api/contacts
│   ├── templates.js        ← GET /api/templates
│   └── drafts.js           ← GET/POST/PATCH/DELETE /api/drafts
├── vercel.json
└── .env                    ← Supabase credentials (set in Vercel dashboard)
```

## Deploy steps

1. Install Vercel CLI (if not already):
   ```
   npm i -g vercel
   ```

2. From the slick-vercel/ folder:
   ```
   cd slick-vercel
   vercel
   ```
   - Set project name: `smkwik-slick-builder`
   - Framework: Other
   - Output directory: `public`

3. Add environment variables in Vercel dashboard → Settings → Environment Variables:
   ```
   SUPABASE_URL       = https://uhpzoiotqpmcsuqzpuvo.supabase.co
   SUPABASE_ANON_KEY  = <your anon key>
   ```

4. Redeploy after setting env vars:
   ```
   vercel --prod
   ```

## API Routes
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/contacts | All 3 BDM contacts |
| GET | /api/templates | All templates from Supabase |
| GET | /api/templates?slug=ti-reconnect | Single template |
| GET | /api/drafts | All saved drafts |
| POST | /api/drafts | Save new draft |
| PATCH | /api/drafts?id=UUID | Update draft |
| DELETE | /api/drafts?id=UUID | Delete draft |

## How it works
- Builder loads contacts from Supabase on init → populates footer dropdown
- Templates load from Supabase → shown in Load Sample menu
- Save Draft → creates/updates row in slick_drafts table
- Falls back to in-memory/hardcoded data if Supabase is unreachable
