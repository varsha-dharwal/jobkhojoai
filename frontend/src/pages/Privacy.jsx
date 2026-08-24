import SEO from "../components/SEO";

export default function Privacy(){
  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60, maxWidth:720, lineHeight:1.7}}>
      <SEO
        title="Privacy Policy | jobkhojoAI"
        description="Read jobkhojoAI's privacy policy. We don't collect your personal application data — Apply Now links take you directly to the employer's official site."
        path="/privacy-policy"
      />
      <h1>Privacy Policy</h1>
      <p style={{color:"var(--color-text-secondary)"}}>
        jobkhojoAI does not collect any of your personal application data — the "Apply Now" button takes you
        directly to the hiring company's official website or careers page, where their own privacy policy
        applies. This site may only track basic analytics (page visits) so we can improve our content.
      </p>
    </main>
  );
}
