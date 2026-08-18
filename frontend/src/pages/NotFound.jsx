import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound(){
  useEffect(() => { document.title = "Page Not Found | jobkhojoAI"; }, []);

  return (
    <main className="container" style={{paddingTop:"var(--space-12)", paddingBottom:"var(--space-12)", textAlign:"center"}}>
      <p style={{fontSize:13, letterSpacing:2, color:"var(--color-text-tertiary)", textTransform:"uppercase", marginBottom:12}}>
        Error 404
      </p>
      <h1 style={{fontSize:"clamp(28px, 6vw, 44px)", lineHeight:1.2, marginBottom:12}}>This page took a wrong turn</h1>
      <p style={{color:"var(--color-text-secondary)", maxWidth:440, margin:"0 auto 28px", lineHeight:1.6}}>
        The page you're looking for doesn't exist, may have been moved, or the job listing has expired.
      </p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </main>
  );
}
