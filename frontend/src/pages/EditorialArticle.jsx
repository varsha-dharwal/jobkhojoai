import { Navigate, useParams, Link } from "react-router-dom";
import SEO from "../components/SEO";

export const CAREER_GUIDE_ARTICLES = [
  {
    slug: "frontend-developer-roadmap-2026",
    title: "Frontend Developer Roadmap 2026",
    summary: "A practical roadmap for aspiring frontend developers in 2026, covering the skills, projects, and job-readiness milestones employers actually expect.",
    sections: [
      {
        heading: "Start with strong fundamentals",
        body: "A frontend developer should understand HTML structure, accessible markup, CSS layout, responsive design, browser rendering, and JavaScript logic before they try to build a large app. Employers value clarity over hype, so begin with fundamentals and build real UI patterns you can explain in interviews.",
      },
      {
        heading: "Build real product habits",
        body: "By the time you reach React, you should already be comfortable with component thinking, state management, and data flow. Use small but complete projects such as a product listing page, a dashboard, a login flow, or a reusable component library. That is far more valuable than collecting multiple unfinished demos.",
      },
      {
        heading: "Learn the tools used by teams",
        body: "Modern frontend work includes Git, package managers, UI frameworks, testing, and deployment. Practice building components, handling API responses, and shipping polished work that works on mobile and desktop. Employers are looking for product sense, not just syntax recall.",
      },
      {
        heading: "Prepare for real interviews",
        body: "Interview rounds often test DOM events, CSS layouts, JavaScript closures, API integration, reusable components, and debugging. Prepare by explaining your thinking clearly and by building a few portfolio projects that show decisions, trade-offs, and edge-case handling.",
      },
    ],
  },
  {
    slug: "react-developer-interview-preparation",
    title: "React Developer Interview Preparation",
    summary: "A focused interview prep guide for React roles, covering state, props, rendering, optimization, and common product-level questions.",
    sections: [
      {
        heading: "Know the fundamentals deeply",
        body: "A strong React interview starts with JSX, props, state, lifecycle patterns, and how React re-renders. Be ready to explain when to use local state, prop drilling, lifting state up, context, and custom hooks without copying a memorized answer.",
      },
      {
        heading: "Practice component design",
        body: "Employers often ask how you would structure a dashboard, a reusable form, a modal flow, or a product page. Your answer should show separation of concerns, clear props, accessible UI, and scalable state management. Good component design is usually more important than fancy animation.",
      },
      {
        heading: "Understand performance and bugs",
        body: "Be able to talk about memoization, rendering bottlenecks, stale state, API race conditions, and how to debug a broken UI. Good candidates explain the problem, reproduce it, and reason about the fix instead of jumping to random optimizations.",
      },
      {
        heading: "Show product thinking",
        body: "Interviewers want to know whether you can design interfaces that are simple, fast, and understandable. Explain why a feature matters to a user, how it fits the product flow, and how you would test edge cases before release.",
      },
    ],
  },
  {
    slug: "how-to-spot-fake-job-posts",
    title: "How to Identify Fake Job Posts",
    summary: "A practical checklist for spotting suspicious hiring posts, fake recruiter behaviors, and scams before you share your personal information.",
    sections: [
      {
        heading: "Check the official source",
        body: "Legitimate companies publish jobs on their own careers page, official LinkedIn page, or trusted job boards. If the post asks for a payment, cryptocurrency, or a quick WhatsApp interview before any formal process, treat it as suspicious.",
      },
      {
        heading: "Look for red flags in the process",
        body: "Be careful with vague job descriptions, missing salary details, unrealistic offers, and pressure to apply immediately. Real employers usually explain the role, the interview process, and the salary range or compensation policy in a clear and consistent manner.",
      },
      {
        heading: "Verify who is contacting you",
        body: "Check the sender email domain, call the company directly using official numbers, and confirm the recruiter profile on the company website. A fake listing can look polished, but the process often breaks down when you verify the details.",
      },
      {
        heading: "Protect your data",
        body: "Share personal information only after the company process is clear and legitimate. Keep your CV, identity documents, and banking details private until there is a verified official hiring process. If the employer avoids formal documentation or asks for unusual payments, walk away.",
      },
    ],
  },
  {
    slug: "resume-guide-for-it-freshers",
    title: "Resume Guide for IT Freshers",
    summary: "A simple, effective resume structure for freshers and early-career candidates targeting software, QA, support, and technical roles.",
    sections: [
      {
        heading: "Lead with outcome, not only skills",
        body: "Freshers should focus on academic projects, internships, freelancing, and practical work. A strong resume explains what you built, the tools you used, and the problem you solved rather than listing every course you took.",
      },
      {
        heading: "Use ATS-friendly formatting",
        body: "Keep headings clear, use simple fonts, and avoid graphics-heavy layouts. Most recruiters use screening tools that look for relevant keywords such as JavaScript, SQL, React, Python, communication, and problem-solving. Put those terms in a natural, relevant way.",
      },
      {
        heading: "Make your projects convincing",
        body: "A project section works best when it shows scope, technology, and impact. For example: 'Built an attendance dashboard using React and Firebase to manage daily check-ins for a small student team.' That gives recruiters context and a better sense of your ability.",
      },
      {
        heading: "Keep it short and specific",
        body: "One page is enough for most freshers. Focus on what is relevant to the target job, include the strongest examples, and remove generic statements that do not reveal your value. Clarity and relevance win more often than long lists of skills.",
      },
    ],
  },
  {
    slug: "how-to-apply-for-remote-tech-jobs",
    title: "How to Apply for Remote Tech Jobs",
    summary: "A practical guide to applying for remote technical jobs without falling for vague listings or highly risky hiring processes.",
    sections: [
      {
        heading: "Confirm the job is truly remote",
        body: "Remote roles are often misclassified. Check whether the company states a true remote structure, time-zone expectations, and working model clearly. Some listings are hybrid or global contractor roles disguised as remote jobs.",
      },
      {
        heading: "Tailor your application for remote work",
        body: "Remote hiring teams want to see your communication skills, async collaboration ability, and ability to work independently. Highlight tools like Git, Jira, Slack, Notion, or project trackers and show how you follow process without constant supervision.",
      },
      {
        heading: "Prepare for process differences",
        body: "Remote jobs often include asynchronous assignments, portfolio reviews, or take-home coding tasks. Set a realistic schedule, review the instructions carefully, and submit polished work that demonstrates quality and clarity rather than rushed output.",
      },
      {
        heading: "Watch for payment or upfront requirements",
        body: "A valid remote employer will not ask you to pay a fee for interviewing, onboarding, or equipment. If a listing asks you to buy a course, pay registration fees, or move funds, that is not a trustworthy hiring process.",
      },
    ],
  },
  {
    slug: "salary-guide-for-indian-software-developers",
    title: "Salary Guide for Indian Software Developers",
    summary: "A practical salary breakdown for developers across freshers, mid-level, and senior roles in India, with the factors that truly influence pay.",
    sections: [
      {
        heading: "Start with the market range",
        body: "Indian software salaries vary substantially by role, city, company type, and product maturity. A fresher frontend or backend developer usually earns far less than a senior engineer in a global product company, but the gap often reflects skills, experience, product complexity, and business impact rather than title alone.",
      },
      {
        heading: "Look beyond the base pay",
        body: "Bonus, stock options, ESOPs, flexible benefits, remote allowances, and growth opportunities often matter as much as the salary number. A role with a lower fixed monthly payout but strong learning and promotion paths can be a better long-term move than a short-term salary spike.",
      },
      {
        heading: "Understand value by specialization",
        body: "Skills in cloud, backend architecture, AI tooling, system design, and data engineering tend to command stronger salary bands. Build depth in one domain and learn to explain business impact clearly; that is often what changes the compensation range during interviews and internal promotions.",
      },
      {
        heading: "Negotiate from clarity, not pressure",
        body: "Your compensation narrative should be grounded in the value you create, not just the market average. Show projects, portfolio work, measurable results, and a clear understanding of the role's expectations. Strong negotiation begins with preparation and confidence.",
      },
    ],
  },
  {
    slug: "github-portfolio-guide-for-freshers",
    title: "GitHub Portfolio Guide for Freshers",
    summary: "A clear guide to building a GitHub portfolio that proves skill, consistency, and product thinking to recruiters and hiring managers.",
    sections: [
      {
        heading: "Build projects that tell a story",
        body: "Employers usually care less about the number of repos and more about whether your projects show thoughtful execution. A small but polished project with a real problem, clean code, and a working UI is stronger than ten half-finished examples.",
      },
      {
        heading: "Keep your repository readable",
        body: "Document how to run the app, what technologies were used, and what problem it solves. A clean README, meaningful commit history, and clear structure signal professionalism. Good code and a thoughtful project narrative often matter more than flashy visuals alone.",
      },
      {
        heading: "Show process, not perfection",
        body: "Explain design decisions, trade-offs, and what you would improve next. Employers value candidates who can reason about what they built, not just people who can paste a working repo. That kind of explanation helps interviewers understand your maturity.",
      },
      {
        heading: "Turn GitHub into proof of learning",
        body: "If you are a fresher, your projects should reflect the kind of work you want to be hired for. Build tools around frontend, backend, data, or automation depending on your target role, and make sure the repos align with the job description you are aiming for.",
      },
    ],
  },
  {
    slug: "internship-application-guide",
    title: "Internship Application Guide",
    summary: "A practical guide to applying for internships without wasting time, improving your odds, and building a strong early-career profile.",
    sections: [
      {
        heading: "Target the right type of internship",
        body: "The best internship applications are specific. A company seeking a product engineering intern should be approached differently from one hiring for QA, data support, or marketing technology. Match your application to the role, not just the brand name.",
      },
      {
        heading: "Use an focused resume",
        body: "Your internship resume should highlight coursework, meaningful projects, tools, and any relevant work experience. Keep it short, direct, and aligned to the actual internship description. Employers want to see whether you can contribute quickly.",
      },
      {
        heading: "Prepare for quick screening",
        body: "Many internships rely on a short screening call or a basic technical assessment. Be ready to explain your coursework, projects, and the problem-solving approach behind them. If your work is real, your answer should be clear and confident.",
      },
      {
        heading: "Follow up professionally",
        body: "A short follow-up after applying is perfectly fine if it is polite and brief. It shows initiative without becoming repetitive. Most employers value professionalism and clarity more than aggressive follow-up.",
      },
    ],
  },
  {
    slug: "frontend-vs-backend-development",
    title: "Frontend vs Backend Development",
    summary: "A beginner-friendly explanation of the difference between frontend and backend development, including skills, responsibilities, and career direction.",
    sections: [
      {
        heading: "Frontend is the user experience layer",
        body: "Frontend developers focus on what users see and interact with — pages, components, layouts, forms, buttons, navigation, and responsiveness. They work closely with design systems, product flows, accessibility, and performance to make the interface feel smooth.",
      },
      {
        heading: "Backend handles logic and data",
        body: "Backend development deals with APIs, server logic, validation, databases, authentication, workflow automation, and business rules. It is the layer that makes the application actually process requests, persist data, and coordinate action across systems.",
      },
      {
        heading: "Neither is better, but the workflows differ",
        body: "A frontend developer is often closer to product design and UI quality, while backend developers think more about architecture, security, and data flow. Full stack developers combine both. In practice, each path requires different strengths and habits.",
      },
      {
        heading: "Choose based on interest and output",
        body: "If you enjoy visual design, interaction, and UX refinement, frontend is often a strong fit. If you enjoy logic, data processing, APIs, and problem-solving at scale, backend may be a better long-term match. The best choice is the one that keeps you motivated to build.",
      },
    ],
  },
  {
    slug: "javascript-interview-questions-with-explanations",
    title: "JavaScript Interview Questions with Explanations",
    summary: "A beginner-to-intermediate guide to common JavaScript interview questions and the reasoning behind the answers.",
    sections: [
      {
        heading: "Explain hoisting, scope, and closures",
        body: "JavaScript interviews often probe how you reason about scope and execution. A strong answer explains how variables are created, how functions capture outer state, and why closures can be useful in callbacks, private state, and event handlers.",
      },
      {
        heading: "Understand async behavior clearly",
        body: "Candidates are often tested on promises, async/await, and event loop behavior. The key is to explain that JavaScript runs single-threaded but can wait for external operations without blocking the UI, which is why async patterns are essential in real web applications.",
      },
      {
        heading: "Talk through equality and type coercion",
        body: "Questions about == vs === are common because they reveal whether you understand strict comparisons and type conversion. Strong answers usually focus on avoiding hidden coercion and writing predictable code that does not surprise other developers.",
      },
      {
        heading: "Use examples instead of memorized definitions",
        body: "Exam answers improve sharply when you explain a real example. For instance, show how a closure can help a button count clicks, or how a promise chain changes the flow of code. Real-world examples usually sound more credible than memorized definitions.",
      },
    ],
  },
  {
    slug: "how-to-build-a-job-ready-portfolio",
    title: "How to Build a Job-Ready Portfolio",
    summary: "A guide to building a portfolio that proves skill, communication, and the ability to solve practical problems for recruiters.",
    sections: [
      {
        heading: "Choose projects that match your target role",
        body: "Your portfolio should not be a random collection of tutorials. It should reflect the role you are applying for. For example, a frontend candidate should show responsive UI work, usability decisions, and clean component design, while a backend candidate should highlight APIs, data flow, and real application logic.",
      },
      {
        heading: "Make the case for each project",
        body: "Every project should explain the problem, the approach, and the result. This helps recruiters understand what you built and why it matters. A project without context feels decorative; a project with a clear story feels credible.",
      },
      {
        heading: "Show quality in the details",
        body: "Consistent design, thoughtful structure, clear architecture, readable code, and responsive behavior make a portfolio feel professional. A polished project often says more about work quality than a long list of unfinished experiments.",
      },
      {
        heading: "Keep updating it",
        body: "The best portfolios evolve with your learning. As you gain experience, replace weak examples with stronger ones, add new case studies, and refine the work that best reflects your current skill level. That makes your portfolio believable and current.",
      },
    ],
  },
];

