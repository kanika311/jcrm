# JCRM

Unified Next.js app (UI + API routes + Prisma) — one project for local dev, Vercel, and custom domain.

## Structure

```
/
├── app/                 # Pages + API routes (backend)
├── components/
├── lib/                 # Auth, Prisma, Firebase
├── prisma/              # DB schema
├── public/
└── package.json
```

There is no separate Express server. Backend lives under `app/api/*`.

## Local development

```bash
npm install
cp .env.example .env   # fill in values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → import the repo.
3. **Root Directory**: leave blank (project root).
4. Add the same env vars as `.env.example` in Project → Settings → Environment Variables.
5. Set production values:
   - `NEXTAUTH_URL` = `https://your-domain.com`
   - `NEXTAUTH_SECRET` = strong random secret
6. Deploy.

### Custom domain

Vercel → Project → **Settings → Domains** → add your domain → follow DNS instructions (usually `A` / `CNAME` records). HTTPS is automatic.

## One command after clone

```bash
npm install && npm run dev
```
