import SEO from "../components/SEO";

export default function Privacy(){
  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60, maxWidth:720, lineHeight:1.7}}>
      <SEO
        title="Privacy Policy | jobkhojoAI"
        description="Learn how jobkhojoAI uses account details, email verification, saved jobs, and application activity."
        path="/privacy-policy"
      />
      <h1>Privacy Policy for jobkhojoAI</h1>
      <p style={{color:"var(--color-text-secondary)"}}>
        When you create an account, jobkhojoAI collects your name, email address, and phone number. We send a
        one-time verification code to your email using our email delivery provider, Resend. We store your account
        details and email verification state so you can sign in and use your account. After your first successful
        verification, we send the welcome email using the same provider.
      </p>
      <h2>Saved jobs and application activity</h2>
      <p style={{color:"var(--color-text-secondary)"}}>
        If you are signed in, we store saved jobs, sign-in visit activity, and the jobs you click Apply Now on,
        along with the tracking status you choose in My Jobs. Apply Now records that you clicked through; it does not submit an application
        to the employer or tell us whether the employer received your application. The employer's website handles
        the application form and its own privacy policy applies to information you submit there.
      </p>
      <h2>Resume data</h2>
      <p style={{color:"var(--color-text-secondary)"}}>
        If you use the resume builder while signed in, your resume draft may be saved to your account so you can
        continue working on it later.
      </p>
      <h2>Job reports</h2>
      <p style={{color:"var(--color-text-secondary)"}}>
        When you report a listing, we store the selected reason and any details you provide so the listing can be
        reviewed.
      </p>
    </main>
  );
}
