import { useEffect, useRef, useState } from "react";
import { FileUp, Search, Share2, X } from "lucide-react";
import { useNavigate } from "react-router";
import SEO from "../components/SEO";
import RoleSelectionCard from "../components/resume-marketplace/RoleSelectionCard";

const STEPS = [
  { icon: Search, title: "Choose your role", text: "Start as a template creator or find a design for your next application." },
  { icon: FileUp, title: "Upload or select a template", text: "Share an original design or choose a resume template to work with." },
  { icon: Share2, title: "Create, share or download", text: "Prepare your resume and share it with confidence." },
];

export default function ResumeMarketplace() {
  const [isChoiceOpen, setIsChoiceOpen] = useState(false);
  const navigate = useNavigate();
  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isChoiceOpen) return undefined;

    closeButtonRef.current?.focus();
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsChoiceOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll("button:not(:disabled)");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isChoiceOpen]);

  function continueTo(path) {
    setIsChoiceOpen(false);
    navigate(path);
  }

  return (
    <main className="container market-page">
      <SEO
        title="Resume Marketplace | JobKhojo"
        description="Discover resume templates or explore the JobKhojo creator studio."
        path="/resume-marketplace"
      />
      <section className="market-hero" aria-labelledby="market-title">
        <span className="hero-eyebrow"><span className="dot" aria-hidden="true" /> JobKhojo Resume Marketplace</span>
        <h1 id="market-title">Create, Share &amp; Discover Resume Templates</h1>
        <p>Build your career with professional resume templates or share your own designs with the JobKhojo community.</p>
      </section>

      <section className="market-role-grid" aria-label="Choose how to use the marketplace">
        <RoleSelectionCard
          image="/images/marketplace/creator-3d.png"
          imageAlt="3D illustration of a resume being edited with a pencil and color palette"
          eyebrow="For job seekers"
          title="Build a Resume from Scratch"
          description="Create your professional resume step by step, without selecting a template first."
          to="/career-guide/resume-builder?start=scratch"
          buttonLabel="Build My Resume"
        />
        <RoleSelectionCard
          image="/images/marketplace/buyer-3d.png"
          imageAlt="3D illustration of resume pages being explored with a magnifying glass"
          eyebrow="For job seekers and creators"
          title="Create a Resume Using Templates"
          description="Choose a free or premium resume template, personalize it, or create and sell your own original resume templates."
          onClick={() => setIsChoiceOpen(true)}
          buttonRef={triggerRef}
          buttonLabel="Explore Resume Templates"
        />
      </section>

      <section className="market-steps" aria-labelledby="market-steps-title">
        <div className="market-section-heading"><p className="eyebrow">A simple way to get started</p><h2 id="market-steps-title">From first click to next opportunity</h2></div>
        <ol className="market-steps-grid">
          {STEPS.map(({ icon: Icon, title, text }, index) => <li className="market-step-card" key={title}>
            <span className="market-step-number">0{index + 1}</span>
            <Icon size={23} aria-hidden="true" />
            <h3>{title}</h3><p>{text}</p>
          </li>)}
        </ol>
      </section>
      <div className="market-demo-notice" role="note">Marketplace creator tools are currently a frontend demo. Sign-in, uploads, sales and payouts are not active yet.</div>

      {isChoiceOpen && (
        <div
          className="modal-overlay market-choice-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsChoiceOpen(false);
              triggerRef.current?.focus();
            }
          }}
        >
          <section
            className="market-choice-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="market-choice-title"
            aria-describedby="market-choice-description"
            ref={dialogRef}
          >
            <button
              ref={closeButtonRef}
              className="market-choice-close"
              type="button"
              aria-label="Close template choices"
              onClick={() => {
                setIsChoiceOpen(false);
                triggerRef.current?.focus();
              }}
            ><X size={20} aria-hidden="true" /></button>
            <p className="market-choice-eyebrow">Resume Marketplace</p>
            <h2 id="market-choice-title">How would you like to continue?</h2>
            <p id="market-choice-description" className="market-choice-intro">Choose the path that best matches what you want to do.</p>
            <div className="market-choice-options">
              <article className="market-choice-option">
                <h3>I'm a Buyer</h3>
                <p>Browse resume templates and create your resume using a design you like.</p>
                <button className="btn btn-primary" type="button" onClick={() => continueTo("/resume-templates")}>Browse Templates<span aria-hidden="true">→</span></button>
              </article>
              <article className="market-choice-option">
                <h3>I'm a Creator</h3>
                <p>Upload your original resume templates and earn from successful sales.</p>
                <button className="btn btn-secondary" type="button" onClick={() => continueTo("/creator/dashboard")}>Continue as Creator<span aria-hidden="true">→</span></button>
              </article>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
