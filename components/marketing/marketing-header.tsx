import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BrandMark from "@/components/brand-mark";
import MarketingHeaderFrame from "./marketing-header-frame";
import { MarketingMobileMenuButton } from "./marketing-mobile-nav";

export default function MarketingHeader() {
  return (
    <div className="cal-site cal-header">
      <MarketingHeaderFrame transparentAtTop>
        <header className="marketing-header wrap">
          <Link href="/" className="brand" aria-label="Umoja home">
            <BrandMark />
            <span className="brand-word">umoja</span>
          </Link>

          <nav className="marketing-nav hidden min-w-0 flex-1 items-center justify-center gap-1 text-sm font-normal md:flex lg:absolute lg:left-1/2 lg:flex-none lg:-translate-x-1/2" aria-label="Main navigation">
            <a className="site-nav-link" href="#features">Features</a>
            <a className="site-nav-link" href="#how-it-works">How it works</a>
            <a className="site-nav-link" href="#for-communities">For communities</a>
          </nav>

          <div className="header-actions ml-auto flex min-w-0 shrink-0 items-center gap-1 md:gap-2">
            <div className="marketing-desktop-actions hidden items-center gap-2 md:flex">
              <Link href="/login" className="site-btn site-btn-sm site-btn-outline">Log in</Link>
              <Link href="/dashboard" className="site-btn site-btn-sm site-btn-primary">
                Open the app <ArrowRight size={15} />
              </Link>
            </div>
            <MarketingMobileMenuButton />
          </div>
        </header>
      </MarketingHeaderFrame>
    </div>
  );
}
