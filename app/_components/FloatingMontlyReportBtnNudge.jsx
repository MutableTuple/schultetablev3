"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TbReportAnalytics } from "react-icons/tb";
import { IoClose } from "react-icons/io5";

const STORAGE_KEY = "monthly_report_nudge_dismissed_at";
const RESHOW_AFTER_MS = 24 * 60 * 60 * 1000;

export default function FloatingMonthlyReportBtnNudge() {
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
        event_label: "monthly_brain_report_nudge",
      });
    }
  };

  const handleClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "floating_cta_click", {
        event_category: "engagement",
        event_label: "monthly_brain_report_nudge",
      });
    }
  };

  if (!visible) return null;

  return (
    <div className="sm:hidden fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="bg-black text-white rounded-full border border-white/10 shadow-2xl flex items-center overflow-hidden">
        <Link
          href="/monthly-brain-report"
          onClick={handleClick}
          className="flex items-center gap-2 px-4 py-2"
        >
          <TbReportAnalytics size={18} />

          <span className="text-sm font-medium">
            Get Your Monthly Brain Report
          </span>

          <span className="px-2 py-0.5 text-[10px] rounded-full bg-white text-black font-semibold">
            NEW
          </span>
        </Link>

        <button
          onClick={handleDismiss}
          className="h-full px-3 text-white/60 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <IoClose size={16} />
        </button>
      </div>
    </div>
  );
}
