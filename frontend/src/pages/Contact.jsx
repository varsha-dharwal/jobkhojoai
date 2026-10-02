import { Mail, MessageCircle, Flag } from "lucide-react";
import TrustPage from "./TrustPage";
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "../lib/site";

export default function Contact(){
  return (
    <TrustPage
      title="Contact JobKhojo"
      description="Contact JobKhojo to report a listing, request a correction, ask about your data or share feedback."
      path="/contact"
      eyebrow="Contact"
      heading="Get in touch"
      intro="Questions, corrections or a listing that doesn't look right — we'd like to hear about it."
      updated={null}
    >
      <div className="contact-grid">
        <div className="panel">
          <Mail size={20} aria-hidden="true" />
          <h2>Email</h2>
          <p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          <p className="muted">Best for corrections, data requests and anything detailed.</p>
        </div>
        <div className="panel">
          <MessageCircle size={20} aria-hidden="true" />
          <h2>Instagram</h2>
          <p><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{INSTAGRAM_HANDLE}</a></p>
          <p className="muted">Send us a direct message for quick questions.</p>
        </div>
      </div>
      <h2><Flag size={18} aria-hidden="true" style={{ verticalAlign: "-3px", marginRight: 6 }} />Reporting a listing</h2>
      <p>
        Include the job link and what's wrong — closed, inaccurate, broken link, or suspicious (for example, someone asking
        for a fee). We review every report and update or remove listings that can't be confirmed.
      </p>
      <p>
        JobKhojo doesn't process job applications, so we can't share the status of an application. Please contact the
        employer directly for that.
      </p>
    </TrustPage>
  );
}
