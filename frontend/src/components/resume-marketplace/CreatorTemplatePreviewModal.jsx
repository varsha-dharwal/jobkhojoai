import { useEffect } from "react";
import { X } from "lucide-react";
import FresherClassicPreview from "../resume-builder/templates/FresherClassicPreview";
import FresherMinimalPreview from "../resume-builder/templates/FresherMinimalPreview";
import { DEMO_RESUME } from "../../data/demoResume";

export default function CreatorTemplatePreviewModal({ template, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!template) return null;
  const Preview = template.id === "contemporary-two-column" ? FresherMinimalPreview : FresherClassicPreview;
  return <div className="creator-preview-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="creator-preview-modal" role="dialog" aria-modal="true" aria-labelledby="creator-preview-title">
      <header><div><p className="eyebrow">Sample template preview</p><h2 id="creator-preview-title">{template.name}</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close preview"><X size={18} /></button></header>
      <div className={`creator-preview-paper creator-preview-${template.id}`}><Preview resume={DEMO_RESUME} /></div>
      <footer><button type="button" className="btn btn-secondary" onClick={onClose}>Close preview</button></footer>
    </section>
  </div>;
}
