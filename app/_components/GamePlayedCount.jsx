"use client";
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/app/_lib/supabase";
import { formatNumber } from "../_utils/formatNumber";

function DashedLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="flex-1 border-t border-dashed border-border" />
      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
        {children}
      </span>
      <span className="flex-1 border-t border-dashed border-border" />
    </div>
  );
}

export default function GamePlayedCount({ userData, user, mode }) {
  const [compareData, setCompareData] = useState(null);
  const fillRef = useRef(null);

  useEffect(() => {
    async function getComparisonStats() {
      try {
        const { data } = await supabase
          .from("UniversalGameStats")
          .select("time_taken")
          .eq("grid_size", userData.grid_size)
          .eq("difficulty", userData.difficulty)
          .eq("game_mode", mode)
          .gt("time_taken", 0)
          .order("time_taken", { ascending: true })
          .limit(100);

        if (!data || !data.length || !userData?.time_taken) return;

        const yourTime = Number(userData.time_taken);
        const topTime = Number(data[0].time_taken);
        const avgTime =
          data.reduce((sum, item) => sum + Number(item.time_taken), 0) /
          data.length;
        const topGap = (((yourTime - topTime) / topTime) * 100).toFixed(1);
        const avgGap = (((yourTime - avgTime) / avgTime) * 100).toFixed(1);

        let tier, badge, headline, sub;

        if (Number(topGap) <= 0) {
          tier = "elite";
          badge = "TOP PLAYER";
          headline = "You own this board.";
          sub = `Faster than every player in the top ${data.length}. Someone is studying your run right now.`;
        } else if (Number(topGap) <= 5) {
          tier = "elite";
          badge = "SO CLOSE";
          headline = `${topGap}% from immortality.`;
          sub = `One cleaner run. One less mistake. The #1 spot is sitting there waiting for you to take it.`;
        } else if (Number(topGap) <= 15) {
          tier = "good";
          badge = "CLOSING IN";
          headline = `${topGap}% behind the leader.`;
          sub =
            Number(avgGap) < 0
              ? `You're beating ${Math.round(((avgTime - yourTime) / avgTime) * 100)}% of players — but the top is still ${topGap}% faster. You know you can close that gap.`
              : `That's one focused run away from the top. You're not even playing your best yet.`;
        } else if (Number(topGap) <= 30) {
          tier = "mid";
          badge = "MID TIER";
          headline = `The top is ${topGap}% faster than you.`;
          sub =
            Number(avgGap) < 0
              ? `You're above average — but average isn't why you're here. The gap is real. So is your potential.`
              : `You're slower than average and ${topGap}% behind the leader. This score doesn't represent you.`;
        } else {
          tier = "low";
          badge = "WAKE UP CALL";
          headline = `Elite players are ${topGap}% faster.`;
          sub = `That's not a gap — that's a canyon. But every top player started exactly where you are. The only question is whether you're done or just getting started.`;
        }

        setCompareData({
          tier,
          badge,
          headline,
          sub,
          topGap: Number(topGap),
          sampleSize: data.length,
        });
      } catch (error) {
        // console.log(error);
      }
    }

    getComparisonStats();
  }, [userData, mode]);

  const accuracy =
    userData.total_wrong_click === 0
      ? "100%"
      : `${(
          (userData.total_right_click /
            (userData.total_right_click + userData.total_wrong_click)) *
          100
        ).toFixed(1)}%`;

  const tierBadgeStyles = {
    elite:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    good: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    mid: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    low: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  const tierBarStyles = {
    elite: "bg-emerald-500",
    good: "bg-blue-500",
    mid: "bg-amber-500",
    low: "bg-red-500",
  };
  const tierFill = { elite: 92, good: 72, mid: 45, low: 18 };

  const stats = [
    { value: `${userData.time_taken}s`, label: "Time taken" },
    { value: `${userData.grid_size}×${userData.grid_size}`, label: "Grid" },
    { value: accuracy, label: "Accuracy" },
    { value: formatNumber(userData.score), label: "Score" },
  ];

  return (
    <div className="w-full text-sm">
      <DashedLabel>Past Game</DashedLabel>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-2 text-center">
        {stats.map(({ value, label }) => (
          <div key={label}>
            <div className="text-lg sm:text-xl font-black text-foreground leading-none">
              {value}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Verdict banner */}
      {compareData && (
        <div className="border-t border-border mt-4 pt-4">
          <span
            className={`inline-block text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-none mb-2 ${tierBadgeStyles[compareData.tier]}`}
          >
            {compareData.badge}
          </span>
          <div className="text-lg sm:text-xl font-black tracking-tight leading-tight mb-1">
            {compareData.headline}
          </div>
          <div className="text-xs text-muted-foreground leading-snug mb-3">
            {compareData.sub}
          </div>

          <div className="w-full bg-muted h-1.5 overflow-hidden">
            <div
              ref={fillRef}
              className={`h-full rounded-none transition-all duration-1000 ease-out ${tierBarStyles[compareData.tier]}`}
              style={{ width: `${tierFill[compareData.tier]}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>You</span>
            <span>#1 player</span>
          </div>
        </div>
      )}

      {!compareData && (
        <div className="border-t border-border mt-4 pt-4 animate-pulse">
          <div className="h-3 w-24 bg-muted mb-2" />
          <div className="h-5 w-48 bg-muted mb-1" />
          <div className="h-3 w-full bg-muted" />
        </div>
      )}
    </div>
  );
}
