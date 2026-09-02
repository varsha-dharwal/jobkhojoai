import { StepShell } from "../FormFields";

function flattenSkills(skills) {
  return Object.values(skills || {}).flat();
}

function ReviewRow({ label, value, onEdit }) {
  return (
    <div className="resume-review-row">
      <div>
        <strong>{label}</strong>
        <p>{value || <em style={{ color: "var(--color-text-tertiary)" }}>Not filled in yet</em>}</p>
      </div>
      <button type="button" className="btn-ghost-link" onClick={onEdit}>Edit</button>
    </div>
  );
}

export default function ReviewStep({ resume, onEditStep, onCheckResume }) {
  const skills = flattenSkills(resume.skills).join(", ");
  return (
    <StepShell title="Review" subtitle="Take one last look before checking your resume.">
      <ReviewRow label="Personal" value={`${resume.personal.fullName} — ${resume.personal.targetTitle}`} onEdit={() => onEditStep("personal")} />
      <ReviewRow label="Education" value={`${resume.education.degree}, ${resume.education.college}`} onEdit={() => onEditStep("education")} />
      <ReviewRow label="Skills" value={skills} onEdit={() => onEditStep("skills")} />
      <ReviewRow label="Projects" value={resume.projects.map((p) => p.name).filter(Boolean).join(", ")} onEdit={() => onEditStep("projects")} />
      <ReviewRow
        label="Internship"
        value={resume.hasInternship ? `${resume.internship.role} at ${resume.internship.company}` : "None"}
        onEdit={() => onEditStep("internship")}
      />
      <ReviewRow label="Certifications" value={resume.certifications.map((c) => c.name).filter(Boolean).join(", ")} onEdit={() => onEditStep("certifications")} />
      <ReviewRow label="Summary" value={resume.summary} onEdit={() => onEditStep("summary")} />

      <button type="button" className="btn btn-primary" onClick={onCheckResume} style={{ marginTop: 20 }}>
        🔍 Check My Resume — Free
      </button>
    </StepShell>
  );
}
