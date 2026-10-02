import { useState } from "react";
import { companyLogo } from "../lib/companyLogos";

// Soft tint + strong text pairs (all pass WCAG AA) so initials badges stay calm.
const TINTS = [
  ["#EFF6FF", "#1D4ED8"], ["#F0FDFA", "#0F766E"], ["#FEF3C7", "#92400E"], ["#F5F3FF", "#5B21B6"],
  ["#FCE7F3", "#9D174D"], ["#ECFEFF", "#155E75"], ["#F1F5F9", "#334155"], ["#ECFDF5", "#166534"],
];

function hashString(str){
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
}

function getInitials(name){
  const words = name.replace(/[^\p{L}\p{N}\s]/gu, " ").trim().split(/\s+/).slice(0, 2);
  return words.map(w => w[0]?.toUpperCase() || "").join("") || "?";
}

export default function CompanyAvatar({ name = "", logoUrl, size = 44 }){
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size };
  const src = logoUrl || companyLogo(name);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        className="company-avatar company-avatar-img"
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        style={style}
        onError={() => setFailed(true)}
      />
    );
  }

  const [bg, fg] = TINTS[hashString(name) % TINTS.length];
  return (
    <span className="company-avatar" style={{ ...style, background: bg, color: fg, fontSize: Math.round(size * 0.36) }} aria-hidden="true">
      {getInitials(name)}
    </span>
  );
}
