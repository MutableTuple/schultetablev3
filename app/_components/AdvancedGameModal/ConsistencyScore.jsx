"use client";

import React, { useMemo, useState, useEffect } from "react";
import { supabase } from "@/app/_lib/supabase";
import { FaMinus, FaQuestionCircle, FaExternalLinkAlt } from "react-icons/fa";

import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { ComposedChart } from "recharts";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

import DetailedExpandedConsistencyModal from "./DetailedExpandedConsistencyModal";

export default function ConsistencyScore({ game, user }) {
  const [intel, setIntel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false); // ✅ DaisyUI modal state

  // Filters
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [gridSizeFilter, setGridSizeFilter] = useState("");
  const [gameModeFilter, setGameModeFilter] = useState("");

  // Reaction → spikes
  const values = game?.clicks?.map((c) => c.timeTakenMs) || [];
  const diffs = values.map((v, i) =>
    i === 0 ? 0 : Math.abs(v - values[i - 1])
  );
  const points = useMemo(() => diffs.map((v) => ({ value: v })), [diffs]);

  // Click table for extra analytics in modal
  const clickTable =
    game?.clicks?.map((c, i) => ({
      num: c.number,
      t: c.timeTakenMs,
      spike:
        i === 0 ? 0 : Math.abs(c.timeTakenMs - game.clicks[i - 1].timeTakenMs),
    })) || [];

  // Fetch RPC
  useEffect(() => {
    async function fetchIntel() {
      if (!user?.[0]?.id) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.rpc("calc_consistency_intel", {
        game,
        user_id: user[0].id,
        difficulty_filter: difficultyFilter || null,
        grid_size_filter: gridSizeFilter ? Number(gridSizeFilter) : null,
        game_mode_filter: gameModeFilter || null,
      });
      setIntel(data);
      setLoading(false);
    }

    fetchIntel();
  }, [user, game, difficultyFilter, gridSizeFilter, gameModeFilter]);

  // RPC Values
  const percentile = intel?.percentile;
  const peakSpike = intel?.peak_spike;
  const tier = intel?.tier;
  const trendData = intel?.trend_data || [];

  const trend =
    intel?.trend_last_game != null && !isNaN(intel?.trend_last_game)
      ? Number(intel.trend_last_game).toFixed(1)
      : null;

  const trendPoints = trendData.map((v) => ({ value: v }));

  // Tier colors
  const tierColor =
    tier === "Zen Mode"
      ? "#10b981"
      : tier === "Iron Focus"
        ? "#3b82f6"
        : tier === "Balanced Mind"
          ? "#f59e0b"
          : "#ef4444";

  // Motivation text
  let motivation = "";
  if (percentile >= 80) motivation = "Elite-level focus — pro-level control.";
  else if (percentile >= 60) motivation = "Strong control with fast recovery.";
  else if (percentile >= 40) motivation = "Decent, but you can level up more.";
  else if (percentile >= 20) motivation = "Frequent dips — practice helps.";
  else if (percentile !== null)
    motivation = "Large fluctuations — improve consistency.";
  // ✅ GRAPH COLOR BASED ON TREND
  let graphColor = "#fbbf24"; // default = yellow (neutral)

  if (trend > 0) graphColor = "#22c55e"; // green-500 (positive)
  if (trend < 0) graphColor = "#ef4444"; // red-500 (negative)
  return (
    <>
      {/* ✅ MAIN SMALL CARD */}
      <div className="w-full h-full  text-center rounded-2xl bg-base-200/60 backdrop-blur-sm ">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <span className="text-base font-semibold text-base-content/90">
              Consistency
            </span>
            <FaQuestionCircle className="text-xs opacity-70" />
          </div>

          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-primary opacity-70 hover:opacity-100 flex items-center gap-1"
          >
            Details <FaExternalLinkAlt size={10} />
          </button>
        </div>

        {/* Trend */}
        {/* ✅ TREND INDICATOR WITH BADGE + COLOR LOGIC */}
        {!user || loading ? (
          <span className="badge badge-sm bg-base-300 text-base-content/60">
            ---
          </span>
        ) : trend === null ? (
          <span className="badge badge-sm bg-base-300 text-base-content/60">
            First game
          </span>
        ) : trend > 0 ? (
          <span className="badge badge-sm badge-soft badge-success text-success flex items-center gap-1 font-medium">
            <FaArrowTrendUp /> +{trend}%
          </span>
        ) : trend < 0 ? (
          <span className="badge badge-sm bg-red-500 text-white flex items-center gap-1">
            <FaArrowTrendDown /> {trend}%
          </span>
        ) : (
          <span className="badge badge-sm bg-yellow-500 text-black flex items-center gap-1">
            <FaMinus /> same
          </span>
        )}

        {/* Mini Graph */}
        <div className="w-full h-24 my-2 rounded-xl overflow-hidden ">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={game?.clicks?.map((c, i) => ({
                spike: diffs[i],
                rt: c.timeTakenMs,
              }))}
            >
              <defs>
                {/* ✅ Gradient uses trend-based color */}
                <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={graphColor} stopOpacity={0.65} />
                  <stop offset="100%" stopColor={graphColor} stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* ✅ Always white tooltip with black text */}
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  fontSize: "12px",
                  color: "black",
                }}
                labelStyle={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6b7280", // grey-500
                  marginBottom: "4px",
                }}
                itemStyle={{
                  padding: 0,
                  margin: 0,
                  fontSize: "12px",
                  color: "#111827", // grey-900
                  fontWeight: 600,
                }}
                formatter={(v, name) =>
                  name === "rt"
                    ? [`${v} ms`, "Reaction Time"]
                    : [`+${v}`, "Spike"]
                }
              />

              {/* ✅ BAR GRAPH (reaction time) */}
              <Bar
                dataKey="rt"
                fill={graphColor}
                opacity={0.25}
                radius={[6, 6, 0, 0]}
              />

              {/* ✅ AREA GRAPH (spikes) */}
              <Area
                type="monotone"
                dataKey="spike"
                stroke={graphColor}
                strokeWidth={2.4}
                fill="url(#mainGradient)"
                dot={false}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        {/* ✅ LAST GAME VS THIS GAME SCORE */}
        {intel?.single_game_score != null && intel?.last_game_score != null && (
          <div className="mt-2 flex justify-center">
            <div className="flex items-center gap-2">
              {/* ✅ Last game */}
              <span className="badge badge-sm bg-base-300 text-base-content/70">
                Last: {intel.last_game_score}
              </span>

              {/* ✅ Current score */}
              <span className="badge badge-sm bg-primary/10 text-primary font-semibold">
                Now: {intel.single_game_score}
              </span>
            </div>
          </div>
        )}

        {percentile != null && (
          <p className="text-lg text-base-content mt-2">
            You&apos;re more consistent than{" "}
            <span
              className={
                "badge badge-sm font-medium tracking-wide " +
                (percentile > 50
                  ? "badge-success badge-soft text-success"
                  : percentile > 25
                    ? "badge-secondary badge-soft text-secondary font-semibold"
                    : "badge-error badge-soft text-error")
              }
            >
              {percentile.toFixed(2)}%
            </span>{" "}
            of players — keep this streak going.
          </p>
        )}

        <p className="text-sm text-base-content/60 mt-1">
          Consistency improves stability & endurance.
        </p>
      </div>

      {/* ✅ DAISYUI MODAL EXPANDED ANALYTICS */}
      <DetailedExpandedConsistencyModal
        expanded={expanded}
        setExpanded={setExpanded}
        clickTable={clickTable}
        tier={tier}
        tierColor={tierColor}
        percentile={percentile}
        motivation={motivation}
        points={points}
        peakSpike={peakSpike}
        trendPoints={trendPoints}
        graphColor={graphColor}
        user={user}
      />
    </>
  );
}
