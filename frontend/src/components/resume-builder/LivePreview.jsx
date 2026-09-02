import FresherClassicPreview from "./templates/FresherClassicPreview";
import FresherMinimalPreview from "./templates/FresherMinimalPreview";

export default function LivePreview({ resume }) {
  const Template = resume.templateId === "minimal" ? FresherMinimalPreview : FresherClassicPreview;
  return (
    <div className="resume-live-preview">
      <Template resume={resume} />
    </div>
  );
}
