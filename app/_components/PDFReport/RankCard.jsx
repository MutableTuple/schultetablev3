"use client";

import React from "react";

import {
  FiArrowUpRight,
  FiAward,
  FiBarChart2,
  FiGlobe,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";

import { ResponsiveContainer, AreaChart, Area } from "recharts";

// ============================================
// MAIN
// ============================================

export default function RankCard({ user, analytics }) {
  const { rawStats, rankings, brainMetrics, trends, speedMetrics, gameData } =
    analytics || {};

  // ── Values ──────────────────────────────────────────────────────────────
  const globalRank = rankings?.globalRank ?? null;
  const percentile = rankings?.percentile ?? null;
  const totalGames = rawStats?.totalGames ?? 0;
  const consistency = brainMetrics?.consistency ?? 0;
  const speedTier = speedMetrics?.speedTier ?? "—";
  const reactionTrend = trends?.reactionTrend ?? null;
  const scoreTrend = trends?.scoreTrend ?? null;
  const mentalProfile = analytics?.mentalProfile ?? "—";
  const country = user?.user?.country ?? gameData?.[0]?.country ?? "—";

  // betterThan: if we have percentile use it, else leave null
  const betterThan = percentile != null ? Math.round(percentile) : null;

  // Rank improvement: we don't have historical rank snapshots so we derive
  // a proxy from scoreTrend — if score improved X% we estimate rank moved similarly
  const rankImprovement =
    scoreTrend != null && scoreTrend > 0
      ? Math.round((scoreTrend / 100) * (globalRank ?? 1000))
      : null;

  // Rank trend chart: build from last 8 games' scores reversed (proxy for rank movement)
  // Lower score = worse rank, higher score = better rank, so we invert for rank display
  const rankTrend = (() => {
    if (!gameData?.length) return Array(8).fill({ value: 500 });
    const slice = [...gameData]
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .slice(-8);
    const maxScore = Math.max(...slice.map((g) => g.score || 0), 1);
    return slice.map((g) => ({
      value: Math.round(1000 - ((g.score || 0) / maxScore) * 800),
    }));
  })();

  // Consistency label
  const consistencyLabel =
    consistency >= 90
      ? "Elite"
      : consistency >= 75
        ? "High"
        : consistency >= 60
          ? "Moderate"
          : "Developing";

  // Dynamic insight text
  const insightText =
    reactionTrend != null && reactionTrend > 0
      ? `Your reaction speed improved ${reactionTrend}ms this period — a strong driver of rank growth.`
      : scoreTrend != null && scoreTrend > 0
        ? `Your score improved ${scoreTrend}% this period — your trajectory suggests continued ranking growth.`
        : "Keep building session volume to accelerate your ranking progression.";

  // Player archetype description
  const archetypeDesc =
    mentalProfile === "Elite Competitor"
      ? "Your performance pattern suggests elite sustained attention and fast visual scanning."
      : mentalProfile === "Precision Specialist"
        ? "Your performance pattern suggests exceptional accuracy with strong cognitive control."
        : mentalProfile === "Speed Demon"
          ? "Your performance pattern suggests rapid visual processing and fast decision making."
          : "Your performance pattern suggests strong sustained attention and visual scanning ability.";

  return (
    <div className="w-full h-full bg-white text-zinc-900 relative overflow-hidden">
      {/* LEFT STRIP */}
      <div className="absolute left-0 top-0 w-4 h-full bg-[#570df8]" />

      {/* CONTENT */}
      <div className="px-12 pt-10 pb-[120px]">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <div className="uppercase tracking-[0.25em] text-[10px] text-zinc-400">
              Competitive Analytics
            </div>
            <h1 className="text-[48px] leading-[0.9] font-black mt-4">
              Global
              <br />
              Rank
            </h1>
          </div>

          <div className="w-14 h-14 bg-[#570df8] text-white flex items-center justify-center">
            <FiAward className="text-3xl" />
          </div>
        </div>

        {/* HERO */}
        <div className="grid grid-cols-[1fr_280px] gap-8 mt-8 items-start">
          {/* LEFT */}
          <div>
            {betterThan != null ? (
              <div className="inline-flex bg-[#570df8] text-white px-3 py-2 text-[10px] font-semibold">
                Top {100 - betterThan}% Worldwide
              </div>
            ) : (
              <div className="inline-flex bg-[#570df8] text-white px-3 py-2 text-[10px] font-semibold">
                {speedTier} Speed Tier
              </div>
            )}

            <h2 className="text-[72px] leading-none font-black mt-5 tracking-[-0.05em]">
              {globalRank != null ? `#${globalRank}` : "—"}
            </h2>

            <p className="text-sm text-zinc-600 leading-relaxed mt-5 max-w-md">
              {betterThan != null ? (
                <>
                  You currently rank higher than{" "}
                  <span className="font-bold text-[#570df8]">
                    {betterThan}% of players
                  </span>{" "}
                  globally based on reaction speed, consistency, and cognitive
                  scanning ability.
                </>
              ) : (
                <>
                  Based on your{" "}
                  <span className="font-bold text-[#570df8]">
                    {totalGames} sessions
                  </span>{" "}
                  and {consistencyLabel.toLowerCase()} consistency, your ranking
                  is building steadily.
                </>
              )}
            </p>

            {/* PLAYER ARCHETYPE */}
            <div className="mt-6 border border-zinc-200 bg-zinc-50 p-5">
              <div className="uppercase tracking-[0.25em] text-[10px] text-zinc-400">
                Player Archetype
              </div>
              <div className="text-2xl font-black mt-3">{mentalProfile}</div>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                {archetypeDesc}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {/* IMPROVEMENT */}
            <div className="bg-[#570df8] text-white p-5">
              <div className="uppercase tracking-[0.25em] text-[10px] opacity-70">
                {rankImprovement != null ? "Rank Improvement" : "Score Growth"}
              </div>

              <div className="text-5xl font-black mt-4">
                {rankImprovement != null
                  ? `+${rankImprovement}`
                  : scoreTrend != null
                    ? `+${scoreTrend}%`
                    : "—"}
              </div>

              <div className="mt-5 text-xs leading-relaxed opacity-90">
                {rankImprovement != null
                  ? "Significant ranking growth this period."
                  : "Score improvement over this period."}
              </div>
            </div>

            {/* MINI GRID */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <MiniCard
                icon={<FiUsers />}
                label="Sessions"
                value={totalGames}
              />

              <MiniCard
                icon={<FiGlobe />}
                label="Country"
                value={country !== "—" ? country : "—"}
              />

              <MiniCard icon={<FiZap />} label="Speed Tier" value={speedTier} />

              <MiniCard
                icon={<FiBarChart2 />}
                label="Consistency"
                value={consistencyLabel}
              />
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="mt-7 border border-zinc-200 bg-zinc-50 p-5">
          <div className="flex items-end justify-between gap-8">
            {/* TEXT */}
            <div className="max-w-md">
              <div className="uppercase tracking-[0.25em] text-[10px] text-zinc-400">
                Ranking Progression
              </div>

              <h2 className="text-2xl font-black mt-3 leading-tight">
                Your global ranking continues improving.
              </h2>

              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Players with stable ranking progression usually demonstrate
                stronger focus endurance and reaction consistency.
              </p>

              {/* INSIGHT */}
              <div className="flex items-start gap-3 mt-5">
                <FiArrowUpRight className="text-[#570df8] text-xl mt-1 shrink-0" />
                <div className="text-sm font-semibold leading-relaxed">
                  {insightText}
                </div>
              </div>
            </div>

            {/* CHART */}
            <div className="w-[260px] h-[140px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rankTrend}>
                  <defs>
                    <linearGradient
                      id="rankGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#570df8"
                        stopOpacity={0.35}
                      />
                      <stop offset="100%" stopColor="#570df8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#570df8"
                    strokeWidth={3}
                    fill="url(#rankGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <BottomCard
            title="Global Rank"
            value={globalRank != null ? `#${globalRank}` : "—"}
            desc="Worldwide leaderboard position."
          />

          <BottomCard
            title="Players Beaten"
            value={betterThan != null ? `${betterThan}%` : "—"}
            desc="Higher than most active users."
          />

          <BottomCard
            title="Country"
            value={country !== "—" ? country : "—"}
            desc={`Based on your registered region.`}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 w-full border-t border-zinc-200 px-12 py-5 bg-white">
        <div className="flex items-center justify-between text-[10px] text-zinc-400">
          <div>Competitive Intelligence Analytics™</div>
          <div>www.schultetable.com</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTS
// ============================================

function MiniCard({ icon, label, value }) {
  return (
    <div className="bg-zinc-50 border border-zinc-200 p-3">
      <div className="flex items-center justify-between">
        <div className="text-[#570df8] text-base">{icon}</div>
        <div className="text-[9px] uppercase text-zinc-400">{label}</div>
      </div>
      <div className="text-xl font-black mt-3">{value}</div>
    </div>
  );
}

function BottomCard({ title, value, desc }) {
  return (
    <div className="border border-zinc-200 bg-zinc-50 p-4">
      <div className="uppercase tracking-[0.2em] text-[9px] text-zinc-400">
        {title}
      </div>
      <div className="text-3xl font-black mt-4">{value}</div>
      <p className="mt-3 text-xs text-zinc-600 leading-relaxed">{desc}</p>
    </div>
  );
}
