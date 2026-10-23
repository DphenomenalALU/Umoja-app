"use client";

import { useEffect, useEffectEvent, useState, type RefObject } from "react";

const SCRUB_QUERY =
  "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

/** Enable the Omentir-style scroll-driven product stage only on large screens. */
export function useScrubEnabled() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(SCRUB_QUERY);
    const sync = () => setEnabled(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return enabled;
}

/** Run the stage update once per frame as the visitor scrolls or resizes. */
export function useScrollScrub(
  track: RefObject<HTMLElement | null>,
  enabled: boolean,
  onFrame: (scrolled: number) => void,
) {
  const frame = useEffectEvent(onFrame);
  useEffect(() => {
    if (!enabled) return;
    let pending: number | null = null;
    const run = () => {
      pending = null;
      const element = track.current;
      if (element) frame(-element.getBoundingClientRect().top);
    };
    const schedule = () => {
      if (pending === null) pending = window.requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (pending !== null) window.cancelAnimationFrame(pending);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [enabled, track]);
}
