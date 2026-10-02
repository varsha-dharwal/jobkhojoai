import TrustPage from "./TrustPage";
import { CONTACT_EMAIL } from "../lib/site";

const sections = [
  {
    id: "report",
    heading: "How to report a problem",
    paragraphs: [
      `Email ${CONTACT_EMAIL} or message us on Instagram with the page link and what looks wrong — for example an incorrect title or salary, an expired opening, a broken apply link, a typo, or advice that's out of date.`,
    ],
  },
  {
    id: "listings",
    heading: "Corrections to job listings",
    paragraphs: [
      "We compare the report with the original posting. If the original confirms the change, we update the listing. If the opening has closed or can't be confirmed, we take the listing down.",
    ],
  },
  {
    id: "guides",
    heading: "Corrections to guides and career paths",
    paragraphs: [
      "Factual mistakes are fixed as soon as we confirm them. When a change is significant, we update the page's date. We also revise or remove content that has become outdated or isn't useful.",
    ],
  },
];

export default function ContentCorrectionPolicy() {
  return (
    <TrustPage
      title="Content Correction Policy | JobKhojo"
      description="How to report an error on JobKhojo and how we correct job listings, guides and career paths."
      path="/content-correction-policy"
      eyebrow="Policies"
      heading="Content correction policy"
      sections={sections}
    />
  );
}
