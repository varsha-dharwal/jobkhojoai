import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "jobkhojoai_resume_draft";

export const STEPS = [
  { id: "personal", label: "Personal" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "internship", label: "Internship" },
  { id: "certifications", label: "Certifications" },
  { id: "summary", label: "Summary" },
  { id: "review", label: "Review" },
];

export const EMPTY_RESUME = {
  templateId: "classic",
  personal: { fullName: "", targetTitle: "", email: "", phone: "", city: "", linkedin: "", github: "", portfolio: "" },
  education: { degree: "", fieldOfStudy: "", college: "", startYear: "", gradYear: "", cgpa: "" },
  skills: { languages: [], frameworks: [], tools: [], platforms: [], softSkills: [] },
  projects: [],
  hasInternship: null,
  internship: { company: "", role: "", startDate: "", endDate: "", bullets: [] },
  certifications: [],
  achievements: [],
  summary: "",
};

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...EMPTY_RESUME, ...parsed };
  } catch {
    return null;
  }
}

const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(() => loadDraft() || EMPTY_RESUME);
  const [stage, setStage] = useState("intro"); // intro -> template -> wizard -> review -> score -> done
  const [stepIndex, setStepIndex] = useState(0);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
      } catch {
        // localStorage may be unavailable (private mode, quota) — draft simply won't persist
      }
    }, 400);
    return () => clearTimeout(saveTimer.current);
  }, [resume]);

  const updateSection = useCallback((section, patch) => {
    setResume((r) => ({ ...r, [section]: { ...r[section], ...patch } }));
  }, []);

  const updateField = useCallback((field, value) => {
    setResume((r) => ({ ...r, [field]: value }));
  }, []);

  const resetResume = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setResume(EMPTY_RESUME);
    setStage("intro");
    setStepIndex(0);
  }, []);

  const goToStep = useCallback((idOrIndex) => {
    const idx = typeof idOrIndex === "number" ? idOrIndex : STEPS.findIndex((s) => s.id === idOrIndex);
    if (idx < 0) return;
    setStepIndex(idx);
    setStage("wizard");
  }, []);

  const value = {
    resume, setResume, updateSection, updateField, resetResume,
    stage, setStage, stepIndex, setStepIndex, goToStep,
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within a ResumeProvider");
  return ctx;
}
