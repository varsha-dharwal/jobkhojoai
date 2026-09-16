import TrustPage from "./TrustPage";

export default function JobVerificationPolicy() {
  return (
    <TrustPage
      title="Job Verification Policy | jobkhojoAI"
      description="Our job verification policy explains how we review updates, verify application links, and handle expired or disputed listings."
      path="/job-verification-policy"
      heading="Job Verification Policy"
      paragraphs={[
        "jobkhojoAI reviews public job listings for relevance, clarity, and basic quality before publishing. We check whether the title, employer, location, category, and application link appear consistent with the original source.",
        "If a listing is expired, withdrawn, misleading, duplicate, or missing a valid official application link, it may be hidden or marked as inactive. This helps keep the platform useful and reduces low-quality or broken listings.",
        "For any listing that appears suspicious, we confirm the official employer source where possible and avoid promoting content that requires unusual payments, unclear application steps, or unverifiable recruiter behavior.",
        "Users should treat jobkhojoAI as a discovery and information platform, while treating the official employer or hiring page as the final authority for application requirements, screening process, and deadlines."
      ]}
    />
  );
}
