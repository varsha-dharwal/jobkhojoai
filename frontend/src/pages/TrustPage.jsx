import SEO from "../components/SEO";

export default function TrustPage({ title, description, path, heading, paragraphs }) {
  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 820, lineHeight: 1.7 }}>
      <SEO title={title} description={description} path={path} />
      <h1>{heading}</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {paragraphs.map((paragraph, index) => (
          <p key={index} style={{ margin: 0, color: "var(--color-text-secondary)" }}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
