import SEO from "../components/SEO";

export default function Contact(){
  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60, maxWidth:720, lineHeight:1.7}}>
      <SEO
        title="Contact Us | jobkhojoAI"
        description="Get in touch with jobkhojoAI for queries, corrections, or suggestions about tech job and internship listings across India."
        path="/contact"
      />
      <h1>Contact Us</h1>
      <p style={{color:"var(--color-text-secondary)"}}>
        For any query, correction or suggestion, message us on Instagram:
        <br/><a href="https://instagram.com/jobkhojoAI" style={{color:"var(--color-brand)"}}>@jobkhojoAI</a>
        <br/>Or email us: <a href="mailto:hello@jobkhojoai.com" style={{color:"var(--color-brand)"}}>hello@jobkhojoai.com</a>
      </p>
    </main>
  );
}
