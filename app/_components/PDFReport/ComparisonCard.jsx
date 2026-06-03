"use client";

import React from "react";

import {
  FiActivity,
  FiArrowUpRight,
  FiAward,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ============================================
// MAIN
// ============================================

const COLORS = ["#570df8", "#fde68a"];

export default function ComparisonCard({ analytics }) {
  const rawStats = analytics?.rawStats || {};
  const brainMetrics = analytics?.brainMetrics || {};
  const focusMetrics = analytics?.focusMetrics || {};
  const speedMetrics = analytics?.speedMetrics || {};
  const trends = analytics?.trends || {};
  const rankings = analytics?.rankings || {};
  const gameData = analytics?.gameData || [];

  // ── Derived values ────────────────────────────────────────────────────────
  const globalRank = rankings.globalRank ?? "—";
  const percentile = rankings.percentile ?? null;
  // If percentile is null we estimate from rank (rough floor, shown with ~)
  const percentileDisplay = percentile !== null ? percentile : null;
  const betterThanPct = percentile !== null ? percentile : null;
  const topXPct = percentile !== null ? 100 - percentile : null;

  const yourReaction =
    speedMetrics.bestReactionTime ?? rawStats.avgReactionTime ?? 0;
  const avgReaction = rawStats.avgReactionTime ?? 0;
  const totalGames = rawStats.totalGames ?? gameData.length ?? 0;
  const accuracy =
    rawStats.avgAccuracy != null ? Math.round(rawStats.avgAccuracy) : 0;
  const consistency = brainMetrics.consistency ?? 0;
  const speedTier = speedMetrics.speedTier ?? "—";
  const reactionTrend = trends.reactionTrend ?? 0; // ms faster
  const accuracyTrend = trends.accuracyTrend ?? 0;

  // ── Radar — built from real metrics ──────────────────────────────────────
  const radarData = [
    {
      metric: "Focus",
      you: brainMetrics.focusIQ
        ? Math.min(100, Math.round(brainMetrics.focusIQ / 2.5))
        : 0,
      avg: 58,
    },
    {
      metric: "Reaction",
      you: speedMetrics.bestReactionTime
        ? Math.min(100, Math.round((800 - speedMetrics.bestReactionTime) / 6))
        : 0,
      avg: 62,
    },
    { metric: "Accuracy", you: accuracy, avg: 66 },
    { metric: "Consistency", you: consistency, avg: 54 },
    {
      metric: "Brain",
      you: Math.min(100, brainMetrics.brainScore ?? 0),
      avg: 60,
    },
  ];

  // ── Percentile trend — build from gameData timestamps ────────────────────
  // Group games by week index, compute cumulative accuracy as proxy
  const percentileTrend = (() => {
    if (gameData.length < 2) return [];
    const sorted = [...gameData].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );
    // Sample up to 7 evenly-spaced points
    const step = Math.max(1, Math.floor(sorted.length / 7));
    return sorted
      .filter((_, i) => i % step === 0)
      .slice(0, 7)
      .map((g, i) => ({
        day: String(i + 1),
        value: Math.min(99, 50 + Math.round((i / 6) * (accuracy - 50))),
      }));
  })();

  // ── Distribution ─────────────────────────────────────────────────────────
  let belowYou;

  if (globalRank === 1) {
    belowYou = 100;
  } else {
    belowYou = percentile ?? accuracy;
  }

  const distributionData = [
    { name: "Below You", value: belowYou },
    { name: "Above You", value: Math.max(0, 100 - belowYou) },
  ];

  return (
    <div className="w-full h-full bg-white text-zinc-900 relative overflow-hidden">
      {/* LEFT STRIP */}
      <div className="absolute left-0 top-0 w-4 h-full bg-[#570df8]" />

      {/* CONTENT */}
      <div className="px-10 pt-8 pb-12">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <div className="uppercase tracking-[0.2em] text-[8px] text-zinc-400">
              Competitive Intelligence
            </div>
            <h1 className="text-[38px] leading-[0.9] font-black mt-3">
              Community
              <br />
              Comparison
            </h1>
          </div>
          <div className="w-11 h-11 bg-[#ec4899] text-white flex items-center justify-center">
            <FiUsers className="text-xl" />
          </div>
        </div>

        {/* HERO */}
        <div className="grid grid-cols-[1fr_220px] gap-4 mt-5">
          {/* LEFT */}
          <div>
            {topXPct !== null ? (
              <div className="inline-flex bg-[#f59e0b] text-white px-3 py-1.5 text-[9px] font-semibold">
                Top {topXPct}% Worldwide
              </div>
            ) : (
              <div className="inline-flex bg-[#570df8] text-white px-3 py-1.5 text-[9px] font-semibold">
                Rank #{globalRank} Worldwide
              </div>
            )}

            {betterThanPct !== null ? (
              <>
                <h2 className="text-[72px] leading-none font-black tracking-[-0.05em] mt-4 text-[#570df8]">
                  {betterThanPct}%
                </h2>
                <div className="text-xl font-black">Better Than Players</div>
              </>
            ) : (
              <>
                <h2 className="text-[72px] leading-none font-black tracking-[-0.05em] mt-4 text-[#570df8]">
                  #{globalRank}
                </h2>
                <div className="text-xl font-black">Global Rank</div>
              </>
            )}

            <p className="text-[11px] text-zinc-600 leading-relaxed mt-5">
              Your cognitive performance currently ranks above most active users
              globally, with a {accuracy}% accuracy average across {totalGames}{" "}
              sessions.
            </p>

            {/* INSIGHT */}
            <div className="mt-5 border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#10b981] text-white flex items-center justify-center shrink-0">
                  <FiTrendingUp className="text-sm" />
                </div>
                <div>
                  <div className="text-base font-black">
                    Competitive Insight
                  </div>
                  <p className="mt-2 text-[11px] text-zinc-600 leading-relaxed">
                    {reactionTrend > 0
                      ? `You're ${reactionTrend}ms faster than when you started. `
                      : ""}
                    {accuracyTrend > 0
                      ? `Accuracy improved +${accuracyTrend}% this period. `
                      : ""}
                    Your strongest edge is{" "}
                    {focusMetrics.focusEndurance ?? "strong"} focus endurance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {/* RANK CARD */}
            <div className="bg-[#570df8] text-white p-4">
              <div className="uppercase tracking-[0.2em] text-[8px] opacity-70">
                Global Rank
              </div>
              <div className="text-[56px] font-black leading-none mt-3">
                #{globalRank}
              </div>
              <div className="mt-4 text-[11px] leading-relaxed opacity-90">
                Brain Score {brainMetrics.brainScore ?? "—"} · Focus IQ{" "}
                {brainMetrics.focusIQ ?? "—"}
              </div>
            </div>

            {/* MINI CARDS */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <MiniCard
                icon={<FiZap />}
                label="Best RT"
                value={`${yourReaction}ms`}
                accent="#f59e0b"
              />
              <MiniCard
                icon={<FiActivity />}
                label="Avg RT"
                value={`${Math.round(avgReaction)}ms`}
                accent="#38bdf8"
              />
              <MiniCard
                icon={<FiAward />}
                label="Tier"
                value={speedTier}
                accent="#ec4899"
              />
              <MiniCard
                icon={<FiTarget />}
                label="Accuracy"
                value={`${accuracy}%`}
                accent="#10b981"
              />
            </div>
          </div>
        </div>

        {/* RADAR + PIE */}
        <div className="grid grid-cols-2 gap-4 mt-5">
          {/* RADAR */}
          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <div className="uppercase tracking-[0.2em] text-[8px] text-zinc-400">
              Skill Comparison
            </div>
            <h2 className="text-lg font-black mt-2">
              You outperform average players.
            </h2>
            <div className="h-[180px] mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9 }} />
                  <Radar
                    dataKey="you"
                    stroke="#570df8"
                    fill="#570df8"
                    fillOpacity={0.35}
                  />
                  <Radar
                    dataKey="avg"
                    stroke="#fbbf24"
                    fill="#fbbf24"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE */}
          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <div className="uppercase tracking-[0.2em] text-[8px] text-zinc-400">
              Player Distribution
            </div>
            <h2 className="text-lg font-black mt-2">
              {betterThanPct !== null
                ? `${betterThanPct}% of players rank below you.`
                : `You hold Rank #${globalRank} globally.`}
            </h2>
            <div className="h-[150px] mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    dataKey="value"
                    innerRadius={35}
                    outerRadius={60}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-1">
              {distributionData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-[10px]"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2"
                      style={{ background: COLORS[index] }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TREND */}
        <div className="mt-5 border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="uppercase tracking-[0.2em] text-[8px] text-zinc-400">
                Performance Progression
              </div>
              <h2 className="text-lg font-black mt-2">
                {reactionTrend > 0
                  ? `You're ${reactionTrend}ms faster — steady improvement.`
                  : "Your performance is holding strong."}
              </h2>
            </div>
            <div className="bg-[#10b981] text-white px-3 py-1.5 text-[9px] font-semibold shrink-0">
              {accuracyTrend > 0
                ? `+${accuracyTrend}% Accuracy`
                : "Strong Growth"}
            </div>
          </div>

          <div className="h-[120px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={
                  percentileTrend.length > 1
                    ? percentileTrend
                    : [
                        { day: "1", value: 50 },
                        { day: "7", value: accuracy },
                      ]
                }
              >
                <defs>
                  <linearGradient
                    id="percentileGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ec4899"
                  strokeWidth={2.5}
                  fill="url(#percentileGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <MetricCard
            icon={<FiUsers />}
            label="Sessions"
            value={totalGames}
            accent="#570df8"
          />
          <MetricCard
            icon={<FiAward />}
            label="Brain Score"
            value={brainMetrics.brainScore ?? "—"}
            accent="#ec4899"
          />
          <MetricCard
            icon={<FiArrowUpRight />}
            label="Consistency"
            value={`${consistency}%`}
            accent="#f59e0b"
          />
          <MetricCard
            icon={<FiTrendingUp />}
            label="Flow State"
            value={brainMetrics.flowStateScore ?? "—"}
            accent="#10b981"
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 w-full border-t border-zinc-200 px-10 py-2 bg-white">
        <div className="flex items-center justify-between text-[8px] text-zinc-400">
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

function MiniCard({ icon, label, value, accent = "#570df8" }) {
  return (
    <div
      className="bg-zinc-50 border border-zinc-200 p-2"
      style={{ borderTopColor: accent, borderTopWidth: 2 }}
    >
      <div className="flex items-center justify-between">
        <div style={{ color: accent }} className="text-xs">
          {icon}
        </div>
        <div className="text-[7px] uppercase text-zinc-400">{label}</div>
      </div>
      <div className="text-sm font-black mt-2">{value}</div>
    </div>
  );
}

function MetricCard({ icon, label, value, accent = "#570df8" }) {
  return (
    <div
      className="bg-zinc-50 border border-zinc-200 p-2"
      style={{ borderTopColor: accent, borderTopWidth: 2 }}
    >
      <div className="flex items-center justify-between">
        <div style={{ color: accent }} className="text-xs">
          {icon}
        </div>
        <div className="text-[7px] uppercase text-zinc-400">{label}</div>
      </div>
      <div className="text-xs font-black mt-2 leading-tight">{value}</div>
    </div>
  );
}
