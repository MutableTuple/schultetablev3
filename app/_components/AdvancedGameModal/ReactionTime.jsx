"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import { FaArrowTrendUp, FaArrowTrendDown, FaMinus } from "react-icons/fa6";
import { FaQuestionCircle } from "react-icons/fa";

// ✅ Recharts
import { ComposedChart } from "recharts";
import { Area, ResponsiveContainer, Tooltip } from "recharts";
import { Bar, XAxis, YAxis } from "recharts";
import { BsTriangleFill } from "react-icons/bs";
import ReactionTimeCompare from "./ReactionTimeCompare";
import ReactionTimeSlidersPreview from "./ReactionTimeSlidersPreview";

export default function ReactionTime({ game, user, mode }) {
  const [intel, setIntel] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = user?.[0]?.id;
  // ✅ SPARKLINE VALUES
  const clicks = game?.clicks || game?.game_summary?.clicks || [];
  const values = clicks.map((c) => c.timeTakenMs);
  const avg =
    game.avgReactionTimeMs ?? game.game_summary?.avgReactionTimeMs ?? 0;

  // ✅ FORMAT FOR RECHARTS
  const chartData = values.map((v, i) => ({
    x: i + 1,
    value: v,
  }));

  // ✅ GAME OBJECT SENT TO RPC (memoized)
  const cleanGame = useMemo(
    () => ({
      avgReactionTimeMs:
        game.avgReactionTimeMs ?? game.game_summary?.avgReactionTimeMs,

      fastestMs: game.fastestMs ?? game.game_summary?.fastestMs,
      slowestMs: game.slowestMs ?? game.game_summary?.slowestMs,

      gridSize: Number(game.gridSize ?? game.grid_size),

      difficulty: (
        game.difficulty ??
        game.game_summary?.difficulty ??
        game.difficulty_level ??
        ""
      )
        ?.toString()
        .toLowerCase(),

      gameMode: (
        game.gameMode ??
        game.game_summary?.gameMode ??
        game.game_mode ??
        mode ??
        ""
      )
        ?.toString()
        .toLowerCase(),

      clicks: (game.clicks || game.game_summary?.clicks || []).map((c) => ({
        timeTakenMs: c.timeTakenMs,
        correct: c.correct ?? null,
      })),
    }),
    [game]
  );


  // ✅ SINGLE RPC (clean, stable, no duplicates)
  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!userId || !cleanGame.avgReactionTimeMs) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc("calc_reaction_intel", {
        game: cleanGame,
        p_user_id: userId,
      });

      if (!mounted) return;
      if (!error && data) setIntel(data);

      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [userId, cleanGame]);

  // ✅ Extract RPC values
  const globalP = intel?.global_percentile ?? null;
  const trend = intel?.trend ?? null;
  const tier = intel?.tier ?? null;
  const msg = intel?.message ?? null;
  const earlyDesc = intel?.early_desc ?? null;
  const fatigueDesc = intel?.fatigue_desc ?? null;

  const idealFast = intel?.ideal_fast ?? null;
  const idealGood = intel?.ideal_good ?? null;
  const idealAvg = intel?.ideal_avg ?? null;
  const avgDuration = intel?.avg_duration ?? null;

  // ✅ Trend label
  const trendLabel =
    trend === null
      ? "First game"
      : trend > 0
        ? `+${trend.toFixed(1)}% faster`
        : trend < 0
          ? `${trend.toFixed(1)}% slower`
          : "same";

  const trendColor =
    trend == null
      ? "text-base-content/50"
      : trend > 0
        ? "text-green-500"
        : trend < 0
          ? "text-red-500"
          : "text-gray-500";

  const fasterThanAvg = idealAvg && avg < idealAvg;
  // ✅ Emotional message based on percentile
  let emotionMsg = "";

  if (globalP !== null) {
    if (globalP >= 90) {
      emotionMsg = "Lightning fast — elite reactions!";
    } else if (globalP >= 75) {
      emotionMsg = "You're extremely quick — amazing performance!";
    } else if (globalP >= 60) {
      emotionMsg = "Above average — your brain reacts fast.";
    } else if (globalP >= 40) {
      emotionMsg = "You're building solid reflexes — keep going.";
    } else if (globalP >= 20) {
      emotionMsg = "You're improving with every game — keep training.";
    } else {
      emotionMsg = "Everyone starts somewhere — this is how progress begins.";
    }
  }

  return (
    <div className="w-full bg-base-200 p-3 text-center rounded-xl relative">
      {/* HEADER */}
      <div className="flex  text-xs mb-1 gap-1 justify-between items-center">
        <div className="flex items-center gap-1">
          <span className="text-base font-semibold text-base-content/90">
            Reaction Time
          </span>
          <div className="tooltip" data-tip="How quickly your brain reacts.">
            <FaQuestionCircle className="text-[10px] opacity-70" />
          </div>
        </div>

        {/* ✅ TREND BADGE WITH SKELETON */}
        <span className="flex items-center gap-1 ">
          {loading ? (
            <div className="h-3 w-fit px-1 bg-base-300 rounded animate-pulse"></div>
          ) : trend === null ? (
            <span className="badge font-semibold bg-base-300 text-base-content/70 text-xs px-2 py-1">
              First game
            </span>
          ) : trend > 0 ? (
            <span className="badge font-semibold badge-success text-xs px-2 py-1 flex items-center gap-1">
              <FaArrowTrendUp className="text-[10px]" />
              {trendLabel}
            </span>
          ) : trend < 0 ? (
            <span className="badge font-semibold badge-error text-xs px-2 py-1 flex items-center gap-1">
              <FaArrowTrendDown className="text-[10px]" />
              {trendLabel}
            </span>
          ) : (
            <span className="badge font-semibold badge-warning text-xs px-2 py-1 flex items-center gap-1">
              <FaMinus className="text-[10px]" />
              same
            </span>
          )}
        </span>
      </div>

      {/* ✅ RECHARTS GRAPH */}
      <div className="w-full h-24 my-2 rounded-xl overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData.map((d, i) => ({
              rt: d.value,
              spike: i === 0 ? 0 : Math.abs(d.value - chartData[i - 1].value),
            }))}
          >
            <defs>
              <linearGradient id="rtGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={
                    trend > 0 ? "#22c55e" : trend < 0 ? "#ef4444" : "#fbbf24"
                  }
                  stopOpacity={0.65}
                />
                <stop
                  offset="100%"
                  stopColor={
                    trend > 0 ? "#22c55e" : trend < 0 ? "#ef4444" : "#fbbf24"
                  }
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <Tooltip
              cursor={{ opacity: 0.18 }}
              contentStyle={{
                background:
                  trend > 0
                    ? "linear-gradient(135deg, #0b2f1c 0%, #081d12 100%)" // green
                    : trend < 0
                      ? "linear-gradient(135deg, #3a0d0d 0%, #220606 100%)" // red
                      : "linear-gradient(135deg, #3a330c 0%, #241f08 100%)", // yellow

                border:
                  trend > 0
                    ? "1px solid rgba(34,197,94,0.35)"
                    : trend < 0
                      ? "1px solid rgba(239,68,68,0.35)"
                      : "1px solid rgba(251,191,36,0.35)",

                borderRadius: "10px",
                padding: "6px 10px",
                boxShadow:
                  trend > 0
                    ? "0 3px 12px rgba(34,197,94,0.25)"
                    : trend < 0
                      ? "0 3px 12px rgba(239,68,68,0.25)"
                      : "0 3px 12px rgba(251,191,36,0.25)",
                backdropFilter: "blur(4px)",
                fontSize: "11px",
                color: "#f3f4f6",
                textAlign: "left", // ✅ LEFT ALIGN TEXT
                maxWidth: "180px", // ✅ better for mobile
              }}
              labelStyle={{
                fontSize: "10px",
                fontWeight: 700,
                marginBottom: "4px",
                textAlign: "left", // ✅ LEFT ALIGN
                color:
                  trend > 0
                    ? "rgba(34,197,94,0.7)"
                    : trend < 0
                      ? "rgba(239,68,68,0.7)"
                      : "rgba(251,191,36,0.7)",
                letterSpacing: "0.3px",
              }}
              itemStyle={{
                padding: 0,
                margin: "0",
                fontSize: "11px",
                fontWeight: 500,
                color: "#f9fafb",
                textAlign: "left", // ✅ LEFT ALIGN
              }}
              formatter={(v, name) =>
                name === "rt"
                  ? [
                      `${v} ms`,
                      trend > 0
                        ? "Reaction Time (better)"
                        : trend < 0
                          ? "Reaction Time (slower)"
                          : "Reaction Time",
                    ]
                  : [
                      `+${v}`,
                      trend > 0
                        ? "Spike (more stable)"
                        : trend < 0
                          ? "Spike (less stable)"
                          : "Spike",
                    ]
              }
            />

            {/* ✅ Bars */}
            <Bar
              dataKey="rt"
              fill={trend > 0 ? "#22c55e" : trend < 0 ? "#ef4444" : "#fbbf24"}
              opacity={0.25}
              radius={[6, 6, 0, 0]}
            />

            {/* ✅ Area */}
            <Area
              type="monotone"
              dataKey="spike"
              stroke={trend > 0 ? "#22c55e" : trend < 0 ? "#ef4444" : "#fbbf24"}
              strokeWidth={2.4}
              fill="url(#rtGradient)"
              dot={false}
              isAnimationActive={false}
            />

            <XAxis hide />
            <YAxis hide />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* BASIC STATS */}
      <div className="mt-1 text-[11px] text-base-content/70 flex justify-between">
        <span>Your Avg: {avg}ms</span>
        <span>Fastest: {game.fastestMs}ms</span>
        <span>Slowest: {game.slowestMs}ms</span>
      </div>

      {/* PERCENTILE */}
      {globalP !== null && (
        <div className="mt-2 flex flex-col items-center text-center">
          {/* ✅ Emotional message */}
          <p className="text-[11px] sm:text-sm text-base-content/70 font-medium">
            {emotionMsg}
          </p>

          {/* ✅ Stat line */}
          <p className="sm:text-lg text-xs text-base-content flex flex-nowrap whitespace-nowrap gap-1.5 justify-center items-center mt-1">
            Faster than{" "}
            <b>
              <span
                className={`badge font-semibold tracking-wide badge-soft flex items-center gap-1 ${
                  globalP >= 60
                    ? "badge-success"
                    : globalP <= 40
                      ? "badge-error"
                      : "badge-warning"
                }`}
              >
                <BsTriangleFill className="text-[10px]" />
                {globalP}%
              </span>
            </b>{" "}
            of players
          </p>
        </div>
      )}

      {/* COMPARISON COMPONENT */}
      {userId ? (
        <ReactionTimeCompare
          userId={userId}
          gridSize={cleanGame.gridSize}
          difficulty={cleanGame.difficulty}
          gameMode={cleanGame.gameMode}
          currentGame={cleanGame}
        />
      ) : (
        <ReactionTimeSlidersPreview />
      )}
      {/* TIER */}
      {tier && (
        <p className="mt-2 text-[11px] text-green-400 font-medium">
          Tier: <b>{tier}</b>
        </p>
      )}

      {/* COACHING */}
      {msg && (
        <p className="mt-1 text-[10px] text-base-content/60 italic">{msg}</p>
      )}
    </div>
  );
}
