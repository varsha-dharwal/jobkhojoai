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
npm run dev       # http://localhost:5173
npm run build     # pre-renders every public page into build/client
npm run preview   # serves build/client the way Cloudflare Pages does (http://localhost:8788)
```

Don't keep a `frontend/.env` pointing at localhost when you build for production — the API URL is baked
into the build. Without one, builds use the live Render API.

### How the frontend works

React Router in framework mode with **pre-rendering** (`frontend/react-router.config.js`). At build time every
public page — homepage, `/jobs`, every `/jobs/:slug`, career paths, guides and policy pages — is rendered to
static HTML from live API data. Visitors and search/AdSense crawlers get the full page instantly, even while
the free backend is asleep.

- A job posted after the last build still opens: `jobs/404.html` boots the app and loads it from the API.
  It gets its own static page on the next build.
- `scripts/postbuild.js` writes clean URLs (`about.html` is served at `/about`), the static `404.html` and
  `sitemap.xml`.
- A production build fails if the API can't be reached, so a deploy never ships without jobs.

## 3. Posting a job (no coding)

1. Go to `yoursite.com/admin/login`, log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`
2. Click **+ Add Job**, fill the form, click **Publish Job**
3. The job link works immediately. It joins the jobs list and gets a pre-rendered page at the next deploy
   (automatic every morning — see below).

## 4. Deploying

- **Frontend** → Cloudflare Pages, connected to this repo: every push to `main` deploys, and pull requests
  get a preview URL. Build settings: root directory `frontend`, build command `npm run build`, output
  directory `build/client` (Node version comes from `frontend/.nvmrc`).
  `.github/workflows/deploy-frontend.yml` also rebuilds every day at 07:00 IST and on demand (GitHub →
  Actions → Deploy frontend → Run workflow), so new jobs get their pre-rendered page. It needs repository
  secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
  Manual alternative: `cd frontend && npm run deploy`.
- **Backend** → Render (free plan). `.github/workflows/keep-backend-awake.yml` pings it every 10 minutes so it
  doesn't fall asleep.
- **Database** → MongoDB Atlas (free tier).

## Notes

- No password-reset flow for admin — if you forget it, update `ADMIN_PASSWORD` in `.env` directly and redeploy
