import { useState } from "react";
import api from "../../../api/client";
import { TextArea, StepShell } from "../FormFields";

function flattenSkills(skills) {
  return Object.values(skills || {}).flat();
}

export default function SummaryStep({ resume, onChange }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/resume-ai/generate-summary", {
        role: resume.personal.targetTitle,
        skills: flattenSkills(resume.skills),
        education: resume.education,
        projects: resume.projects,
        hasInternship: resume.hasInternship,
      });
      setOptions(res.data.summaries || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate a summary right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <StepShell title="Professional Summary" subtitle="A short intro at the top of your resume — this is often the hardest part to write, so let AI help.">
      <button type="button" className="btn btn-ghost" onClick={generate} disabled={loading} style={{ marginBottom: 16 }}>
        {loading ? "Generating…" : "✨ Generate Summary"}
      </button>
      {error && <p role="alert" style={{ color: "var(--color-danger)", fontSize: 13, marginBottom: 16 }}>{error}</p>}

      {options.length > 0 && (
        <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
          {options.map((opt, i) => (
            <button
              key={i}
              type="button"
              className="card guide-quote"
              style={{ textAlign: "left", cursor: "pointer" }}
              onClick={() => onChange({ summary: opt })}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      <TextArea
        label="Your Summary"
        name="summary"
        value={resume.summary}
        onChange={(n, v) => onChange({ [n]: v })}
        rows={5}
        hint="Pick a version above or write/edit your own."
      />
    </StepShell>
  );
}
