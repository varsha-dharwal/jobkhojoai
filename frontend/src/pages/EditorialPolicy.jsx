import TrustPage from "./TrustPage";

const sections = [
  {
    id: "listings",
    heading: "Job listings",
    paragraphs: [
      "Job descriptions on JobKhojo are based on the employer's original posting. We restructure them into a consistent format — about the role, responsibilities, requirements, skills and job overview — and correct obvious formatting problems, but we don't add requirements, salaries or benefits that the employer didn't state. Every listing links to its original source.",
    ],
  },
  {
    id: "guides",
    heading: "Career guides and career paths",
    paragraphs: [
      "Guides and career paths are written to answer specific questions job seekers ask: what to learn next, how to write a resume, how to prepare for interviews, and how to stay safe from fake offers. We aim for practical, specific advice over generic tips.",
    ],
    list: [
      "Advice should be something a reader can act on.",
      "Claims about salaries or hiring trends should come from a source we can name, or be clearly framed as general guidance.",
      "Content is reviewed and updated when tools, hiring practices or our own understanding change.",
    ],
  },
  {
    id: "ai",
    heading: "Use of AI",
    paragraphs: [
      "We may use AI tools to help with drafting or formatting, but a person reviews and edits everything before it's published. The “Ask” assistant and resume suggestions are AI features and are clearly labelled; their answers can be wrong.",
    ],
  },
  {
    id: "independence",
    heading: "Independence and ads",
    paragraphs: [
      "Employers don't pay to appear in our listings, and advertising never decides which jobs or guides we publish. Ads are provided by Google AdSense and are kept separate from listings and apply buttons.",
    ],
  },
  {
    id: "corrections",
    heading: "Corrections",
    paragraphs: [
      "If you spot an error, tell us through the contact page. See our content correction policy for how we handle it.",
    ],
  },
];

export default function EditorialPolicy() {
  return (
    <TrustPage
      title="Editorial Policy | JobKhojo"
      description="How JobKhojo writes up job listings and career guides, how we use AI, and how we keep content independent from advertising."
      path="/editorial-policy"
      eyebrow="Policies"
      heading="Editorial policy"
      intro="How we write up listings and guides, and the standards we hold them to."
      sections={sections}
    />
  );
}
