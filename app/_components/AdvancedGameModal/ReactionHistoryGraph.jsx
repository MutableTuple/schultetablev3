"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import { FaArrowTrendUp, FaArrowTrendDown, FaMinus } from "react-icons/fa6";
import { FaQuestionCircle } from "react-icons/fa";

export default function ReactionHistoryGraph({ user }) {
  const userId = user?.[0]?.id ?? null;

  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState("past_10");

  // Hover tooltip
  const [hoverX, setHoverX] = useState(null);
  const [hoverValue, setHoverValue] = useState(null);

  // ✅ Fetch data
  useEffect(() => {
    async function load() {
      if (!userId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc("calc_reaction_history", {
        p_user_id: userId,
      });

      if (!error) setHistory(data);

      setLoading(false);
    }

    load();
  }, [userId]);

  // ✅ Build pastTimes based on selected range
  let pastTimes = [];

  if (history) {
    if (range === "past_10") pastTimes = history.past_10_array ?? [];
    if (range === "past_20") pastTimes = history.past_20_array ?? [];
    if (range === "past_50") pastTimes = history.past_50_array ?? [];
    if (range === "all_games") pastTimes = history.all_games_array ?? [];
  }

  if (!Array.isArray(pastTimes) || pastTimes.length === 0) pastTimes = [0];

  const windowLabel =
    range === "past_10"
      ? "last 10 games"
      : range === "past_20"
        ? "last 20 games"
        : range === "past_50"
          ? "last 50 games"
          : "all your games";

  const max = Math.max(...pastTimes, 1);
  const min = Math.min(...pastTimes, 0);

  const points = useMemo(() => {
    return pastTimes.map((v, i) => ({
      x: pastTimes.length > 1 ? (i / (pastTimes.length - 1)) * 100 : 0,
      y: 100 - ((v - min) / (max - min)) * 100,
      value: v,
    }));
  }, [pastTimes, max, min]);

  // ✅ Selected window stats
  const selected = history?.[range] ?? null;

  const trend = selected?.trend ?? null;
  const trendLabel =
    trend === null
      ? "no trend"
      : trend > 0
        ? `+${trend.toFixed(1)}% faster`
        : trend < 0
          ? `${trend.toFixed(1)}% slower`
          : "same";

  const trendColor =
    trend === null
      ? "text-base-content/40"
      : trend > 0
        ? "text-green-500"
        : trend < 0
          ? "text-red-500"
          : "text-gray-400";

  // ✅ ----------------------------------------
  // ✅ EMOTIONAL COACHING MESSAGES (IMPROVED)
  // ✅ ----------------------------------------

  let emotionalMain = "";
  let emotionalStreak = "";
  let emotionalStability = "";

  // ✅ MAIN MESSAGE — based on trend
  if (trend !== null) {
    if (trend > 5) {
      emotionalMain = `🔥 You’re getting significantly faster in your ${windowLabel}. That’s real progress — your brain is adapting.`;
    } else if (trend > 0) {
      emotionalMain = `✅ A small improvement in your ${windowLabel}. Subtle, but it adds up over time.`;
    } else if (trend < -5) {
      emotionalMain = `😔 Your speed dropped in your ${windowLabel}. Happens to everyone — the comeback always starts after a dip.`;
    } else {
      emotionalMain = `🤝 Your performance is steady in your ${windowLabel}. Consistency is underrated.`;
    }
  }

  // ✅ STREAK (last 5 games inside the selected window)
  if (pastTimes.length >= 5) {
    let improvementCount = 0;
    for (let i = pastTimes.length - 5; i < pastTimes.length - 1; i++) {
      if (pastTimes[i + 1] < pastTimes[i]) improvementCount++;
    }

    if (improvementCount >= 4) {
      emotionalStreak = `🔥 You're on a strong improvement streak — ${improvementCount}/4 recent games were faster.`;
    } else if (improvementCount === 0) {
      emotionalStreak = `🧊 Your last few games slowed down, but this is where momentum is rebuilt. You got this.`;
    } else {
      emotionalStreak = `↔️ Mixed streak — some highs, some dips. You're building stability.`;
    }
  }

  // ✅ STABILITY (variance)
  if (pastTimes.length >= 4) {
    const avg = pastTimes.reduce((a, b) => a + b, 0) / pastTimes.length;
    const variance =
      pastTimes.reduce((a, b) => a + (b - avg) ** 2, 0) / pastTimes.length;

    if (variance < 2000) {
      emotionalStability = `✅ Very consistent performance across your ${windowLabel}. Strong discipline.`;
    } else if (variance < 5000) {
      emotionalStability = `⚠️ Some ups and downs in your ${windowLabel}. That's normal — your speed ceiling can grow a LOT from here.`;
    } else {
      emotionalStability = `🚨 Big fluctuations in your ${windowLabel}. Your mind is fast, but scattered — a short break may help reset.`;
    }
  }

  return (
    <div className="w-full bg-base-200 p-3 text-center rounded-xl relative">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-1 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-base-content/70 font-medium">
            Reaction History
          </span>
          <div className="tooltip" data-tip="Track your improvement over time.">
            <FaQuestionCircle className="text-[10px] opacity-70" />
          </div>
        </div>

        {/* TREND */}
        <span className={`flex items-center gap-1 ${trendColor}`}>
          {trend === null ? (
            <span className="text-[10px] text-base-content/40">no trend</span>
          ) : trend > 0 ? (
            <>
              <FaArrowTrendUp /> {trendLabel}
            </>
          ) : trend < 0 ? (
            <>
              <FaArrowTrendDown /> {trendLabel}
            </>
          ) : (
            <>
              <FaMinus /> same
            </>
          )}
        </span>
      </div>

      {/* SELECTOR */}
      <div className="flex justify-center gap-2 mb-3">
        {["past_10", "past_20", "past_50", "all_games"].map((key) => (
          <button
            key={key}
            onClick={() => setRange(key)}
            className={`btn btn-xs ${
              range === key ? "btn-primary" : "btn-ghost"
            }`}
          >
            {key === "past_10" && "10"}
            {key === "past_20" && "20"}
            {key === "past_50" && "50"}
            {key === "all_games" && "All"}
          </button>
        ))}
      </div>

      {/* IF NO LOGIN */}
      {!userId && (
        <p className="text-[11px] opacity-70">
          Log in to unlock reaction history.
        </p>
      )}

      {/* GRAPH */}
      {userId && (
        <>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-24 cursor-crosshair"
            onMouseMove={(e) => {
              const bbox = e.target.getBoundingClientRect();
              const xPct = ((e.clientX - bbox.left) / bbox.width) * 100;

              let nearest = points[0];
              let diff = Math.abs(points[0].x - xPct);

              for (let p of points) {
                const d = Math.abs(p.x - xPct);
                if (d < diff) {
                  diff = d;
                  nearest = p;
                }
              }

              setHoverX(nearest.x);
              setHoverValue(nearest.value);
            }}
            onMouseLeave={() => {
              setHoverX(null);
              setHoverValue(null);
            }}
          >
            <polyline
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            />

            {hoverX !== null && (
              <circle
                cx={hoverX}
                cy={points.find((p) => p.x === hoverX)?.y}
                r="2.5"
                fill="#22c55e"
              />
            )}
          </svg>

          {hoverValue && (
            <div className="absolute left-1/2 -translate-x-1/2 top-14 text-xs bg-base-300 px-2 py-1 rounded shadow-md">
              {hoverValue} ms
            </div>
          )}

          {/* STATS */}
          {selected && (
            <div className="mt-2 text-[11px] text-base-content/70 flex justify-between">
              <span>Avg: {selected?.avg?.toFixed(0)}ms</span>
              <span>Best: {selected?.best?.toFixed(0)}ms</span>
              <span>Worst: {selected?.worst?.toFixed(0)}ms</span>
            </div>
          )}

          <p className="text-[10px] mt-1 opacity-70">
            Showing {selected?.count ?? 0} / {history?.available_games ?? 0}{" "}
            games
          </p>

          {/* ✅ PERSONALIZED COACHING */}
          <div className="mt-3 text-left text-[11px] text-base-content/70 space-y-2">
            {emotionalMain && <p>• {emotionalMain}</p>}
            {emotionalStreak && <p>• {emotionalStreak}</p>}
            {emotionalStability && <p>• {emotionalStability}</p>}
          </div>
        </>
      )}
    </div>
  );
}
