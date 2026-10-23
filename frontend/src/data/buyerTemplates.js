import { readCreatorSubmissions } from "./creatorSubmissions";

// These are the built-in resume layouts that have working editor and PDF output.
export const FREE_BUYER_TEMPLATES = [
  {
    id: "classic",
    name: "Fresher Classic",
    category: "ATS-Friendly",
    suitableFor: "Fresher · Tech · Non-Tech",
    description: "A clean, ATS-friendly resume with a two-column contact header and clear experience sections.",
    layout: "classic",
  },
  {
    id: "ats-simple",
    name: "ATS Simple",
    category: "ATS-Friendly",
    suitableFor: "Fresher · Professional · Tech · Non-Tech",
    description: "A straightforward one-column format with clear headings for applicant tracking systems.",
    layout: "ats-simple",
  },
  {
    id: "modern-professional",
    name: "Modern Professional",
    category: "Professional",
    suitableFor: "Professional · Tech · Non-Tech",
    description: "A polished professional layout with a restrained blue accent and clean section hierarchy.",
    layout: "modern-professional",
  },
  {
    id: "clean-minimal",
    name: "Clean Minimal",
    category: "Fresher",
    suitableFor: "Fresher · Professional · Tech · Non-Tech",
    description: "A compact single-column layout that keeps attention on experience, projects, and skills.",
    layout: "clean-minimal",
  },
  {
    id: "entry-level-tech",
    name: "Entry-Level Tech",
    category: "Tech",
    suitableFor: "Fresher · Tech",
    description: "A project-focused design for entry-level developers and technology graduates.",
    layout: "entry-level-tech",
  },
];

/** Creator listings remain local demo records until server storage is enabled. */
export function getApprovedCreatorTemplates() {
  return readCreatorSubmissions()
    .filter((record) => record?.status === "Approved" && record?.id && record?.name && record?.pdfId)
    .map((record) => ({
      ...record,
      category: record.category || "Professional",
      price: Number(record.price),
      pricePaise: Number.isSafeInteger(record.pricePaise) ? record.pricePaise : Math.round(Number(record.price) * 100),
      source: "creator",
    }))
    .filter((record) => Number.isFinite(record.price) && record.price > 0);
}
