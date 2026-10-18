import { Link } from "react-router";
import { authorFor } from "../data/authors";
import { formatDate } from "../lib/jobs";

function Initial({ name }){
  return <span className="byline-avatar" aria-hidden="true">{name[0]}</span>;
}

// "By Varsha · Updated 11 Oct 2026 · 7 min read" under a page title.
export default function AuthorByline({ author, updated, minutes, extra }){
  const a = authorFor(author);
  return (
    <p className="byline">
      <Initial name={a.name} />
      <span>
        By <Link to="/about#who-runs-jobkhojo">{a.name}</Link>
        {updated && <> · <span suppressHydrationWarning>Updated {formatDate(updated)}</span></>}
        {minutes && <> · {minutes} min read</>}
        {extra && <> · {extra}</>}
      </span>
    </p>
  );
}

// Short author card for the end of a guide.
export function AuthorBox({ author }){
  const a = authorFor(author);
  return (
    <aside className="author-box" aria-label="About the author">
      <Initial name={a.name} />
      <div>
        <p className="author-box-name">{a.name} <span>{a.role}</span></p>
        <p className="author-box-bio">{a.bio}</p>
        <p className="author-box-links"><Link to="/editorial-policy">How we write and check guides</Link> · <Link to="/contact">Suggest a correction</Link></p>
      </div>
    </aside>
  );
}

