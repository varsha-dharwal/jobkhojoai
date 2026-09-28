import express from "express";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Job from "../models/Job.js";
import EmailVerification from "../models/EmailVerification.js";
import UserActivity from "../models/UserActivity.js";
import Notification from "../models/Notification.js";
import { requireUser } from "../middleware/auth.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../services/email.js";

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isObjectId(value) {
  return /^[a-f\d]{24}$/i.test(value);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getResumeTerms(resume) {
  if (!resume || typeof resume !== "object") return [];
  const terms = new Set();
  const add = (value) => {
    if (typeof value !== "string") return;
    const term = value.trim().replace(/\s+/g, " ");
    if (term.length >= 2 && term.length <= 80) terms.add(term);
  };

  add(resume.personal?.targetTitle);
  Object.values(resume.skills || {}).forEach((values) => {
    (Array.isArray(values) ? values : [values]).forEach(add);
  });
  (Array.isArray(resume.projects) ? resume.projects : []).forEach((project) => {
    add(project?.tech);
    (Array.isArray(project?.technologies) ? project.technologies : []).forEach(add);
  });
  return [...terms].slice(0, 40);
}

function cleanString(value, maxLength = 160) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanStringList(value, maxItems = 30, maxLength = 80) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => cleanString(item, maxLength)).filter(Boolean))].slice(0, maxItems);
}

function cleanProfileEntries(value, fields) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 20).map((entry) => {
    const cleaned = {};
    for (const [field, maxLength] of Object.entries(fields)) cleaned[field] = cleanString(entry?.[field], maxLength);
    if (fields.current) cleaned.current = Boolean(entry?.current);
    if (!cleaned.title && !cleaned.degree && !cleaned.company && !cleaned.school) return null;
    return cleaned;
  }).filter(Boolean);
}

function profileResponse(user) {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location || "",
    profileVisible: user.profileVisible !== false,
    profileSummary: user.profileSummary || "",
    currentSalary: user.currentSalary ?? null,
    workExperience: user.workExperience || [],
    educationHistory: user.educationHistory || [],
    preferences: user.preferences || {},
    resumeDraft: user.resumeDraft || null,
    resumeFile: user.resumeFile ? {
      fileName: user.resumeFile.fileName,
      mimeType: user.resumeFile.mimeType,
      size: user.resumeFile.size,
      uploadedAt: user.resumeFile.uploadedAt,
    } : null,
  };
}

async function findUserWithJobs(userId) {
  return User.findById(userId)
    .populate("savedJobs.job")
    .populate("applications.job");
}

function signToken(user) {
  return jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

function normalizePhone(value) {
  const input = String(value || "").trim();
  const compact = input.replace(/[\s()-]/g, "");
  if (/^\d{10}$/.test(compact)) return `+91${compact}`;
  return /^\+[1-9]\d{7,14}$/.test(compact) ? compact : "";
}

function makeCodeHash(email, purpose, code) {
  return crypto.createHash("sha256").update(`${email}:${purpose}:${code}:${process.env.JWT_SECRET || ""}`).digest("hex");
}

async function sendCode(req, res, purpose) {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: "Enter a valid email address." });
    const existingUser = await User.findOne({ email });
    if (purpose === "signup") {
      if (!req.body.name?.trim()) return res.status(400).json({ message: "Name is required." });
      const phone = normalizePhone(req.body.phone);
      if (!phone) return res.status(400).json({ message: "Enter a valid phone number with country code, or a 10-digit Indian mobile number." });
      if (existingUser) return res.status(409).json({ message: "An account with this email already exists. Sign in instead." });
      req.signupData = { name: req.body.name.trim().slice(0, 100), phone };
    } else if (!existingUser) {
      return res.status(404).json({ message: "No account was found for this email. Create an account first." });
    }

    const previous = await EmailVerification.findOne({ email, purpose });
    if (previous && Date.now() - previous.sentAt.getTime() < 60_000) {
      return res.status(429).json({ message: "Please wait a minute before requesting another code." });
    }

    const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
    await EmailVerification.findOneAndUpdate(
      { email, purpose },
      {
        email, purpose, codeHash: makeCodeHash(email, purpose, code),
        name: req.signupData?.name || "", phone: req.signupData?.phone || "",
        attempts: 0, sentAt: new Date(), expiresAt: new Date(Date.now() + 10 * 60_000),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    try {
      await sendVerificationEmail(email, code);
    } catch (mailError) {
      await EmailVerification.deleteOne({ email, purpose });
      console.error("Could not send email verification code:", mailError.message);
      if (mailError.code === "EMAIL_NOT_CONFIGURED") {
        return res.status(503).json({ message: "Email verification is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL in backend/.env, then restart the backend." });
      }
      if (mailError.code === "EMAIL_PROVIDER_REJECTED") {
        return res.status(503).json({ message: "The email provider rejected this message. Check that RESEND_FROM_EMAIL uses a verified sender domain." });
      }
      return res.status(503).json({ message: "We could not send the verification email. Check the backend email provider settings and try again." });
    }
    return res.json({ sent: true, email, expiresIn: 600 });
  } catch (err) {
    return res.status(500).json({ message: "Could not send verification code", error: err.message });
  }
}

