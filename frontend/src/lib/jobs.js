// Pure helpers that turn the free-text fields admins type into consistent, honest
// display values. Nothing here invents data: when a value can't be read reliably it
// is shown as typed, or hidden.

import { SITE_URL } from "./site";
import { companyLogo } from "./companyLogos";

const US_LOCATION_RE = /\b(united states|usa|u\.s\.a?\.?)\b/i;

export function jobCountry(job) {
  return US_LOCATION_RE.test(job.location || "") ? "USA" : "India";
}

// The admin "remote" checkbox is sometimes left unticked when the location itself
// says "Remote", so both are considered.
export function isRemote(job) {
  return Boolean(job.remote) || /\bremote\b|work from home|\bwfh\b/i.test(job.location || "");
}

export function workMode(job) {
  return isRemote(job) ? "Remote" : "On-site";
}

export function jobTypeLabel(job) {
  return job.category || "Full-time";
}

// "Remote (USA)" / "India (Remote)" already say remote — avoid "Remote · Remote".
export function locationLabel(job) {
  const loc = (job.location || "").replace(/\s*\((office-based|onsite|on-site|remote)\)\s*/i, "").trim();
  return loc || (isRemote(job) ? "Remote" : "India");
}

// Splits on commas/pipes/newlines that aren't inside brackets, so "Design tools
// (Figma, Sketch)" stays one item, and drops sentence-like fragments.
export function skillsList(job, max = Infinity) {
  const parts = [];
  let depth = 0, current = "";
  for (const ch of job.skills || "") {
    if (ch === "(" || ch === "[") depth++;
    if ((ch === ")" || ch === "]") && depth > 0) depth--;
    if (depth === 0 && /[,|\n;]/.test(ch)) { parts.push(current); current = ""; } else current += ch;
  }
  parts.push(current);
  const seen = new Set();
  return parts
    .map(s => s.trim().replace(/\.$/, "").replace(/^(and|&)\s+/i, ""))
    .filter(s => s && s.length <= 40 && !/^etc\b/i.test(s) && !seen.has(s.toLowerCase()) && seen.add(s.toLowerCase()))
    .slice(0, max);
}

const EMPTY_VALUE_RE = /^(not\s+(mentioned|disclosed|specified|available)|n\/?a|na|-|—|as per (company|industry) (norms|standards)?)$/i;

function cleanValue(value) {
  const v = String(value ?? "").trim();
  return v && !EMPTY_VALUE_RE.test(v) ? v : "";
}

// Bare numbers get thousands separators; the ₹ sign is only added for Indian jobs —
// for anything else the currency isn't known, so none is shown.
function prettyMoney(v, india) {
  if (!/^\d{4,}$/.test(v)) return v;
  return india ? `₹${Number(v).toLocaleString("en-IN")}` : Number(v).toLocaleString("en-US");
}

export function salaryText(job) {
  const india = jobCountry(job) === "India";
  const min = cleanValue(job.salaryMin);
  const max = cleanValue(job.salaryMax);
  if (min && max && min !== max) return `${prettyMoney(min, india)} – ${prettyMoney(max, india)}`;
  return prettyMoney(min || max, india) || "";
}

// "0-6" → "0–6 years", "3-8Y" → "3–8 years", "2+" → "2+ years"; anything else as typed.
export function experienceText(job) {
  const raw = cleanValue(job.experience);
  if (!raw) return "";
  let m = raw.match(/^(\d+)\s*(?:-|–|to)\s*(\d+)\s*(?:y|yr|yrs|years?)?\.?$/i);
  if (m) return `${m[1]}–${m[2]} years`;
  m = raw.match(/^(\d+)\s*(\+)?\s*(?:y|yr|yrs|years?)?\.?$/i);
  if (m) return `${m[1]}${m[2] || ""} ${m[1] === "1" && !m[2] ? "year" : "years"}`;
  return raw;
}

