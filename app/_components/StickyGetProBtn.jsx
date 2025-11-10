"use client";
import Link from "next/link";
import React from "react";
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default function StickyGetProBtn({ user }) {
  const isPro = user?.is_pro_user || user?.[0]?.is_pro_user;

  if (isPro) return null;

  const handleClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "click_upgrade_sticky_button", {
        event_category: "engagement",
        event_label: "Sticky Pro Button",
        value: 1,
      });
    }
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200]">
      <Link href="/get-pro">
        <button
          onClick={handleClick}
          className="btn btn-neutral btn-sm px-4 py-3 relative overflow-hidden hover:scale-[1.04] transition-all font-semibold tracking-wide flex items-center leading-tight shadow-lg rounded-full border-2 border-yellow-400"
        >
          <style jsx>{`
            @keyframes shine {
              0% {
                background-position: 200% 0;
              }
              50% {
                background-position: 0 0;
              }
              100% {
                background-position: -200% 0;
              }
            }
          `}</style>
          <RiVerifiedBadgeFill size={16} color="#FDBA4D" /> Upgrade to Pro
          &rarr;
        </button>
      </Link>
    </div>
  );
}
