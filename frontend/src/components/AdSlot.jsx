import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT } from "../config/adsense";

// Renders one AdSense display unit. Returns null (renders nothing) if no slot id is
// configured yet, so a placement stays invisible until its ad unit is actually created.
export default function AdSlot({ slot, style }) {
  const insRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense script blocked or not yet loaded */
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <ins
      ref={insRef}
      className="adsbygoogle"
      style={{ display: "block", ...style }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
