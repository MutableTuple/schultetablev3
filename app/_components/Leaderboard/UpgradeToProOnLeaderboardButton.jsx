import Link from "next/link";
import React from "react";
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default function UpgradeToProOnLeaderboardButton() {
  return (
    <div className="card bg-base-100 border border-warning shadow-md text-center p-4 mx-auto">
      <div className="text-warning-content text-sm sm:text-base font-medium space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:justify-center sm:items-center sm:gap-3 leading-snug">
        {/* Price & Unlock */}
        <div>
          Unlock <span className="font-semibold text-warning">Pro</span> for{" "}
          <span className="font-bold text-warning">
            $4.99{" "}
            <span className="line-through text-muted text-xs">$19.99</span>
          </span>
        </div>

        {/* Benefits */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-1 text-center text-muted">
          <span>✅ No ads</span>
          <span>📊 Detailed stats</span>
          <span>♾ Lifetime access &</span>
          <span className="flex items-center justify-center gap-1">
            Pro checkmark <RiVerifiedBadgeFill className="text-warning" />
          </span>
        </div>

        {/* Get Pro Button */}
        <Link href="/get-pro">
          <button className="btn btn-warning btn-sm sm:btn-md mt-1 sm:mt-0">
            Get Pro Now →
          </button>
        </Link>
      </div>
    </div>
  );
}
