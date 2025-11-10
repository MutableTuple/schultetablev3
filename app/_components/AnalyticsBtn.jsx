"use client";
import Link from "next/link";
import React, { useState } from "react";
import { IoMdAnalytics } from "react-icons/io";
import { IoClose } from "react-icons/io5";

export default function AnalyticsBtn() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="fixed top-40 left-4 z-10 ">
      <div
        className={`tooltip tooltip-right ${dismissed ? "tooltip-hidden" : ""}`}
        data-tip="My Game Analytics"
      >
        <div className="relative flex items-center">
          {/* Analytics button */}
          <Link href="/my-profile/analytics" passHref>
            <button className="btn btn-secondary btn-circle btn-sm shadow-md hover:scale-105 transition-all">
              <IoMdAnalytics size={20} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
