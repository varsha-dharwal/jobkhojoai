// Long-form Markdown content: career guides (src/content/guides) and company hiring
// guides (src/content/companies). Each file starts with front matter, e.g.
//
//   ---
//   title: TCS NQT 2026: Selection Process for Freshers
//   description: One or two sentences for search results.
//   author: varsha
//   published: 2026-10-14
//   updated: 2026-10-14
//   status: draft            (only "published" files go live; drafts show in `npm run dev`)
//   ---
//
// Company files also take `name`, `careersUrl` and `match` (a regex that finds this
// company's jobs by organization name, e.g. `tata consultancy|\btcs\b`).
import { Marked } from "marked";
import { parseFrontmatter, isPublished } from "./frontmatter";
import { slugify } from "../utils/slugify";

const guideFiles = import.meta.glob("../content/guides/*.md", { query: "?raw", import: "default", eager: true });
const companyFiles = import.meta.glob("../content/companies/*.md", { query: "?raw", import: "default", eager: true });

const SHOW_DRAFTS = import.meta.env.DEV;

function plain(text){
  return text.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
}

const md = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth }){
      const html = this.parser.parseInline(tokens);
      return `<h${depth} id="${slugify(plain(html))}">${html}</h${depth}>\n`;
    },
    link({ href, title, tokens }){
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//.test(href) && !href.startsWith("https://jobkhojoai.com");
      const t = title ? ` title="${title}"` : "";
      return external
        ? `<a href="${href}"${t} target="_blank" rel="noopener noreferrer">${text}</a>`
        : `<a href="${href.replace("https://jobkhojoai.com", "")}"${t}>${text}</a>`;
    },
  },
});

function load(files){
  return Object.entries(files)
    .map(([file, raw]) => {
      const slug = file.split("/").pop().replace(/\.md$/, "");
      const { data, body } = parseFrontmatter(raw);
      const tokens = md.lexer(body);
      const toc = tokens
        .filter(t => t.type === "heading" && t.depth === 2)
        .map(t => ({ text: plain(t.text), id: slugify(plain(md.parseInline(t.text))) }));
      const words = body.split(/\s+/).filter(Boolean).length;
      const html = md.parser(tokens)
        .replace(/<table>/g, '<div class="table-wrap"><table>')
        .replace(/<\/table>/g, "</table></div>");
      return {
        ...data,
        slug,
        draft: !isPublished(data),
        words,
        minutes: Math.max(1, Math.round(words / 200)),
        toc,
        html,
      };
    })
    .filter(item => SHOW_DRAFTS || !item.draft)
    .sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
}

export const LONG_GUIDES = load(guideFiles);
export const COMPANY_GUIDES = load(companyFiles).sort((a, b) => a.name.localeCompare(b.name));

export function longGuide(slug){
  return LONG_GUIDES.find(g => g.slug === slug) || null;
}

export function companyGuide(slug){
  return COMPANY_GUIDES.find(c => c.slug === slug) || null;
}

export function companyJobs(company, jobs){
  if (!company?.match) return [];
  const re = new RegExp(company.match, "i");
  return jobs.filter(job => re.test(job.organization || ""));
}

// The company guide a job belongs to, if one is published.
export function companyGuideForJob(job){
  return COMPANY_GUIDES.find(c => c.match && new RegExp(c.match, "i").test(job.organization || "")) || null;
}
