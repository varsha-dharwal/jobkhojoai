import express from "express";
import Job from "../models/Job.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

function makeSlug(title, organization) {
  return `${title}-${organization}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    + "-" + Date.now().toString().slice(-5);
}

// ---------- PUBLIC ----------

// GET /api/jobs?category=Full-time&remote=true&search=react&company=Amazon&limit=4
// "search" matches across title, organization, and skills (one box, three targets).
router.get("/", async (req, res) => {
  try {
    const { category, remote, search, company, limit } = req.query;
    const filter = { status: "active" };
    if (category && category !== "All") filter.category = category;
    if (remote === "true") filter.remote = true;
    if (company) filter.organization = company;
    if (search) filter.$text = { $search: search };

    let query = Job.find(filter).sort({ createdAt: -1 });
    if (limit) query = query.limit(Number(limit));
    const jobs = await query;
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Could not load jobs", error: err.message });
  }
});

// GET /api/jobs/meta/companies -> distinct organizations from active jobs, most active first
router.get("/meta/companies", async (req, res) => {
  try {
    const companies = await Job.aggregate([
      { $match: { status: "active" } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$organization", jobCount: { $sum: 1 }, logoUrl: { $first: "$logoUrl" } } },
      { $sort: { jobCount: -1 } },
      { $limit: 12 },
      { $project: { _id: 0, organization: "$_id", jobCount: 1, logoUrl: 1 } },
    ]);
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: "Could not load companies", error: err.message });
  }
});

// GET /api/jobs/:slug
router.get("/:slug", async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Could not load job", error: err.message });
  }
});

// ---------- ADMIN (protected) ----------

// GET /api/jobs/admin/all -> everything, including expired
router.get("/admin/all", requireAdmin, async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
});

// POST /api/jobs
router.post("/", requireAdmin, async (req, res) => {
  try {
    const body = req.body;
    const job = await Job.create({
      ...body,
      slug: makeSlug(body.title, body.organization),
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: "Could not create job", error: err.message });
  }
});

// PUT /api/jobs/:id
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: "Could not update job", error: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete("/:id", requireAdmin, async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json({ message: "Job deleted" });
});

export default router;
