import { useEffect, useState } from "react";
import SEO from "../components/SEO";
import api from "../api/client";
import { ResumeProvider, useResume, STEPS, EMPTY_RESUME } from "../context/ResumeContext";
import { getUserToken, isLoggedIn, clearUserSession, getUserProfile } from "../utils/userAuth";

import StepProgress from "../components/resume-builder/StepProgress";
import TemplateChooser from "../components/resume-builder/TemplateChooser";
import LivePreview from "../components/resume-builder/LivePreview";
import ResumeScore from "../components/resume-builder/ResumeScore";
import AuthModal from "../components/resume-builder/AuthModal";
import PersonalStep from "../components/resume-builder/steps/PersonalStep";
import EducationStep from "../components/resume-builder/steps/EducationStep";
import SkillsStep from "../components/resume-builder/steps/SkillsStep";
import ProjectsStep from "../components/resume-builder/steps/ProjectsStep";
import InternshipStep from "../components/resume-builder/steps/InternshipStep";
import CertificationsStep from "../components/resume-builder/steps/CertificationsStep";
import SummaryStep from "../components/resume-builder/steps/SummaryStep";
import ReviewStep from "../components/resume-builder/steps/ReviewStep";

function isDraftEmpty(resume) {
  return !resume.personal.fullName && (resume.projects || []).length === 0;
}

