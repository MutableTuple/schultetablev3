"use client";
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/app/_lib/supabase";
import { formatNumber } from "../_utils/formatNumber";

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

        setCompareData({ tier, badge, headline, sub, topGap: Number(topGap), sampleSize: data.length });
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

  const tierStyles = {
    elite: {
      border: "",
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      bar: "bg-emerald-500",
      fill: 92,
    },
    good: {
      border: "",
      badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      bar: "bg-blue-500",
      fill: 72,
    },
    mid: {
      border: "",
      badge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      bar: "bg-amber-500",
      fill: 45,
    },
    low: {
      border: "",
      badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      bar: "bg-red-500",
      fill: 18,
    },
  };

  const style = compareData ? tierStyles[compareData.tier] : null;

  return (
    <div className="flex flex-col gap-2 w-full text-sm rounded-sm py-4">
   {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-base-200 rounded-xl p-3 border border-base-300">
          <div className="text-[10px] uppercase tracking-widest text-base-content/40 mb-1">Time</div>
          <div className="text-2xl font-black text-primary leading-none">{userData.time_taken}s</div>
          <div className="text-[10px] text-base-content/40 mt-1">to complete board</div>
        </div>

        <div className="bg-base-200 rounded-xl p-3 border border-base-300">
          <div className="text-[10px] uppercase tracking-widest text-base-content/40 mb-1">Accuracy</div>
          <div className="text-2xl font-black text-secondary leading-none">{accuracy}</div>
          <div className="text-[10px] text-base-content/40 mt-1">click precision</div>
        </div>

        <div className="bg-base-200 rounded-xl p-3 border border-base-300">
          <div className="text-[10px] uppercase tracking-widest text-base-content/40 mb-1">Score</div>
          <div className="text-2xl font-black text-accent leading-none">{formatNumber(userData.score)}</div>
          <div className="text-[10px] text-base-content/40 mt-1">this run</div>
        </div>

        <div className="bg-base-200 rounded-xl p-3 border border-base-300">
          <div className="text-[10px] uppercase tracking-widest text-base-content/40 mb-1">Board</div>
          <div className="text-2xl font-black text-info leading-none">
            {userData.grid_size}×{userData.grid_size}
          </div>
          <div className="text-[10px] text-base-content/40 mt-1">{userData.difficulty} · {mode}</div>
        </div>
      </div>
      {/* Verdict Banner */}
      {compareData && (
        <div
          className={`rounded-r-xl rounded-l-none border border-base-300 bg-base-100 p-4 ${style.border}`}
        >
          <span
            className={`inline-block text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full mb-2 ${style.badge}`}
          >
            {compareData.badge}
          </span>
          <div className="text-xl font-black tracking-tight leading-tight mb-1">
            {compareData.headline}
          </div>
          <div className="text-xs text-base-content/60 leading-snug mb-3">
            {compareData.sub}
          </div>

          {/* Gap bar */}
          <div className="w-full bg-base-300 rounded-full h-1.5 overflow-hidden">
            <div
              ref={fillRef}
              className={`h-full rounded-full transition-all duration-1000 ease-out ${style.bar}`}
              style={{ width: `${style.fill}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-base-content/40 mt-1">
            <span>You</span>
            <span>#1 player</span>
          </div>
        </div>
      )}

   

      {/* Loading state for verdict */}
      {!compareData && (
        <div className="rounded-xl border border-base-300 bg-base-200 p-4 animate-pulse">
          <div className="h-3 w-24 bg-base-300 rounded-full mb-2" />
          <div className="h-5 w-48 bg-base-300 rounded-full mb-1" />
          <div className="h-3 w-full bg-base-300 rounded-full" />
        </div>
      )}
    </div>
  );
}