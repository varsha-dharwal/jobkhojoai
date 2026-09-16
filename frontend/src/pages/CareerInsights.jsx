import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const insights = [
  {
    slug: "frontend-developer-roadmap-2026",
    title: "Frontend Developer Roadmap 2026",
    summary: "A practical roadmap for learning UI, JavaScript, React, accessibility, APIs, and delivery skills in a modern frontend workflow.",
  },
  {
    slug: "react-developer-interview-preparation",
    title: "React Developer Interview Preparation",
    summary: "A focused guide to React interviews, including rendering, state, forms, hooks, debugging, and product-level problem solving.",
  },
  {
    slug: "how-to-spot-fake-job-posts",
    title: "How to Spot Fake Job Posts",
    summary: "Learn the common warning signs of fake listings, recruiter scams, and suspicious hiring processes before you share personal details.",
  },
  {
    slug: "resume-guide-for-it-freshers",
    title: "Resume Guide for IT Freshers",
    summary: "A step-by-step guide to writing an ATS-friendly resume that highlights projects, skills, and internship experience for freshers.",
  },
  {
    slug: "how-to-apply-for-remote-tech-jobs",
    title: "How to Apply for Remote Tech Jobs",
    summary: "Practical guidance for remote hiring, screening, and protecting yourself from vague or risky work-from-home roles.",
  },
  {
    slug: "salary-guide-for-indian-software-developers",
    title: "Salary Guide for Indian Software Developers",
    summary: "Understand the pay bands, growth factors, and market realities behind salaries for developers across India.",
  },
  {
    slug: "github-portfolio-guide-for-freshers",
    title: "GitHub Portfolio Guide for Freshers",
    summary: "Learn how to build a GitHub profile that demonstrates skill, clarity, and proof of work for recruiters and hiring managers.",
  },
  {
    slug: "internship-application-guide",
    title: "Internship Application Guide",
    summary: "A practical playbook for targeting internships, making stronger applications, and improving your early-career chances.",
  },
  {
    slug: "frontend-vs-backend-development",
    title: "Frontend vs Backend Development",
    summary: "Compare the two major software paths and learn which one matches your strengths, interests, and career goals.",
  },
  {
    slug: "javascript-interview-questions-with-explanations",
    title: "JavaScript Interview Questions with Explanations",
    summary: "Work through common JavaScript questions with the reasoning and examples you need to answer them confidently.",
  },
  {
    slug: "how-to-build-a-job-ready-portfolio",
    title: "How to Build a Job-Ready Portfolio",
    summary: "Build a portfolio that proves your technical ability, communication, and product thinking to employers.",
  },
];

export default function CareerInsights(){
  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 72, maxWidth: 1000 }}>
      <SEO
        title="Career Insights & Guides | jobkhojoAI"
        description="Explore original career guides, resume advice, interview preparation, and hiring insights for tech job seekers and fresher candidates."
        path="/career-insights"
      />

      <span className="hero-eyebrow"><span className="dot" aria-hidden="true" /> Career Insights</span>
      <h1 style={{ fontSize: "clamp(30px, 5vw, 44px)", lineHeight: 1.15, margin: "16px 0 12px" }}>Career Insights for Tech Jobs, Internships & Hiring Success</h1>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 18, lineHeight: 1.7, maxWidth: 720, margin: "0 0 32px" }}>
        jobkhojoAI publishes practical, original guidance for job seekers, freshers, and working professionals who want stronger applications and clearer career decisions.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
        {insights.map((item) => (
          <Link key={item.slug} to={`/career-guide/${item.slug}`} className="card" style={{ display: "block", padding: 24, textDecoration: "none" }}>
            <h2 style={{ fontSize: 22, margin: "0 0 12px" }}>{item.title}</h2>
            <p style={{ margin: 0, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{item.summary}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
