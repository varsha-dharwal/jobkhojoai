import { Link } from "react-router";
import FAQSection from "../FAQSection";
import AuthorByline from "../AuthorByline";

const FAQS = [
  {
    question: "Is the resume builder really free?",
    answer: "Yes. Building, previewing and downloading your resume as a PDF costs nothing and needs no payment details. Signing in is optional and only used to save your draft so you can continue on another device.",
  },
  {
    question: "What does ATS-friendly mean?",
    answer: "Many companies, including most large IT employers in India, run applications through an applicant tracking system (ATS) that reads the text of your resume before a recruiter does. An ATS-friendly resume uses a single column, standard section headings and real text instead of images or tables, so the software can read every line correctly.",
  },
  {
    question: "Should a fresher's resume be one page?",
    answer: "Yes. With no full-time experience, one page is enough to show your education, skills, two or three projects and any internship. Recruiters screening hundreds of fresher resumes spend well under a minute on each one, so a tight page works in your favour.",
  },
  {
    question: "Should I add a photo, date of birth or my full address?",
    answer: "No, not for private-sector jobs. They take up space, add nothing to your chances, and some ATS tools read photos poorly. Your city, phone number, email and LinkedIn or GitHub link are enough. Follow the employer's instructions if a government or overseas application asks for more.",
  },
  {
    question: "What should I write if I have no internship?",
    answer: "Lead with projects. Two or three projects you can explain in detail, with what you built, the tools you used and the result, carry more weight than a list of certificates. College projects, hackathons and open-source contributions all count.",
  },
  {
    question: "Is my data stored anywhere?",
    answer: "Your draft is saved in your own browser while you work. It is only stored on our server if you choose to sign in to save it. To have a saved resume deleted, contact us. See our privacy policy for details.",
  },
];

// Readable guidance shown with the builder, so the page explains itself to people
// (and search engines) before the interactive tool loads.
export default function ResumeGuide(){
  return (
    <section className="resume-guide doc-body prose" aria-labelledby="resume-guide-heading">
      <h2 id="resume-guide-heading">How to use the resume builder</h2>
      <AuthorByline updated="2026-10-11" />
      <p>
        The builder walks you through your resume one section at a time and shows a live preview as you type. It is
        designed for students, freshers and anyone with less than two years of experience applying for tech jobs and
        internships in India.
      </p>
      <ol>
        <li><strong>Choose the template.</strong> The Fresher Classic layout keeps the main content in a single column, which applicant tracking software reads reliably, and suits IT services, product and startup roles alike.</li>
        <li><strong>Personal details.</strong> Name, city, phone, a professional email address and your LinkedIn or GitHub link. Leave out your photo, date of birth and full address.</li>
        <li><strong>Education.</strong> Degree, branch, college, graduation year and CGPA or percentage. Add Class 12 and Class 10 only if the companies you're targeting ask for them, as many mass recruiters do.</li>
        <li><strong>Skills.</strong> Group them: languages, frameworks, databases, tools. List only what you can answer interview questions on.</li>
        <li><strong>Projects and internship.</strong> For each, write two or three lines: what it does, what you built, and the tools you used. Add a link to the code or a live demo.</li>
        <li><strong>Certifications and summary.</strong> Add certifications relevant to the role, then a two-line summary of who you are and what you're looking for.</li>
        <li><strong>Review and download.</strong> The readiness check flags missing sections and weak points. Fix them, then download the PDF.</li>
      </ol>

      <h2>What recruiters look for in a fresher resume</h2>
      <p>
        At the fresher level, recruiters are not comparing years of experience. They check three things quickly: whether
        you meet the eligibility criteria (degree, graduation year, minimum marks), whether your skills match the role, and
        whether you have built anything real. Make all three easy to find.
      </p>
      <ul>
        <li><strong>Eligibility at the top.</strong> Your degree, branch, year and CGPA should be visible in the first few lines. Bulk hiring drives at large IT companies often filter on these first.</li>
        <li><strong>Projects with specifics.</strong> "Built a library management system" says little. "Built a library management app in React and Node.js with login, search and due-date reminders for 200+ books" shows what you can do.</li>
        <li><strong>Skills that match the job.</strong> Read the job post and use the same names for skills you genuinely have, such as "SQL" or "REST APIs". Automated screening often matches exact terms.</li>
        <li><strong>No filler.</strong> Objective statements like "seeking a challenging role" and long lists of hobbies take space without adding information.</li>
      </ul>

      <h2>Common mistakes that get resumes rejected</h2>
      <ul>
        <li>Two-column layouts, tables and text inside images, which many ATS tools read in the wrong order or skip.</li>
        <li>Spelling mistakes in your own name, email or skill names. Read the final PDF once out loud before sending it.</li>
        <li>An unprofessional email address. Use a simple one built from your name.</li>
        <li>Listing skills you can't discuss. Interviewers often pick something from your skills list and ask you to explain it.</li>
        <li>Sending the same resume everywhere. Adjusting your summary and skills order for each role takes five minutes and makes a visible difference.</li>
      </ul>

      <p>
        For a deeper walkthrough with examples, read our <Link to="/career-guide/resume-guide-for-it-freshers">resume guide for IT freshers</Link>.
        When your resume is ready, <Link to="/jobs">browse current jobs and internships</Link>.
      </p>

      <FAQSection items={FAQS} title="Resume builder FAQs" />
    </section>
  );
}
