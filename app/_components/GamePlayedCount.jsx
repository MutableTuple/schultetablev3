"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import { formatNumber } from "../_utils/formatNumber";

export default function GamePlayedCount({ userData, user, mode }) {
  return (
    <div className="stats stats-vertical border border-base-300 text-sm lg:text-xs p-2 lg:p-1 gap-2 lg:gap-1 bg-base-100">
      <div className="stat">
        <div className="stat-title">Total time taken</div>
        <div className="stat-value text-primary text-lg lg:text-base">
          {userData.time_taken}s
        </div>
        <div className="stat-desc">
          Total time it took to complete the board.
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Accuracy</div>
        <div className="stat-value text-secondary text-lg lg:text-base">
          {userData.total_wrong_click === 0
            ? "100%"
            : `${(
                (userData.total_right_click /
                  (userData.total_right_click + userData.total_wrong_click)) *
                100
              ).toFixed(1)}%`}
        </div>
        <div className="stat-desc">Your accuracy across the board</div>
      </div>

      <div className="stat">
        <div className="stat-title">Last game score</div>
        <div className="stat-value text-accent text-lg lg:text-base">
          {formatNumber(userData.score)}
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Board data (Game mode: {mode})</div>
        <div className="stat-value text-info text-lg lg:text-base">
          {userData.grid_size} x {userData.grid_size}
        </div>
        <div className="stat-desc">{userData.difficulty}</div>
      </div>
    </div>
  );
}
