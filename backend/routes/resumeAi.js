import express from "express";

const router = express.Router();

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

function getIp(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;
}

async function callGemini(systemPrompt, userText, { json = false } = {}) {
  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  // gemini-3.6-flash spends several hundred tokens on invisible "thinking" before
  // writing the actual answer (thinkingConfig to disable it is rejected as an
  // invalid argument on this model) — maxOutputTokens has to cover both or the
  // response gets cut off mid-JSON with finishReason MAX_TOKENS.
  const generationConfig = { maxOutputTokens: 2048, temperature: 0.5 };
  if (json) generationConfig.responseMimeType = "application/json";

  const geminiBody = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: userText }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig,
  });

  let geminiRes = await fetch(geminiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: geminiBody });
  if (geminiRes.status === 503) {
    await new Promise((r) => setTimeout(r, 1200));
    geminiRes = await fetch(geminiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: geminiBody });
  }
  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    console.error("Gemini API error:", geminiRes.status, errText);
    throw Object.assign(new Error("Gemini request failed"), { status: geminiRes.status });
  }
  const data = await geminiRes.json();
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
}

function requireGeminiConfigured(res) {
  if (!process.env.GEMINI_API_KEY) {
    res.status(503).json({ message: "The AI assistant isn't configured yet." });
    return false;
  }
  return true;
}

// ---------- POST /improve-description ----------
router.post("/improve-description", async (req, res) => {
  if (!requireGeminiConfigured(res)) return;
  const ip = getIp(req);
  if (isRateLimited(ip)) return res.status(429).json({ message: "Too many requests — please wait a moment and try again." });

  const { text, role, techUsed } = req.body;
  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ message: "Description text is required." });
  }
  if (text.length > 800) return res.status(400).json({ message: "Description is too long (max 800 characters)." });

  const systemPrompt = `You rewrite a fresher/student's rough project description into one concise, professional resume bullet point (1-2 sentences).
Target role: ${role || "not specified"}. Technologies used: ${techUsed || "not specified"}.
Rules:
- Only rephrase and clarify what the user already wrote — never invent metrics, user counts, performance numbers, or impact that isn't stated.
- Use active, resume-appropriate language (e.g. "Developed", "Implemented", "Built").
- Return ONLY the rewritten sentence, no preamble, no quotes.`;

  try {
    const improved = await callGemini(systemPrompt, text.trim());
    res.json({ improved: improved.trim() });
  } catch (err) {
    res.status(502).json({ message: "The AI assistant is temporarily unavailable." });
  }
});

// ---------- POST /generate-summary ----------
router.post("/generate-summary", async (req, res) => {
  if (!requireGeminiConfigured(res)) return;
  const ip = getIp(req);
  if (isRateLimited(ip)) return res.status(429).json({ message: "Too many requests — please wait a moment and try again." });

  const { role, skills, education, projects, hasInternship } = req.body;

  const skillsText = Array.isArray(skills) ? skills.join(", ") : String(skills || "");
  const projectsText = Array.isArray(projects)
    ? projects.map((p) => `${p.name || "Project"}: ${p.description || ""}`).join(" | ")
    : "";

  const systemPrompt = `You write short, professional resume summaries (2-3 sentences each) for a fresher/student tech job seeker.
Return ONLY a JSON array of exactly 3 distinct summary strings, nothing else — no markdown, no explanation.
Never invent skills, projects, experience, or metrics not given below. Keep each summary under 400 characters.`;

  const userText = `Target role: ${role || "not specified"}
Education: ${education?.degree || ""} ${education?.fieldOfStudy || ""}, ${education?.college || ""}
Skills: ${skillsText || "not specified"}
Projects: ${projectsText || "none listed"}
Has internship experience: ${hasInternship ? "yes" : "no"}`;

  try {
    const raw = await callGemini(systemPrompt, userText, { json: true });
    let summaries;
    try {
      summaries = JSON.parse(raw);
    } catch {
      summaries = [raw.trim()];
    }
    if (!Array.isArray(summaries)) summaries = [String(summaries)];
    res.json({ summaries: summaries.slice(0, 3).map((s) => String(s).trim()).filter(Boolean) });
  } catch (err) {
    res.status(502).json({ message: "The AI assistant is temporarily unavailable." });
  }
});

// ---------- Resume Readiness Score ----------

function scoreFormatting(resume) {
  let score = 20;
  const feedback = [];
  if (!resume.templateId) score -= 10;
  const longFields = [resume.summary, ...(resume.projects || []).map((p) => p.description)].filter(
    (t) => t && t.length > 500
  );
  if (longFields.length) {
    score -= 5;
    feedback.push({ severity: "recommended", message: "Some sections are dense, long paragraphs — break them into shorter bullet points.", section: "review" });
  }
  return { score: Math.max(0, score), feedback };
}

function scoreCompleteness(resume) {
  const checks = [
    Boolean(resume.personal?.fullName),
    Boolean(resume.personal?.targetTitle),
    Boolean(resume.personal?.email),
    Boolean(resume.personal?.phone),
    Boolean(resume.education?.degree),
    Boolean(resume.education?.fieldOfStudy),
    Boolean(resume.education?.college),
    Boolean(resume.education?.gradYear),
    Boolean(resume.projects && resume.projects.length > 0),
    Boolean(resume.summary),
  ];
  const passed = checks.filter(Boolean).length;
  const score = Math.round((passed / checks.length) * 15);
  const feedback = [];
  if (!resume.personal?.email || !resume.personal?.phone) {
    feedback.push({ severity: "important", message: "Add your contact details (email and phone) so recruiters can reach you.", section: "personal" });
  } else {
    feedback.push({ severity: "passed", message: "Contact information present", section: "personal" });
  }
  if (resume.education?.degree) feedback.push({ severity: "passed", message: "Education included", section: "education" });
  return { score, feedback };
}

