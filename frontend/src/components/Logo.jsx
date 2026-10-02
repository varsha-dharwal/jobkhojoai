import { useId } from "react";

// The JobKhojo logo (traced from the brand artwork): a blue rounded tile with a white
// "j" — its dot in light blue — joined to a "K", next to the "JobKhojo" wordmark.
// Keep in sync with public/favicon.svg.
export function LogoMark({ size = 36, title }){
  const gradientId = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0B4FD6" />
          <stop offset="1" stopColor="#063A9E" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="19" fill={`url(#${gradientId})`} />
      <circle cx="43.8" cy="21.4" r="7.1" fill="#16A3FF" />
      <path d="M37 31H50.7V60.3A19.85 19.85 0 0 1 11 60.3H24.7A6.15 6.15 0 0 0 37 60.3Z" fill="#FFFFFF" />
      <path d="M71.2 29.6H87.7L64.9 54.25 87.7 78.9H68.5L50.7 59.7V47.9Z" fill="#FFFFFF" />
    </svg>
  );
}

export default function Logo({ size = 36, inverse = false }){
  return (
    <span className={`logo${inverse ? " logo-inverse" : ""}`}>
      <LogoMark size={size} />
      <span className="logo-word"><span className="logo-word-job">Job</span><span className="logo-word-khojo">Khojo</span></span>
    </span>
  );
}
