import type { FeatureIconName } from "./squircle-icon";

/** Umoja glyphs rendered inside Omentir's squircle feature-icon component. */
export default function FeatureIcon({ icon }: { icon: FeatureIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      {icon === "calendar" ? (
        <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>
      ) : icon === "people" ? (
        <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.3" /><path d="M3.5 19c.5-3.4 2.3-5 5.5-5s5 1.6 5.5 5M14.5 14.5c3.2-.4 5.2 1 6 4" /></>
      ) : icon === "location" ? (
        <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>
      ) : icon === "check" ? (
        <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16.5 9" /></>
      ) : icon === "heart" ? (
        <><path d="M20.8 8.6c0 5-8.8 10.4-8.8 10.4S3.2 13.6 3.2 8.6a4.8 4.8 0 0 1 8.8-2.5 4.8 4.8 0 0 1 8.8 2.5Z" /><path d="m8 12 2.3 2.3L16 8.7" /></>
      ) : (
        <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>
      )}
    </svg>
  );
}
