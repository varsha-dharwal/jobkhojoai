import SEO from "../components/SEO";

export default function Privacy(){
  return (
    <main className="container" style={{paddingTop:32, paddingBottom:60, maxWidth:720, lineHeight:1.7}}>
      <SEO
        title="Privacy Policy | jobkhojoAI"
        description="Learn how jobkhojoAI handles account details, activity, AI inputs, advertising cookies, and third-party services."
        path="/privacy-policy"
      />
      <h1>Privacy Policy for jobkhojoAI</h1>
      <p style={{color:"var(--color-text-secondary)"}}>
        When you create an account, we collect your name and email address and store your account details. Passwords
        are stored as hashes, not plain text. If you sign in and use the resume builder, your resume draft may be
        saved to your account. Saved jobs are stored in your browser on this device. The "Apply Now" button takes
        you to the employer's website; we do not collect the application form data you submit to the employer.
      </p>
      <h2>AI features</h2>
      <p style={{color:"var(--color-text-secondary)"}}>
        When you use Ask AI or resume AI features, the text you submit and the context needed to answer your request
        (which may include chat messages, resume or project descriptions, a target role, or technologies) are sent
        to Google's Gemini API to generate a response. Do not include information you do not want processed by this
        service. Google's handling of data is also subject to Google's applicable privacy terms and policies.
      </p>
      <h2>Advertising and cookies</h2>
      <p style={{color:"var(--color-text-secondary)"}}>
        jobkhojoAI integrates Google AdSense. If ads are served on this site, Google and other third-party vendors
        may use cookies, web beacons, IP addresses, or similar technologies to collect information as a result of
        ad serving, including to provide, measure, and personalize ads where permitted. Google's use of information
        from sites that use its services is described at{" "}
        <a href="https://policies.google.com/technologies/partner-sites" style={{color:"var(--color-brand)"}}>
          How Google uses information from sites or apps that use its services
        </a>.
        You can manage Google ad personalization through{" "}
        <a href="https://adssettings.google.com/" style={{color:"var(--color-brand)"}}>Google Ads Settings</a>.
        Where required, we will provide applicable consent choices before using advertising technologies that
        require consent.
      </p>
    </main>
  );
}
