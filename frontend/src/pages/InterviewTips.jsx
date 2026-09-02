import { Link } from "react-router-dom";
import {
  Compass, UserRound, Users, Code2, Terminal, Star, Wrench, FileText, Building2,
  MessageCircle, Video, ClipboardCheck, IndianRupee, AlertTriangle, HelpCircle,
  GraduationCap, CalendarDays, Trophy, Briefcase, MonitorSmartphone, Server,
  Layers, Bot, BarChart3, Cloud, ShieldCheck, FlaskConical,
} from "lucide-react";
import SEO from "../components/SEO";

const TOC = [
  { id: "how-to-prepare", label: "How to Prepare" },
  { id: "tell-me-about-yourself", label: "Tell Me About Yourself" },
  { id: "hr-questions", label: "HR Questions" },
  { id: "technical", label: "Technical Prep" },
  { id: "coding", label: "Coding Rounds" },
  { id: "behavioral", label: "Behavioral (STAR)" },
  { id: "projects", label: "Project Questions" },
  { id: "resume", label: "Resume-Based" },
  { id: "company-research", label: "Company Research" },
  { id: "communication", label: "Communication" },
  { id: "virtual", label: "Virtual Interviews" },
  { id: "checklist", label: "Interview Day Checklist" },
  { id: "salary", label: "Salary Discussion" },
  { id: "mistakes", label: "Common Mistakes" },
  { id: "ask-them", label: "Questions to Ask" },
  { id: "fresher-vs-experienced", label: "Fresher vs Experienced" },
  { id: "prep-plan", label: "7-Day Prep Plan" },
  { id: "final-checklist", label: "Final Checklist" },
];

const ROLE_PREP = [
  { icon: MonitorSmartphone, title: "Frontend Developer", slug: "frontend", focus: "HTML, CSS, JavaScript, DOM, React, TypeScript, APIs, Git, responsive design, browser fundamentals, performance and testing." },
  { icon: Server, title: "Backend Developer", slug: "backend", focus: "Programming fundamentals, APIs, databases, authentication, caching, backend frameworks, security, scalability and system design." },
  { icon: Layers, title: "Full Stack Developer", slug: "full-stack", focus: "Frontend + Backend + Databases + APIs + Authentication + Deployment + basic system design." },
  { icon: Bot, title: "AI / ML", slug: "ai", focus: "Python, statistics, probability, ML algorithms, model evaluation, data preprocessing and deep learning fundamentals." },
  { icon: BarChart3, title: "Data Science", slug: "data-science", focus: "Python, SQL, statistics, data cleaning, visualization, experimentation and business problem solving." },
  { icon: Cloud, title: "DevOps / Cloud", slug: "devops", focus: "Linux, networking, Docker, Kubernetes, CI/CD, cloud services, Infrastructure as Code, monitoring and security." },
  { icon: ShieldCheck, title: "Cybersecurity", slug: "cyber-security", focus: "Networking, Linux, web security, authentication, common vulnerabilities and defensive security concepts." },
  { icon: FlaskConical, title: "QA", slug: "qa", focus: "Testing fundamentals, test cases, bug lifecycle, API testing, SQL, automation and CI/CD basics." },
];

const HR_QUESTIONS = [
  "Tell me about yourself.", "Why do you want to work here?", "Why are you interested in this role?",
  "What are your strengths?", "What is one area you're currently improving?", "Why should we hire you?",
  "Where do you see yourself in 3–5 years?", "Why are you leaving your current company?", "What motivates you?",
  "Tell me about an achievement you're proud of.", "How do you handle pressure?", "How do you deal with disagreements?",
  "What type of work environment do you prefer?", "What are your salary expectations?",
  "Are you comfortable working remotely/hybrid?", "Why is there a gap in your employment?",
  "What do you know about our company?", "What are your career goals?", "When can you join?",
  "Do you have any questions for us?",
];

const COMMON_MISTAKES = [
  "Not researching the company", "Giving extremely long answers", "Memorizing robotic answers",
  "Lying about skills", "Adding fake projects/experience", "Speaking negatively about previous employers",
  "Not understanding your own resume", "Interrupting the interviewer", "Not asking any questions",
  "Failing to prepare examples",
];

const ASK_INTERVIEWER = [
  "What would success look like in the first 90 days?",
  "What are the biggest challenges someone in this role would work on?",
  "How is the engineering/design/data team structured?",
  "How does the team review and ship work?",
  "What opportunities are available for learning and growth?",
];

