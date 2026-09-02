function flattenList(list) {
  return (list || []).filter(Boolean);
}

export default function FresherMinimalPreview({ resume }) {
  const { personal, education, skills, projects, hasInternship, internship, certifications, summary } = resume;
  const contactBits = [personal.city, personal.phone, personal.email, personal.linkedin, personal.github].filter(Boolean);
  const allSkills = Object.values(skills || {}).flat().filter(Boolean);

  return (
    <div className="resume-paper resume-paper-minimal">
      <header className="resume-paper-header">
        <h1>{personal.fullName || "Your Name"}</h1>
        <p className="resume-paper-title">{personal.targetTitle || "Target Job Title"}</p>
        {contactBits.length > 0 && <p className="resume-paper-contact">{contactBits.join(" · ")}</p>}
      </header>

      {summary && (
        <section>
          <h2>Summary</h2>
          <p>{summary}</p>
        </section>
      )}

      {allSkills.length > 0 && (
        <section>
          <h2>Skills</h2>
          <p>{allSkills.join(" • ")}</p>
        </section>
      )}

      {flattenList(projects).length > 0 && (
        <section>
          <h2>Projects</h2>
          {projects.map((p) => (
            <div key={p.id} className="resume-paper-item">
              <p className="resume-paper-item-title">{p.name}{p.tech && <span className="resume-paper-item-meta"> — {p.tech}</span>}</p>
              {p.description && <p>{p.description}</p>}
              {p.contribution && <p>{p.contribution}</p>}
            </div>
          ))}
        </section>
      )}

      {hasInternship && (internship.company || internship.role) && (
        <section>
          <h2>Experience</h2>
          <div className="resume-paper-item">
            <p className="resume-paper-item-title">{internship.role} · {internship.company}</p>
            <p className="resume-paper-item-meta">{internship.startDate} – {internship.endDate}</p>
            {flattenList(internship.bullets).map((b, i) => <p key={i}>{b}</p>)}
          </div>
        </section>
      )}

      {(education.degree || education.college) && (
        <section>
          <h2>Education</h2>
          <p className="resume-paper-item-title">{education.degree}{education.fieldOfStudy ? `, ${education.fieldOfStudy}` : ""} · {education.college}</p>
          <p className="resume-paper-item-meta">
            {education.startYear}{education.startYear ? " – " : ""}{education.gradYear}{education.cgpa ? ` · ${education.cgpa}` : ""}
          </p>
        </section>
      )}

      {flattenList(certifications).length > 0 && (
        <section>
          <h2>Certifications</h2>
          <p>{certifications.map((c) => `${c.name}${c.org ? ` — ${c.org}` : ""}`).join(" · ")}</p>
        </section>
      )}
    </div>
  );
}
