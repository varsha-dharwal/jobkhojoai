import TrustPage from "./TrustPage";
import { CONTACT_EMAIL } from "../lib/site";

const sections = [
  {
    id: "using",
    heading: "Using JobKhojo",
    paragraphs: [
      "By using jobkhojoai.com you agree to these terms. JobKhojo is a free information service that lists job and internship openings, career guidance and tools such as the resume builder. You may use it for your own, personal job search.",
    ],
  },
  {
    id: "listings",
    heading: "Job listings",
    paragraphs: [
      "Listings are based on openings published by employers on their own websites or on public job boards. We present them in good faith, but we don't employ, represent or endorse the employers, and we can't guarantee that a role is still open or that every detail is current.",
      "The employer's official posting is always the final authority on eligibility, salary, deadlines and the hiring process. If something on JobKhojo differs from the original, the original applies.",
    ],
  },
  {
    id: "applying",
    heading: "Applying for jobs",
    paragraphs: [
      "When you click an apply button you leave JobKhojo for a third-party website. Your application, and any information you give there, is between you and that employer or job board. JobKhojo doesn't receive applications and isn't responsible for third-party websites or hiring outcomes.",
      "We never charge candidates. Don't pay anyone who claims to offer a job through JobKhojo — please report it to us instead.",
    ],
  },
  {
    id: "accounts",
    heading: "Accounts and content you create",
    paragraphs: [
      "You're responsible for keeping your account password safe and for the accuracy of anything you put in your resume. Resume content you create belongs to you.",
    ],
  },
  {
    id: "acceptable",
    heading: "Acceptable use",
    list: [
      "Don't misuse the site — for example by attempting to break its security, overload it, or scrape it at scale.",
      "Don't use the AI features to generate unlawful, harmful or misleading content.",
      "Don't impersonate an employer or post misleading information through any feature.",
    ],
  },
  {
    id: "content",
    heading: "Our content",
    paragraphs: [
      "Career guides, career paths, design and code on JobKhojo are our work. You're welcome to link to and share pages; please don't republish them in full without permission. Company names and logos belong to their owners.",
    ],
  },
  {
    id: "liability",
    heading: "No warranty",
    paragraphs: [
      "JobKhojo is provided “as is”. To the extent permitted by law, we're not liable for losses arising from your use of the site, from third-party websites, or from decisions made based on listings or guidance. AI-generated suggestions may be inaccurate and should be checked.",
    ],
  },
  {
    id: "changes",
    heading: "Changes and contact",
    paragraphs: [
      `We may update these terms; the date above shows the latest version. These terms are governed by the laws of India. Questions? Email ${CONTACT_EMAIL}.`,
    ],
  },
];

export default function Terms(){
  return (
    <TrustPage
      title="Terms of Use | JobKhojo"
      description="The terms for using JobKhojo: how job listings work, applying on third-party sites, accounts, acceptable use and liability."
      path="/terms"
      eyebrow="Legal"
      heading="Terms of use"
      sections={sections}
    />
  );
}
