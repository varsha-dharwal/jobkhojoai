import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Single-admin login. No signup route on purpose — only you should have access.
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, email });
});

export default router;
