# jobkhojoAI — Phase 1 MVP

Full-stack job listing site. React (Vite) frontend + Node/Express + MongoDB backend.
Flow: Instagram post → bio link → jobkhojoai.com job detail page → "Apply Now" → redirects to the official
government/company website. You post jobs yourself through a simple password-protected admin panel — no coding
needed for daily posting.

## Folder structure
```
jobkhojoai/
  backend/     Express API + MongoDB models
  frontend/    React site (public pages + admin panel)
```

## 1. Backend setup

```
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:
- `MONGODB_URI` — get a free cluster at mongodb.com/atlas, copy the connection string
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your own admin login (this is the only account, used for the admin panel)

Run it:
```
npm run dev
```
Server runs on http://localhost:5000

## 2. Frontend setup

```
cd frontend
npm install
cp .env.example .env
npm run dev
```
Site runs on http://localhost:5173

## 3. Posting a job (no coding)

1. Go to `yoursite.com/admin/login`, log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`
2. Click **+ Add Job**, fill the form, click **Publish Job**
3. It instantly appears on the homepage — that's the link you share on Instagram

## 4. Deploying (when ready)

- **Frontend** → Vercel (connect the `frontend` folder as the project root, set `VITE_API_URL` to your live backend URL)
- **Backend** → Render or Railway (connect the `backend` folder, add the same env vars as your local `.env`, set `CLIENT_URL` to your live frontend URL)
- **Database** → MongoDB Atlas (free tier is enough for MVP)
- Point `jobkhojoai.com` at the Vercel deployment (Vercel gives you the DNS records to add)

## What's already built in

- JobPosting structured data (JSON-LD) on every job page — helps jobs show up in Google's "Jobs" search feature
- Auto-hide expired jobs from the public homepage (mark a job "Expired" in the admin panel)
- Govt vs Private badges, search, and category filter on the homepage
- Privacy Policy / Terms / About / Contact pages already in place (needed for AdSense review later)
- Dark theme using your design tokens, brand teal (#00c48c) matching the jobkhojoAI logo

## What's still manual / next steps

- The 600-word SEO homepage paragraph, FAQ section, sitemap.xml, robots.txt, and Google Analytics — add these
  once the site is live on a real domain (they need a real URL to be useful)
- No password-reset flow for admin — if you forget it, update `ADMIN_PASSWORD` in `.env` directly and redeploy
