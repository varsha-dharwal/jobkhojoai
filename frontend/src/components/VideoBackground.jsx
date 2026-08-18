import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

export default function VideoBackground({ src, poster }){
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) el.pause();
    else el.play().catch(() => {});
  }, [reducedMotion]);

  if (!src || failed) return null;

  function toggleSound(){
    const el = ref.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    el.play().catch(() => {});
  }

  return (
    <>
      <video
        ref={ref}
        className="section-video-bg"
        src={src}
        poster={poster}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
      />
      <div className="section-video-overlay" aria-hidden="true" />
      <button
        type="button"
        className="video-sound-toggle"
        onClick={toggleSound}
        aria-label={muted ? "Turn video sound on" : "Turn video sound off"}
      >
        {muted ? (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M17 9l4 6M21 9l-4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M16 8.5a4 4 0 0 1 0 7M18.5 6a7.5 7.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>
    </>
  );
}