const PREP_PLAN = [
  { day: "Day 1", focus: "Understand JD + Company" },
  { day: "Day 2", focus: "Resume + Projects" },
  { day: "Day 3", focus: "Core Technical Concepts" },
  { day: "Day 4", focus: "Coding / Role-Specific Practice" },
  { day: "Day 5", focus: "HR + Behavioral Questions" },
  { day: "Day 6", focus: "Mock Interview + Weak Areas" },
  { day: "Day 7", focus: "Final Revision + Interview" },
];

const FINAL_CHECKLIST = [
  "Can I introduce myself clearly?",
  "Can I explain every major item on my resume?",
  "Can I explain my strongest projects?",
  "Do I understand the job description?",
  "Have I researched the company?",
  "Have I revised the important technical concepts?",
  "Do I have STAR stories ready?",
  "Do I have questions for the interviewer?",
];

const DAY_CHECKLIST = [
  "Resume", "Job Description", "Company Research", "Project Revision",
  "Technical Revision", "Interview Link/Location", "Laptop & Internet", "Questions for Interviewer",
];

function SectionIcon({ icon: Icon }){
  return <Icon size={22} aria-hidden="true" style={{ color: "var(--color-brand-strong)", flexShrink: 0 }} />;
}

export default function InterviewTips(){
  return (
    <main className="container guide-page">
      <SEO
        title="Interview Preparation Guide | jobkhojoAI"
        description="A free, no-fluff interview preparation guide covering HR, technical, coding, behavioral and virtual interviews — for freshers and experienced tech professionals."
        path="/career-guide/interview-tips"
      />

      <div className="guide-hero">
        <span className="hero-eyebrow"><span className="dot" aria-hidden="true" /> Free Guide</span>
        <h1>Ace Your Next Tech Interview</h1>
        <p>
          Prepare smarter, answer confidently, and walk in with a clear strategy — whether you're a fresher
          applying for your first internship or an experienced professional preparing for your next role.
        </p>
      </div>

      <nav className="guide-toc" aria-label="Guide sections">
        {TOC.map(t => (
          <a key={t.id} href={`#${t.id}`} className="tag-pill">{t.label}</a>
        ))}
      </nav>

      <section className="guide-section" id="how-to-prepare">
        <h2><SectionIcon icon={Compass} /> How to Prepare for an Interview</h2>
        <p>Preparation should start before the actual interview day. Before you go in, work through this:</p>
        <ul className="guide-check-list">
          <li>Read the complete Job Description carefully and identify the most important skills mentioned.</li>
          <li>Research the company, its product, industry and recent developments.</li>
          <li>Review everything on your resume and prepare examples from your projects and work.</li>
          <li>Practice common HR and behavioral questions, and revise role-specific technical concepts.</li>
          <li>Prepare 3–5 thoughtful questions for the interviewer.</li>
          <li>Test your laptop, microphone and internet if it's an online interview.</li>
        </ul>
        <p style={{marginTop:"var(--space-6)"}}>
          Don't try to memorize hundreds of answers. Instead, understand your own:
        </p>
        <div className="guide-flow">
          Skills <span className="sep">→</span> Projects <span className="sep">→</span> Experience{" "}
          <span className="sep">→</span> Achievements <span className="sep">→</span> Challenges{" "}
          <span className="sep">→</span> Career Goals
        </div>
        <p className="guide-prose">Most interview answers can be built around these six areas.</p>
      </section>

      <section className="guide-section" id="tell-me-about-yourself">
        <h2><SectionIcon icon={UserRound} /> How to Answer "Tell Me About Yourself"</h2>
        <p className="guide-prose">This is often the first question you'll get. Don't tell your entire life story — use this structure instead:</p>
        <div className="guide-flow">
          Present <span className="sep">→</span> Experience <span className="sep">→</span> Skills{" "}
          <span className="sep">→</span> Achievement/Project <span className="sep">→</span> Why this opportunity
        </div>
        <blockquote className="guide-quote">
          "I'm a recent Computer Science graduate with a strong interest in frontend development. I've been working
          with HTML, CSS, JavaScript and React and have built projects including an e-commerce application and task
          management app. Through these projects, I've gained practical experience working with APIs, responsive
          design and Git. I'm now looking for an opportunity where I can contribute to real products while
          continuing to grow as a frontend developer."
        </blockquote>
        <p className="guide-prose" style={{marginTop:"var(--space-6)"}}><strong>Experienced candidates</strong>, use instead:</p>
        <div className="guide-flow">
          Current Role <span className="sep">→</span> Experience <span className="sep">→</span> Key Expertise{" "}
          <span className="sep">→</span> Major Impact <span className="sep">→</span> Next Career Goal
        </div>
        <p className="guide-prose">Keep your introduction relevant to the job you're actually interviewing for.</p>
      </section>

      <section className="guide-section" id="hr-questions">
        <h2><SectionIcon icon={Users} /> Common HR Interview Questions</h2>
        <p className="guide-prose">
          Don't memorize "perfect answers" to these — learn to construct your own from your real experience.
          That's what actually works in the room.
        </p>
        <details className="guide-accordion">
          <summary>See the 20 most common HR questions</summary>
          <div className="guide-accordion-body">
            <ul>
              {HR_QUESTIONS.map(q => <li key={q}>{q}</li>)}
            </ul>
          </div>
        </details>
      </section>

      <section className="guide-section" id="technical">
        <h2><SectionIcon icon={Code2} /> Technical Interview Preparation</h2>
        <p className="guide-prose">
          Technical interviews evaluate more than definitions — expect a mix of Fundamentals, Problem Solving,
          Practical Knowledge, Projects and Communication. Prepare according to your target role, then dive into
          the full roadmap for it:
        </p>
        <div className="guide-role-grid" style={{marginTop:"var(--space-7)"}}>
          {ROLE_PREP.map(r => (
            <Link key={r.title} to={`/roadmap/${r.slug}`} className="card feature-card guide-role-card">
              <div className="feature-icon"><r.icon aria-hidden="true" /></div>
              <h3>{r.title}</h3>
              <p>{r.focus}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="guide-section" id="coding">
        <h2><SectionIcon icon={Terminal} /> Coding Interview Preparation</h2>
        <p className="guide-prose">Coding rounds evaluate:</p>
        <div className="guide-flow">
          Problem understanding <span className="sep">→</span> Approach <span className="sep">→</span> Implementation{" "}
          <span className="sep">→</span> Testing <span className="sep">→</span> Complexity <span className="sep">→</span> Communication
        </div>
        <p className="guide-prose">
          Common areas: arrays, strings, hash maps, linked lists, stacks, queues, trees, graphs, recursion,
          sorting, searching and dynamic programming. Don't jump straight to hard problems — progress through:
        </p>
        <div className="guide-flow">
          Fundamentals <span className="sep">→</span> Easy Problems <span className="sep">→</span> Patterns{" "}
          <span className="sep">→</span> Medium Problems <span className="sep">→</span> Timed Practice <span className="sep">→</span> Mock Interviews
        </div>
        <p className="guide-prose" style={{marginTop:"var(--space-6)"}}>
          <strong>During the round:</strong> understand the problem, clarify assumptions, discuss your approach out
          loud, write clean code, test edge cases, then explain the complexity. Silently coding for 20 minutes
          rarely goes well.
        </p>
      </section>

      <section className="guide-section" id="behavioral">
        <h2><SectionIcon icon={Star} /> Behavioral Interviews — The STAR Method</h2>
        <p className="guide-prose">Structure every behavioral answer around four parts:</p>
        <ul className="guide-check-list">
          <li><strong>Situation</strong> — what was happening?</li>
          <li><strong>Task</strong> — what were you responsible for?</li>
          <li><strong>Action</strong> — what specifically did you do?</li>
          <li><strong>Result</strong> — what happened because of your actions?</li>
        </ul>
        <p className="guide-prose" style={{marginTop:"var(--space-6)"}}>
          Instead of "I fixed a website performance issue," a stronger answer explains the context, your
          responsibility, what you changed, and the measurable or observable result — without inventing numbers.
        </p>
        <p className="guide-prose">Prepare STAR stories around: leadership, teamwork, conflict, failure, tight deadlines, difficult problems, initiative, customer impact, learning something quickly, and receiving feedback.</p>
      </section>

      <section className="guide-section" id="projects">
        <h2><SectionIcon icon={Wrench} /> Project-Based Interview Questions</h2>
        <p className="guide-prose">If a project is on your resume, be ready to explain it end to end:</p>
        <div className="guide-flow">
          Problem <span className="sep">→</span> Why you built it <span className="sep">→</span> Tech Stack{" "}
          <span className="sep">→</span> Architecture <span className="sep">→</span> Your Contribution{" "}
          <span className="sep">→</span> Challenges <span className="sep">→</span> Decisions <span className="sep">→</span> Results
        </div>
        <details className="guide-accordion">
          <summary>Questions you should be ready for</summary>
          <div className="guide-accordion-body">
            <ul>
              <li>Why did you choose React?</li>
              <li>How does authentication work?</li>
              <li>How did you structure your database?</li>
              <li>What was the hardest bug?</li>
              <li>What happens when 10× more users arrive?</li>
              <li>How did you deploy it?</li>
              <li>What would you change if you rebuilt it today?</li>
            </ul>
          </div>
        </details>
        <p className="guide-prose" style={{marginTop:"var(--space-6)"}}><strong>Never add a technology to your resume that you cannot comfortably discuss.</strong></p>
      </section>

      <section className="guide-section" id="resume">
        <h2><SectionIcon icon={FileText} /> Resume-Based Interview Preparation</h2>
        <p className="guide-prose">
          Before an interview, read your resume top to bottom — you should be able to explain every skill,
          project, job, internship, certification and achievement on it.
        </p>
        <p className="guide-prose">
          If you write <strong>"React — Advanced,"</strong> expect deeper React questions. If you write{" "}
          <strong>"Improved application performance,"</strong> be ready to explain what was slow, what you
          changed, and how you measured the improvement.
        </p>
      </section>

      <section className="guide-section" id="company-research">
        <h2><SectionIcon icon={Building2} /> How to Research a Company</h2>
        <p className="guide-prose">Before your interview, understand: what the company does, its products/services, who its customers are, what your role contributes, and why you're genuinely interested. Good research makes "Why do you want to join us?" much easier to answer naturally.</p>
      </section>

      <section className="guide-section" id="communication">
        <h2><SectionIcon icon={MessageCircle} /> Communication Tips</h2>
        <p className="guide-prose">You don't need complicated English to do well — focus on <strong>Clear over Fancy</strong>. Keep answers structured and relevant, and avoid excessive filler words.</p>
        <ul className="guide-check-list">
          <li>Don't understand a question? "Could you please clarify what you mean by…?"</li>
          <li>Need a moment? "I'd like a moment to think through that."</li>
          <li>Don't know something? "I haven't worked with that directly yet, but here's how I'd approach learning or solving it…"</li>
        </ul>
        <p className="guide-prose" style={{marginTop:"var(--space-6)"}}>Don't pretend to know something you don't.</p>
      </section>

      <section className="guide-section" id="virtual">
        <h2><SectionIcon icon={Video} /> Virtual Interview Tips</h2>
        <ul className="guide-check-list">
          <li>Check your internet connection, microphone and camera beforehand.</li>
          <li>Use a quiet environment with the camera near eye level.</li>
          <li>Close unnecessary apps and disable notifications.</li>
          <li>Join a few minutes early, with your resume and JD accessible.</li>
          <li>Maintain natural eye contact, and keep water and a notebook nearby.</li>
        </ul>
      </section>

      <section className="guide-section" id="checklist">
        <h2><SectionIcon icon={ClipboardCheck} /> Interview Day Checklist</h2>
        <div className="guide-role-grid" style={{gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))"}}>
          <div className="card feature-card">
            <h3 style={{margin:"0 0 var(--space-5)", fontSize:"var(--font-size-md)"}}>Before</h3>
            <ul className="guide-check-list">
              {DAY_CHECKLIST.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="card feature-card">
            <h3 style={{margin:"0 0 var(--space-5)", fontSize:"var(--font-size-md)"}}>During</h3>
            <ul className="guide-check-list">
              <li>Listen carefully and think before answering</li>
              <li>Use real examples and explain your reasoning</li>
              <li>Ask clarifying questions when necessary</li>
            </ul>
          </div>
          <div className="card feature-card">
            <h3 style={{margin:"0 0 var(--space-5)", fontSize:"var(--font-size-md)"}}>After</h3>
            <ul className="guide-check-list">
              <li>Write down questions you struggled with</li>
              <li>Review weak concepts</li>
              <li>Send a concise thank-you/follow-up when appropriate</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="guide-section" id="salary">
        <h2><SectionIcon icon={IndianRupee} /> Salary Discussion</h2>
        <p className="guide-prose">Don't panic at "What are your salary expectations?" Research compensation for the role, experience level, location and company type beforehand. You can respond along the lines of:</p>
        <blockquote className="guide-quote">
          "I'm primarily focused on finding the right role and team. Based on the responsibilities and market range
          for similar positions, I have a range in mind, but I'm open to discussing the complete compensation
          package."
        </blockquote>
        <p className="guide-prose">Experienced candidates should also weigh: Base Salary + Variable Pay + Joining Bonus + Equity + Benefits + Work Arrangement.</p>
      </section>

      <section className="guide-section" id="mistakes">
        <h2><SectionIcon icon={AlertTriangle} /> Common Interview Mistakes</h2>
        <details className="guide-accordion">
          <summary>10 mistakes to avoid</summary>
          <div className="guide-accordion-body">
            <ul>
              {COMMON_MISTAKES.map(m => <li key={m}>{m}</li>)}
            </ul>
          </div>
        </details>
      </section>

      <section className="guide-section" id="ask-them">
        <h2><SectionIcon icon={HelpCircle} /> Questions You Can Ask the Interviewer</h2>
        <p className="guide-prose">Candidates often forget this part. Good questions include:</p>
        <ul className="guide-check-list">
          {ASK_INTERVIEWER.map(q => <li key={q}>{q}</li>)}
        </ul>
        <p className="guide-prose" style={{marginTop:"var(--space-6)"}}>Avoid asking anything whose answer is clearly on the company's homepage.</p>
      </section>

      <section className="guide-section" id="fresher-vs-experienced">
        <h2><SectionIcon icon={GraduationCap} /> Fresher vs Experienced — What Changes</h2>
        <div className="guide-role-grid" style={{gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))"}}>
          <div className="card feature-card">
            <h3 style={{margin:"0 0 var(--space-5)", display:"flex", alignItems:"center", gap:8}}>
              <GraduationCap size={18} aria-hidden="true" style={{color:"var(--color-brand-strong)"}} /> Freshers
            </h3>
            <p className="guide-prose" style={{margin:0}}>
              Without years of professional experience, your projects carry the weight. Explain: what you built,
              why, how, your contribution, the challenge, the result, and what you learned.
            </p>
            <div className="guide-flow" style={{marginTop:"var(--space-6)", fontSize:"var(--font-size-sm)"}}>
              Fundamentals <span className="sep">→</span> Projects <span className="sep">→</span> Internships{" "}
              <span className="sep">→</span> Problem Solving <span className="sep">→</span> Communication <span className="sep">→</span> Learning Ability
            </div>
          </div>
          <div className="card feature-card">
            <h3 style={{margin:"0 0 var(--space-5)", display:"flex", alignItems:"center", gap:8}}>
              <Briefcase size={18} aria-hidden="true" style={{color:"var(--color-brand-strong)"}} /> Experienced Professionals
            </h3>
            <p className="guide-prose" style={{margin:0}}>
              Instead of "I know React," explain what you built with it, why that approach was chosen, what
              trade-offs you made, and what impact your work had.
            </p>
            <div className="guide-flow" style={{marginTop:"var(--space-6)", fontSize:"var(--font-size-sm)"}}>
              Impact <span className="sep">→</span> Ownership <span className="sep">→</span> Architecture{" "}
              <span className="sep">→</span> Decisions <span className="sep">→</span> Leadership <span className="sep">→</span> Collaboration
            </div>
          </div>
        </div>
      </section>

      <section className="guide-section" id="prep-plan">
        <h2><SectionIcon icon={CalendarDays} /> 7-Day Interview Preparation Plan</h2>
        <p className="guide-prose">
          24 hours before? Don't cram a whole technology overnight — prioritize Resume → JD → Company → Core
          concepts → Projects → STAR stories → Common questions → Rest. The goal is revision, not panic-learning.
        </p>
        <div className="guide-table-wrap" style={{marginTop:"var(--space-6)"}}>
          <table className="guide-table">
            <thead>
              <tr><th>Day</th><th>Focus</th></tr>
            </thead>
            <tbody>
              {PREP_PLAN.map(p => (
                <tr key={p.day}><td>{p.day}</td><td>{p.focus}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="guide-section" id="final-checklist">
        <h2><SectionIcon icon={Trophy} /> Final Interview Checklist</h2>
        <p className="guide-prose">Before clicking "Join Interview," you should be able to answer yes to:</p>
        <ul className="guide-check-list">
          {FINAL_CHECKLIST.map(item => <li key={item}>{item}</li>)}
        </ul>
        <p className="guide-prose" style={{marginTop:"var(--space-6)"}}>If most answers are yes, you're much better prepared than most candidates walking in.</p>
      </section>

      <div className="guide-cta">
        <h2>Interview prep starts with a strong resume</h2>
        <p>Create a clean, professional, ATS-friendly resume for your next tech opportunity with jobkhojoAI.</p>
        <Link to="/career-guide/resume-builder" className="btn btn-primary">Build My Resume →</Link>
        <div className="guide-cta-links">
          <a href="/#jobs">Explore Tech Jobs →</a>
          <Link to="/?category=Internship#jobs">Find Internships →</Link>
          <a href="/#roadmaps">Explore Career Roadmaps →</a>
        </div>
      </div>
    </main>
  );
}
