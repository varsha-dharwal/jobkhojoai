// Public, read-only job API used by route loaders. Loaders run at build time
// (pre-rendering) and the result is baked into static HTML, so visitors never wait
// on the backend waking up. In the browser these same helpers are only used to pick
// up jobs posted after the last build.

export const API_BASE = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://jobkhojoai-backend.onrender.com/api")
).replace(/\/$/, "");

const IS_BUILD = typeof window === "undefined";

// The free backend can take 30s+ to wake up, so builds wait patiently and retry,
// while browsers give up quickly and keep showing the pre-rendered data.
async function getJson(path, { timeoutMs = IS_BUILD ? 90_000 : 12_000, retries = IS_BUILD ? 2 : 0 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${API_BASE}${path}`, { signal: AbortSignal.timeout(timeoutMs) });
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

// In the browser this only runs for jobs newer than the last build, where there's
// nothing else to show — so it waits long enough for a cold backend to wake up.
export function fetchJob(slug) {
  return getJson(`/jobs/${encodeURIComponent(slug)}`, IS_BUILD ? undefined : { timeoutMs: 35_000 });
}
