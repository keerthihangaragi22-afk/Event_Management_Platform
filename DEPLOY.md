# Deploy notes

## Vercel build

```
prisma generate && prisma db push --skip-generate && next build
```

## Required env (Production)

- `DATABASE_URL` — Neon connection string (only this is required)
- `AUTH_SECRET` / `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL`

`DATABASE_URL_UNPOOLED` is **not** required anymore.

## After first successful deploy

1. If tables are empty, run `prisma/init.sql` in Neon SQL Editor.
2. Seed data:

```js
fetch('/api/setup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
}).then(r => r.json()).then(console.log)
```
