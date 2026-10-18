import { Link, useParams } from "react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import SEO, { JsonLd, SITE_URL } from "../components/SEO";
import AuthorByline, { AuthorBox } from "../components/AuthorByline";
import { authorSchema } from "../data/authors";
import NotFound from "./NotFound";
import { CAREER_GUIDE_ARTICLES } from "../data/careerGuides";
import { LONG_GUIDES, longGuide } from "../lib/content";

function readingMinutes(article){
  const words = article.sections.reduce((n, s) => n + s.body.split(/\s+/).length, article.summary.split(/\s+/).length);
  return Math.max(1, Math.round(words / 200));
}

// Up to three other guides, long-form ones first.
function relatedGuides(slug){
  const long = LONG_GUIDES.filter(g => g.slug !== slug).map(g => ({ slug: g.slug, title: g.title }));
  const short = CAREER_GUIDE_ARTICLES.filter(a => a.slug !== slug && !long.some(g => g.slug === a.slug));
  return [...long, ...short].slice(0, 3);
}

function PracticeCta(){
  return (
    <aside className="doc-cta panel">
      <h2>Put it into practice</h2>
      <p>Browse current openings for freshers and early-career candidates, or start with a career path.</p>
      <div className="doc-cta-actions">
        <Link to="/jobs" className="btn btn-primary">Browse jobs</Link>
        <Link to="/career-paths" className="btn btn-secondary">Career paths</Link>
      </div>
    </aside>
  );
}

function MoreGuides({ slug }){
  const related = relatedGuides(slug);
  return (
    <section className="section" aria-labelledby="more-guides">
      <h2 id="more-guides" className="h3">More guides</h2>
      <ul className="link-list">
        {related.map(a => (
          <li key={a.slug}><Link to={`/career-guide/${a.slug}`}>{a.title} <ArrowRight size={14} aria-hidden="true" /></Link></li>
        ))}
      </ul>
    </section>
  );
}

function Breadcrumbs({ title }){
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/career-insights">Career guides</Link>
      <ChevronRight size={14} aria-hidden="true" />
      <span aria-current="page">{title}</span>
    </nav>
  );
}

// Long-form guide written in Markdown (src/content/guides).
function LongGuide({ guide }){
  const path = `/career-guide/${guide.slug}`;
  return (
    <main className="container doc-page">
      <SEO title={`${guide.title} | JobKhojo`} description={guide.description} path={path} type="article" noindex={guide.draft} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        mainEntityOfPage: `${SITE_URL}${path}`,
        ...(guide.published ? { datePublished: guide.published } : {}),
        ...(guide.updated ? { dateModified: guide.updated } : {}),
        author: authorSchema(guide.author),
        publisher: { "@type": "Organization", name: "JobKhojo", logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` } },
      }} />

      <Breadcrumbs title={guide.title} />

      <header className="doc-head">
        <p className="eyebrow">{guide.topic || "Career guide"}{guide.draft ? " · Draft (not live)" : ""}</p>
        <h1>{guide.title}</h1>
        {guide.description && <p className="lead">{guide.description}</p>}
        <AuthorByline author={guide.author} updated={guide.updated} minutes={guide.minutes} />
      </header>

      {guide.toc.length > 2 && (
        <nav className="doc-toc" aria-label="On this page">
          <p>On this page</p>
          <ol>{guide.toc.map(h => <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>)}</ol>
        </nav>
      )}

      <article className="prose doc-body md-body" dangerouslySetInnerHTML={{ __html: guide.html }} />

      <AuthorBox author={guide.author} />
      <PracticeCta />
      <MoreGuides slug={guide.slug} />
    </main>
  );
}

export default function EditorialArticle(){
  const { slug } = useParams();
  const guide = longGuide(slug);
  if (guide) return <LongGuide guide={guide} />;

  const article = CAREER_GUIDE_ARTICLES.find(item => item.slug === slug);
  if (!article) return <NotFound />;

  // Short guides stay readable but are kept out of search until their long version
  // (a Markdown file with the same slug) is published.
  return (
    <main className="container doc-page">
      <SEO title={`${article.title} | JobKhojo`} description={article.summary} path={`/career-guide/${article.slug}`} type="article" noindex />

      <Breadcrumbs title={article.title} />

      <header className="doc-head">
        <p className="eyebrow">Career guide</p>
        <h1>{article.title}</h1>
        <p className="lead">{article.summary}</p>
        <AuthorByline minutes={readingMinutes(article)} />
      </header>

      <article className="prose doc-body">
        {article.sections.map(section => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>

      <PracticeCta />
      <MoreGuides slug={article.slug} />
    </main>
  );
}
