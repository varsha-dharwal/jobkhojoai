import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(){
    return { hasError: true };
  }

  componentDidCatch(error, info){
    console.error("Unhandled UI error:", error, info);
  }

  render(){
    if (this.state.hasError) {
      return (
        <main className="container" style={{paddingTop:"var(--space-12)", paddingBottom:"var(--space-12)", textAlign:"center"}}>
          <p style={{fontSize:13, letterSpacing:2, color:"var(--color-text-tertiary)", textTransform:"uppercase", marginBottom:12}}>
            Error
          </p>
          <h1 style={{fontSize:"clamp(28px, 6vw, 44px)", lineHeight:1.2, marginBottom:12}}>Something went wrong</h1>
          <p style={{color:"var(--color-text-secondary)", maxWidth:440, margin:"0 auto 28px", lineHeight:1.6}}>
            An unexpected error occurred while showing this page. Try reloading — if it keeps happening, please let us know.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.assign("/")}>Back to Home</button>
        </main>
      );
    }
    return this.props.children;
  }
}
