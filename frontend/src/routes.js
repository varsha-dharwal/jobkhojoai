import { index, route } from "@react-router/dev/routes";
import { contentSlugs } from "../scripts/contentIndex.js";

const SHOW_COMPANIES = contentSlugs("companies").length > 0;

export default [
  index("pages/Home.jsx"),
  route("jobs", "pages/Jobs.jsx"),
  route("jobs/:slug", "pages/JobDetail.jsx"),
  route("saved-jobs", "pages/SavedJobs.jsx"),

  route("career-paths", "pages/CareerPaths.jsx"),
  route("roadmap/:slug", "pages/RoadmapDetail.jsx"),
  route("skill-roadmap/:slug", "pages/SkillRoadmapDetail.jsx"),

  route("career-insights", "pages/CareerInsights.jsx"),
  // Company guides only exist once one is published (drafts are visible in dev).
  ...(SHOW_COMPANIES ? [route("companies", "pages/Companies.jsx"), route("companies/:slug", "pages/CompanyGuide.jsx")] : []),
  route("career-guide/interview-tips", "pages/InterviewTips.jsx"),
  route("resume-marketplace", "pages/ResumeMarketplace.jsx"),
  route("resume-templates", "pages/ResumeTemplatesRoute.jsx"),
  route("creator/dashboard", "pages/CreatorDashboard.jsx"),
  route("creator/templates", "pages/CreatorTemplatesRedirect.jsx"),
  route("creator/templates/new", "pages/CreatorTemplateUpload.jsx"),
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
  route("sitemap", "pages/SiteMap.jsx"),

  route("admin/login", "pages/admin/AdminLogin.jsx"),
  route("admin/jobs", "pages/admin/AdminJobs.jsx"),
  route("admin/jobs/new", "pages/admin/AdminJobForm.jsx", { id: "admin-job-new" }),
  route("admin/jobs/:id/edit", "pages/admin/AdminJobForm.jsx", { id: "admin-job-edit" }),
  route("admin/messages", "pages/admin/AdminMessages.jsx"),
  route("admin/resume-templates", "pages/admin/AdminResumeTemplates.jsx"),

  route("*", "pages/NotFound.jsx"),
];
