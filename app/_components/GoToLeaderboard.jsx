"use client";
import Link from "next/link";
import React from "react";
import { MdLeaderboard } from "react-icons/md";

export default function GoToLeaderboard() {
  return (
    <div className="fixed top-64 left-4 z-30">
      <div className="tooltip tooltip-right" data-tip="Leaderboard">
        <Link href="/leaderboard" passHref>
          <button className="btn btn-primary btn-circle btn-sm shadow-md hover:scale-105 transition-all">
            <MdLeaderboard size={20} />
          </button>
        </Link>
      </div>
    </div>
  );
}
