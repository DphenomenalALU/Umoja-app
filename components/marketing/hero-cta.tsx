import Link from "next/link";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3">
      <path
        d="M2 6h7M6 3l3 3-3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroCta() {
  return (
    <div className="hero-enter hero-enter-delay-1 mt-6 flex flex-wrap gap-3">
      <Link href="/dashboard" className="site-btn site-btn-primary">
        Open the workspace
      </Link>
      <Link href="#features" className="site-btn site-btn-secondary">
        See what Umoja does
        <ArrowIcon />
      </Link>
    </div>
  );
}
