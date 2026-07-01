"use client";
import { useSyncExternalStore } from "react";

// SSR-safe media-query hook. getServerSnapshot returns false so the server and
// the first client render agree (no hydration mismatch); the real value is read
// after mount. In jsdom (tests) matchMedia is absent, so this returns false and
// components render their desktop branch - which keeps loop clones and other
// mobile-only DOM out of the accessibility tree the tests assert against.
function makeMediaQueryHook(query: string) {
  function subscribe(callback: () => void) {
    if (typeof window === "undefined" || !window.matchMedia) return () => {};
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  }
  function getSnapshot() {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  }
  function getServerSnapshot() {
    return false;
  }
  return () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True at tablet width and below - where grids become card carousels. */
export const useIsMobile = makeMediaQueryHook("(max-width: 1024px)");

/** True at phone width and below - the single-column / wizard range. */
export const useIsPhone = makeMediaQueryHook("(max-width: 640px)");
