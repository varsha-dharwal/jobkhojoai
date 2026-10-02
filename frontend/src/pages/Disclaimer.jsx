import TrustPage from "./TrustPage";

const sections = [
  {
    id: "information",
    heading: "Information only",
    paragraphs: [
      "JobKhojo presents publicly available job and internship openings, along with career guidance, for general information. We are not a recruiter, staffing agency or employer, and we don't take part in any hiring process.",
    ],
  },
  {
    id: "accuracy",
    heading: "Check the original posting",
    paragraphs: [
      "We take care when writing up listings, but employers can change or close openings at any time. Before applying, sharing personal details or making any commitment, confirm the role, eligibility, salary and deadline on the employer's official website or the original job board.",
    ],
  },
  {
    id: "outcomes",
    heading: "No guarantees",
    paragraphs: [
      "We can't guarantee interviews, job offers, salaries or any other outcome. Salary figures, where shown, are as published by the employer or source and may not reflect a final offer.",
    ],
  },
  {
    id: "fees",
    heading: "We never charge candidates",
    paragraphs: [
      "JobKhojo never asks for money. If someone asks you to pay for a job, an interview, training or an offer letter in JobKhojo's name, it is a scam — please report it to us.",
    ],
  },
  {
    id: "external",
    heading: "External links and ads",
    paragraphs: [
      "Job pages link to third-party websites we don't control. Ads shown on JobKhojo are provided by Google AdSense; an ad appearing here is not an endorsement.",
    ],
  },
];

export default function Disclaimer() {
  return (
    <TrustPage
      title="Disclaimer | JobKhojo"
      description="JobKhojo provides job information for general guidance. Confirm details with the employer before applying. We never charge candidates."
      path="/disclaimer"
      eyebrow="Legal"
      heading="Disclaimer"
      sections={sections}
    />
  );
}
