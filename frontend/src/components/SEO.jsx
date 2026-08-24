export const SITE_URL = "https://jobkhojoai.com";
export const SITE_NAME = "jobkhojoAI";

// React 19 hoists title/meta/link rendered anywhere in the tree into <head>,
// and de-dupes them automatically — no react-helmet needed.
export default function SEO({ title, description, path, noindex = false }){
  const url = `${SITE_URL}${path}`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
