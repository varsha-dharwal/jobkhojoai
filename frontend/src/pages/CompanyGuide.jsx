import { Link, useLoaderData, useParams } from "react-router";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import SEO, { JsonLd, SITE_URL } from "../components/SEO";
import AuthorByline, { AuthorBox } from "../components/AuthorByline";
import { authorSchema } from "../data/authors";
import CompanyAvatar from "../components/CompanyAvatar";
import JobCard from "../components/JobCard";
import NotFound from "./NotFound";
import { fetchAllJobs, toListJob } from "../lib/api";
import { companyGuide, companyJobs } from "../lib/content";

// Build time: the company's open jobs are baked into the page.
export async function loader({ params }){
  const company = companyGuide(params.slug);
  if (!company) return { jobs: [] };
  const jobs = await fetchAllJobs().catch(() => []);
  return { jobs: companyJobs(company, jobs).map(toListJob) };
}

export default function CompanyGuide(){
  const { slug } = useParams();
  const { jobs } = useLoaderData();
  const company = companyGuide(slug);
  if (!company) return <NotFound />;
  const path = `/companies/${company.slug}`;

  return (
    <main className="container doc-page">
      <SEO title={`${company.title} | JobKhojo`} description={company.description} path={path} type="article" noindex={company.draft} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: company.title,
        description: company.description,
        mainEntityOfPage: `${SITE_URL}${path}`,
        ...(company.published ? { datePublished: company.published } : {}),
        ...(company.updated ? { dateModified: company.updated } : {}),
        about: { "@type": "Organization", name: company.name, ...(company.careersUrl ? { url: company.careersUrl } : {}) },
        author: authorSchema(company.author),
        publisher: { "@type": "Organization", name: "JobKhojo", logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` } },
      }} />

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/companies">Company hiring guides</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">{company.name}</span>
      </nav>

      <header className="doc-head company-head">
        <CompanyAvatar name={company.name} size={56} />
        <div>
          <p className="eyebrow">Company hiring guide{company.draft ? " · Draft (not live)" : ""}</p>
          <h1>{company.title}</h1>
          {company.description && <p className="lead">{company.description}</p>}
          <AuthorByline author={company.author} updated={company.updated} minutes={company.minutes} />
        </div>
      </header>

      <section className="panel company-jobs" aria-labelledby="open-jobs">
        <div className="section-head section-head-row">
          <h2 id="open-jobs">Open {company.name} jobs on JobKhojo</h2>
          {company.careersUrl && (
            <a href={company.careersUrl} target="_blank" rel="noopener noreferrer" className="link-arrow">
              Official careers site <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
        {jobs.length > 0
          ? <div className="job-list">{jobs.map(j => <JobCard key={j._id} job={j} />)}</div>
          : <p className="muted">No open {company.name} roles are listed right now. Check the official careers site, or <Link to="/jobs">browse all jobs</Link>.</p>}
      </section>

      {company.toc.length > 2 && (
        <nav className="doc-toc" aria-label="On this page">
          <p>On this page</p>
          <ol>{company.toc.map(h => <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>)}</ol>
        </nav>
      )}

      <article className="prose doc-body md-body" dangerouslySetInnerHTML={{ __html: company.html }} />

      <AuthorBox author={company.author} />
    </main>
  );
}
