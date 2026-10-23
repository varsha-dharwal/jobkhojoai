import MarketplaceTemplatePreview from "./MarketplaceTemplatePreview";
import { DEMO_RESUME } from "../../data/demoResume";
import { FREE_BUYER_TEMPLATES } from "../../data/buyerTemplates";

export default function TemplateChooser({ selected, onSelect, onContinue }) {
  const active = FREE_BUYER_TEMPLATES.find((template) => template.id === selected) || FREE_BUYER_TEMPLATES[0];
  return <div className="resume-template-chooser resume-template-chooser-gallery">
    <h2>Choose a Template</h2>
    <p className="guide-prose">Choose a free resume design. Preview it before continuing.</p>
    <div className="template-chooser-layout">
      <div className="template-chooser-options" role="list" aria-label="Free resume templates">
        {FREE_BUYER_TEMPLATES.map((template) => <button key={template.id} type="button" role="listitem" className={`card template-card${active.id === template.id ? " selected" : ""}`} aria-pressed={active.id === template.id} onClick={() => onSelect(template.id)}>
          <span className="template-free-tag">FREE</span>
          <div className="template-mini-real"><MarketplaceTemplatePreview templateId={template.id} resume={{ ...DEMO_RESUME, templateId: template.id }} /></div>
          <h3>{template.name}</h3><p>{template.description}</p>
        </button>)}
      </div>
      <div className="template-selected-preview" aria-label={`${active.name} full preview`}>
        <MarketplaceTemplatePreview templateId={active.id} resume={{ ...DEMO_RESUME, templateId: active.id }} />
      </div>
    </div>
    <button type="button" className="btn btn-primary" onClick={onContinue} style={{ marginTop: "var(--space-8)" }}>Continue →</button>
  </div>;
}