// @react-pdf/renderer is ~450KB gzipped — dynamically imported only when the
// user actually downloads, so it never loads on the rest of the builder flow.
async function downloadResumePdf(resume) {
  const [{ pdf }, { default: FresherClassicPdf }, { default: FresherMinimalPdf }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("../components/resume-builder/templates/FresherClassicPdf"),
    import("../components/resume-builder/templates/FresherMinimalPdf"),
  ]);
  const PdfDoc = resume.templateId === "minimal" ? FresherMinimalPdf : FresherClassicPdf;
  const blob = await pdf(<PdfDoc resume={resume} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const filename = (resume.personal.fullName || "resume").trim().replace(/\s+/g, "_");
  a.download = `${filename}_Resume.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Intro({ onStart }) {
  return (
    <div className="resume-intro">
      <span className="hero-eyebrow"><span className="dot" aria-hidden="true" /> 100% Free During Beta</span>
      <h1>Build Your First ATS-Friendly Resume — Free</h1>
      <p>
        Create a clean, professional resume designed for fresher tech jobs and internships. Get step-by-step
        guidance and check your resume before applying.
      </p>
      <button type="button" className="btn btn-primary" onClick={onStart}>Create My Resume — Free</button>
      <p style={{ marginTop: 12, fontSize: 13, color: "var(--color-text-tertiary)" }}>No payment required.</p>
    </div>
  );
}

function BuilderInner() {
  const { resume, setResume, updateSection, updateField, stage, setStage, stepIndex, setStepIndex, goToStep, resetResume } = useResume();
  const [showAuth, setShowAuth] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [mobileTab, setMobileTab] = useState("edit");

  // Pull a saved server resume only if there's nothing meaningful in the local draft yet.
  useEffect(() => {
    if (!loggedIn || !isDraftEmpty(resume)) return;
    api.get("/users/me/resume", { headers: { Authorization: `Bearer ${getUserToken()}` } })
      .then((res) => { if (res.data.resumeDraft) setResume({ ...EMPTY_RESUME, ...res.data.resumeDraft }); })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  function handleAuthSuccess() {
    setShowAuth(false);
    setLoggedIn(true);
    api.put("/users/me/resume", resume, { headers: { Authorization: `Bearer ${getUserToken()}` } }).catch(() => {});
  }

  function logout() {
    clearUserSession();
    setLoggedIn(false);
  }

  function nextStep() {
    if (stepIndex < STEPS.length - 1) setStepIndex(stepIndex + 1);
    else setStage("score");
  }
  function prevStep() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  }

  const currentStepId = STEPS[stepIndex].id;

  function renderStep() {
    switch (currentStepId) {
      case "personal":
        return <PersonalStep personal={resume.personal} onChange={(p) => updateSection("personal", p)} />;
      case "education":
        return <EducationStep education={resume.education} onChange={(p) => updateSection("education", p)} />;
      case "skills":
        return <SkillsStep skills={resume.skills} onChange={(p) => updateSection("skills", p)} />;
      case "projects":
        return <ProjectsStep projects={resume.projects} targetTitle={resume.personal.targetTitle} onChange={(list) => updateField("projects", list)} />;
      case "internship":
        return (
          <InternshipStep
            hasInternship={resume.hasInternship}
            internship={resume.internship}
            onHasInternshipChange={(v) => updateField("hasInternship", v)}
            onChange={(p) => updateSection("internship", p)}
          />
        );
      case "certifications":
        return (
          <CertificationsStep
            certifications={resume.certifications}
            achievements={resume.achievements}
            onChangeCertifications={(list) => updateField("certifications", list)}
            onChangeAchievements={(list) => updateField("achievements", list)}
          />
        );
      case "summary":
        return <SummaryStep resume={resume} onChange={(p) => setResume((r) => ({ ...r, ...p }))} />;
      case "review":
        return <ReviewStep resume={resume} onEditStep={goToStep} onCheckResume={() => setStage("score")} />;
      default:
        return null;
    }
  }

  if (stage === "intro") {
    return <Intro onStart={() => setStage("template")} />;
  }

  if (stage === "template") {
    return (
      <TemplateChooser
        selected={resume.templateId}
        onSelect={(id) => updateField("templateId", id)}
        onContinue={() => setStage("wizard")}
      />
    );
  }

  if (stage === "score") {
    return (
      <div className="resume-builder-shell">
        <ResumeScore resume={resume} onEditStep={goToStep} onDownload={() => downloadResumePdf(resume)} />
        <div style={{ textAlign: "center", marginTop: 24, display: "flex", gap: 16, justifyContent: "center" }}>
          <button type="button" className="btn-ghost-link" onClick={() => setStage("wizard")}>Edit Resume</button>
          <button type="button" className="btn-ghost-link" onClick={() => setStage("template")}>Change Template</button>
        </div>
      </div>
    );
  }

  // stage === "wizard"
  return (
    <div className="resume-builder-shell">
      <div className="resume-builder-topbar">
        <StepProgress activeIndex={stepIndex} onStepClick={goToStep} />
        {loggedIn ? (
          <div className="resume-auth-status">
            <span>{getUserProfile()?.name}</span>
            <button type="button" className="btn-ghost-link" onClick={logout}>Sign out</button>
          </div>
        ) : (
          <button type="button" className="btn-ghost-link" onClick={() => setShowAuth(true)}>Sign in to save</button>
        )}
      </div>

      <div className="resume-mobile-tabs">
        <button type="button" className={mobileTab === "edit" ? "active" : ""} onClick={() => setMobileTab("edit")}>Edit</button>
        <button type="button" className={mobileTab === "preview" ? "active" : ""} onClick={() => setMobileTab("preview")}>Preview</button>
      </div>

      <div className="resume-builder-grid">
        <div className={`resume-builder-edit${mobileTab === "preview" ? " mobile-hidden" : ""}`}>
          {renderStep()}
          <div className="resume-step-nav">
            <button type="button" className="btn btn-ghost" onClick={prevStep} disabled={stepIndex === 0}>← Back</button>
            <button type="button" className="btn btn-primary" onClick={nextStep}>
              {stepIndex === STEPS.length - 1 ? "Review →" : "Next →"}
            </button>
          </div>
        </div>
        <div className={`resume-builder-preview${mobileTab === "edit" ? " mobile-hidden" : ""}`}>
          <LivePreview resume={resume} />
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button type="button" className="btn-ghost-link" onClick={resetResume}>Start Over</button>
      </div>
    </div>
  );
}

export default function ResumeBuilder() {
  return (
    <main className="container guide-page">
      <SEO
        title="Free ATS Resume Builder for Freshers | jobkhojoAI"
        description="Build your first ATS-friendly resume for free. Step-by-step guidance for freshers and students, a resume readiness check, and a free PDF download — no login required."
        path="/career-guide/resume-builder"
      />
      <ResumeProvider>
        <BuilderInner />
      </ResumeProvider>
    </main>
  );
}