async function verifyCode(req, res, purpose) {
  try {
    const email = String(req.body.email || "").toLowerCase().trim();
    const code = String(req.body.code || "").trim();
    if (!EMAIL_RE.test(email) || !/^\d{6}$/.test(code)) return res.status(400).json({ message: "Enter your email and the 6-digit verification code." });

    const challenge = await EmailVerification.findOne({ email, purpose });
    if (!challenge || challenge.expiresAt <= new Date()) {
      if (challenge) await challenge.deleteOne();
      return res.status(400).json({ message: "That code expired. Request a new verification code." });
    }
    if (challenge.attempts >= 5) {
      await challenge.deleteOne();
      return res.status(429).json({ message: "Too many incorrect attempts. Request a new code." });
    }
    const expected = Buffer.from(challenge.codeHash, "hex");
    const actual = Buffer.from(makeCodeHash(email, purpose, code), "hex");
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
      challenge.attempts += 1;
      await challenge.save();
      return res.status(400).json({ message: "That code is not correct. Check the email and try again." });
    }

    let user;
    if (purpose === "signup") {
      if (await User.exists({ email })) {
        await challenge.deleteOne();
        return res.status(409).json({ message: "An account with this email already exists. Sign in instead." });
      }
      user = await User.create({ name: challenge.name, email, phone: challenge.phone, emailVerified: true });
    } else {
      user = await User.findOne({ email });
      if (!user) {
        await challenge.deleteOne();
        return res.status(404).json({ message: "No account was found for this email. Create an account first." });
      }
      user.emailVerified = true;
      await user.save();
    }
    await challenge.deleteOne();

    let welcomeEmailSent = Boolean(user.welcomeEmailSent);
    if (!welcomeEmailSent) {
      try {
        await sendWelcomeEmail(user.email, user.name);
        user.welcomeEmailSent = true;
        await user.save();
        welcomeEmailSent = true;
      } catch (mailError) {
        console.error("Could not send welcome email:", mailError.message);
      }
    }
    return res.json({
      token: signToken(user), name: user.name, email: user.email, phone: user.phone,
      welcomeEmailSent,
    });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "An account with this email already exists. Sign in instead." });
    return res.status(500).json({ message: "Could not verify email", error: err.message });
  }
}

router.post("/signup/request-code", (req, res) => sendCode(req, res, "signup"));
router.post("/signup/verify-code", (req, res) => verifyCode(req, res, "signup"));
router.post("/login/request-code", (req, res) => sendCode(req, res, "login"));
router.post("/login/verify-code", (req, res) => verifyCode(req, res, "login"));

// Password-based signup is retired; new accounts must verify their email.
router.post("/register", (_req, res) => res.status(410).json({ message: "Use email verification to create an account." }));

router.post("/login", (_req, res) => res.status(410).json({ message: "Use email verification to sign in." }));

router.get("/me/resume", requireUser, async (req, res) => {
  const user = await User.findById(req.userId).select("resumeDraft");
  if (!user) return res.status(404).json({ message: "Account not found" });
  res.json({ resumeDraft: user.resumeDraft || null });
});

router.post("/me/visit", requireUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("_id createdAt");
    if (!user) return res.status(404).json({ message: "Account not found" });
    const hasPriorVisit = await UserActivity.exists({ user: user._id, type: "visit" });
    const accountAgeMs = Date.now() - new Date(user.createdAt).getTime();
    await UserActivity.create({ user: user._id, type: "visit", isReturn: Boolean(hasPriorVisit) || accountAgeMs >= 30 * 60 * 1000 });
    res.status(201).json({ tracked: true });
  } catch (err) {
    res.status(500).json({ message: "Could not record visit", error: err.message });
  }
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

