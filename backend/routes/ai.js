import express from "express";
import Job from "../models/Job.js";
import { publicJobFilter } from "../utils/publicJobs.js";

const router = express.Router();

const SYSTEM_PROMPT_BASE = `You are "Ask JobKhojo", the assistant embedded on JobKhojo (https://jobkhojoai.com) — a job discovery site for freshers and early-career professionals in India, strongest in software/IT roles, internships and remote-friendly jobs.

What the site offers:
- Search and filter all jobs at /jobs (keyword, location or "remote", job type, work mode, experience, date posted). Internships: /jobs?type=internship.
- Each job page shows the role, requirements, location, experience and a clearly labelled apply button that goes to the original posting (company site, LinkedIn, Naukri, etc.) — JobKhojo does not collect applications and never charges candidates.
- Users can save a job with the bookmark button and see saved jobs at /saved-jobs (header: "Saved").
- Career paths at /career-paths: step-by-step learning paths (Frontend, Backend, Full Stack, AI, ML, Data Science, DevOps, Cloud, UI/UX, QA, Cyber Security, Mobile Development) with project ideas.
- Career guides at /career-insights, interview preparation at /career-guide/interview-tips, and a free resume builder at /career-guide/resume-builder.
- About, Contact, Privacy and Terms are linked in the footer. Contact: hello@jobkhojoai.com or Instagram @jobkhojoAI.

Answer only questions about jobkhojoAI, its job listings, roadmaps, or general job-search/career advice. Keep answers concise and friendly, using the live job listings below when relevant. Never invent job listings that aren't in the data provided to you, and never discuss internal admin tooling, credentials, or backend implementation details.`;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;
const requestLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

router.post("/chat", async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ message: "The AI assistant isn't configured yet." });
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;
  if (isRateLimited(ip)) {
    return res.status(429).json({ message: "Too many requests — please wait a moment and try again." });
  }

  const { message, history } = req.body;
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ message: "Message is required." });
  }
  if (message.length > 500) {
    return res.status(400).json({ message: "Message is too long (max 500 characters)." });
  }

  try {
    const jobs = await Job.find(publicJobFilter())
      .sort({ createdAt: -1 })
      .limit(40)
      .select("title organization category remote location salaryMin slug");

    const jobsList = jobs
      .map((j) => `- ${j.title} at ${j.organization} (${j.category}${j.remote ? ", Remote" : ""}, ${j.location})${j.salaryMin ? ` — ${j.salaryMin}` : ""} [/jobs/${j.slug}]`)
      .join("\n");

    const systemPrompt = `${SYSTEM_PROMPT_BASE}\n\nCurrently active job listings:\n${jobsList || "No active listings right now."}`;

    const contents = [
      ...(Array.isArray(history)
        ? history.slice(-10).map((h) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: String(h.text || "").slice(0, 1000) }],
          }))
        : []),
      { role: "user", parts: [{ text: message.trim() }] },
    ];

    const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const geminiBody = JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 500, temperature: 0.6 },
    });

    // The free-tier model occasionally returns a transient 503 under load —
    // one short retry smooths that over instead of surfacing it to the user.
    let geminiRes = await fetch(geminiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: geminiBody });
    if (geminiRes.status === 503) {
      await new Promise((r) => setTimeout(r, 1200));
      geminiRes = await fetch(geminiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: geminiBody });
    }

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);
      const message = geminiRes.status === 503
        ? "The AI is getting a lot of requests right now — please try again in a few seconds."
        : "The AI assistant is temporarily unavailable.";
      return res.status(502).json({ message });
    }

    const data = await geminiRes.json();
    const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "Sorry, I couldn't come up with an answer to that.";
    res.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ message: "Something went wrong talking to the AI assistant." });
  }
});

export default router;
