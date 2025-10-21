"use client";
import Link from "next/link";
import React, { useState } from "react";
import { IoMdAnalytics } from "react-icons/io";
import { IoClose } from "react-icons/io5";

export default function AnalyticsBtn() {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = (e) => {
    e.stopPropagation(); // prevent link click
    setDismissed(true);
  };

  return (
    <div className="fixed top-20 left-4 z-30">
      <div className="relative group">
        {/* Tooltip */}
        <div
          className={`absolute left-12 top-1/2 -translate-y-1/2 bg-secondary  text-sm px-3 py-1 rounded-lg shadow-md flex items-center gap-2 whitespace-nowrap
            ${dismissed ? "opacity-0 group-hover:opacity-100 transition-opacity" : "opacity-100"}`}
        >
          <span>My game analytics</span>
          {!dismissed && (
            <button
              onClick={handleDismiss}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <IoClose size={16} />
            </button>
          )}
        </div>

        {/* Analytics button */}
        <Link href="/my-profile/analytics" passHref>
          <button className="btn btn-secondary btn-circle btn-sm shadow-md hover:scale-105 transition-all">
            <IoMdAnalytics size={20} />
          </button>
        </Link>
      </div>
    </div>
  );
}
