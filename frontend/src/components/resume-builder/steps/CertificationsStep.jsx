import { Field, StepShell } from "../FormFields";

function emptyCert() {
  return { id: crypto.randomUUID(), name: "", org: "", year: "", url: "" };
}

export default function CertificationsStep({ certifications, achievements, onChangeCertifications, onChangeAchievements }) {
  function addCert() {
    onChangeCertifications([...(certifications || []), emptyCert()]);
  }
  function updateCert(id, patch) {
    onChangeCertifications(certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function removeCert(id) {
    onChangeCertifications(certifications.filter((c) => c.id !== id));
  }

  function updateAchievement(i, value) {
    const next = [...achievements];
    next[i] = value;
    onChangeAchievements(next);
  }
  function addAchievement() {
    onChangeAchievements([...(achievements || []), ""]);
  }
  function removeAchievement(i) {
    onChangeAchievements(achievements.filter((_, idx) => idx !== i));
  }

  return (
    <StepShell title="Certifications & Achievements" subtitle="Both optional — add whatever's relevant.">
      <h4>Certifications</h4>
      {(certifications || []).map((cert, i) => (
        <div key={cert.id} className="card resume-repeatable-card">
          <div className="resume-repeatable-header">
            <h4>Certification {i + 1}</h4>
            <button type="button" className="btn-ghost-link" onClick={() => removeCert(cert.id)}>Remove</button>
          </div>
          <div className="form-grid-2">
            <Field label="Certification Name" name="name" value={cert.name} onChange={(n, v) => updateCert(cert.id, { [n]: v })} />
            <Field label="Organization" name="org" value={cert.org} onChange={(n, v) => updateCert(cert.id, { [n]: v })} />
          </div>
          <div className="form-grid-2">
            <Field label="Year" name="year" value={cert.year} onChange={(n, v) => updateCert(cert.id, { [n]: v })} />
            <Field label="Credential URL" name="url" value={cert.url} onChange={(n, v) => updateCert(cert.id, { [n]: v })} />
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-ghost" onClick={addCert}>+ Add Certification</button>

      <h4 style={{ marginTop: 28 }}>Achievements</h4>
      <p style={{ margin: "-4px 0 12px", fontSize: 12, color: "var(--color-text-tertiary)" }}>
        Hackathons, coding competitions, college achievements, open-source contributions
      </p>
      {(achievements || []).map((a, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input type="text" value={a} onChange={(e) => updateAchievement(i, e.target.value)} />
          <button type="button" className="btn-ghost-link" onClick={() => removeAchievement(i)}>Remove</button>
        </div>
      ))}
      <button type="button" className="btn btn-ghost" onClick={addAchievement}>+ Add Achievement</button>
    </StepShell>
  );
}
