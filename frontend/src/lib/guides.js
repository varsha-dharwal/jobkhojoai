// Presentation details for career guides: topic label and illustration (where one
// exists). Images live in public/images in 360w and 720w WebP versions.
const GUIDE_META = {
  "resume-guide-for-it-freshers": { topic: "Career tips", image: "guide-resume" },
  "how-to-spot-fake-job-posts": { topic: "Job safety", image: "guide-fake-jobs" },
  "internship-application-guide": { topic: "Internships", image: "guide-internship" },
  "how-to-apply-for-remote-tech-jobs": { topic: "Job search", image: "guide-job-search" },
  "frontend-developer-roadmap-2026": { topic: "Career paths" },
  "react-developer-interview-preparation": { topic: "Interviews" },
  "salary-guide-for-indian-software-developers": { topic: "Salary" },
  "github-portfolio-guide-for-freshers": { topic: "Portfolio" },
  "frontend-vs-backend-development": { topic: "Career paths" },
  "javascript-interview-questions-with-explanations": { topic: "Interviews" },
  "how-to-build-a-job-ready-portfolio": { topic: "Portfolio" },
};

export function guideMeta(slug){
  const meta = GUIDE_META[slug] || {};
  return {
    topic: meta.topic || "Career guide",
    image: meta.image
      ? { src: `/images/${meta.image}-360.webp`, srcSet: `/images/${meta.image}-360.webp 360w, /images/${meta.image}-720.webp 720w` }
      : null,
  };
}

export function readingMinutes(article){
  const words = article.sections.reduce((n, s) => n + s.body.split(/\s+/).length, article.summary.split(/\s+/).length);
  return Math.max(1, Math.round(words / 200));
}
