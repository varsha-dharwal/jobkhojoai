import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// False while pre-rendering and during hydration, true afterwards (and immediately
// on client-side navigations). Lets a page first render exactly what the static HTML
// contains, then apply anything that depends on the URL query or the browser.
export function useHydrated(){
  return useSyncExternalStore(subscribe, () => true, () => false);
}
