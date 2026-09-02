import { Field, StepShell } from "../FormFields";

export default function EducationStep({ education, onChange }) {
  const set = (name, value) => onChange({ [name]: value });
  return (
    <StepShell title="Education">
      <div className="form-grid-2">
        <Field label="Degree" name="degree" value={education.degree} onChange={set} required />
        <Field label="Field of Study" name="fieldOfStudy" value={education.fieldOfStudy} onChange={set} required />
      </div>
      <Field label="College / University" name="college" value={education.college} onChange={set} required />
      <div className="form-grid-2">
        <Field label="Start Year" name="startYear" value={education.startYear} onChange={set} />
        <Field label="Graduation Year" name="gradYear" value={education.gradYear} onChange={set} required />
      </div>
      <Field label="CGPA / Percentage (Optional)" name="cgpa" value={education.cgpa} onChange={set} />
    </StepShell>
  );
}
