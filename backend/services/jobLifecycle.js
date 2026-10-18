import Job from "../models/Job.js";

const MAX_AGE_DAYS = 45;
const REMINDER_DAYS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

function effectiveExpiry(job) {
  const ageExpiry = new Date(new Date(job.createdAt).getTime() + MAX_AGE_DAYS * DAY_MS);
  if (!job.lastDate) return ageExpiry;

  // lastDate is inclusive for its calendar day, so expire at the next UTC midnight.
  const lastDateExpiry = new Date(job.lastDate);
  lastDateExpiry.setUTCHours(0, 0, 0, 0);
  lastDateExpiry.setUTCDate(lastDateExpiry.getUTCDate() + 1);
  return lastDateExpiry < ageExpiry ? lastDateExpiry : ageExpiry;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

async function sendAdminEmail({ to, subject, html, text }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: process.env.MAIL_FROM || "hello@jobkhojoai.com", to: [to], subject, html, text }),
  });
  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Resend email request failed (${response.status}): ${details.slice(0, 300)}`);
  }
}

export async function runJobLifecycle(now = new Date()) {
  const jobs = await Job.find({ status: "active" }).select("title organization slug createdAt lastDate expiryReminderFor").lean();
  const reminders = [];
  let expired = 0;
  const expiresBy = now.getTime() + REMINDER_DAYS * DAY_MS;

  for (const job of jobs) {
    const expiry = effectiveExpiry(job);
    if (expiry <= now) {
      await Job.updateOne({ _id: job._id, status: "active" }, { $set: { status: "expired" } }, { timestamps: false });
      expired += 1;
      continue;
    }

    if (expiry.getTime() > expiresBy) continue;
    if (job.expiryReminderFor && new Date(job.expiryReminderFor).getTime() === expiry.getTime()) continue;
    reminders.push({ job, expiry });
  }

  if (!reminders.length) return { expired, reminded: 0 };

  const missing = [
    !process.env.ADMIN_EMAIL && "ADMIN_EMAIL",
    !process.env.RESEND_API_KEY && "RESEND_API_KEY",
  ].filter(Boolean);
  if (missing.length) {
    console.warn(`Job expiry reminders skipped; configure ${missing.join(", ")}.`);
    return { expired, reminded: 0 };
  }

  const siteUrl = (process.env.PUBLIC_SITE_URL || "https://jobkhojoai.com").replace(/\/$/, "");
  const rows = reminders.map(({ job, expiry }) => {
    const date = expiry.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium" });
    return { job, expiry, date };
  });
  const htmlRows = rows.map(({ job, date }) => `<li><strong>${escapeHtml(job.title || "Untitled job")}</strong> at ${escapeHtml(job.organization || "Employer")} - expires ${date}. <a href="${siteUrl}/admin/jobs/${encodeURIComponent(job._id)}/edit">Review job</a></li>`).join("");
  const textRows = rows.map(({ job, date }) => `- ${job.title || "Untitled job"} at ${job.organization || "Employer"} - expires ${date}: ${siteUrl}/admin/jobs/${job._id}/edit`).join("\n");

  await sendAdminEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `${reminders.length} job${reminders.length === 1 ? "" : "s"} expiring within 3 days`,
    html: `<div style="font-family:Arial,sans-serif;color:#0f172a;max-width:640px;margin:auto"><h1 style="color:#2563eb">Jobs expiring soon</h1><p>These active jobs will expire within 3 days based on the earlier of their application deadline or 45 days after posting.</p><ul>${htmlRows}</ul><p><a href="${siteUrl}/admin/jobs">Manage all jobs</a></p></div>`,
    text: `Jobs expiring within 3 days:\n\n${textRows}\n\nManage all jobs: ${siteUrl}/admin/jobs`,
  });

  for (const { job, expiry } of reminders) {
    await Job.updateOne({ _id: job._id, status: "active" }, { $set: { expiryReminderFor: expiry } }, { timestamps: false });
  }
  return { expired, reminded: reminders.length };
}
