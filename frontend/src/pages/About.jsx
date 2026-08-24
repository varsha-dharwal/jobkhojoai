import SEO from "../components/SEO";

export default function About(){
  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60, maxWidth:720, lineHeight:1.7}}>
      <SEO
        title="About Us | jobkhojoAI"
        description="Learn about jobkhojoAI — a tech job-alert platform bringing verified IT & software jobs, internships, and remote-friendly roles to job seekers across India."
        path="/about"
      />
      <h1>About jobkhojoAI</h1>
      <p style={{color:"var(--color-text-secondary)"}}>
        jobkhojoAI is a tech job-alert platform that brings IT & software jobs, internships, and remote-friendly
        roles together in one place, in a simple, easy-to-understand format — with eligibility, salary, important
        dates and the official apply link. Our goal is to get accurate opportunities to every tech job seeker,
        from freshers to experienced professionals, without any confusion.
      </p>
    </main>
  );
}
