import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductTabs from "@/components/marketing/product-tabs";
import HomeSteps from "@/components/marketing/home-steps";
import MarketingHeader from "@/components/marketing/marketing-header";
import HeroCta from "@/components/marketing/hero-cta";
import BrandMark from "@/components/brand-mark";

export default function Home() {
  return <main className="marketing-page">
    <MarketingHeader />

    <section className="cal-hero">
      <div className="cal-hero-copy"><h1 className="cal-h1">Meet, decide, and act together.</h1><p className="cal-lead">Community meetings and volunteer days deserve a place everyone can find. Bring people together, keep track of who showed up, and make every hour count.</p><div className="cal-hero-cta"><HeroCta /></div></div>
      <ProductTabs />
    </section>

    <HomeSteps />

    <section className="cal-closing wrap" id="for-communities"><BrandMark className="cal-closing-mark" /><div><span className="cal-eyebrow">MADE FOR THE PEOPLE WHO SHOW UP</span><h2>Your community is already doing the work.</h2><p>Umoja helps neighbors find the next gathering and see what they made possible together.</p></div><Link href="/dashboard" className="button button-dark">Open the sample workspace <ArrowRight size={15} /></Link></section>

    <footer className="marketing-footer wrap"><Link href="/" className="brand" aria-label="Umoja home"><BrandMark /><span className="brand-word">umoja</span></Link><span>Meet, decide, and act together.</span><div><Link href="/login">Log in</Link><a href="#how-it-works">How it works</a></div></footer>
  </main>;
}
