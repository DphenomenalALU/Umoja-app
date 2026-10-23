type BrandMarkProps = {
  className?: string;
};

export default function BrandMark({ className = "brand-mark" }: BrandMarkProps) {
  return (
    <span className={className} aria-hidden="true">
      <svg className="brand-symbol" viewBox="0 0 32 32" fill="none" focusable="false">
        <circle cx="16" cy="9.25" r="2.45" fill="currentColor" />
        <circle cx="8.55" cy="13.45" r="1.95" fill="currentColor" />
        <circle cx="23.45" cy="13.45" r="1.95" fill="currentColor" />
        <path d="M10.75 23c.2-3.45 2.25-5.45 5.25-5.45s5.05 2 5.25 5.45" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
        <path d="M4.75 22.8c.2-2.55 1.55-4.2 3.8-4.8m18.7 4.8c-.2-2.55-1.55-4.2-3.8-4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}
