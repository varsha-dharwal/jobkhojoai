import { useState } from "react";

const COLORS = ["#0057D9", "#00C48C", "#FF7A00", "#7C4DFF", "#FF3B77", "#00B8D9", "#FFAB00", "#36B37E"];

function hashString(str){
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
}

function getInitials(name){
  const words = name.trim().split(/\s+/).slice(0, 2);
  return words.map(w => w[0]?.toUpperCase() || "").join("") || "?";
}

export default function CompanyAvatar({ name, logoUrl, size = 44 }){
  const [failed, setFailed] = useState(false);

  if (logoUrl && !failed) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="company-avatar"
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        style={{ width:size, height:size, objectFit:"contain", background:"#fff" }}
        onError={() => setFailed(true)}
      />
    );
  }

  const color = COLORS[hashString(name || "") % COLORS.length];
  return (
    <div
      className="company-avatar"
      style={{ width:size, height:size, background:color, fontSize:Math.round(size * 0.38) }}
      aria-hidden="true"
    >
      {getInitials(name || "?")}
    </div>
  );
}