router.get("/me/profile", requireUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "name email phone location profileVisible profileSummary currentSalary workExperience educationHistory preferences resumeDraft resumeFile.fileName resumeFile.mimeType resumeFile.size resumeFile.uploadedAt"
    );
    if (!user) return res.status(404).json({ message: "Account not found" });
    res.json({ profile: profileResponse(user) });
  } catch (err) {
    res.status(500).json({ message: "Could not load your profile", error: err.message });
  }
});

router.put("/me/profile", requireUser, async (req, res) => {
  try {
    const body = req.body || {};
    const updates = {};
    if (body.name !== undefined) {
      const name = cleanString(body.name, 100);
      if (!name) return res.status(400).json({ message: "Name is required." });
      updates.name = name;
    }
    if (body.phone !== undefined) {
      const inputPhone = cleanString(body.phone, 30);
      const normalizedPhone = normalizePhone(inputPhone);
      if (inputPhone && !normalizedPhone) return res.status(400).json({ message: "Enter a valid phone number." });
      updates.phone = normalizedPhone;
    }
    if (body.location !== undefined) updates.location = cleanString(body.location, 120);
    if (body.profileVisible !== undefined) updates.profileVisible = Boolean(body.profileVisible);
    if (body.profileSummary !== undefined) updates.profileSummary = cleanString(body.profileSummary, 2000);
    if (body.currentSalary !== undefined) {
      const salary = body.currentSalary === "" || body.currentSalary === null ? null : Number(body.currentSalary);
      if (salary !== null && (!Number.isFinite(salary) || salary < 0 || salary > 1_000_000_000)) {
        return res.status(400).json({ message: "Enter a valid salary amount." });
      }
      updates.currentSalary = salary;
    }
    if (body.workExperience !== undefined) {
      updates.workExperience = cleanProfileEntries(body.workExperience, {
        title: 120, company: 120, location: 120, employmentType: 60,
        startDate: 40, endDate: 40, description: 1600, current: true,
      });
    }
    if (body.educationHistory !== undefined) {
      updates.educationHistory = cleanProfileEntries(body.educationHistory, {
        degree: 120, school: 160, location: 120, startDate: 40, endDate: 40, description: 1000,
      });
    }
    if (body.preferences && typeof body.preferences === "object") {
      const value = body.preferences;
      const payPeriod = ["year", "month", "hour"].includes(value.payPeriod) ? value.payPeriod : "year";
      const remotePreference = ["any", "remote", "on-site"].includes(value.remotePreference) ? value.remotePreference : "any";
      const minimumPay = value.minimumPay === "" || value.minimumPay === null || value.minimumPay === undefined ? null : Number(value.minimumPay);
      if (minimumPay !== null && (!Number.isFinite(minimumPay) || minimumPay < 0 || minimumPay > 1_000_000_000)) {
        return res.status(400).json({ message: "Enter a valid minimum pay amount." });
      }
      const jobTypes = cleanStringList(value.jobTypes, 10, 40).filter((item) => ["Full-time", "Part-time", "Internship", "Contract", "Temporary"].includes(item));
      updates.preferences = {
        readyToWork: value.readyToWork !== false,
        desiredTitles: cleanStringList(value.desiredTitles, 20, 100),
        jobTypes,
        workSchedules: cleanStringList(value.workSchedules, 10, 60),
        minimumPay,
        payPeriod,
        relocationLocations: cleanStringList(value.relocationLocations, 20, 100),
        remotePreference,
        countries: cleanStringList(value.countries, 20, 80),
        languages: cleanStringList(value.languages, 20, 80),
        notInterested: cleanStringList(value.notInterested, 20, 80),
      };
    }

    const user = await User.findByIdAndUpdate(req.userId, { $set: updates }, { new: true, runValidators: true })
      .select("name email phone location profileVisible profileSummary currentSalary workExperience educationHistory preferences resumeDraft resumeFile.fileName resumeFile.mimeType resumeFile.size resumeFile.uploadedAt");
    if (!user) return res.status(404).json({ message: "Account not found" });
    res.json({ profile: profileResponse(user) });
  } catch (err) {
    res.status(500).json({ message: "Could not save your profile", error: err.message });
  }
});

