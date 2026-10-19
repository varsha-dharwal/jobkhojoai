import express from "express";
import Message from "../models/Message.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = ["general", "job-report", "correction", "partnership"];

// Simple per-IP limit so the form can't be used to flood the inbox.
const recent = new Map();
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

function tooMany(ip) {
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter(t => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > LIMIT;
}

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, topic, pageUrl, message, website } = req.body || {};
    // "website" is a hidden field people never see; bots fill it in.
    if (website) return res.status(201).json({ message: "Thanks — we'll get back to you." });
    if (tooMany(req.ip)) return res.status(429).json({ message: "Too many messages. Please try again in an hour." });

    if (typeof name !== "string" || !name.trim()) return res.status(400).json({ message: "Please enter your name." });
    if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) return res.status(400).json({ message: "Please enter a valid email address." });
    if (typeof message !== "string" || message.trim().length < 10) {
      return res.status(400).json({ message: "Please write a message of at least 10 characters." });
    }

    await Message.create({
      name: name.slice(0, 100),
      email: email.slice(0, 200),
      topic: TOPICS.includes(topic) ? topic : "general",
      pageUrl: typeof pageUrl === "string" ? pageUrl.slice(0, 500) : "",
      message: message.slice(0, 5000),
    });
    res.status(201).json({ message: "Thanks — we'll get back to you." });
  } catch (err) {
    res.status(500).json({ message: "Could not send your message. Please email us instead.", error: err.message });
  }
});

// ---------- ADMIN ----------

router.get("/", requireAdmin, async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 }).limit(500);
  res.json(messages);
});

router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { handled: !!req.body.handled }, { new: true });
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.json(msg);
  } catch (err) {
    res.status(400).json({ message: "Could not update message", error: err.message });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id);
  if (!msg) return res.status(404).json({ message: "Message not found" });
  res.json({ message: "Message deleted" });
});

export default router;
