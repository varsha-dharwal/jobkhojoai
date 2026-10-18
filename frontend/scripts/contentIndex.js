// Node-only: which Markdown files in src/content/<dir> are published. Used by
// react-router.config.js (what to pre-render) and src/routes.js (which routes exist).
import { readdirSync, readFileSync } from "node:fs";
import { parseFrontmatter, isPublished } from "../src/lib/frontmatter.js";

export function publishedSlugs(dir) {
  const folder = new URL(`../src/content/${dir}/`, import.meta.url);
  return readdirSync(folder)
    .filter(f => f.endsWith(".md"))
    .filter(f => isPublished(parseFrontmatter(readFileSync(new URL(f, folder), "utf8")).data))
    .map(f => f.replace(/\.md$/, ""));
}

export const IS_PRODUCTION_BUILD = process.argv.includes("build");

// Production builds only include published files; `react-router dev` includes drafts
// so they can be previewed locally.
export function contentSlugs(dir) {
  if (IS_PRODUCTION_BUILD) return publishedSlugs(dir);
  const folder = new URL(`../src/content/${dir}/`, import.meta.url);
  return readdirSync(folder).filter(f => f.endsWith(".md")).map(f => f.replace(/\.md$/, ""));
}