const MAX_RESUME_BYTES = 4 * 1024 * 1024;

router.post("/me/resume-file", requireUser, async (req, res) => {
  try {
    const fileName = cleanString(req.body?.fileName, 120).replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_") || "resume.pdf";
    const dataUrl = String(req.body?.data || "");
    const match = dataUrl.match(/^data:application\/pdf;base64,([A-Za-z0-9+/]+=*)$/);
    if (!match) return res.status(400).json({ message: "Please upload a valid PDF file." });

    const fileBuffer = Buffer.from(match[1], "base64");
    if (!fileBuffer.length || fileBuffer.length > MAX_RESUME_BYTES) {
      return res.status(400).json({ message: "Your PDF must be smaller than 4 MB." });
    }
    if (fileBuffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
      return res.status(400).json({ message: "This file does not appear to be a valid PDF." });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Account not found" });
    user.resumeFile = {
      fileName,
      mimeType: "application/pdf",
      size: fileBuffer.length,
      data: dataUrl,
      uploadedAt: new Date(),
    };
    await user.save();
    res.status(201).json({ resumeFile: profileResponse(user).resumeFile });
  } catch (err) {
    res.status(500).json({ message: "Could not upload your resume", error: err.message });
  }
});

router.get("/me/resume-file", requireUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("+resumeFile.data resumeFile.fileName resumeFile.mimeType");
    if (!user?.resumeFile?.data) return res.status(404).json({ message: "No resume has been uploaded." });
    const encoded = user.resumeFile.data.split(",", 2)[1];
    const fileBuffer = Buffer.from(encoded, "base64");
    res.set("Content-Type", "application/pdf");
    res.set("Content-Length", String(fileBuffer.length));
    res.set("Content-Disposition", `attachment; filename="${user.resumeFile.fileName}"`);
    res.send(fileBuffer);
  } catch (err) {
    res.status(500).json({ message: "Could not download your resume", error: err.message });
  }
});

router.delete("/me/resume-file", requireUser, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, { $set: { resumeFile: null } }, { new: true }).select("_id");
    if (!user) return res.status(404).json({ message: "Account not found" });
    res.json({ removed: true });
  } catch (err) {
    res.status(500).json({ message: "Could not remove your resume", error: err.message });
  }
});

router.get("/me/notifications", requireUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("resumeDraft");
    if (!user) return res.status(404).json({ message: "Account not found" });

    const terms = getResumeTerms(user.resumeDraft);
    if (!terms.length) {
      return res.json({ notifications: [], unreadCount: 0, hasResume: false, skills: [] });
    }

    const search = { $or: [] };
    for (const term of terms) {
      const regex = new RegExp(escapeRegex(term), "i");
      search.$or.push({ title: regex }, { skills: regex }, { roleDescription: regex }, { requirements: regex });
    }
    const jobs = await Job.find({ status: "active", ...search })
      .select("title organization logoUrl category remote location salaryMin salaryMax experience skills roleDescription requirements slug createdAt")
      .sort({ createdAt: -1 });

    if (jobs.length) {
      const syncMatches = () => Notification.bulkWrite(jobs.map((job) => {
        const searchable = [job.title, job.skills, job.roleDescription, job.requirements].filter(Boolean).join(" ").toLowerCase();
        const matchedSkills = terms.filter((term) => searchable.includes(term.toLowerCase()));
        return {
          updateOne: {
            filter: { user: user._id, job: job._id },
            update: {
              $set: { matchedSkills },
              $setOnInsert: { user: user._id, job: job._id, type: "job_match", readAt: null },
            },
            upsert: true,
          },
        };
      }));
      try {
        await syncMatches();
      } catch (err) {
        const duplicateKey = err.code === 11000 || err.writeErrors?.some((item) => item.code === 11000);
        if (!duplicateKey) throw err;
        // Concurrent navbar and page loads can try to create the same user's job match.
        await syncMatches();
      }
    }

    const matchingJobIds = jobs.map((job) => job._id);
    const query = matchingJobIds.length ? { user: user._id, job: { $in: matchingJobIds } } : { user: user._id, job: { $in: [] } };
    const [notifications, unreadCount] = await Promise.all([
      req.query.summary === "true"
        ? Promise.resolve([])
        : Notification.find(query).sort({ createdAt: -1 }).populate({
          path: "job",
          select: "title organization logoUrl category remote location salaryMin salaryMax experience slug",
        }),
      Notification.countDocuments({ ...query, readAt: null }),
    ]);

    res.json({
      notifications: notifications.filter((item) => item.job).map((item) => ({
        _id: item._id,
        type: item.type,
        matchedSkills: item.matchedSkills,
        readAt: item.readAt,
        createdAt: item.createdAt,
        job: item.job,
      })),
      unreadCount,
      hasResume: true,
      skills: terms,
    });
  } catch (err) {
    res.status(500).json({ message: "Could not load notifications", error: err.message });
  }
});

