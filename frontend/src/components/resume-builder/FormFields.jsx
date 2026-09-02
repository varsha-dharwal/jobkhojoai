export function Field({ label, name, type = "text", value, onChange, required = false }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label>{label}{required && " *"}</label>
      <input type={type} value={value || ""} onChange={(e) => onChange(name, e.target.value)} required={required} />
    </div>
  );
}

export function TextArea({ label, name, value, onChange, rows = 4, hint, required = false }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label>{label}{required && " *"}</label>
      {hint && <p style={{ margin: "-4px 0 8px", fontSize: 12, color: "var(--color-text-tertiary)" }}>{hint}</p>}
      <textarea rows={rows} value={value || ""} onChange={(e) => onChange(name, e.target.value)} required={required} />
    </div>
  );
}

export function StepShell({ title, subtitle, children }) {
  return (
    <div className="card resume-step-card">
      <h2 style={{ fontSize: 18, margin: "0 0 2px" }}>{title}</h2>
      {subtitle && <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--color-text-tertiary)" }}>{subtitle}</p>}
      {!subtitle && <div style={{ marginBottom: 18 }} />}
      {children}
    </div>
  );
}
