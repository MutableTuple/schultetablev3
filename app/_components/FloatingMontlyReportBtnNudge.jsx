"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TbReportAnalytics } from "react-icons/tb";
import { IoClose } from "react-icons/io5";

const STORAGE_KEY = "monthly_report_nudge_dismissed_at";
const RESHOW_AFTER_MS = 24 * 60 * 60 * 1000;

export default function FloatingMonthlyReportBtnNudge() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (!dismissedAt) {
      setVisible(true);
    } else {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed >= RESHOW_AFTER_MS) {
        localStorage.removeItem(STORAGE_KEY);
        setVisible(true);
      }
    }
    // slight delay so the enter animation is visible
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleDismiss = () => {
    setMounted(false);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      setVisible(false);
    }, 300);
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
        value: 1,
      });
    }
  };

  if (!visible) return null;

  return (
    <div className="sm:hidden fixed top-3 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div
        className="relative pointer-events-auto flex items-center gap-1"
        style={{
          animation: mounted
            ? "slideDown 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards, btnFloat 4s ease-in-out 0.35s infinite"
            : "none",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-16px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        {/* Shimmer layer behind pill */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{ animation: "shimmer 3.5s ease-in-out infinite" }}
          />
        </div>

        {/* Main pill */}
        <Link
          href="/monthly-brain-report"
          onClick={handleClick}
          className="btn btn-sm rounded-full gap-2 shadow-md bg-accent border border-base-300 text-base-content hover:bg-base-200 overflow-hidden relative"
        >
          {/* Shimmer sweep inside pill */}
          <span
            className="absolute inset-y-0 w-1/2 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
              animation: "pillShimmer 3.5s ease-in-out infinite",
            }}
          />

          <span
            className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 relative z-10"
            style={{ animation: "dotPulse 2s ease-in-out infinite" }}
          />
          <TbReportAnalytics size={15} className="text-primary relative z-10" />
          <span className="whitespace-nowrap text-xs font-semibold relative z-10">
            Get Monthly Report
          </span>
        </Link>

        {/* Close btn */}
        <button
          onClick={handleDismiss}
          className="btn btn-circle btn-xs bg-accent border border-base-300 text-base-content/40 hover:text-base-content hover:bg-base-200 shadow-sm transition-all duration-200"
          aria-label="Dismiss"
        >
          <IoClose size={12} />
        </button>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
        @keyframes btnFloat {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-3px); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1;   transform: scale(1);   }
          50%       { opacity: 0.3; transform: scale(0.6); }
        }
        @keyframes pillShimmer {
          0%        { left: -60%; opacity: 0;   }
          10%       { opacity: 1;               }
          55%       { left: 130%; opacity: 0;   }
          100%      { left: 130%; opacity: 0;   }
        }
      `}</style>
    </div>
  );
}
