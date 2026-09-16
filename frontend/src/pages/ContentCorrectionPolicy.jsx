import TrustPage from "./TrustPage";

export default function ContentCorrectionPolicy() {
  return (
    <TrustPage
      title="Content Correction Policy | jobkhojoAI"
      description="Learn how jobkhojoAI reviews content corrections, updates expired listings, and fixes editorial or job detail issues."
      path="/content-correction-policy"
      heading="Content Correction Policy"
      paragraphs={[
        "jobkhojoAI aims to keep job and career information accurate and helpful. If a user notices a wrong title, incorrect salary range, expired link, outdated deadline, or a typo, they can contact us through the Contact page.",
        "We review correction requests promptly and update listings when the official source confirms the change. If the information cannot be verified, we may leave the listing unpublished or mark it as inactive until reviewed.",
        "For editorial articles and roadmap content, mistakes are corrected when identified. We also remove or revise content when it is duplicated, misleading, or no longer useful to readers.",
        "Our goal is to maintain a trustworthy platform that helps users discover relevant job opportunities and career guidance without confusing or low-value content."
      ]}
    />
  );
}
