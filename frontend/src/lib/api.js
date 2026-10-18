// Public, read-only job API used by route loaders. Loaders run at build time
// (pre-rendering) and the result is baked into static HTML. The homepage refreshes
// its job sections from the live API in the browser while keeping that snapshot visible.

export const API_BASE = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://jobkhojoai-backend.onrender.com/api")
).replace(/\/$/, "");

const IS_BUILD = typeof window === "undefined";

// The free backend can take 30s+ to wake up, so builds wait patiently and retry.
// Browser loaders use short defaults unless a page opts into a longer live fetch.
async function getJson(path, { timeoutMs = IS_BUILD ? 90_000 : 12_000, retries = IS_BUILD ? 2 : 0, cache } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${API_BASE}${path}`, { signal: AbortSignal.timeout(timeoutMs), ...(cache ? { cache } : {}) });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`GET ${path} failed with ${res.status}`);
      return await res.json();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

// Fields a job card / the jobs list needs — keeps the pre-rendered list payload small.
const LIST_FIELDS = [
  "_id", "slug", "title", "organization", "logoUrl", "category", "remote", "location",
  "salaryMin", "salaryMax", "experience", "education", "skills", "lastDate", "createdAt", "updatedAt",
];

export function toListJob(job) {
  const out = {};
  for (const key of LIST_FIELDS) if (job[key] !== undefined && job[key] !== null && job[key] !== "") out[key] = job[key];
  return out;
}

let allJobsPromise;

// Every active job, newest first. Cached per process so one build fetches the list once.
export function fetchAllJobs() {
  if (!IS_BUILD) return getJson("/jobs").then(jobs => jobs || []);
  allJobsPromise ??= getJson("/jobs").then(jobs => jobs || []);
  return allJobsPromise;
}

// Refresh the home page's pre-rendered snapshot against the live jobs API on each visit.
export function fetchCurrentJobs() {
  return getJson("/jobs", { timeoutMs: 35_000, cache: "no-store" }).then(jobs => jobs || []);
}

// In the browser this only runs for jobs newer than the last build, where there's
// nothing else to show — so it waits long enough for a cold backend to wake up.
export function fetchJob(slug) {
  return getJson(`/jobs/${encodeURIComponent(slug)}`, IS_BUILD ? undefined : { timeoutMs: 35_000 });
}
