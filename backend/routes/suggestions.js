import express from "express";

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 3;
const submissionsByIp = new Map();

function escapeHtml(value = ""){
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

async function sendSuggestionEmail({ email, suggestion }){
  const missing = [!process.env.RESEND_API_KEY && "RESEND_API_KEY"].filter(Boolean);
  if (missing.length) throw new Error(`Email delivery setup is incomplete (${missing.join(", ")}).`);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || "hello@jobkhojoai.com",
      to: ["hello@jobkhojoai.com"],
      subject: "New job post suggestion for JobKhojo",
      reply_to: email,
      html: `<div style="font-family:Arial,sans-serif;color:#0f172a;max-width:640px;margin:auto"><h1 style="color:#2563eb">New job post suggestion</h1><p><strong>From:</strong> ${escapeHtml(email)}</p><h2>Job details or suggestion</h2><p style="white-space:pre-wrap">${escapeHtml(suggestion)}</p></div>`,
      text: `New job post suggestion\n\nFrom: ${email}\n\nJob details or suggestion:\n${suggestion}`,
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Suggestion email delivery failed:", response.status, detail.slice(0, 400));
    throw new Error("Email provider could not send the suggestion.");
  }
}

router.post("/", async (req, res) => {
  const website = String(req.body?.website || "").trim();
  if (website) return res.json({ message: "Suggestion sent." });

  const email = String(req.body?.email || "").trim().toLowerCase();
  const suggestion = String(req.body?.suggestion || "").trim();
  if (!EMAIL_RE.test(email) || email.length > 254) return res.status(400).json({ message: "Enter a valid email address." });
  if (suggestion.length < 10 || suggestion.length > 5000) {
    return res.status(400).json({ message: "Please provide at least 10 characters and no more than 5,000 characters." });
  }

  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  if (submissionsByIp.size > 1000) {
    for (const [address, timestamps] of submissionsByIp) {
      if (!timestamps.some(timestamp => now - timestamp < WINDOW_MS)) submissionsByIp.delete(address);
    }
  }
  const recent = (submissionsByIp.get(ip) || []).filter(timestamp => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return res.status(429).json({ message: "Please wait a few minutes before sending another suggestion." });
  recent.push(now);
  submissionsByIp.set(ip, recent);

  try {
    await sendSuggestionEmail({ email, suggestion });
    return res.json({ message: "Suggestion sent." });
  } catch (error) {
    recent.pop();
    submissionsByIp.set(ip, recent);
    console.error("Job suggestion submission failed:", error.message);
    return res.status(503).json({ message: "We couldn't send your suggestion right now. Please try again later." });
  }
});

export default router;
