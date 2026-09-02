import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireUser } from "../middleware/auth.js";

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(user) {
  return jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Name is required." });
    if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ message: "A valid email is required." });
    if (!password || password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: "An account with this email already exists." });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), passwordHash });

    res.status(201).json({ token: signToken(user), name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Could not create account", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    res.json({ token: signToken(user), name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Could not log in", error: err.message });
  }
});

router.get("/me/resume", requireUser, async (req, res) => {
  const user = await User.findById(req.userId).select("resumeDraft");
  if (!user) return res.status(404).json({ message: "Account not found" });
  res.json({ resumeDraft: user.resumeDraft || null });
});

router.put("/me/resume", requireUser, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.userId,
    { resumeDraft: req.body },
    { new: true }
  ).select("resumeDraft");
  if (!user) return res.status(404).json({ message: "Account not found" });
  res.json({ resumeDraft: user.resumeDraft });
});

export default router;
