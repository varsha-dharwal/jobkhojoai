import { motion } from "motion/react";

// A small animated bot avatar — a soft pulsing glow ring plus a gentle breathing
// scale, both a little quicker/tighter while the assistant is "thinking".
export default function AiAvatar({ size = 32, thinking = false }){
  return (
    <motion.div
      className="ai-avatar"
      style={{ width: size, height: size }}
      animate={{ scale: thinking ? [1, 1.12, 1] : [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: thinking ? 0.9 : 2.6, ease: "easeInOut" }}
    >
      <motion.span
        className="ai-avatar-ring"
        animate={{ opacity: [0.55, 0.1, 0.55], scale: [1, 1.4, 1] }}
        transition={{ repeat: Infinity, duration: thinking ? 1.1 : 2.8, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <svg viewBox="0 0 24 24" fill="none" width={size * 0.55} height={size * 0.55} aria-hidden="true">
        <rect x="5" y="8" width="14" height="11" rx="4" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M12 8V5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="12" cy="4" r="1.3" fill="currentColor"/>
        <circle cx="9" cy="13.5" r="1.2" fill="currentColor"/>
        <circle cx="15" cy="13.5" r="1.2" fill="currentColor"/>
        <path d="M9 17h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    </motion.div>
  );
}
