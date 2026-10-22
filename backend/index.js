import "dotenv/config";
import express from "express";
import cors from "cors";
import zlib from "zlib";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import aiRoutes from "./routes/ai.js";
import userRoutes from "./routes/users.js";
import resumeAiRoutes from "./routes/resumeAi.js";
import contactRoutes from "./routes/contact.js";
import alertRoutes, { sendDailyJobDigest } from "./routes/alerts.js";
import suggestionRoutes from "./routes/suggestions.js";
import creatorSupportRoutes from "./routes/creatorSupport.js";
import { runJobLifecycle } from "./services/jobLifecycle.js";

if (!process.env.JWT_SECRET) {
  console.error("Backend startup failed: JWT_SECRET is not configured. Set it in backend/.env.");
  process.exit(1);
}

const app = express();

// Gzip JSON responses when the client supports it — cuts payload size for the
// jobs list/AI replies without pulling in the `compression` package.
app.use((req, res, next) => {
  if (!(req.headers["accept-encoding"] || "").includes("gzip")) return next();
  const originalSend = res.send.bind(res);
  res.send = (body) => {
    if (typeof body !== "string" && !Buffer.isBuffer(body)) return originalSend(body);
    zlib.gzip(Buffer.isBuffer(body) ? body : Buffer.from(body), (err, compressed) => {
      if (err) return originalSend(body);
      res.set("Content-Encoding", "gzip");
      res.set("Vary", "Accept-Encoding");
      originalSend(compressed);
    });
  };
  next();
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "https://jobkhojoai.com",
  "https://www.jobkhojoai.com",
  "https://jobkhojoai.pages.dev",
  "https://www.jobkhojoai.pages.dev",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || /jobkhojoai\.(com|pages\.dev)$/.test(origin) || /localhost:\d+$/.test(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
// Render sits behind a proxy; this makes req.ip the visitor's address (used for rate limits).
app.set("trust proxy", 1);
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "jobkhojoAI API running" }));
app.get("/api/health", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "unavailable", database: "disconnected" });
  }
});
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resume-ai", resumeAiRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/creator-support", creatorSupportRoutes);

// 404 fallback for unknown API routes
app.use("/api", (req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  runJobLifecycle()
    .then(({ expired, reminded }) => {
      if (expired || reminded) console.log(`Job lifecycle complete: ${expired} expired, ${reminded} reminders sent.`);
    })
    .catch((error) => console.error("Initial job lifecycle run failed:", error.message));
  let lastDigestDay = "";
  let lastLifecycleDay = "";
  setInterval(async () => {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: process.env.DIGEST_TIME_ZONE || "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    const value = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    const day = `${value.year}-${value.month}-${value.day}`;
    const sendHour = Number(process.env.DIGEST_HOUR ?? 9);
    if (value.hour === String(sendHour).padStart(2, "0") && value.minute === "00" && lastDigestDay !== day) {
      lastDigestDay = day;
      try { await sendDailyJobDigest(); }
      catch (error) { console.error("Daily job digest failed:", error.message); }
    }
    if (value.hour === String(sendHour).padStart(2, "0") && value.minute === "00" && lastLifecycleDay !== day) {
      lastLifecycleDay = day;
      try {
        const { expired, reminded } = await runJobLifecycle();
        if (expired || reminded) console.log(`Job lifecycle complete: ${expired} expired, ${reminded} reminders sent.`);
      } catch (error) { console.error("Daily job lifecycle failed:", error.message); }
    }
  }, 60_000);
});
