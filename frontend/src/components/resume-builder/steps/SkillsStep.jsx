import { StepShell } from "../FormFields";
import SkillsPicker from "../SkillsPicker";

export default function SkillsStep({ skills, onChange }) {
  return (
    <StepShell title="Technical Skills" subtitle="Pick from suggestions or add your own — this is one of the most scanned sections on a fresher resume.">
      <SkillsPicker skills={skills} onChange={(category, next) => onChange({ [category]: next })} />
    </StepShell>
  );
}
