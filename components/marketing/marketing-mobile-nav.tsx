"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";

function MobileMenuSheet({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("marketing-menu-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove("marketing-menu-open");
    };
  }, [onClose]);

  return createPortal(
    <div className="marketing-mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="marketing-mobile-menu-head">
        <button type="button" aria-label="Close menu" onClick={onClose}><X size={22} /></button>
      </div>
      <div className="marketing-mobile-menu-body">
        <nav aria-label="Mobile navigation">
          <a href="#features" onClick={onClose}>Features</a>
          <a href="#how-it-works" onClick={onClose}>How it works</a>
          <a href="#for-communities" onClick={onClose}>For communities</a>
        </nav>
        <div className="marketing-mobile-menu-actions">
          <Link href="/login" onClick={onClose} className="button button-light">Log in</Link>
          <Link href="/dashboard" onClick={onClose} className="button button-dark">Open the app</Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function MarketingMobileMenuButton() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="marketing-mobile-menu-trigger">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <Menu size={21} />
      </button>
      {open && <MobileMenuSheet onClose={close} />}
    </div>
  );
}
