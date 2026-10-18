// A job without a last date stays open for this many days after it was posted.
export const DEFAULT_OPEN_DAYS = 30;

function startOfTodayUTC() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}

export function defaultLastDate(from = new Date()) {
  const date = new Date(from);
  date.setUTCDate(date.getUTCDate() + DEFAULT_OPEN_DAYS);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

// Open = active, not past its last date (or, without one, posted in the last
// DEFAULT_OPEN_DAYS days) and has some description. Mirrors isJobOpen below.
export function publicJobFilter(extra = {}) {
  const today = startOfTodayUTC();
  const cutoff = new Date(Date.now() - DEFAULT_OPEN_DAYS * 864e5);

  return {
    $and: [
      { status: "active" },
      {
        $or: [
          { lastDate: { $gte: today } },
          { lastDate: { $in: [null] }, createdAt: { $gte: cutoff } },
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
  if (job.lastDate) return new Date(job.lastDate) >= startOfTodayUTC();
  return Date.now() - new Date(job.createdAt).getTime() <= DEFAULT_OPEN_DAYS * 864e5;
}