router.patch("/me/notifications/read-all", requireUser, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.userId, readAt: null }, { $set: { readAt: new Date() } });
    res.json({ markedRead: true });
  } catch (err) {
    res.status(500).json({ message: "Could not update notifications", error: err.message });
  }
});

router.patch("/me/notifications/:id/read", requireUser, async (req, res) => {
  if (!isObjectId(req.params.id)) return res.status(400).json({ message: "Invalid notification id" });
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: { readAt: new Date() } },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json({ readAt: notification.readAt });
  } catch (err) {
    res.status(500).json({ message: "Could not update notification", error: err.message });
  }
});

router.patch("/me/notifications/:id/unread", requireUser, async (req, res) => {
  if (!isObjectId(req.params.id)) return res.status(400).json({ message: "Invalid notification id" });
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: { readAt: null } },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json({ readAt: notification.readAt });
  } catch (err) {
    res.status(500).json({ message: "Could not update notification", error: err.message });
  }
});

router.get("/me/jobs", requireUser, async (req, res) => {
  const user = await findUserWithJobs(req.userId);
  if (!user) return res.status(404).json({ message: "Account not found" });

  res.json({
    savedJobs: user.savedJobs.filter(item => item.job).map(item => ({
      ...item.job.toObject(),
      savedAt: item.savedAt,
    })),
    applications: user.applications.filter(item => item.job).map(item => ({
      ...item.toObject(),
      job: item.job.toObject(),
    })),
  });
});

router.put("/me/jobs/:jobId/save", requireUser, async (req, res) => {
  if (!isObjectId(req.params.jobId)) return res.status(400).json({ message: "Invalid job id" });
  const job = await Job.findById(req.params.jobId).select("_id");
  if (!job) return res.status(404).json({ message: "Job not found" });

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "Account not found" });
  const index = user.savedJobs.findIndex(item => item.job.toString() === req.params.jobId);
  if (index >= 0) {
    user.savedJobs.splice(index, 1);
    await user.save();
    return res.json({ saved: false });
  }

  user.savedJobs.unshift({ job: job._id });
  await user.save();
  res.json({ saved: true });
});

router.post("/me/jobs/:jobId/apply", requireUser, async (req, res) => {
  if (!isObjectId(req.params.jobId)) return res.status(400).json({ message: "Invalid job id" });
  const job = await Job.findById(req.params.jobId).select("_id");
  if (!job) return res.status(404).json({ message: "Job not found" });

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "Account not found" });
  const existing = user.applications.find(item => item.job.toString() === req.params.jobId);
  if (existing) {
    existing.status = "applied";
    existing.updatedAt = new Date();
  } else {
    const source = typeof req.body.source === "string" && req.body.source.trim() ? req.body.source.trim().slice(0, 80) : "jobkhojoAI";
    user.applications.unshift({ job: job._id, status: "applied", source });
  }
  await user.save();
  if (req.body.trackActivity !== false) {
    try {
      await UserActivity.create({ user: user._id, type: "apply", job: job._id });
    } catch (err) {
      console.error("Could not record application analytics:", err.message);
    }
  }
  res.json({ applied: true });
});

router.patch("/me/jobs/applications/:applicationId/status", requireUser, async (req, res) => {
  const allowed = ["applied", "viewed", "interview", "archived"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid application status" });

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "Account not found" });
  const application = user.applications.id(req.params.applicationId);
  if (!application) return res.status(404).json({ message: "Application not found" });
  application.status = req.body.status;
  application.updatedAt = new Date();
  await user.save();
  res.json({ status: application.status });
});

export default router;
