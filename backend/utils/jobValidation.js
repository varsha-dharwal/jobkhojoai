export function validateJob(job) {
  if (typeof job.title !== "string" || !job.title.trim()) return "Job title is required.";
  if (typeof job.organization !== "string" || !job.organization.trim()) return "Organization is required.";
  if (typeof job.roleDescription !== "string" || !job.roleDescription.trim()) {
    return "A role description is required before publishing.";
  }

  try {
    const url = new URL(job.applyLink);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
  } catch {
    return "Enter a valid official application URL starting with http:// or https://.";
  }

  return "";
}