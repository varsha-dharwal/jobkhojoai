// Runs after `react-router build`. Prepares build/client for Cloudflare Pages:
//  1. Flattens about/index.html → about.html so Pages serves /about directly
//     (a folder index would 308-redirect /about → /about/ and fight the canonical URL).
//  2. Turns the pre-rendered /404 page into a static 404.html (scripts stripped, so it
//     never tries to hydrate on the wrong URL). Unknown URLs now return a real 404.
//  3. Adds SPA-fallback 404.html files under jobs/, admin/ and skill-roadmap/.
//  4. Writes sitemap.xml from the pages that were actually pre-rendered.

import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://jobkhojoai.com";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../build/client");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// 1. Flatten nested index.html files (deepest first so parents can be removed).
const nested = walk(root)
  .filter(f => path.basename(f) === "index.html" && path.dirname(f) !== root)
  .sort((a, b) => b.length - a.length);
for (const file of nested) {
  const dir = path.dirname(file);
  renameSync(file, `${dir}.html`);
  if (readdirSync(dir).length === 0) rmdirSync(dir);
}

// 2. Static 404 page.
const notFound = path.join(root, "404.html");
if (!existsSync(notFound)) throw new Error("postbuild: expected a pre-rendered /404 page");
const html404 = readFileSync(notFound, "utf8")
  .replace(/<link rel="modulepreload"[^>]*>/g, "")
  .replace(/<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g, "")
  .replace('<link rel="canonical" href="https://jobkhojoai.com/404"/>', "");
writeFileSync(notFound, html404);

// 2b. Folder-level fallbacks: Cloudflare Pages serves the nearest 404.html, so an
// unknown /jobs/<slug> (posted after this build) boots the app and loads the job
// from the API, while still answering 404 to crawlers until the next build.
const spaFallback = readFileSync(path.join(root, "__spa-fallback.html"), "utf8");
for (const dir of ["jobs", "admin", "skill-roadmap"]) {
  mkdirSync(path.join(root, dir), { recursive: true });
  writeFileSync(path.join(root, dir, "404.html"), spaFallback);
}

// 3. Sitemap from the pre-rendered pages (skips noindex pages and the special files).
const pages = walk(root)
  .filter(f => f.endsWith(".html"))
  .map(file => {
    const rel = path.relative(root, file).split(path.sep).join("/");
    if (rel.endsWith("404.html") || rel === "__spa-fallback.html") return null;
    const html = readFileSync(file, "utf8");
    if (/<meta name="robots" content="noindex/.test(html)) return null;
    const loc = rel === "index.html" ? "/" : `/${rel.replace(/\.html$/, "")}`;
    const posted = html.match(/"datePosted":"([^"]+)"/)?.[1];
    return { loc, lastmod: posted ? posted.slice(0, 10) : null };
  })
  .filter(Boolean)
  .sort((a, b) => (a.loc === "/" ? -1 : b.loc === "/" ? 1 : a.loc.localeCompare(b.loc)));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>${SITE_URL}${p.loc}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
writeFileSync(path.join(root, "sitemap.xml"), xml);

console.log(`postbuild: flattened ${nested.length} pages, wrote 404.html and sitemap.xml (${pages.length} URLs)`);
