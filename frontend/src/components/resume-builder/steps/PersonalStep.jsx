import { Field, StepShell } from "../FormFields";

export default function PersonalStep({ personal, onChange }) {
  const set = (name, value) => onChange({ [name]: value });
  return (
    <StepShell title="Personal Details" subtitle="How should recruiters see and reach you?">
      <div className="form-grid-2">
        <Field label="Full Name" name="fullName" value={personal.fullName} onChange={set} required />
        <Field label="Target Job Title" name="targetTitle" value={personal.targetTitle} onChange={set} required />
      </div>
      <p style={{ margin: "-8px 0 16px", fontSize: 12, color: "var(--color-text-tertiary)" }}>
        e.g. Frontend Developer, Backend Developer, Data Analyst, UI/UX Designer
      </p>
      <div className="form-grid-2">
        <Field label="Email" name="email" type="email" value={personal.email} onChange={set} required />
        <Field label="Phone" name="phone" type="tel" value={personal.phone} onChange={set} required />
      </div>
      <div className="form-grid-2">
        <Field label="City" name="city" value={personal.city} onChange={set} />
        <Field label="LinkedIn" name="linkedin" value={personal.linkedin} onChange={set} />
      </div>
      <div className="form-grid-2">
        <Field label="GitHub" name="github" value={personal.github} onChange={set} />
        <Field label="Portfolio" name="portfolio" value={personal.portfolio} onChange={set} />
      </div>
    </StepShell>
  );
}
