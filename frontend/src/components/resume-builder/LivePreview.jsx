import MarketplaceTemplatePreview from "./MarketplaceTemplatePreview";

export default function LivePreview({ resume }) {
  const templateId = resume.templateId || "classic";
  return (
    <div className="resume-live-preview">
      <MarketplaceTemplatePreview templateId={templateId} resume={resume} />
    </div>
  );
}
