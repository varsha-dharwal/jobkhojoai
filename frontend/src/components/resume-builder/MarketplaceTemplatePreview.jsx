import FresherClassicPreview from "./templates/FresherClassicPreview";
import FresherMinimalPreview from "./templates/FresherMinimalPreview";

const MINIMAL_TEMPLATES = new Set(["minimal", "clean-minimal"]);

export default function MarketplaceTemplatePreview({ templateId = "classic", resume }) {
  const Preview = MINIMAL_TEMPLATES.has(templateId) ? FresherMinimalPreview : FresherClassicPreview;
  return <div className={`marketplace-resume-preview marketplace-resume-${templateId}`}><Preview resume={resume} /></div>;
}
