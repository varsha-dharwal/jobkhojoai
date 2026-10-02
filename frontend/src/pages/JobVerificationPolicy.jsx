import TrustPage from "./TrustPage";

const sections = [
  {
    id: "before",
    heading: "Before a listing goes live",
    paragraphs: ["Every listing is added by hand. Before publishing we check that:"],
    list: [
      "the opening appears on the employer's careers page or a recognised job board;",
      "the title, employer, location, job type and experience match that source;",
      "the apply link opens the original posting or the employer's application page;",
      "the listing has a real description of the role, not just a title;",
      "nothing in the posting asks candidates to pay a fee.",
    ],
  },
  {
    id: "dont",
    heading: "What we don't publish",
    list: [
      "Openings that ask candidates for money for registration, training, interviews or offer letters.",
      "Listings with no identifiable employer or no way to apply through an official channel.",
      "Duplicate copies of a listing we already show.",
    ],
  },
  {
    id: "limits",
    heading: "What “reviewed” does and doesn't mean",
    paragraphs: [
      "Our checks confirm that a listing matches a real, public posting. They don't mean we've contacted the employer, and they can't guarantee the role is still open. Employers can change or close openings without notice, so the original posting is always the final authority.",
    ],
  },
  {
    id: "after",
    heading: "After publishing",
    paragraphs: [
      "Listings with a closing date are hidden automatically once it passes. When we learn that a role has closed, that its link no longer works, or that a listing is inaccurate, we update it or take it down.",
    ],
  },
  {
    id: "report",
    heading: "Report a listing",
    paragraphs: [
      "If a listing looks wrong or suspicious, or someone contacts you asking for money, please tell us through the contact page with the job link. We review every report.",
    ],
  },
];

export default function JobVerificationPolicy() {
  return (
    <TrustPage
      title="How We Review Job Listings | JobKhojo"
      description="The checks every JobKhojo listing goes through before it's published, what we don't publish, and how to report a listing."
      path="/job-verification-policy"
      eyebrow="Policies"
      heading="How we review job listings"
      intro="What we check before a job appears on JobKhojo — and the limits of those checks."
      sections={sections}
    />
  );
}
