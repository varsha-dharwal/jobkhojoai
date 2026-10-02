import { Link, useParams } from "react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import SEO, { JsonLd, SITE_URL } from "../components/SEO";
import NotFound from "./NotFound";
import { CAREER_GUIDE_ARTICLES } from "../data/careerGuides";

function readingMinutes(article){
  const words = article.sections.reduce((n, s) => n + s.body.split(/\s+/).length, article.summary.split(/\s+/).length);
  return Math.max(1, Math.round(words / 200));
}

export default function EditorialArticle(){
  const { slug } = useParams();
  const article = CAREER_GUIDE_ARTICLES.find(item => item.slug === slug);
  if (!article) return <NotFound />;

  const related = CAREER_GUIDE_ARTICLES.filter(a => a.slug !== slug).slice(0, 3);

  return (
    <main className="container doc-page">
      <SEO title={`${article.title} | JobKhojo`} description={article.summary} path={`/career-guide/${article.slug}`} type="article" />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.summary,
        mainEntityOfPage: `${SITE_URL}/career-guide/${article.slug}`,
        author: { "@type": "Organization", name: "JobKhojo", url: SITE_URL },
        publisher: { "@type": "Organization", name: "JobKhojo", logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` } },
      }} />

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/career-insights">Career guides</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">{article.title}</span>
      </nav>

      <header className="doc-head">
        <p className="eyebrow">Career guide</p>
        <h1>{article.title}</h1>
        <p className="lead">{article.summary}</p>
        <p className="doc-updated">By the JobKhojo team · {readingMinutes(article)} min read</p>
      </header>

      <article className="prose doc-body">
        {article.sections.map(section => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>

      <aside className="doc-cta panel">
        <h2>Put it into practice</h2>
        <p>Browse current openings for freshers and early-career candidates, or start with a career path.</p>
        <div className="doc-cta-actions">
          <Link to="/jobs" className="btn btn-primary">Browse jobs</Link>
          <Link to="/career-paths" className="btn btn-secondary">Career paths</Link>
        </div>
      </aside>

      <section className="section" aria-labelledby="more-guides">
        <h2 id="more-guides" className="h3">More guides</h2>
        <ul className="link-list">
          {related.map(a => (
            <li key={a.slug}><Link to={`/career-guide/${a.slug}`}>{a.title} <ArrowRight size={14} aria-hidden="true" /></Link></li>
          ))}
        </ul>
      </section>
    </main>
  );
}
