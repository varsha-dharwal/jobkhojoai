import { index, route } from "@react-router/dev/routes";

export default [
  index("pages/Home.jsx"),
  route("jobs", "pages/Jobs.jsx"),
  route("jobs/:slug", "pages/JobDetail.jsx"),
  route("saved-jobs", "pages/SavedJobs.jsx"),

  route("career-paths", "pages/CareerPaths.jsx"),
  route("roadmap/:slug", "pages/RoadmapDetail.jsx"),
  route("skill-roadmap/:slug", "pages/SkillRoadmapDetail.jsx"),

  route("career-insights", "pages/CareerInsights.jsx"),
  route("career-guide/interview-tips", "pages/InterviewTips.jsx"),
  route("career-guide/resume-builder", "pages/ResumeBuilder.jsx"),
  route("career-guide/:slug", "pages/EditorialArticle.jsx"),

  route("about", "pages/About.jsx"),
  route("contact", "pages/Contact.jsx"),
  route("privacy-policy", "pages/Privacy.jsx"),
  route("terms", "pages/Terms.jsx"),
  route("disclaimer", "pages/Disclaimer.jsx"),
  route("editorial-policy", "pages/EditorialPolicy.jsx"),
  route("job-verification-policy", "pages/JobVerificationPolicy.jsx"),
  route("content-correction-policy", "pages/ContentCorrectionPolicy.jsx"),

  route("admin/login", "pages/admin/AdminLogin.jsx"),
  route("admin/jobs", "pages/admin/AdminJobs.jsx"),
  route("admin/jobs/new", "pages/admin/AdminJobForm.jsx", { id: "admin-job-new" }),
  route("admin/jobs/:id/edit", "pages/admin/AdminJobForm.jsx", { id: "admin-job-edit" }),

  route("*", "pages/NotFound.jsx"),
];
