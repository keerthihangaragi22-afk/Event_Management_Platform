# Deploy notes

## Vercel build

Build command runs:

```
prisma generate && prisma db push --skip-generate && next build
```

This creates all database tables on every production deploy.

## Required environment variables

Set these in Vercel → Project → Settings → Environment Variables (Production):

- `DATABASE_URL` — Neon pooled connection string
- `DATABASE_URL_UNPOOLED` — Neon direct connection string
- `AUTH_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` — https://your-app.vercel.app
- `NEXT_PUBLIC_APP_URL` — https://your-app.vercel.app

## After deploy

POST to `/api/setup` once to create admin and seed event data.

```js
fetch('/api/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
  .then(r => r.json()).then(console.log)
```