export default function EditorialArticle(){
  const { slug } = useParams();
  const article = CAREER_GUIDE_ARTICLES.find(item => item.slug === slug);

  if (!article) return <Navigate to="/" replace />;

  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 72, maxWidth: 900 }}>
      <SEO
        title={`${article.title} | jobkhojoAI`}
        description={article.summary}
        path={`/career-guide/${article.slug}`}
      />

      <nav style={{ marginBottom: 20, color: "var(--color-text-tertiary)", fontSize: 14 }}>
        <Link to="/" style={{ color: "var(--color-brand)" }}>Home</Link>
        <span style={{ margin: "0 8px" }}>›</span>
        <Link to="/#career-insights" style={{ color: "var(--color-brand)" }}>Career Insights</Link>
      </nav>

      <span className="hero-eyebrow"><span className="dot" aria-hidden="true" /> Career Guide</span>
      <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", lineHeight: 1.15, margin: "16px 0 12px" }}>{article.title}</h1>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 18, lineHeight: 1.7, margin: "0 0 28px" }}>{article.summary}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {article.sections.map((section, index) => (
          <section key={index} className="card" style={{ padding: 24 }}>
            <h2 style={{ margin: "0 0 10px", fontSize: 22 }}>{section.heading}</h2>
            <p style={{ margin: 0, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>{section.body}</p>
          </section>
        ))}
      </div>

      <div style={{ marginTop: 32, textAlign: "center" }}>
        <Link to="/#jobs" className="btn btn-primary">Browse Jobs</Link>
      </div>
    </main>
  );
}
