import { ROADMAP_CATEGORIES } from "./src/data/roadmaps.js";
import { CAREER_GUIDE_ARTICLES } from "./src/data/careerGuides.js";

const API_URL = (process.env.VITE_API_URL || "https://jobkhojoai-backend.onrender.com/api").replace(/\/$/, "");

// Every public page is pre-rendered to static HTML at build time, so search engines,
// the AdSense crawler and visitors all get the full page immediately — no waiting on
// the free backend to wake up. Client-only screens (saved jobs, admin) and jobs posted
// after the last build are served by the SPA fallback (see scripts/postbuild.js).
async function fetchJobSlugs() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${API_URL}/jobs`, { signal: AbortSignal.timeout(90_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const jobs = await res.json();
      return jobs.map(job => `/jobs/${job.slug}`);
    } catch (err) {
      console.warn(`[prerender] fetching jobs failed (attempt ${attempt}/3): ${err.message}`);
    }
  }
  // A production build fails loudly — deploying a site with no job pages would be worse
  // than not deploying. `react-router dev` just carries on without job pages.
  if (process.argv.includes("build")) throw new Error(`[prerender] could not load jobs from ${API_URL}`);
  return [];
}

export default {
  appDirectory: "src",
  ssr: false,
  async prerender() {
    const jobPaths = await fetchJobSlugs();
    return [
      "/",
      "/jobs",
      ...jobPaths,
      "/saved-jobs",
      "/career-paths",
      ...ROADMAP_CATEGORIES.map(r => `/roadmap/${r.slug}`),
      "/career-insights",
      ...CAREER_GUIDE_ARTICLES.map(a => `/career-guide/${a.slug}`),
      "/career-guide/interview-tips",
      "/career-guide/resume-builder",
      "/about",
      "/contact",
      "/privacy-policy",
      "/terms",
      "/disclaimer",
      "/editorial-policy",
      "/job-verification-policy",
      "/content-correction-policy",
      // Rendered through the catch-all route; postbuild turns it into a static 404.html.
      "/404",
    ];
  },
};
