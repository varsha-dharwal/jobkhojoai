import TrustPage from "./TrustPage";

export default function Disclaimer() {
  return (
    <TrustPage
      title="Disclaimer | jobkhojoAI"
      description="Read the disclaimer for jobkhojoAI. We provide job information for informational purposes and do not guarantee employment or application outcomes."
      path="/disclaimer"
      heading="Disclaimer"
      paragraphs={[
        "jobkhojoAI is an informational career platform. It collects and presents publicly available job listings, internship opportunities, and education content for convenience and awareness.",
        "We do not guarantee hiring, employment, salary, or interview outcomes. Every job or internship must be verified with the official employer, company careers portal, or trusted hiring channel before a candidate proceeds.",
        "Where a listing appears inconsistent, expired, or incomplete, jobkhojoAI may update or remove it after review. Users are responsible for checking the official source before applying, sharing personal details, or making commitments.",
        "We are not a recruiter, staffing agency, or employer. We do not directly hire candidates or manage employer onboarding processes."
      ]}
    />
  );
}
