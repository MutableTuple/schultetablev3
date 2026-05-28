"use client";

import Link from "next/link";
import React from "react";

import { IoMdAnalytics } from "react-icons/io";

export default function AnalyticsBtn() {
  return (
    <Link
      href="/my-profile/analytics"
      className="
        group
        flex
        items-center
        gap-3
        border
        border-base-300
        bg-base-100
        px-4
        py-3
        transition-all
        duration-200
        hover:border-primary
        active:scale-[0.98]
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          border
          border-base-300
          bg-base-200
          text-primary
          transition-all
          duration-200
          group-hover:border-primary
        "
      >
        <IoMdAnalytics size={22} />
      </div>

      <div>
        <p className="text-sm font-bold text-base-content">Analytics</p>

        <p className="text-xs text-base-content/60">
          View performance insights
        </p>
      </div>
    </Link>
  );
}
