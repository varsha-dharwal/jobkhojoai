// Same rule as services/jobLifecycle.js: a job is open until the earlier of its last
// date (inclusive) or MAX_AGE_DAYS after posting. The lifecycle job flips expired jobs
// to status "expired" once a day; these checks keep the site correct in between.
export const MAX_AGE_DAYS = 45;

function startOfTodayUTC() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

// Open = active, inside both date limits, and has some description. Mirrors isJobOpen.
export function publicJobFilter(extra = {}) {
  const cutoff = new Date(Date.now() - MAX_AGE_DAYS * 864e5);

  return {
    $and: [
      { status: "active" },
      { createdAt: { $gte: cutoff } },
      {
        $or: [
          { lastDate: { $in: [null] } },
          { lastDate: { $gte: startOfTodayUTC() } },
        ],
      },
      {
        $or: [
          { roleDescription: { $exists: true, $nin: ["", null] } },
          { responsibilities: { $exists: true, $nin: ["", null] } },
          { requirements: { $exists: true, $nin: ["", null] } },
        ],
      },
      extra,
    ],
  };
}

export function isJobOpen(job) {
  if (job.status !== "active") return false;
  if (![job.roleDescription, job.responsibilities, job.requirements].some(hasText)) return false;
  if (Date.now() - new Date(job.createdAt).getTime() > MAX_AGE_DAYS * 864e5) return false;
  return !job.lastDate || new Date(job.lastDate) >= startOfTodayUTC();
}
