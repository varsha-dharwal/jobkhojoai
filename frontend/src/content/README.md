# Writing guides for JobKhojo

Long-form pages live here as Markdown files:

| Folder | Becomes | Example |
|---|---|---|
| `guides/` | `/career-guide/<file-name>` | `guides/resume-guide-for-it-freshers.md` → `/career-guide/resume-guide-for-it-freshers` |
| `companies/` | `/companies/<file-name>` | `companies/tcs.md` → `/companies/tcs` |

A guide in `guides/` with the same name as one of the old short guides replaces it, and the old
short version disappears automatically.

## The top of every file

```
---
title: TCS NQT 2026: Eligibility, Test Pattern and Selection Process for Freshers
description: One or two sentences. This is what Google shows under the title.
author: varsha
published: 2026-10-11
updated: 2026-10-11
status: draft
---
```

Company files also need:

```
name: TCS
careersUrl: https://www.tcs.com/careers/india
match: tata consultancy|\btcs\b
```

`match` finds that company's jobs by their Organization name, so they're listed on the guide.

## Draft → live

1. While `status: draft`, the page only shows when running the site locally (`npm run dev`),
   marked "Draft (not live)". It never appears on jobkhojoai.com.
2. Check every fact, especially anything marked **CHECK**: eligibility, test pattern, salaries.
3. Add something from real experience: what candidates you've spoken to actually saw, a tip
   that isn't on every other site.
4. Change to `status: published`, set `updated:` to today, commit and push. The page goes live
   with the next deploy and joins the sitemap.

When you change a published guide later, update `updated:` so readers and Google see the date.

## Writing tips

- `## Heading` for sections (they become the "On this page" list), `### Smaller heading` inside them.
- Tables, **bold**, lists and [links](/jobs) all work. Use site links like `/career-guide/interview-tips`
  for our own pages.
- Aim for 1,200–2,000 words. Plain, specific sentences beat long ones.
- Never copy text from another website. Rewriting someone else's article in different words is
  still copying as far as Google is concerned.
