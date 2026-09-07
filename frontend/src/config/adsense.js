// Google AdSense publisher ID — set once the site's ownership verification script (already in index.html) is approved.
export const ADSENSE_CLIENT = "ca-pub-1345881889629105";

// Per-placement ad unit slot IDs. Create a "Display ad" unit in AdSense (Ads > By ad unit)
// for each placement and paste its numeric slot ID here — the placement stays hidden until then.
export const AD_SLOTS = {
  jobDetailSidebar: "",      // desktop (>=1180px): sticky top-right sidebar
  jobDetailMobileBanner: "", // below 1180px: responsive in-content banner
  roadmapDetailSidebar: "",      // desktop (>=1300px): sticky right rail next to the diagram
  roadmapDetailMobileBanner: "", // below 1300px: responsive in-content banner
};