function scoreSkills(resume) {
  const skills = resume.skills || {};
  const count = Object.values(skills).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
  let score;
  if (count === 0) score = 0;
  else if (count <= 3) score = 8;
  else if (count <= 7) score = 14;
  else if (count <= 12) score = 18;
  else score = 20;

  const feedback = [];
  if (count === 0) feedback.push({ severity: "important", message: "Add your technical skills — this is one of the most scanned sections on a fresher resume.", section: "skills" });
  else if (count < 4) feedback.push({ severity: "recommended", message: "List a few more relevant skills to strengthen this section.", section: "skills" });
  else feedback.push({ severity: "passed", message: "Skills clearly listed", section: "skills" });
  return { score, feedback };
}

function scoreProjects(resume) {
  const projects = resume.projects || [];
  let score;
  if (projects.length === 0) score = 0;
  else if (projects.length === 1) score = 8;
  else if (projects.length === 2) score = 12;
  else score = 15;

  const feedback = [];
  if (projects.length === 0) {
    feedback.push({ severity: "important", message: "Add at least one project — projects are the core of a fresher resume.", section: "projects" });
  } else {
    const missingContribution = projects.find((p) => !p.contribution || !p.contribution.trim());
    if (missingContribution) {
      score = Math.max(0, score - 3);
      feedback.push({ severity: "recommended", message: `"${missingContribution.name || "One project"}" doesn't explain what you personally built or contributed.`, section: "projects" });
    } else {
      feedback.push({ severity: "passed", message: "Standard section headings", section: "projects" });
    }
  }
  return { score, feedback };
}

function scoreReadability(resume) {
  let score = 10;
  const blocks = [resume.summary, ...(resume.projects || []).map((p) => p.description)].filter(Boolean);
  const wallsOfText = blocks.filter((t) => t.length > 350 && !/[.!?]\s/.test(t));
  score -= wallsOfText.length * 2;
  const feedback = [];
  if (wallsOfText.length) {
    feedback.push({ severity: "recommended", message: "Break long unbroken paragraphs into shorter, punctuated sentences or bullets.", section: "review" });
  } else {
    feedback.push({ severity: "passed", message: "No complex layout detected", section: "review" });
  }
  return { score: Math.max(0, score), feedback };
}

router.post("/resume-score", async (req, res) => {
  const { resume } = req.body;
  if (!resume || typeof resume !== "object") {
    return res.status(400).json({ message: "Resume data is required." });
  }

  const formatting = scoreFormatting(resume);
  const completeness = scoreCompleteness(resume);
  const skills = scoreSkills(resume);
  const projects = scoreProjects(resume);
  const readability = scoreReadability(resume);

  let contentQualityScore = 12;
  let aiFeedback = [];

  if (process.env.GEMINI_API_KEY) {
    const ip = getIp(req);
    if (!isRateLimited(ip)) {
      const systemPrompt = `You review the content quality of a fresher/student resume's professional summary and project descriptions.
Return ONLY strict JSON: {"contentQualityScore": <0-20 integer>, "feedback": [{"severity": "important"|"recommended", "message": "<short actionable sentence>", "section": "summary"|"projects"}]}.
Score 20 = specific, concrete, well-written. Lower the score for generic filler language (e.g. "hardworking team player"), vague project descriptions that don't say what was actually built, or missing personal contribution detail.
Give at most 3 feedback items. Do not invent facts about the candidate — only comment on how clearly/specifically the existing text is written.`;
      const userText = `Summary: ${resume.summary || "(none written)"}
Projects:
${(resume.projects || []).map((p, i) => `${i + 1}. ${p.name || "Untitled"} — Built: ${p.description || "(empty)"} — Contribution: ${p.contribution || "(empty)"}`).join("\n") || "(no projects)"}`;

      try {
        const raw = await callGemini(systemPrompt, userText, { json: true });
        const parsed = JSON.parse(raw);
        if (typeof parsed.contentQualityScore === "number") {
          contentQualityScore = Math.max(0, Math.min(20, Math.round(parsed.contentQualityScore)));
        }
        if (Array.isArray(parsed.feedback)) aiFeedback = parsed.feedback.slice(0, 3);
      } catch (err) {
        console.error("Resume content-quality AI call failed, falling back to default score:", err.message);
      }
    }
  }

  const categories = [
    { name: "Formatting", score: formatting.score, max: 20 },
    { name: "Completeness", score: completeness.score, max: 15 },
    { name: "Skills", score: skills.score, max: 20 },
    { name: "Projects", score: projects.score, max: 15 },
    { name: "Content Quality", score: contentQualityScore, max: 20 },
    { name: "Readability", score: readability.score, max: 10 },
  ];
  const total = categories.reduce((sum, c) => sum + c.score, 0);

  const feedback = [
    ...formatting.feedback, ...completeness.feedback, ...skills.feedback,
    ...projects.feedback, ...readability.feedback, ...aiFeedback,
  ];

  res.json({ total, categories, feedback });
});

export default router;
