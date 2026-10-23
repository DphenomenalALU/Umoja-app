"use client";

import { useEffect, useRef, type ReactNode } from "react";

function isInViewport(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;
  const height = window.innerHeight || document.documentElement.clientHeight;
  const width = window.innerWidth || document.documentElement.clientWidth;
  return rect.bottom > 0 && rect.top < height && rect.right > 0 && rect.left < width;
}

/** Fail-safe section reveal used by the Omentir landing component system. */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined" || isInViewport(node)) return;

    let done = false;
    let observer: IntersectionObserver | null = null;
    let fallbackTimer = 0;
    let frame = 0;
    node.setAttribute("data-reveal-pending", "");

    const reveal = () => {
      if (done) return;
      done = true;
      node.removeAttribute("data-reveal-pending");
      node.setAttribute("data-revealed", "");
      observer?.disconnect();
      observer = null;
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      if (frame) window.cancelAnimationFrame(frame);
    };

    frame = window.requestAnimationFrame(() => {
      if (isInViewport(node)) reveal();
    });
    observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting || entry.intersectionRatio > 0)) reveal();
    }, { threshold: 0, rootMargin: "120px 0px 120px 0px" });
    observer.observe(node);
    fallbackTimer = window.setTimeout(reveal, 2500);

    return () => {
      done = true;
      observer?.disconnect();
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      if (frame) window.cancelAnimationFrame(frame);
      node.removeAttribute("data-reveal-pending");
    };
  }, []);

  return <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</div>;
}
