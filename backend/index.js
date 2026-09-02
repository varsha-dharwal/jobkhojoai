import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import zlib from "zlib";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import aiRoutes from "./routes/ai.js";
import userRoutes from "./routes/users.js";
import resumeAiRoutes from "./routes/resumeAi.js";

dotenv.config();

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

const allowedOrigins = (process.env.CLIENT_URL || "*")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins.includes("*")
      ? "*"
      : (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) callback(null, true);
          else callback(new Error("Not allowed by CORS"));
        },
  })
);
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "jobkhojoAI API running" }));
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resume-ai", resumeAiRoutes);

// 404 fallback for unknown API routes
app.use("/api", (req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
