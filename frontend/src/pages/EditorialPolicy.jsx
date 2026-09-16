import TrustPage from "./TrustPage";

export default function EditorialPolicy() {
  return (
    <TrustPage
      title="Editorial Policy | jobkhojoAI"
      description="Learn how jobkhojoAI handles original content, verification, and quality standards for job and career information."
      path="/editorial-policy"
      heading="Editorial Policy"
      paragraphs={[
        "jobkhojoAI creates and curates career information to help job seekers understand hiring trends, application expectations, and the skills needed for different tech roles.",
        "Our articles are written to be practical, readable, and useful. We aim to explain career decisions and hiring realities in a clear way, rather than publishing repetitive or shallow content that adds no value to a user.",
        "Whenever possible, we prefer original analysis, summaries, and guidance based on actual hiring realities. We do not rely on blindly copying employer text or scraping job descriptions without context or review.",
        "We review content for clarity, factual accuracy, relevance, and user utility before publishing. This includes checking for misleading claims, outdated information, and duplicate or low-value pages."
      ]}
    />
  );
}
