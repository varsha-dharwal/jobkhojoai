import { Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import TrustPage from "./TrustPage";
import ContactForm from "../components/ContactForm";
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "../lib/site";

export default function Contact(){
  return (
    <TrustPage
      title="Contact JobKhojo: Report a Job, Ask a Question or Request a Correction"
      description="Contact JobKhojo to report a closed or suspicious job, request a correction, ask about your data or share feedback. Use the form, email or Instagram."
      path="/contact"
      eyebrow="Contact"
      heading="Get in touch"
      intro="Questions, corrections or a listing that doesn't look right: we'd like to hear about it. JobKhojo is run by a small team, and every message is read by a person."
      updated={null}
    >
      <ContactForm />

      <div className="contact-grid">
        <div className="panel">
          <Mail size={20} aria-hidden="true" />
          <h2>Email</h2>
          <p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          <p className="muted">Best for corrections, data requests and anything with attachments.</p>
        </div>
        <div className="panel">
          <MessageCircle size={20} aria-hidden="true" />
          <h2>Instagram</h2>
          <p><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{INSTAGRAM_HANDLE}</a></p>
          <p className="muted">Send a direct message for quick questions and job alerts.</p>
        </div>
      </div>

      <h2>When to expect a reply</h2>
      <p>
        We aim to reply within two working days. Reports about suspicious listings are handled first: if a job asks for
        money or personal documents up front, we take it down while we check it.
      </p>

      <h2>Reporting a listing</h2>
      <p>
        Include the job link and what's wrong: closed, inaccurate, a broken apply link, or suspicious (for example,
        someone asking for a fee). We review every report and update or remove listings that can't be confirmed. Our{" "}
        <Link to="/job-verification-policy">job verification policy</Link> explains what we check before a job goes live.
      </p>

      <h2>What we can't help with</h2>
      <ul>
        <li>The status of an application. JobKhojo doesn't process applications; please contact the employer directly.</li>
        <li>Referrals or guaranteed interviews. We don't offer them, and anyone who charges for them is not genuine.</li>
        <li>Changes to a company's own job post. We can fix our listing, but the original post belongs to the employer.</li>
      </ul>

      <h2>Corrections to guides</h2>
      <p>
        If something in a career guide or company hiring guide is wrong or out of date, tell us which page and what
        changed. We correct mistakes quickly and note significant changes, as described in our{" "}
        <Link to="/content-correction-policy">content correction policy</Link>.
      </p>
    </TrustPage>
  );
}
