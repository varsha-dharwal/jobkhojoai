import express from "express";
import { createHash, randomBytes, randomInt } from "node:crypto";
import JobAlertSubscriber from "../models/JobAlertSubscriber.js";
import { sendEmail } from "../services/emailDelivery.js";

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hash = (value) => createHash("sha256").update(value).digest("hex");
// OAuth web client IDs are public identifiers; keep the environment override for other deployments.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "868093988992-qj56h39hgj75oo8euq56s2bduif4vpco.apps.googleusercontent.com";

function emailTemplate(jobs, unsubscribeUrl) {
  const lines = jobs.map((job) => `<li style="margin:0 0 18px"><strong>${escapeHtml(job.title)}</strong> at ${escapeHtml(job.organization || "Employer")}<br><a href="${process.env.PUBLIC_SITE_URL || "https://jobkhojoai.com"}/jobs/${encodeURIComponent(job.slug)}">View job</a></li>`).join("");
  const plain = jobs.map((job) => `${job.title} at ${job.organization || "Employer"}: ${process.env.PUBLIC_SITE_URL || "https://jobkhojoai.com"}/jobs/${job.slug}`).join("\n");
  return {
    html: `<div style="font-family:Arial,sans-serif;color:#0f172a;max-width:600px;margin:auto"><h1 style="color:#2563eb">New jobs on JobKhojo</h1><p>Here are recent openings you may be interested in:</p><ul>${lines}</ul><p style="color:#64748b;font-size:13px">You subscribed to daily job updates. <a href="${unsubscribeUrl}">Unsubscribe</a></p></div>`,
    text: `New jobs on JobKhojo\n\n${plain}\n\nUnsubscribe: ${unsubscribeUrl}`,
  };
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

async function findOrCreate(email) {
  return JobAlertSubscriber.findOneAndUpdate(
    { email },
    { $setOnInsert: { email, unsubscribeToken: randomBytes(24).toString("hex") } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

router.post("/send-code", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: "Enter a valid email address." });
    const subscriber = await findOrCreate(email);
    if (subscriber.codeSentAt && Date.now() - subscriber.codeSentAt.getTime() < 60_000) {
      return res.status(429).json({ message: "Please wait a minute before requesting another code." });
    }
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const expiry = new Date(Date.now() + 10 * 60_000);
    await sendEmail({
      to: email, subject: "Your JobKhojo verification code",
      html: `<div style="font-family:Arial,sans-serif;color:#0f172a"><h2>Verify your email</h2><p>Your JobKhojo code is:</p><p style="font-size:28px;font-weight:bold;letter-spacing:6px;color:#2563eb">${code}</p><p>This code expires in 10 minutes. If you didn't request it, ignore this email.</p></div>`,
      text: `Your JobKhojo verification code is ${code}. It expires in 10 minutes.`,
    });
    subscriber.codeHash = hash(`${email}:${code}`);
    subscriber.codeExpiresAt = expiry;
    subscriber.codeSentAt = new Date();
    subscriber.codeAttempts = 0;
    await subscriber.save();
    res.json({ message: "Verification code sent." });
  } catch (error) {
    res.status(503).json({ message: error.message || "Could not send a verification code." });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const code = String(req.body.code || "").trim();
    if (!EMAIL_RE.test(email) || !/^\d{6}$/.test(code)) return res.status(400).json({ message: "Enter the 6-digit code from your email." });
    const subscriber = await JobAlertSubscriber.findOne({ email });
    if (!subscriber || !subscriber.codeExpiresAt || subscriber.codeExpiresAt < new Date()) {
      return res.status(400).json({ message: "That code is incorrect or expired. Request a new one and try again." });
    }
    if (subscriber.codeAttempts >= 5) return res.status(429).json({ message: "Too many incorrect attempts. Request a new code and try again." });
    if (subscriber.codeHash !== hash(`${email}:${code}`)) {
      subscriber.codeAttempts += 1;
      await subscriber.save();
      return res.status(400).json({ message: "That code is incorrect or expired. Request a new one and try again." });
    }
    subscriber.verified = true; subscriber.subscribed = true; subscriber.consentedAt = new Date();
    subscriber.codeHash = ""; subscriber.codeExpiresAt = null; subscriber.codeAttempts = 0;
    await subscriber.save();
    res.json({ message: "Email verified and daily job alerts enabled." });
  } catch {
    res.status(500).json({ message: "Could not verify your email." });
  }
});

router.post("/google", async (req, res) => {
  try {
    const credential = String(req.body.credential || "");
    if (!credential) return res.status(503).json({ message: "Google sign-in is not configured on the server. Set GOOGLE_CLIENT_ID to the web client ID." });
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    if (!response.ok) return res.status(401).json({ message: "Google sign-in could not be verified. Please try again." });
    const profile = await response.json();
    if (profile.aud !== GOOGLE_CLIENT_ID || profile.email_verified !== "true" || !EMAIL_RE.test(profile.email || "")) {
      return res.status(401).json({ message: "Please use a verified Google email address." });
    }
    const subscriber = await findOrCreate(profile.email.trim().toLowerCase());
    subscriber.name = profile.name || subscriber.name;
    subscriber.verified = true; subscriber.subscribed = true; subscriber.consentedAt = new Date();
    await subscriber.save();
    res.json({ message: "Google email verified and daily job alerts enabled." });
  } catch {
    res.status(500).json({ message: "Could not complete Google sign-in." });
  }
});

router.get("/unsubscribe/:token", async (req, res) => {
  const subscriber = await JobAlertSubscriber.findOneAndUpdate({ unsubscribeToken: req.params.token }, { subscribed: false });
  res.type("html").send(subscriber
    ? "<main style='font-family:Arial,sans-serif;max-width:560px;margin:12vh auto;padding:24px;color:#0f172a'><h1>You are unsubscribed</h1><p>You will no longer receive JobKhojo daily job alerts.</p></main>"
    : "<main style='font-family:Arial,sans-serif;max-width:560px;margin:12vh auto;padding:24px;color:#0f172a'><h1>Link unavailable</h1><p>This unsubscribe link is invalid.</p></main>");
});

export async function sendDailyJobDigest(){
  if (!process.env.RESEND_API_KEY) return;
  const now = new Date();
  const jobs = await (await import("../models/Job.js")).default.find({ status: "active", createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60_000), $lte: now } }).sort({ createdAt: -1 }).limit(30).lean();
  if (!jobs.length) return;
  const subscribers = await JobAlertSubscriber.find({ verified: true, subscribed: true }).lean();
  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${process.env.API_PUBLIC_URL || "https://jobkhojoai-backend.onrender.com/api"}/alerts/unsubscribe/${subscriber.unsubscribeToken}`;
    const content = emailTemplate(jobs, unsubscribeUrl);
    try { await sendEmail({ to: subscriber.email, subject: `${jobs.length} new jobs on JobKhojo`, ...content }); }
    catch (error) { console.error(`Job digest failed for ${subscriber.email}:`, error.message); }
  }
}

export default router;
