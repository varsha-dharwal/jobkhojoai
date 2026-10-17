import { BookOpen, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { INSTAGRAM_URL, WHATSAPP_URL } from "../lib/site";
import { applyTarget, experienceText, formatDate, locationLabel, salaryText, skillsList, textLines, workMode } from "../lib/jobs";
import JobAuthor from "./JobAuthor";

const MISSING = "Not specified in the available listing.";

function InstagramIcon(){
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function OverviewTable({ rows }){
  return (
    <div className="job-article-table-wrap">
      <table className="job-article-table">
        <tbody>{rows.map(([label, value]) => (
          <tr key={label}><th scope="row">{label}</th><td>{value || MISSING}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}

function SourceText({ text, list = false }){
  const lines = textLines(text);
  if (!lines.length) return null;
  return list
    ? <ul className="prose-list">{lines.map((line, i) => <li key={`${i}-${line}`}>{line}</li>)}</ul>
    : <div className="prose">{lines.map((line, i) => <p key={`${i}-${line}`}>{line}</p>)}</div>;
}

function introduction(job){
  const exp = experienceText(job);
  const education = (job.education || "").trim();
  const role = textLines(job.roleDescription).join(" ");
  const roleSummary = role.length > 360 ? `${role.slice(0, 357).replace(/\s+\S*$/, "")}…` : role;
  const applyHost = applyTarget(job).host;
  const facts = [
    `${job.organization} is named in this listing for the ${job.title} position in ${locationLabel(job)}.`,
    `The listed arrangement is ${workMode(job).toLowerCase()}${job.category ? ` and ${job.category.toLowerCase()}` : ""}${exp ? `, with ${exp} of experience requested` : ""}${education ? `; the listed education requirement is ${education}` : ""}.`,
    roleSummary ? `The available role description says: ${roleSummary}` : "The listing does not include a detailed role description, so candidates should review the source posting for day-to-day duties.",
    applyHost ? `Applications are directed to ${applyHost}; review the original posting and confirm its current instructions before sharing personal information.` : "Review the original listing for application instructions before sharing personal information.",
  ];
  return facts.join(" ");
}

function JobFaq({ job, location, exp, salary, target }){
  const questions = [
    ["What role is listed?", `${job.title} at ${job.organization}.`],
    ["What experience is required?", exp || MISSING],
    ["What qualification is required?", job.education || MISSING],
    ["Where is the role based, and what is the work mode?", `${location}; ${workMode(job)}.`],
    ["Is the salary listed?", salary || "Salary was not specified in the available listing. Confirm compensation with the original source."],
    ["How do I apply?", target.host ? `Use the Apply Here button to continue to ${target.host}, then follow the instructions on that listing.` : "Use the Apply Here button to open the application destination."],
  ];
  return <div className="job-faq-list">{questions.map(([question, answer]) => (
    <details className="job-faq-item" key={question}>
      <summary>{question}</summary><p>{answer}</p>
    </details>
  ))}</div>;
}

export default function JobArticle({ job, relatedJobs = [], path }){
  const location = locationLabel(job);
  const exp = experienceText(job);
  const salary = salaryText(job);
  const target = applyTarget(job);
  const skills = skillsList(job);
  const rows = [
    ["Company or recruiter listed", job.organization],
    ["Job role", job.title],
    ["Qualification", job.education],
    ["Experience", exp],
    ["Location", location],
    ["Job type", job.category],
    ["Work mode", workMode(job)],
    ["Salary", salary],
    ["Application deadline", job.lastDate ? formatDate(job.lastDate) : ""],
    ["Application source", target.host ? <a key="application-source" href={job.applyLink} target="_blank" rel="noopener noreferrer nofollow">{target.host}</a> : ""],
  ];

  const sections = [
    { id: "job-overview", title: "Job overview", content: <OverviewTable rows={rows} /> },
  ];
  if (job.roleDescription && textLines(job.roleDescription).length) sections.push({
    id: "about-the-role", title: "About the role", content: <SourceText text={job.roleDescription} />,
  });
  sections.push({
    id: "responsibilities", title: "Roles and responsibilities", content: job.responsibilities && textLines(job.responsibilities).length
      ? <SourceText text={job.responsibilities} list />
      : <p>Specific responsibilities were not separately stated in the available listing. Review the role description and confirm day-to-day duties with the application source.</p>,
  });
  sections.push({
    id: "eligibility", title: "Eligibility criteria", content: job.requirements && textLines(job.requirements).length
      ? <SourceText text={job.requirements} list />
      : <p>Detailed eligibility criteria were not separately specified in the available listing. Refer to the listed experience and education in the job overview, and confirm any additional requirements with the application source.</p>,
  });
  sections.push({
    id: "skills-preparation", title: "Required skills and preparation", content: (
      <>
        {skills.length > 0 && <ul className="chip-list job-article-skills">{skills.map(skill => <li className="chip" key={skill}>{skill}</li>)}</ul>}
        <div className="job-guidance">
          {skills.length
            ? <p><strong>JobKhojo career guidance:</strong> Review the skills named in the listing and prepare a clear example of where you have used each relevant skill. Be ready to explain your contribution and the outcome; this is preparation advice, not an additional employer requirement.</p>
            : <p>The available listing does not name specific skills. <strong>JobKhojo career guidance:</strong> Review the role description and prepare examples of relevant work and experience; confirm any mandatory skills with the source.</p>}
          <p>For the application, tailor your resume to the listed requirements and include links to relevant work when you have them.</p>
          <p className="job-guide-links"><Link to="/career-guide/interview-tips"><BookOpen size={15} aria-hidden="true" /> Interview preparation guide</Link>{path && <Link to={`/roadmap/${path.slug}`}>Explore the {path.title} career path</Link>}</p>
        </div>
      </>
    ),
  });
  if (salary || job.category) sections.push({
    id: "salary-benefits", title: "Salary and benefits", content: (
      <p>{salary ? `The salary shown in the listing is ${salary}.` : "Salary information was not specified in the available listing. Confirm compensation and any benefits with the original source."} {job.category ? `The listed employment type is ${job.category}.` : "Employment type was not specified in the available listing."} No additional benefits are stated here unless they appear in the source details above.</p>
    ),
  });
  sections.push({
    id: "how-to-apply", title: "Application process", content: (
      <>
        <ol className="job-steps">
          <li>Review the job description and the requirements in this listing.</li>
          <li>Prepare a current resume and any documents the original listing requests.</li>
          <li>Choose <strong>Apply Here</strong> to continue to {target.host || "the application destination"} and follow its instructions.</li>
          <li>Keep any confirmation or reference details provided by the application site.</li>
        </ol>
        <p>Check that the opportunity and application instructions match the source before sharing personal information. <Link to="/career-guide/how-to-spot-fake-job-posts">Read our guide to spotting fake job posts</Link>.</p>
      </>
    ),
  });
  sections.push({
    id: "about-company", title: `About ${job.organization}`, content: job.aboutCompany && textLines(job.aboutCompany).length
      ? <SourceText text={job.aboutCompany} />
      : <p>Additional company background is not included in the available listing. Verify the organization and role through the application source.</p>,
  });
  sections.push({
    id: "selection-process", title: "Selection process", content: (
      <p>The available listing does not describe the employer's selection stages. As general preparation, review the responsibilities and requirements, and be ready to discuss relevant experience. This is JobKhojo guidance; the actual process may differ.</p>
    ),
  });
  if (relatedJobs.length) sections.push({
    id: "related-listings", title: "Related job listings", content: (
      <ul className="job-related-links">{relatedJobs.slice(0, 2).map(related => <li key={related._id || related.slug}><Link to={`/jobs/${related.slug}`}>{related.title} at {related.organization}</Link></li>)}</ul>
    ),
  });
  sections.push({
    id: "job-faq", title: "Frequently asked questions", content: <JobFaq job={job} location={location} exp={exp} salary={salary} target={target} />,
  });
  sections.push({
    id: "job-disclaimer", title: "Disclaimer", content: <p>JobKhojo shares job information for general informational purposes. Listing details and application instructions can change, so verify the vacancy and next steps through the original application source. JobKhojo does not guarantee selection or employment and does not charge candidates for job updates or guaranteed selection.</p>,
  });

  return (
    <div className="job-article-content">
      <div className="job-follow-links" aria-label="Follow JobKhojo">
        {WHATSAPP_URL && <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Join the JobKhojo WhatsApp channel"><MessageCircle size={17} aria-hidden="true" /><span>Join our WhatsApp channel</span></a>}
        {INSTAGRAM_URL && <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Follow JobKhojo on Instagram"><InstagramIcon /><span>Follow on Instagram</span></a>}
      </div>

      <section className="job-intro" aria-label="Job introduction"><p>{introduction(job)}</p></section>

      <nav className="job-toc" aria-label="On this page">
        <h2>On this page</h2>
        <ol>{sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`}><span>{index + 1}</span>{section.title}</a></li>)}</ol>
      </nav>

      {sections.map(section => <section className="job-section job-article-section" id={section.id} key={section.id} aria-labelledby={`${section.id}-heading`}>
        <h2 id={`${section.id}-heading`}>{section.title}</h2>{section.content}
      </section>)}

      <JobAuthor />
    </div>
  );
}
