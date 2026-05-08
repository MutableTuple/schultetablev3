import Link from "next/link";
import React from "react";
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default function UpgradeToProOnLeaderboardButton() {
  return (
    <div className="rounded-2xl border border-yellow-400/40 bg-gradient-to-br from-yellow-400/10 via-base-100 to-base-100 p-5 space-y-4">

      {/* Top row: badge + headline */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center text-xl">
          ⚡
        </div>
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-base text-base-content">Upgrade to Pro</span>
            <RiVerifiedBadgeFill className="text-yellow-400 text-base" />
            <span className="badge badge-sm bg-yellow-400/20 text-yellow-600 border-none font-semibold">
              75% off
            </span>
          </div>
          <p className="text-sm text-base-content/50 mt-0.5 leading-snug">
            One-time payment. Lifetime access. No subscriptions.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: "🚫", label: "No ads, ever" },
          { icon: "📊", label: "Detailed stats" },
          { icon: "✅", label: "Pro checkmark" },
          { icon: "♾️", label: "Lifetime access" },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 bg-base-200 rounded-xl px-3 py-2 text-sm font-medium text-base-content/70"
          >
            <span className="text-base leading-none">{icon}</span>
            {label}
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link href="/get-pro" className="block">
        <button className="btn btn-warning w-full rounded-xl font-bold text-warning-content gap-2">
          Get Pro — only $4.99
          <span className="line-through text-warning-content/50 font-normal text-xs">$19.99</span>
        </button>
      </Link>

    </div>
  );
}