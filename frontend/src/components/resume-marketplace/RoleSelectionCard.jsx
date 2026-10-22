import { Link } from "react-router";

export default function RoleSelectionCard({ image, imageAlt, eyebrow, title, description, to, buttonLabel, onClick, buttonRef, terms }) {
  return (
    <article className="market-role-card">
      <div className="market-role-illustration"><img src={image} alt={imageAlt} width="480" height="300" /></div>
      <p className="market-role-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="market-role-description">{description}</p>
      {terms && <p className="market-role-terms">{terms}</p>}
      {onClick ? (
        <button ref={buttonRef} className="btn btn-primary market-role-cta" type="button" onClick={onClick}>{buttonLabel}<span aria-hidden="true">→</span></button>
      ) : (
        <Link className="btn btn-primary market-role-cta" to={to}>{buttonLabel}<span aria-hidden="true">→</span></Link>
      )}
    </article>
  );
}
