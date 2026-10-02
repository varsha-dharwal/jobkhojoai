import { Link } from "react-router";
import TrustPage from "./TrustPage";
import FAQSection from "../components/FAQSection";
import { CONTACT_EMAIL, INSTAGRAM_HANDLE } from "../lib/site";

const sections = [
  {
    id: "what",
    heading: "What JobKhojo is",
    paragraphs: [
      "JobKhojo (jobkhojoai.com) is a job discovery website for freshers, students and early-career professionals, mainly in India. We bring openings from many different places into one consistent, easy-to-scan format, so you can quickly see what a role involves, who it suits and where to apply.",
      "Alongside jobs, we publish career paths, interview preparation and practical guides, and offer a free resume builder — because finding a job usually starts well before you click “apply”.",
    ],
  },
  {
    id: "listings",
    heading: "Where our listings come from",
    paragraphs: [
      "Every job on JobKhojo is added by hand by our team. We find openings on company career pages and on public job boards such as LinkedIn, Naukri and Indeed. We then write the listing up in a standard structure — role, responsibilities, requirements, location, experience, skills — based on the employer's original posting.",
      "Each job page says where its apply button leads, for example “Apply on LinkedIn” or “Apply on company site”. We focus on roles in software and IT, design, data, cloud, QA and technical support, plus other entry-level roles at technology and IT services companies.",
    ],
  },
  {
    id: "dont",
    heading: "What we don't do",
    list: [
      "We are not a recruiter, staffing agency or employer, and we don't take part in hiring decisions.",
      "We don't collect job applications. You always apply on the employer's site or the original job board.",
      "We never charge candidates — not for listings, applications, interviews or “registration”.",
      "We don't sell your personal information.",
    ],
  },
  {
    id: "freshness",
    heading: "How we keep listings current",
    paragraphs: [
      "New jobs are added most days, and every listing shows when it was posted. Listings with a closing date are hidden automatically once that date passes, and we mark other listings as closed when we find they're no longer open. Even so, openings can close without notice — always confirm the details on the original posting.",
    ],
  },
  {
    id: "contact",
    heading: "Talk to us",
    paragraphs: [
      `Spotted a mistake, a closed job or a listing that looks suspicious? Email ${CONTACT_EMAIL} or message us on Instagram (${INSTAGRAM_HANDLE}) with the job link. We read every message.`,
    ],
  },
];

export default function About(){
  return (
    <TrustPage
      title="About JobKhojo — How We Find and Publish Jobs"
      description="JobKhojo helps freshers and early-career professionals in India find jobs and internships. Learn where our listings come from, how we keep them current and what we don't do."
      path="/about"
      eyebrow="About"
      heading="Helping early-career job seekers find real openings, faster"
      intro="JobKhojo collects openings from company career pages and job boards, writes them up clearly, and sends you to the original page to apply."
      updated={null}
      sections={sections}
    >
      <p>
        Read more about <Link to="/job-verification-policy">how we review listings</Link> and our{" "}
        <Link to="/editorial-policy">editorial standards</Link>.
      </p>
      <FAQSection />
    </TrustPage>
  );
}
