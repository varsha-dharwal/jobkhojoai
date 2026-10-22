import { useState } from "react";
import { Link, useNavigate } from "react-router";
import SEO from "../components/SEO";
import TemplateChooser from "../components/resume-builder/TemplateChooser";

export default function ResumeTemplatesRoute() {
  const [selected, setSelected] = useState("classic");
  const navigate = useNavigate();

  return (
    <main className="container guide-page">
      <SEO
        title="Resume Templates | JobKhojo"
        description="Choose a resume template and continue with the existing JobKhojo resume builder."
        path="/resume-templates"
        noindex
      />
      <div className="buyer-marketplace-return">
        <Link to="/resume-marketplace">Back to Resume Marketplace</Link>
      </div>
      <TemplateChooser
        selected={selected}
        onSelect={setSelected}
        onContinue={() => navigate("/career-guide/resume-builder")}
      />
    </main>
  );
}
