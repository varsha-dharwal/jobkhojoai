import { STEPS } from "../../context/ResumeContext";

export default function StepProgress({ activeIndex, onStepClick }) {
  return (
    <div className="resume-step-progress" role="tablist" aria-label="Resume sections">
      {STEPS.map((step, i) => (
        <button
          key={step.id}
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          className={`resume-step${i === activeIndex ? " active" : ""}${i < activeIndex ? " done" : ""}`}
          onClick={() => onStepClick(i)}
        >
          <span className="resume-step-node">{i < activeIndex ? "✓" : i + 1}</span>
          <span className="resume-step-label">{step.label}</span>
        </button>
      ))}
    </div>
  );
}
