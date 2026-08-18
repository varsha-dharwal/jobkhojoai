import { Link } from "react-router-dom";

export default function Footer(){
  return (
    <footer style={{borderTop:"1px solid var(--color-border-default)", marginTop:64}}>
      <div className="container" style={{padding:"32px 20px", display:"flex", flexWrap:"wrap", gap:16, justifyContent:"space-between", color:"var(--color-text-tertiary)", fontSize:13}}>
        <span>© {new Date().getFullYear()} jobkhojoAI — Smart Jobs, Smarter You</span>
        <div style={{display:"flex", gap:16}}>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
