import { Field, StepShell } from "../FormFields";

export default function InternshipStep({ hasInternship, internship, onHasInternshipChange, onChange }) {
  const set = (name, value) => onChange({ [name]: value });

  function updateBullet(i, value) {
    const bullets = [...internship.bullets];
    bullets[i] = value;
    onChange({ bullets });
  }
  function addBullet() {
    onChange({ bullets: [...(internship.bullets || []), ""] });
  }
  function removeBullet(i) {
    onChange({ bullets: internship.bullets.filter((_, idx) => idx !== i) });
  }

  return (
    <StepShell title="Internship" subtitle="Have you completed an internship?">
      <div className="resume-yesno" role="radiogroup" aria-label="Have you completed an internship?">
        <button type="button" className={`btn ${hasInternship === true ? "btn-primary" : "btn-ghost"}`} onClick={() => onHasInternshipChange(true)}>Yes</button>
        <button type="button" className={`btn ${hasInternship === false ? "btn-primary" : "btn-ghost"}`} onClick={() => onHasInternshipChange(false)}>No</button>
      </div>

      {hasInternship === false && (
        <p className="guide-prose" style={{ marginTop: 16 }}>No problem — this section will be left out of your resume entirely.</p>
      )}

      {hasInternship === true && (
        <div style={{ marginTop: 20 }}>
          <div className="form-grid-2">
            <Field label="Company" name="company" value={internship.company} onChange={set} required />
            <Field label="Role" name="role" value={internship.role} onChange={set} required />
          </div>
          <div className="form-grid-2">
            <Field label="Start Date" name="startDate" value={internship.startDate} onChange={set} />
            <Field label="End Date" name="endDate" value={internship.endDate} onChange={set} />
          </div>
          <label style={{ display: "block", marginTop: 8 }}>Responsibilities / Achievements</label>
          {(internship.bullets || []).map((bullet, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input type="text" value={bullet} onChange={(e) => updateBullet(i, e.target.value)} />
              <button type="button" className="btn-ghost-link" onClick={() => removeBullet(i)}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn btn-ghost" onClick={addBullet}>+ Add Bullet</button>
        </div>
      )}
    </StepShell>
  );
}
