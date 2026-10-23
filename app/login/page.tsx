import Link from "next/link";
import { ArrowRight, CalendarDays, Check, HandHeart, UsersRound } from "lucide-react";
import BrandMark from "@/components/brand-mark";

export const metadata = {
  title: "Log in · Umoja Baraza",
  description: "Return to your Umoja community workspace.",
};

export default function LoginPage() {
  return <main className="login-page">
    <div className="login-side-art"><Link href="/" className="brand" aria-label="Umoja home"><BrandMark /><span className="brand-word">umoja</span></Link><div className="login-art-copy"><span className="eyebrow">MEET, DECIDE, AND ACT TOGETHER</span><h1>Good things grow<br />when we <em>show up.</em></h1><p>Keep the people, plans, and work of your community in one place.</p><div className="login-art-rows"><span><CalendarDays size={16} />Gatherings people can find</span><span><UsersRound size={16} />Neighbors ready to help</span><span><HandHeart size={16} />Hours that don’t go unseen</span></div></div><div className="login-art-note"><span className="login-leaf">✳</span><span>Rooted in community.<br />Built for what comes next.</span></div></div>
    <section className="login-content"><div className="login-mobile-brand"><Link href="/" className="brand" aria-label="Umoja home"><BrandMark /><span className="brand-word">umoja</span></Link></div><div className="login-card"><span className="eyebrow green-eyebrow">WELCOME BACK</span><h2>Come on in.</h2><p>Your community is waiting where you left it.</p><div className="login-preview-note"><span className="login-note-icon"><Check size={16} /></span><div><b>Preview workspace is ready</b><small>Authentication will be connected after the sign-in provider is chosen.</small></div></div><Link href="/dashboard" className="button button-dark login-continue">Open the sample workspace <ArrowRight size={16} /></Link><div className="login-divider"><span /> <small>LOOKING FOR YOUR GROUP?</small> <span /></div><p className="login-help">Ask your community organizer to invite you to their Umoja workspace.</p><Link href="/" className="back-home">Back to Umoja <ArrowRight size={14} /></Link></div><div className="login-footer">© 2026 Umoja Baraza <span>·</span> Made for communities, together.</div></section>
  </main>;
}
