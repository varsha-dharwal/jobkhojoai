function flattenList(list) {
  return (list || []).filter(Boolean);
}

function dateRange(start, end) {
  return [start, end].filter(Boolean).join(" – ");
}

export default function FresherClassicPreview({ resume }) {
  const { personal, education, skills, projects, hasInternship, internship, certifications, summary } = resume;

  return (
    <div className="resume-paper resume-paper-classic">
      <header className="resume-paper-header">
        <div className="resume-paper-header-row">
          <div>
            <h1>{personal.fullName || "Full Name"}</h1>
            <p className="resume-paper-links">
              {[personal.linkedin, personal.github, personal.portfolio].filter(Boolean).join(" | ") || "LinkedIn | GitHub"}
            </p>
          </div>
          <div className="resume-paper-header-right">
            {personal.email && <p>Email: {personal.email}</p>}
            {personal.phone && <p>Mobile: {personal.phone}</p>}
          </div>
        </div>
        {personal.targetTitle && <p className="resume-paper-title">{personal.targetTitle}</p>}
      </header>

      {(education.degree || education.college) && (
        <section>
          <h2>Education</h2>
          <div className="resume-paper-row">
            <div>
              <p className="resume-paper-item-title">{education.college}</p>
              <p>{education.degree}{education.fieldOfStudy ? `, ${education.fieldOfStudy}` : ""}{education.cgpa ? ` — GPA: ${education.cgpa}` : ""}</p>
            </div>
            <div className="resume-paper-row-right">
              {personal.city && <p>{personal.city}</p>}
              <p>{dateRange(education.startYear, education.gradYear)}</p>
            </div>
          </div>
        </section>
      )}

      {summary && (
        <section>
          <h2>Summary</h2>
          <p>{summary}</p>
        </section>
      )}

      {Object.values(skills || {}).some((l) => l?.length) && (
        <section>
          <h2>Skills Summary</h2>
          <ul className="resume-paper-skills">
            {skills.languages?.length > 0 && <li><strong>Languages:</strong> {skills.languages.join(", ")}</li>}
            {skills.frameworks?.length > 0 && <li><strong>Frameworks:</strong> {skills.frameworks.join(", ")}</li>}
            {skills.tools?.length > 0 && <li><strong>Tools:</strong> {skills.tools.join(", ")}</li>}
            {skills.platforms?.length > 0 && <li><strong>Platforms:</strong> {skills.platforms.join(", ")}</li>}
            {skills.softSkills?.length > 0 && <li><strong>Soft Skills:</strong> {skills.softSkills.join(", ")}</li>}
          </ul>
        </section>
      )}

      {hasInternship && (internship.company || internship.role) && (
        <section>
          <h2>Work Experience</h2>
          <div className="resume-paper-item">
            <div className="resume-paper-row">
              <p className="resume-paper-item-title">{internship.role}{internship.company ? ` | ${internship.company}` : ""}</p>
              <p className="resume-paper-row-right">{dateRange(internship.startDate, internship.endDate)}</p>
            </div>
            <ul>
              {flattenList(internship.bullets).map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        </section>
      )}

      {flattenList(projects).length > 0 && (
        <section>
          <h2>Projects</h2>
          {projects.map((p) => (
            <div key={p.id} className="resume-paper-item">
              <div className="resume-paper-row">
                <p className="resume-paper-item-title">{p.name}{p.tech ? <span className="resume-paper-item-meta"> | {p.tech}</span> : ""}</p>
                <p className="resume-paper-row-right">{dateRange(p.startDate, p.endDate)}</p>
              </div>
              <ul>
                {p.description && <li>{p.description}</li>}
                {p.contribution && <li>{p.contribution}</li>}
              </ul>
            </div>
          ))}
        </section>
      )}

      {flattenList(certifications).length > 0 && (
        <section>
          <h2>Certificates</h2>
          {certifications.map((c) => (
            <div key={c.id} className="resume-paper-row">
              <p className="resume-paper-item-title">{c.name}{c.org ? ` | ${c.org}` : ""}</p>
              <p className="resume-paper-row-right">{c.year}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
