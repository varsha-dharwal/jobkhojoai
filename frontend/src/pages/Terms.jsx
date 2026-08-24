import SEO from "../components/SEO";

export default function Terms(){
  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60, maxWidth:720, lineHeight:1.7}}>
      <SEO
        title="Terms & Conditions | jobkhojoAI"
        description="Terms and conditions for using jobkhojoAI, a platform aggregating publicly available tech job and internship listings across India."
        path="/terms"
      />
      <h1>Terms &amp; Conditions</h1>
      <p style={{color:"var(--color-text-secondary)"}}>
        The information provided on jobkhojoAI is for informational purposes only, sourced from publicly
        available job and internship listings. For final eligibility, dates and process, always treat the
        official employer listing or website as authoritative. In case of any mismatch, the official source
        will be considered valid.
      </p>
    </main>
  );
}
