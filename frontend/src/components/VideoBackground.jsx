import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const QUIET_VOLUME = 0.15;

export default function VideoBackground({ src, poster }){
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) { el.pause(); return; }

    // Try to autoplay with (quiet) sound on load; browsers that block unmuted
    // autoplay will reject the play() promise, so fall back to muted playback.
    el.volume = QUIET_VOLUME;
    el.muted = false;
    el.play().catch(() => {
      el.muted = true;
      setMuted(true);
      el.play().catch(() => {});
    });
  }, [reducedMotion]);

  // Browsers require at least one user interaction with the page before they'll
  // allow sound at all — this is a hard policy no site code can bypass. The best
  // we can do is turn sound on the moment that first interaction happens, rather
  // than making the visitor hunt down the mute icon themselves.
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    function unmuteOnFirstInteraction(e){
      if (e.target?.closest?.(".video-sound-toggle")) return;
      if (!el.muted) return;
      el.volume = QUIET_VOLUME;
      el.muted = false;
      setMuted(false);
      el.play().catch(() => {});
    }
    window.addEventListener("pointerdown", unmuteOnFirstInteraction, { once: true });
    window.addEventListener("keydown", unmuteOnFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unmuteOnFirstInteraction);
      window.removeEventListener("keydown", unmuteOnFirstInteraction);
    };
  }, [reducedMotion]);

  if (!src || failed) return null;

  function toggleSound(){
    const el = ref.current;
    if (!el) return;
    const nextMuted = !el.muted;
    if (!nextMuted) el.volume = QUIET_VOLUME;
    el.muted = nextMuted;
    setMuted(nextMuted);
    el.play().catch(() => {});
  }

  return (
    <>
      <video
        ref={ref}
        className="section-video-bg"
        src={src}
        poster={poster}
        loop
        playsInline
        preload="metadata"
        fetchpriority="high"
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