// Experience bucket for filtering — derived from the experience text and the title.
export function experienceLevel(job) {
  const text = `${job.experience || ""} ${job.title || ""}`;
  if (/\b(intern|internship|fresher|freshers|graduate trainee|entry[\s-]?level|trainee)\b/i.test(text)) return "fresher";
  if (/\b(senior|sr\.?|lead|principal|manager|architect|head)\b/i.test(job.title || "")) return "senior";
  const nums = (job.experience || "").match(/\d+/g)?.map(Number);
  if (nums?.length) {
    const min = Math.min(...nums);
    if (min <= 1) return "fresher";
    if (min <= 4) return "mid";
    return "senior";
  }
  return "";
}

export const EXPERIENCE_LEVELS = [
  { value: "fresher", label: "Fresher / 0–1 yr" },
  { value: "mid", label: "1–4 years" },
  { value: "senior", label: "5+ years" },
];

// ---------- Apply destination ----------

const BOARDS = [
  { re: /(^|\.)linkedin\.com$/, name: "LinkedIn" },
  { re: /(^|\.)naukri\.com$/, name: "Naukri" },
  { re: /(^|\.)indeed\.com$/, name: "Indeed" },
  { re: /(^|\.)foundit\.in$/, name: "foundit" },
  { re: /(^|\.)internshala\.com$/, name: "Internshala" },
  { re: /(^|\.)wellfound\.com$/, name: "Wellfound" },
  { re: /(^|\.)glassdoor\.(com|co\.in)$/, name: "Glassdoor" },
];

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

// Tells the candidate exactly where the Apply button goes, instead of calling every
// destination "the official website".
export function applyTarget(job) {
  const host = hostOf(job.applyLink);
  if (!host) return { host: "", label: "Apply", note: "" };

  const board = BOARDS.find(b => b.re.test(host));
  if (board) {
    return {
      host,
      kind: "board",
      label: `Apply on ${board.name}`,
      note: `You'll continue to this listing on ${board.name} to apply.`,
    };
  }
  if (/(^|\.)teams\.microsoft\.com$|(^|\.)zoom\.us$|(^|\.)meet\.google\.com$/.test(host)) {
    return {
      host,
      kind: "meeting",
      label: "Open meeting link",
      note: "This link opens an online meeting for a virtual hiring drive. Confirm the drive on the company's own website first.",
    };
  }
  const orgWord = (job.organization || "").toLowerCase().split(/[^a-z0-9]+/).find(w => w.length > 2);
  const looksLikeCompany = /^(careers?|jobs|join|apply|hiring)\./.test(host) || /\.jobs$/.test(host) || (orgWord && host.includes(orgWord));
  if (looksLikeCompany) {
    return {
      host,
      kind: "company",
      label: "Apply on company site",
      note: `You'll continue to ${host} to apply.`,
    };
  }
  return {
    host,
    kind: "other",
    label: "Continue to application",
    note: `You'll continue to ${host}. Check that it belongs to the employer before sharing personal details.`,
  };
}

// ---------- Text cleanup ----------

const SECTION_HEADING_RE = /^(roles?\s*(&|and)\s*)?(responsibilities|requirements|job description|description|qualifications?|eligibility( criteria)?|about (the )?(role|company))\s*:?$/i;

// Splits a textarea into lines and drops lines that only repeat the section heading.
export function textLines(text) {
  return (text || "")
    .split("\n")
    .map(s => s.replace(/^[\s•\-–*·]+/, "").trim())
    .filter(s => s && !SECTION_HEADING_RE.test(s));
}

// ---------- Dates ----------

export function daysSince(date) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 864e5);
}

export function postedLabel(date) {
  const days = daysSince(date);
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 7) return `Posted ${days} days ago`;
  if (days < 14) return "Posted 1 week ago";
  if (days < 31) return `Posted ${Math.floor(days / 7)} weeks ago`;
  return `Posted on ${formatDate(date)}`;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

// ---------- Related career path ----------

