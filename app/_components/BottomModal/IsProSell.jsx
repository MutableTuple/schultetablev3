import React from "react";
import Link from "next/link";

export default function IsProSell({
  formattedUsers = "1,200+",
  user,
  onUpgrade,
}) {
  // Early return if user is already PRO
  if (user?.is_pro_user) return null;

  const CTA = ({ children }) => (
    <button
      className="
        btn btn-warning btn-sm
        text-black font-extrabold
        shadow-xl border-0
        hover:scale-105 active:scale-95
        transition-all duration-200
        rounded-xl px-5
        animate-pulse
      "
    >
      {children}
    </button>
  );

  return (
    <div className="relative mb-4 overflow-hidden rounded-2xl border border-yellow-400/30 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 p-[1px] shadow-2xl">
      {/* glow */}
      <div className="absolute inset-0 opacity-30 blur-2xl bg-yellow-300" />

      {/* main card */}
      <div className="relative flex items-center justify-between gap-4 rounded-2xl bg-neutral px-4 py-4 backdrop-blur-xl">
        {/* LEFT */}
        <div className="flex-1">
          {/* urgency */}
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-yellow-400/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-yellow-300">
            🔥 {formattedUsers} training now
          </div>

          {/* headline */}
          <h3 className="text-base font-black leading-tight text-white">
            Unlock Your{" "}
            <span className="text-yellow-300">
              Peak Brain Performance
            </span>
          </h3>

          {/* benefits */}
          <p className="mt-1 text-xs text-gray-300 leading-relaxed">
            Faster reactions • Sharper focus • Brain age insights • Elite stats
          </p>

          {/* trust / pain of missing out */}
          <div className="mt-2 text-[11px] font-semibold text-orange-300">
            Free users see scores. PRO users see why they win.
          </div>
        </div>

        {/* RIGHT CTA */}
        <div className="shrink-0">
          {!user ? (
            <Link href="/get-pro">
              <CTA>🚀 Get PRO</CTA>
            </Link>
          ) : (
            <button onClick={onUpgrade}>
              <CTA>⚡ Unlock Now</CTA>
            </button>
          )}
        </div>
      </div>

      {/* bottom strip */}
      <div className="relative flex items-center justify-center gap-2 bg-black/40 px-3 py-2 text-[11px] font-bold text-white">
        <span>
          🧠 Most serious players upgrade after their first streak
        </span>
      </div>
    </div>
  );
}