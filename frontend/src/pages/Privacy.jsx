import TrustPage from "./TrustPage";
import { CONTACT_EMAIL } from "../lib/site";

const sections = [
  {
    id: "summary",
    heading: "Summary",
    list: [
      "You can browse jobs and guides without an account.",
      "If you create an account, we store your name, email address and a secure hash of your password, plus any resume draft you choose to save.",
      "Saved jobs and unsaved resume drafts stay in your own browser (local storage) unless you sign in and save them.",
      "Text you send to our AI features is processed by Google's Gemini API to generate a reply.",
      "Advertising on this site is provided by Google AdSense, which may use cookies.",
      "We don't sell your personal information.",
    ],
  },
  {
    id: "collect",
    heading: "Information we collect",
    paragraphs: [
      "Account information: when you sign up (currently used for the resume builder) we collect your name and email address. Your password is stored only as a one-way hash, never as plain text.",
      "Content you create: resume details you enter in the resume builder. These are kept in your browser while you work and are saved to your account only when you're signed in.",
      "Messages to AI features: questions you type into “Ask” and text you submit to resume suggestions, together with the context needed to answer (for example a target role or a list of current job titles).",
      "Technical information: like most websites, our hosting providers automatically process standard request data such as IP address, browser type and the pages requested, in order to deliver the site and protect it from abuse.",
    ],
  },
  {
    id: "use",
    heading: "How we use it",
    list: [
      "To provide the features you use — for example, saving and restoring your resume draft.",
      "To answer questions you ask through AI features.",
      "To keep the site secure, prevent misuse and fix problems.",
      "To respond when you contact us.",
    ],
    after: ["We don't use your resume content for advertising, and we don't sell or rent personal information to anyone."],
  },
  {
    id: "ai",
    heading: "AI features",
    paragraphs: [
      "When you use Ask or resume AI suggestions, the text you submit is sent to Google's Gemini API to generate a response, and is also subject to Google's own terms and privacy policy. Please don't include sensitive personal information (such as ID numbers or bank details) in these messages. AI answers can be wrong — check important details yourself.",
    ],
  },
  {
    id: "cookies",
    heading: "Cookies and advertising",
    paragraphs: [
      "JobKhojo uses Google AdSense to show ads. Google and its partners may use cookies, device identifiers and similar technologies to serve ads, limit how often you see them, measure their performance and — where permitted — personalise them based on your visits to this and other websites.",
      "You can learn how Google uses this information at policies.google.com/technologies/partner-sites, and opt out of personalised ads at adssettings.google.com. Where the law requires it, we will ask for your consent before these technologies are used.",
      "The site itself uses your browser's local storage (not cookies) for saved jobs, resume drafts and keeping you signed in. You can clear this at any time from your browser settings.",
    ],
  },
  {
    id: "sharing",
    heading: "Who we share information with",
    paragraphs: [
      "We use service providers to run JobKhojo: website hosting and delivery, our application server, our database provider, and Google (for AI features and advertising). They process information only to provide their services to us. We may also disclose information if required by law.",
      "When you click an apply button you leave JobKhojo. Whatever you submit on the employer's site or a job board is governed by their privacy policy, not ours.",
    ],
  },
  {
    id: "retention",
    heading: "How long we keep it",
    paragraphs: [
      "We keep account information and saved resume drafts until you delete them or ask us to delete your account. Messages to AI features are not stored in your account.",
    ],
  },
  {
    id: "rights",
    heading: "Your choices and rights",
    paragraphs: [
      `You can ask us to access, correct or delete your personal information by emailing ${CONTACT_EMAIL} from the address linked to your account. If you are in India, you have these rights under the Digital Personal Data Protection Act, 2023. We'll respond within a reasonable time.`,
      "If you are under 18, please use account features only with the consent of a parent or guardian.",
    ],
  },
  {
    id: "changes",
    heading: "Changes and contact",
    paragraphs: [
      `If we change this policy we'll update the date at the top of this page. Questions? Email ${CONTACT_EMAIL}.`,
    ],
  },
];

export default function Privacy(){
  return (
    <TrustPage
      title="Privacy Policy | JobKhojo"
      description="What information JobKhojo collects, how it's used, how AI features and Google AdSense cookies work, and the choices you have."
      path="/privacy-policy"
      eyebrow="Legal"
      heading="Privacy policy"
      intro="This policy explains what information JobKhojo (jobkhojoai.com) collects, why, and the choices you have. We've tried to keep it short and plain."
      sections={sections}
    />
  );
}
