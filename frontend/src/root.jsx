import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError } from "react-router";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import AskAI from "./components/AskAI";
import { ADSENSE_CLIENT } from "./config/adsense";
import "./index.css";

export function Layout({ children }){
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* /jobs is pre-rendered without filters; hide its results until the query is applied. */}
        <script dangerouslySetInnerHTML={{ __html: "if(location.search&&location.pathname==='/jobs')document.documentElement.classList.add('pending-query')" }} />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
        {/* Wordmark only: loads just the glyphs in "JobKhojo". */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&text=JobKhojo&display=swap" />
        <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`} crossOrigin="anonymous" />
        <Meta />
        <Links />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App(){
  return (
    <>
      <SiteHeader />
      <div id="main" className="site-main">
        <Outlet />
      </div>
      <SiteFooter />
      <AskAI />
    </>
  );
}

// Shown by the SPA fallback page (client-only screens and jobs newer than the last
// build) for the split second before the client takes over.
export function HydrateFallback(){
  return (
    <div className="hydrate-fallback" aria-busy="true">
      <span className="spinner" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function ErrorBoundary(){
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  if (!notFound) console.error(error);
  return (
    <>
      <SiteHeader />
      <main id="main" className="container status-page">
        <p className="eyebrow">{notFound ? "Error 404" : "Something went wrong"}</p>
        <h1>{notFound ? "We couldn't find that page" : "This page didn't load properly"}</h1>
        <p className="lead">
          {notFound
            ? "The link may be old, or the job may have closed."
            : "Please refresh the page. If it keeps happening, let us know through the contact page."}
        </p>
        <div className="status-page-actions">
          <a href="/jobs" className="btn btn-primary">Browse jobs</a>
          <a href="/" className="btn btn-secondary">Go to homepage</a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
