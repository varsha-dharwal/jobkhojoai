import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();

const app = express();

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

// 404 fallback for unknown API routes
app.use("/api", (req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