const PATH_RULES = [
  ["ui-ux", /ui\s*\/\s*ux|\bux\b|product design|figma|\bui designer/i],
  ["full-stack", /full[\s-]?stack|\bmern\b|\bmean\b/i],
  ["mobile-development", /android|\bios\b|flutter|react native|mobile/i],
  ["devops", /devops|\bsre\b|site reliability|kubernetes|ci\s*\/\s*cd/i],
  ["cloud", /cloud|\baws\b|azure|\bgcp\b/i],
  ["cyber-security", /security|\bsoc\b|penetration|\bvapt\b/i],
  ["qa", /\bqa\b|tester|testing|quality assurance|automation test/i],
  ["ml", /machine learning|\bml\b|deep learning/i],
  ["ai", /\bai\b|artificial intelligence|\bllm\b|gen\s?ai|automation engineer|automation intern/i],
  ["data-science", /data scien|data analy|analyst|power bi|tableau|\bbi\b/i],
  ["frontend", /front[\s-]?end|react|angular|\bvue\b|\bui developer|web developer|javascript|wordpress|shopify/i],
  ["backend", /back[\s-]?end|node\.?js|\bjava\b|spring|\.net|python developer|golang|\bphp\b|software (engineer|developer)/i],
];

export function relatedPathSlug(job) {
  const text = `${job.title || ""} ${job.skills || ""}`;
  return PATH_RULES.find(([, re]) => re.test(text))?.[0] || null;
}

// ---------- Similar jobs ----------

export function similarJobs(job, jobs, count = 4) {
  const skills = new Set(skillsList(job).map(s => s.toLowerCase()));
  const path = relatedPathSlug(job);
  return jobs
    .filter(j => j.slug !== job.slug)
    .map(j => {
      let score = 0;
      if (path && relatedPathSlug(j) === path) score += 3;
      for (const s of skillsList(j)) if (skills.has(s.toLowerCase())) score += 1;
      if (j.category === job.category) score += 0.5;
      if (isRemote(j) === isRemote(job)) score += 0.25;
      return { j, score };
    })
    .filter(x => x.score >= 1)
    .sort((a, b) => b.score - a.score || new Date(b.j.createdAt) - new Date(a.j.createdAt))
    .slice(0, count)
    .map(x => x.j);
}

// ---------- Filtering (jobs page) ----------

const DAY_MS = 864e5;
export const POSTED_WINDOWS = { "1": DAY_MS, "7": 7 * DAY_MS, "30": 30 * DAY_MS };

const BLR = ["bangalore", "bengaluru", "benguluru"];
const GGN = ["gurgaon", "gurugram"];
const CITY_ALIASES = { bangalore: BLR, bengaluru: BLR, gurgaon: GGN, gurugram: GGN, bombay: ["mumbai"], madras: ["chennai"] };

// Matches at the start of a word ("react" finds "ReactJS"), except that "java"
// shouldn't find "JavaScript".
const wordCache = new Map();
function wordRegex(word) {
  if (!wordCache.has(word)) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const guard = word === "java" ? "(?!script)" : "";
    wordCache.set(word, new RegExp(`(^|[^a-z0-9])${escaped}${guard}`, "i"));
  }
  return wordCache.get(word);
}

export function jobMatches(job, f, now = Date.now()) {
  if (f.q) {
    const hay = `${job.title} ${job.organization} ${job.skills || ""} ${job.category || ""}`.toLowerCase();
    if (!f.q.toLowerCase().split(/\s+/).filter(Boolean).every(word => wordRegex(word).test(hay))) return false;
  }
  if (f.location) {
    const loc = f.location.toLowerCase().trim();
    if (/^(remote|wfh|work from home)$/.test(loc)) {
      if (!isRemote(job)) return false;
    } else {
      const jobLoc = (job.location || "").toLowerCase();
      if (!(CITY_ALIASES[loc] || [loc]).some(name => jobLoc.includes(name))) return false;
    }
  }
  if (f.type.length && !f.type.includes((job.category || "").toLowerCase())) return false;
  if (f.mode.length && !f.mode.includes(isRemote(job) ? "remote" : "onsite")) return false;
  if (f.exp.length && !f.exp.includes(experienceLevel(job))) return false;
  if (f.region && !isRemote(job) && jobCountry(job).toLowerCase() !== f.region) return false;
  if (f.posted && now - new Date(job.createdAt).getTime() > POSTED_WINDOWS[f.posted]) return false;
  return true;
}

