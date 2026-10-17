import { JOB_ARTICLE_AUTHOR } from "../lib/site";

export default function JobAuthor(){
  return (
    <section className="job-author" aria-labelledby="job-author-heading">
      <div className="job-author-mark" aria-hidden="true">VD</div>
      <div>
        <h2 id="job-author-heading">About the author</h2>
        <p className="job-author-name">{JOB_ARTICLE_AUTHOR.name}</p>
        <p>{JOB_ARTICLE_AUTHOR.description}</p>
      </div>
    </section>
  );
}
