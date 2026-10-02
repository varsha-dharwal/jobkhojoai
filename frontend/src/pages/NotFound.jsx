import { Link } from "react-router";
import SEO from "../components/SEO";

export default function NotFound(){
  return (
    <main className="container status-page">
      <SEO title="Page not found | JobKhojo" description="The page you're looking for doesn't exist or may have moved." path="/404" noindex />
      <p className="eyebrow">Error 404</p>
      <h1>We couldn't find that page</h1>
      <p className="lead">The link may be old, or the job may have closed. Try the jobs list or a search instead.</p>
      <div className="status-page-actions">
        <Link to="/jobs" className="btn btn-primary">Browse jobs</Link>
        <Link to="/" className="btn btn-secondary">Go to homepage</Link>
      </div>
    </main>
  );
}