// ---------- Structured data ----------

const INDIAN_STATES = /^(andhra pradesh|assam|bihar|chhattisgarh|delhi|goa|gujarat|haryana|himachal pradesh|jharkhand|karnataka|kerala|madhya pradesh|maharashtra|odisha|punjab|rajasthan|tamil nadu|telangana|uttar pradesh|uttarakhand|west bengal|ncr|delhi ncr)$/i;
const COUNTRY_WORDS = /^(india|usa|us|united states|remote|across india|pan india|anywhere|hybrid|onsite|on-site)$/i;

function parseLocations(job) {
  const parts = (job.location || "")
    .replace(/\(.*?\)/g, " ")
    .split(/,|&|\/|\band\b|–|-(?=\s)/i)
    .map(s => s.trim())
    .filter(Boolean);
  const region = parts.find(p => INDIAN_STATES.test(p));
  const cities = parts.filter(p => !INDIAN_STATES.test(p) && !COUNTRY_WORDS.test(p));
  return { cities, region };
}

// Annual figures like "₹5 LPA" / "6lpa" / "12 lakh". Anything else (stipends without
// a period, "competitive", …) is left out of the markup rather than guessed.
function parseAnnualInr(value) {
  const m = String(value || "").replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*(lpa|l\b|lakhs?|lacs?)/i);
  return m ? Math.round(Number(m[1]) * 100000) : null;
}

function descriptionHtml(job) {
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const block = (title, text, asList) => {
    const lines = textLines(text);
    if (!lines.length) return "";
    const body = asList ? `<ul>${lines.map(l => `<li>${esc(l)}</li>`).join("")}</ul>` : lines.map(l => `<p>${esc(l)}</p>`).join("");
    return title ? `<h3>${title}</h3>${body}` : body;
  };
  return [
    block("", job.roleDescription, false),
    block("Responsibilities", job.responsibilities, true),
    block("Requirements", job.requirements, true),
  ].join("") || esc(job.title);
}

export function jobPostingSchema(job) {
  const isUS = jobCountry(job) === "USA";
  const country = isUS ? "US" : "IN";
  const { cities, region } = parseLocations(job);
  const schema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: descriptionHtml(job),
    datePosted: job.createdAt,
    employmentType: job.category === "Internship" ? "INTERN" : job.category === "Part-time" ? "PART_TIME" : "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.organization,
      ...(job.logoUrl && /^https?:/.test(job.logoUrl)
        ? { logo: job.logoUrl }
        : companyLogo(job.organization) ? { logo: SITE_URL + companyLogo(job.organization) } : {}),
    },
    directApply: false,
    url: `${SITE_URL}/jobs/${job.slug}`,
  };
  if (job.lastDate) schema.validThrough = job.lastDate;

  if (isRemote(job)) {
    schema.jobLocationType = "TELECOMMUTE";
    schema.applicantLocationRequirements = { "@type": "Country", name: isUS ? "United States" : "India" };
  }
  if (!isRemote(job) || cities.length) {
    const places = (cities.length ? cities : [null]).map(city => ({
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(city ? { addressLocality: city } : {}),
        ...(region ? { addressRegion: region } : {}),
        addressCountry: country,
      },
    }));
    schema.jobLocation = places.length === 1 ? places[0] : places;
  }

  if (!isUS) {
    const min = parseAnnualInr(job.salaryMin);
    const max = parseAnnualInr(job.salaryMax) || min;
    if (min) {
      schema.baseSalary = {
        "@type": "MonetaryAmount",
        currency: "INR",
        value: { "@type": "QuantitativeValue", minValue: min, maxValue: Math.max(min, max), unitText: "YEAR" },
      };
    }
  }
  const exp = experienceText(job);
  if (exp) schema.experienceRequirements = exp;
  if (job.education) schema.educationRequirements = job.education;
  const skills = skillsList(job);
  if (skills.length) schema.skills = skills.join(", ");
  return schema;
}
