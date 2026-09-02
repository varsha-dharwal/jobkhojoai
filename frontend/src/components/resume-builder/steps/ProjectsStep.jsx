import { useState } from "react";
import api from "../../../api/client";
import { Field, TextArea, StepShell } from "../FormFields";

function emptyProject() {
  return { id: crypto.randomUUID(), name: "", tech: "", url: "", github: "", startDate: "", endDate: "", description: "", contribution: "" };
}

function ImproveDescription({ project, role, onApply }) {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!project.description.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/resume-ai/improve-description", {
        text: project.description,
        role,
        techUsed: project.tech,
      });
      setSuggestion(res.data.improved);
    } catch (err) {
      setError(err.response?.data?.message || "Could not improve this description right now.");
    } finally {
      setLoading(false);
    }
  }

  if (!suggestion) {
    return (
      <div style={{ marginBottom: 16 }}>
        <button type="button" className="btn btn-ghost" onClick={generate} disabled={loading || !project.description.trim()}>
          {loading ? "Improving…" : "✨ Improve Description"}
        </button>
        {error && <p role="alert" style={{ color: "var(--color-danger)", fontSize: 13, marginTop: 8 }}>{error}</p>}
      </div>
    );
  }

  return (
    <div className="guide-quote" style={{ marginBottom: 16 }}>
      <p style={{ margin: "0 0 12px" }}>{suggestion}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" className="btn btn-primary" onClick={() => { onApply(suggestion); setSuggestion(""); }}>Accept</button>
        <button type="button" className="btn btn-ghost" onClick={generate} disabled={loading}>{loading ? "Regenerating…" : "Regenerate"}</button>
        <button type="button" className="btn btn-ghost" onClick={() => setSuggestion("")}>Keep Mine</button>
      </div>
    </div>
  );
}

export default function ProjectsStep({ projects, targetTitle, onChange }) {
  function addProject() {
    onChange([...(projects || []), emptyProject()]);
  }
  function updateProject(id, patch) {
    onChange(projects.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }
  function removeProject(id) {
    onChange(projects.filter((p) => p.id !== id));
  }

  return (
    <StepShell title="Projects" subtitle="Freshers' resumes are built on projects — this is the most important section.">
      {(projects || []).map((project, i) => (
        <div key={project.id} className="card resume-repeatable-card">
          <div className="resume-repeatable-header">
            <h4>Project {i + 1}</h4>
            <button type="button" className="btn-ghost-link" onClick={() => removeProject(project.id)}>Remove</button>
          </div>
          <div className="form-grid-2">
            <Field label="Project Name" name="name" value={project.name} onChange={(n, v) => updateProject(project.id, { [n]: v })} required />
            <Field label="Technologies Used" name="tech" value={project.tech} onChange={(n, v) => updateProject(project.id, { [n]: v })} required />
          </div>
          <div className="form-grid-2">
            <Field label="Project URL" name="url" value={project.url} onChange={(n, v) => updateProject(project.id, { [n]: v })} />
            <Field label="GitHub URL" name="github" value={project.github} onChange={(n, v) => updateProject(project.id, { [n]: v })} />
          </div>
          <div className="form-grid-2">
            <Field label="Start Date (Optional)" name="startDate" value={project.startDate} onChange={(n, v) => updateProject(project.id, { [n]: v })} />
            <Field label="End Date (Optional)" name="endDate" value={project.endDate} onChange={(n, v) => updateProject(project.id, { [n]: v })} />
          </div>
          <TextArea
            label="What did you build?"
            name="description"
            value={project.description}
            onChange={(n, v) => updateProject(project.id, { [n]: v })}
            required
          />
          <ImproveDescription
            project={project}
            role={targetTitle}
            onApply={(text) => updateProject(project.id, { description: text })}
          />
          <TextArea
            label="What was your contribution?"
            name="contribution"
            value={project.contribution}
            onChange={(n, v) => updateProject(project.id, { [n]: v })}
            required
          />
        </div>
      ))}
      <button type="button" className="btn btn-ghost" onClick={addProject}>+ Add Project</button>
    </StepShell>
  );
}
