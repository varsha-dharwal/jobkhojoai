// Apply links that are never a real application page: meeting invites, forms and chats.
const BLOCKED_APPLY_LINKS = [
  { test: /(^|\.)teams\.(microsoft|live)\.com$/, name: "a Microsoft Teams meeting" },
  { test: /(^|\.)meet\.google\.com$/, name: "a Google Meet call" },
  { test: /(^|\.)zoom\.us$/, name: "a Zoom meeting" },
  { test: /^forms\.gle$|^forms\.office\.com$/, name: "a form" },
  { test: /(^|\.)whatsapp\.com$|^wa\.me$|^t\.me$|^telegram\.me$/, name: "a chat link" },
];

export function validateJob(job) {
  if (typeof job.title !== "string" || !job.title.trim()) return "Job title is required.";
  if (typeof job.organization !== "string" || !job.organization.trim()) return "Organization is required.";
  if (typeof job.roleDescription !== "string" || !job.roleDescription.trim()) {
    return "A role description is required before publishing.";
  }

  let url;
  try {
    url = new URL(job.applyLink);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
  } catch {
    return "Enter a valid official application URL starting with http:// or https://.";
  }

  const host = url.hostname.replace(/^www\./, "");
  const blocked = BLOCKED_APPLY_LINKS.find(rule => rule.test.test(host));
  if (blocked || (host === "docs.google.com" && url.pathname.startsWith("/forms"))) {
    return `The apply link points to ${blocked ? blocked.name : "a Google Form"}. Use the employer's careers page or the original job post instead.`;
  }

  if (job.lastDate && Number.isNaN(new Date(job.lastDate).getTime())) return "Last date is not a valid date.";

  return "";
}
