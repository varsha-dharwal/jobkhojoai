import { useState } from "react";
import FresherClassicPreview from "./templates/FresherClassicPreview";
import { DEMO_RESUME } from "../../data/demoResume";

// Only "Fresher Classic" ships in this launch — a second template comes in a
// later phase, so the chooser deliberately shows one option, not a grid.
const TEMPLATE = { id: "classic", name: "Fresher Classic", blurb: "Clean, ATS-compatible layout with a two-column header and right-aligned dates — hover to see the full design." };

export default function TemplateChooser({ selected, onSelect, onContinue }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const isSelected = selected === TEMPLATE.id || !selected;

  return (
    <div className="resume-template-chooser">
      <h2>Choose a Template</h2>
      <p className="guide-prose">Hover over the card to see exactly how your resume will look.</p>

      <div
        className="template-card-wrap"
        onMouseEnter={() => setPreviewOpen(true)}
        onMouseLeave={() => setPreviewOpen(false)}
      >
        <button
          type="button"
          className={`card template-card${isSelected ? " selected" : ""}`}
          onClick={() => { onSelect(TEMPLATE.id); setPreviewOpen((o) => !o); }}
        >
          <div className="template-mini-preview template-mini-classic" aria-hidden="true">
            <div className="mini-line mini-line-title" />
            <div className="mini-line mini-line-sub" />
            <div className="mini-rule" />
            <div className="mini-line mini-line-heading" />
            <div className="mini-line" />
            <div className="mini-line" style={{ width: "70%" }} />
          </div>
          <h3>{TEMPLATE.name}</h3>
          <p>{TEMPLATE.blurb}</p>
        </button>

        {previewOpen && (
          <div className="template-hover-preview" role="dialog" aria-label={`${TEMPLATE.name} full preview`}>
            <FresherClassicPreview resume={DEMO_RESUME} />
          </div>
        )}
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => { onSelect(TEMPLATE.id); onContinue(); }}
        style={{ marginTop: "var(--space-8)" }}
      >
        Continue →
      </button>
    </div>
  );
}
