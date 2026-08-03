"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Brain } from "lucide-react";
import { IoClose } from "react-icons/io5";

const STORAGE_KEY = "brain_test_nudge_dismissed_at";
const RESHOW_AFTER_MS = 24 * 60 * 60 * 1000;

export default function FloatingBrainTestNudge() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(STORAGE_KEY);

    if (!dismissedAt) {
      setVisible(true);
      return;
    }

    const elapsed = Date.now() - Number(dismissedAt);

    if (elapsed >= RESHOW_AFTER_MS) {
      localStorage.removeItem(STORAGE_KEY);
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setVisible(false);

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "floating_cta_dismissed", {
        event_category: "engagement",
        event_label: "brain_test_nudge",
      });
    }
  };

  const handleClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "floating_cta_click", {
        event_category: "engagement",
        event_label: "brain_test_nudge",
      });
    }
  };

  if (!visible) return null;

  return (
    <div className="sm:hidden fixed bottom-36 left-0 right-0 z-40 flex justify-center px-4">
      <div className="relative bg-primary text-primary-foreground rounded-full border border-primary-foreground/10 shadow-2xl flex items-center overflow-hidden animate-glow">
        <Link
          href="/official-brain-test"
          onClick={handleClick}
          className="flex items-center gap-2 px-4 py-2"
        >
          <Brain size={18} />

          <span className="text-sm font-medium">Take the Brain Test</span>

          <span className="px-2 py-0.5 text-[10px] rounded-full bg-background/20 font-semibold">
            10 GAMES
          </span>
        </Link>

        <button
          onClick={handleDismiss}
          className="h-full px-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          aria-label="Dismiss"
        >
          <IoClose size={16} />
        </button>
      </div>
    </div>
  );
}
