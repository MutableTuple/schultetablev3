"use client";

import Link from "next/link";
import React from "react";

import { MdLeaderboard } from "react-icons/md";

export default function GoToLeaderboard() {
  return (
    <Link
      href="/leaderboard"
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
        <MdLeaderboard size={22} />
      </div>

      <div>
        <p className="text-sm font-bold text-base-content">Leaderboard</p>

        <p className="text-xs text-base-content/60">Top players & rankings</p>
      </div>
    </Link>
  );
}
