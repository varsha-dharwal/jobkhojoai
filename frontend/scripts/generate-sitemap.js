// Regenerates frontend/public/sitemap.xml — static pages plus every active job's
// public /jobs/:slug URL, fetched live from the backend API.
//
// Run before each deploy:
//   SITE_URL=https://jobkhojoai.com API_URL=https://your-backend-domain/api node scripts/generate-sitemap.js
//
// On Windows PowerShell:
//   $env:SITE_URL="https://jobkhojoai.com"; $env:API_URL="https://your-backend-domain/api"; node scripts/generate-sitemap.js
//
// Both env vars are optional — SITE_URL defaults to https://jobkhojoai.com and
// API_URL defaults to http://localhost:5000/api (useful for a local dry run).

import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = (process.env.SITE_URL || "https://jobkhojoai.com").replace(/\/$/, "");
const API_URL = process.env.API_URL || "http://localhost:5000/api";

const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { loc: "/", changefreq: "daily", priority: "1.0" },
  { loc: "/about", changefreq: "monthly", priority: "0.5" },
  { loc: "/contact", changefreq: "monthly", priority: "0.5" },
  { loc: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { loc: "/terms", changefreq: "yearly", priority: "0.3" },
].map(r => ({ ...r, lastmod: today }));

async function fetchJobUrls() {
  try {
    const res = await fetch(`${API_URL}/jobs`);
    if (!res.ok) throw new Error(`API responded with ${res.status}`);
    const jobs = await res.json();
    return jobs.map(job => ({
      loc: `/jobs/${job.slug}`,
      lastmod: (job.updatedAt || job.createdAt || today).slice(0, 10),
      changefreq: "weekly",
      priority: "0.8",
    }));
  } catch (err) {
    console.error(`Could not fetch jobs from ${API_URL}/jobs — sitemap will only include static pages. (${err.message})`);
    return [];
  }
}

function buildXml(urls) {
  const entries = urls.map(u => (
    `  <url>\n` +
    `    <loc>${SITE_URL}${u.loc}</loc>\n` +
    `    <lastmod>${u.lastmod}</lastmod>\n` +
    `    <changefreq>${u.changefreq}</changefreq>\n` +
    `    <priority>${u.priority}</priority>\n` +
    `  </url>`
  )).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

const jobUrls = await fetchJobUrls();
const xml = buildXml([...staticRoutes, ...jobUrls]);

const outPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "sitemap.xml");
writeFileSync(outPath, xml);

console.log(`Sitemap written to ${outPath}`);
console.log(`${staticRoutes.length} static pages + ${jobUrls.length} job listings = ${staticRoutes.length + jobUrls.length} URLs`);
