import FeatureIcon from "./feature-icon";

/** The source reference's smooth 56-unit squircle, with Umoja's icon palette. */
const SQUIRCLE = "M28 0C50 0 56 6 56 28S50 56 28 56 0 50 0 28 6 0 28 0Z";

export type FeatureIconName = "calendar" | "people" | "location" | "check" | "heart" | "clock";
export type SquircleTone = "forest" | "clay" | "ochre" | "sage" | "muted";

export default function SquircleIcon({
  icon,
  tone,
  size = 36,
  ring = false,
  className = "",
}: {
  icon: FeatureIconName;
  tone: SquircleTone;
  size?: number;
  ring?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`squircle-icon is-${tone}${ring ? " has-ring" : ""} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox={ring ? "-5 -5 66 66" : "0 0 56 56"} className="squircle-icon-tile">
        <path d={SQUIRCLE} />
      </svg>
      <span className="squircle-icon-glyph">
        <FeatureIcon icon={icon} />
      </span>
    </span>
  );
}
