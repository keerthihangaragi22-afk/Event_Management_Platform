# Event Management Platform
### The Legacy Circle 2027 Gala Template

A reusable, full-stack event management website built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **Prisma**, and **Neon PostgreSQL**.

Designed so college students can deploy it **without using a terminal**.

---

## What is Included

| Feature | Status |
|---------|--------|
| Public multi-page event website (premium dark + gold design) | ✅ |
| Event configuration stored in database | ✅ |
| Invitation-only registration with code validation | ✅ |
| Unique Registration ID + Ticket Number | ✅ |
| QR code generation for every ticket | ✅ |
| SPOC (Single Point of Contact) system | ✅ |
| Admin dashboard with live statistics | ✅ |
| Database schema (Prisma) for all major entities | ✅ |
| One-time browser setup endpoint (`/api/setup`) | ✅ |
| Resend email integration (confirmation emails) | ✅ |
| Vercel + Neon ready configuration | ✅ |
| Seed data for The Legacy Circle 2027 | ✅ |
| Role-based structure (Super Admin, Event Manager, etc.) | ✅ Foundation |
| Check-in / ticket verification endpoints | ✅ Foundation |
| Email campaigns & reminders (manual / on-demand) | ✅ Schema ready |

---

## Student Deployment Guide (No Terminal Required)

### Step 1 – Download & Extract
1. Download the project or clone this repository
2. Extract if needed

### Step 2 – Create a GitHub Repository (if not already done)
1. Go to [github.com](https://github.com) and sign in
2. Click **New repository**
3. Name it (example: `legacy-circle-2027`)
4. Keep it **Public** or **Private**
5. **Do not** add README, .gitignore or license
6. Click **Create repository**

### Step 3 – Upload Project Files (if creating new repo)
1. On the empty repository page click **uploading an existing file**
2. Drag and drop **all files and folders** from the extracted project
3. Click **Commit changes**

### Step 4 – Create a Neon Database
1. Go to [console.neon.tech](https://console.neon.tech) and sign up / log in
2. Create a new project
3. Copy the **Pooled** connection string → this is `DATABASE_URL`
4. Copy the **Direct** connection string → this is `DATABASE_URL_UNPOOLED`

### Step 5 – Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Import this GitHub repository
4. Leave Framework Preset as **Next.js**
5. Before deploying, open **Environment Variables** and add:

| Name | Value | Notes |
|------|-------|-------|
| `DATABASE_URL` | (Neon pooled string) | Required |
| `DATABASE_URL_UNPOOLED` | (Neon direct string) | Required |
| `AUTH_SECRET` | long random string | Generate at generate-secret.vercel.app/32 |
| `NEXTAUTH_SECRET` | same as AUTH_SECRET | Required |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | Update after first deploy |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Update after first deploy |
| `RESEND_API_KEY` | your Resend key | Optional for emails |
| `RESEND_FROM_EMAIL` | verified sender | Optional |
| `RESEND_FROM_NAME` | The Legacy Circle | Optional |

6. Click **Deploy**

### Step 6 – Initialize the Database
After the first successful deploy:

1. Visit: `https://your-project.vercel.app/api/setup`
2. You should see JSON saying the database is not initialized
3. Open the browser console and run:

```js
fetch('/api/setup', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({}) })
  .then(r => r.json()).then(console.log)
```

Default Super Admin will be created:
- **Email:** `admin@thelegacycircle.org`
- **Password:** `Admin@Legacy2027`

**Change this password immediately after first login.**

### Step 7 – Use the Site
- Public site: `https://your-project.vercel.app`
- Registration: `/register` (use invitation codes `LEGACY2027-VIP` or `LEGACY2027-GUEST`)
- Admin dashboard: `/dashboard`

---

## Default Invitation Codes (after seed/setup)

- `LEGACY2027-VIP`
- `LEGACY2027-GUEST`

---

## Important Notes

1. **Never commit real secrets** to GitHub. Use Vercel Environment Variables.
2. After changing environment variables, trigger a **Redeploy** on Vercel.
3. The design uses a premium dark navy + gold palette suitable for a high-end gala.
4. All event content is stored in the database and can be changed from the admin area.
5. QR codes contain only a secure token, never personal data.
6. **No cron jobs** are used in this project.

---

**The Legacy Circle 2027**  
*Where Giving Creates a Lasting Legacy.*
