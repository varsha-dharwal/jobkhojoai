# JobKhojo — AdSense approval plan

AdSense rejected jobkhojoai.com for **"Low-value content"**. Google asks for three things:

1. Authentic, high-quality information, tools or services.
2. Ongoing curation and structural maintenance.
3. Genuine, sustained user interest.

Tick items as they're done. Request the review only when the **Final gate** is fully ticked.

---

## Track A — Code (Claude, one deploy)

- [x] A1. Hide jobs without an original note from Google (noindex + out of sitemap; visitors still see them)
- [x] A2. Add the JobKhojo note field (`editorNote`) to jobs
- [x] A3. Every job closes 30 days after posting unless admin sets a last date
- [x] A4. Check apply links on save: block Teams/Meet/Zoom, Google Forms, WhatsApp/Telegram; warn on LinkedIn/Naukri/Indeed
- [x] A5. Closed job page: "This job has closed" + similar open jobs, hidden from Google
- [x] A6. Show Posted + Updated dates on jobs; "Last updated" on guides
- [x] A7. Admin job form: note template, word counter, link warnings, "Visible to Google" badge in the list
- [x] A8. Author byline (Varsha) on guides and roadmaps; "Who runs JobKhojo" on About
- [x] A9. Resume builder page Google can read: how-to, ATS tips, FAQ
- [x] A10. Contact page with a working form (messages appear in admin)
- [x] A11. Proper intros on Career paths and Career insights
- [x] A12. Company hiring pages (`/companies/tcs` …): guide + that company's open jobs
- [x] A13. Long-form guide format (Markdown files: headings, tables, FAQ, author, updated date)
- [x] A14. Roadmap stage explanations (why, time needed, resources, project)
- [x] A15. HTML sitemap page (`/sitemap`) linked in the footer
- [x] A16. Thin guides hidden from Google until their long version is live

## Track B — Setup and data (You, after Track A is live)

- [ ] B1. Fix or delete bad jobs: Coforge Teams link, Peeko Google Form, "Accenture @ Bengaluru", expired Capgemini drive, placementdriveinsta.in link
- [ ] B2. Write JobKhojo notes for the 15–20 best jobs (use official careers links where possible)
- [ ] B3. Cloudflare → Scrape Shield → turn off **Email Address Obfuscation** (shows "[email protected]")
- [ ] B4. Cloudflare → Rules → Redirect `www.jobkhojoai.com` → `jobkhojoai.com`
- [ ] B5. Cloudflare → Pages project → Metrics → enable **Web Analytics**
- [ ] B6. AdSense → Privacy & messaging → set up the consent message
- [ ] B7. Confirm hello@jobkhojoai.com receives mail

## Track C — Content (Claude drafts → Varsha checks facts and adds real experience)

| Week | Item | Type |
|---|---|---|
| W1 | [ ] C1. TCS NQT: full selection process — **draft ready** in `frontend/src/content/companies/tcs.md`, needs Varsha's check | Company |
| W1 | [ ] C2. Infosys hiring process for freshers | Company |
| W1 | [ ] C3. Wipro Elite NTH | Company |
| W1 | [ ] C4. Accenture interview rounds | Company |
| W1 | [ ] C5. Resume guide for IT freshers (long) | Guide |
| W1 | [ ] C6. How to spot fake job posts (long) | Guide |
| W2 | [ ] C7. Cognizant GenC | Company |
| W2 | [ ] C8. Capgemini hiring process | Company |
| W2 | [ ] C9. HCLTech hiring process | Company |
| W2 | [ ] C10. Tech Mahindra hiring process | Company |
| W2 | [ ] C11. Salary guide for Indian software developers (long) | Guide |
| W2 | [ ] C12. Internship application guide (long) | Guide |
| W2 | [ ] C13. Stage explanations: Frontend, Backend, Full stack, Data science, DevOps, Cloud | Roadmaps |
| W3 | [ ] C14. React developer interview preparation (long) | Guide |
| W3 | [ ] C15. JavaScript interview questions (long) | Guide |
| W3 | [ ] C16. Stage explanations: AI, ML, Mobile, QA, UI/UX, Cyber security | Roadmaps |
| W3 | [ ] C17. Rewrite or merge the remaining thin guides | Guides |

## Track D — Visitors and indexing (You, every week)

- [ ] D1. Search Console → Sitemaps → submit `https://jobkhojoai.com/sitemap.xml`
- [ ] D2. URL inspection → Request indexing for every new page
- [ ] D3. Share every new guide on Instagram, LinkedIn and fresher Telegram/WhatsApp groups
- [ ] D4. Weekly check: pages indexed (Search Console) and daily visitors (analytics)

## Final gate — before "Request review"

- [ ] G1. No bad, expired or broken job listings
- [ ] G2. 8 company guides and 6+ long guides live and indexed
- [ ] G3. 20+ jobs have a JobKhojo note
- [ ] G4. Visitors every day for at least 2 weeks
- [ ] G5. Contact form works and the email shows correctly
- [ ] G6. Consent message set up in AdSense
