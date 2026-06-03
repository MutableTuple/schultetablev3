"use client";

import React from "react";

import {
  FiAlertTriangle,
  FiArrowDownRight,
  FiArrowUpRight,
  FiBarChart2,
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

const COLORS = ["#570df8", "#06b6d4", "#c4b5fd"];
const BAR_COLORS = {
  reaction: { you: "#570df8", avg: "#d4d4d8" },
  focus: { you: "#06b6d4", avg: "#d4d4d8" },
  accuracy: { you: "#10b981", avg: "#d4d4d8" },
  consistency: { you: "#f59e0b", avg: "#d4d4d8" },
};

// ============================================
// MAIN
// ============================================

export default function PerformanceGraph({ user, analytics }) {
  const {
    rawStats,
    brainMetrics,
    speedMetrics,
    focusMetrics,
    fatigueMetrics,
    performanceMetrics,
    trends,
    gameData,
  } = analytics || {};

  // ── Values ────────────────────────────────────────────────────────────────
  const avgReaction = rawStats?.avgReactionTime ?? 0;
  const avgAccuracy = rawStats?.avgAccuracy ?? 0;
  const consistency = brainMetrics?.consistency ?? 0;
  const cogStability = brainMetrics?.cognitiveStability ?? 0;
  const attentionDrift = focusMetrics?.attentionDrift ?? 0;
  const fatigueScore = fatigueMetrics?.fatigueScore ?? 0;
  const bestAccuracy = performanceMetrics?.bestAccuracy ?? 0;
  const errorRate = performanceMetrics?.errorRate ?? 0;
  const scorePerGame = performanceMetrics?.scorePerGame ?? 0;
  const bestGame = performanceMetrics?.bestGame ?? null;
  const speedTier = speedMetrics?.speedTier ?? "—";
  const accuracyTrend = trends?.accuracyTrend ?? null;
  const reactionTrend = trends?.reactionTrend ?? null;
  const scoreTrend = trends?.scoreTrend ?? null;

  // ── Performance trend chart — real game scores over time ─────────────────
  const performanceTrend = (() => {
    if (!gameData?.length) return [];
    return [...gameData]
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .slice(-12)
      .map((g, i) => ({
        day: String(i + 1),
        score: g.score ?? 0,
      }));
  })();

  // ── Focus state pie — derived from attentionDrift + fatigueScore ──────────
  const focused = Math.round(attentionDrift * 0.85);
  const average = Math.round((100 - attentionDrift) * 0.6);
  const distracted = Math.max(0, 100 - focused - average);

  const focusBreakdown = [
    { name: "Focused", value: focused },
    { name: "Average", value: average },
    { name: "Distracted", value: distracted },
  ];

  // ── Comparison bar data — you vs community benchmarks ────────────────────
  // Community benchmarks: reaction ~600ms = 60 score, focus avg = 58, accuracy avg = 66, consistency avg = 55
  const reactionScore = Math.round(
    Math.min(100, (1000 / Math.max(avgReaction, 1)) * 55),
  );
  const focusScore = Math.round(attentionDrift);
  const accuracyScore = Math.round(avgAccuracy);
  const consistencyScore = Math.round(consistency);

  const comparisonData = [
    { name: "Reaction", you: reactionScore, avg: 60 },
    { name: "Focus", you: focusScore, avg: 58 },
    { name: "Accuracy", you: accuracyScore, avg: 66 },
    { name: "Consistency", you: consistencyScore, avg: 55 },
  ];

  // ── Peak & weak day ───────────────────────────────────────────────────────
  const sortedByScore = [...(gameData ?? [])].sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0),
  );
  const peakGameRow = sortedByScore[0];
  const weakGameRow = sortedByScore[sortedByScore.length - 1];

  const fmtDate = (row) => {
    if (!row?.created_at) return "—";
    return new Date(row.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const peakDay = fmtDate(peakGameRow);
  const weakDay = fmtDate(weakGameRow);
  const highScore = peakGameRow?.score ?? 0;
  const lowScore = weakGameRow?.score ?? 0;

  // ── Growth label ─────────────────────────────────────────────────────────
  const growthLabel =
    accuracyTrend != null && accuracyTrend !== 0
      ? `${accuracyTrend > 0 ? "+" : ""}${accuracyTrend}%`
      : scoreTrend != null && scoreTrend !== 0
        ? `${scoreTrend > 0 ? "+" : ""}${scoreTrend}%`
        : "—";

  // ── Consistency label ─────────────────────────────────────────────────────
  const consistencyLabel =
    consistency >= 90
      ? "Elite"
      : consistency >= 75
        ? "High"
        : consistency >= 60
          ? "Moderate"
          : "Low";

  // ── Trend headline ────────────────────────────────────────────────────────
  const trendHeadline =
    scoreTrend != null && scoreTrend > 0
      ? `Your performance improved ${scoreTrend}% this period.`
      : reactionTrend != null && reactionTrend > 0
        ? `You're ${reactionTrend}ms faster than when you started.`
        : accuracyTrend != null && accuracyTrend > 0
          ? `Your accuracy improved +${accuracyTrend}% this period.`
          : "Your performance remained stable this period.";

  // ── Bar comparison headline ───────────────────────────────────────────────
  const comparisonHeadline =
    reactionScore > 70 && accuracyScore > 85
      ? "You outperform average players across the board."
      : reactionScore > 60 || accuracyScore > 80
        ? "You beat the average in key performance areas."
        : "Your metrics are building toward above-average performance.";

  return (
    <div className="w-full h-full bg-white text-zinc-900 relative overflow-hidden">
      {/* LEFT STRIP */}
      <div className="absolute left-0 top-0 w-4 h-full bg-[#570df8]" />

      {/* CONTENT */}
      <div className="px-10 pt-8 pb-24">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <div className="uppercase tracking-[0.22em] text-[9px] text-zinc-400">
              Deep Analytics
            </div>
            <h1 className="text-[42px] leading-[0.9] font-black mt-3">
              Performance
              <br />
              Graphs
            </h1>
          </div>

          <div className="w-12 h-12 bg-[#570df8] text-white flex items-center justify-center">
            <FiBarChart2 className="text-2xl" />
          </div>
        </div>

        {/* INTRO */}
        <div className="mt-6 border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-[#570df8] text-white flex items-center justify-center shrink-0">
              <FiTrendingUp className="text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-black">
                Understanding Your Performance
              </h2>
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                These charts visualize your reaction speed, focus consistency,
                and cognitive stability across{" "}
                <span className="font-bold text-zinc-800">
                  {rawStats?.totalGames ?? 0} sessions
                </span>
                .
              </p>
            </div>
          </div>
        </div>

        {/* TOP SECTION */}
        <div className="grid grid-cols-[1fr_220px] gap-4 mt-5">
          {/* AREA CHART */}
          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <div className="uppercase tracking-[0.22em] text-[9px] text-zinc-400">
              Performance Trend
            </div>
            <h2 className="text-xl font-black mt-2">{trendHeadline}</h2>
            <div className="h-[120px] mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceTrend}>
                  <defs>
                    <linearGradient
                      id="scoreGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#570df8" stopOpacity={0.4} />
                      <stop
                        offset="50%"
                        stopColor="#06b6d4"
                        stopOpacity={0.2}
                      />
                      <stop offset="100%" stopColor="#570df8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#570df8"
                    strokeWidth={2.5}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE CHART */}
          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <div className="uppercase tracking-[0.22em] text-[9px] text-zinc-400">
              Focus State
            </div>
            <div className="h-[110px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={focusBreakdown}
                    dataKey="value"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                  >
                    {focusBreakdown.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-1">
              {focusBreakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-[10px]"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-sm"
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

        {/* INSIGHT CARDS */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          <InsightCard
            icon={<FiArrowUpRight />}
            title="Peak Day"
            value={peakDay}
            color="#570df8"
          />
          <InsightCard
            icon={<FiArrowDownRight />}
            title="Weak Day"
            value={weakDay}
            color="#f43f5e"
          />
          <InsightCard
            icon={<FiTarget />}
            title="Best Score"
            value={highScore.toLocaleString()}
            color="#10b981"
          />
          <InsightCard
            icon={<FiAlertTriangle />}
            title="Low Score"
            value={lowScore.toLocaleString()}
            color="#f59e0b"
          />
        </div>

        {/* BAR CHART */}
        <div className="mt-5 border border-zinc-200 bg-zinc-50 p-4">
          <div className="uppercase tracking-[0.22em] text-[9px] text-zinc-400">
            Community Comparison
          </div>
          <h2 className="text-xl font-black mt-2">{comparisonHeadline}</h2>
          <div className="h-[140px] mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} barGap={4} barCategoryGap="30%">
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 10,
                    background: "#fff",
                    border: "1px solid #e4e4e7",
                    borderRadius: 4,
                  }}
                  formatter={(val, name) => [
                    `${val}`,
                    name === "you" ? "You" : "Avg",
                  ]}
                />
                <Bar dataKey="you" radius={[3, 3, 0, 0]}>
                  {comparisonData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={Object.values(BAR_COLORS)[i]?.you ?? "#570df8"}
                    />
                  ))}
                </Bar>
                <Bar dataKey="avg" fill="#e4e4e7" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-500">
              <div className="w-3 h-3 rounded-sm bg-[#570df8]" />
              You
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-500">
              <div className="w-3 h-3 rounded-sm bg-[#e4e4e7]" />
              Community Avg
            </div>
          </div>
        </div>

        {/* BOTTOM METRICS */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          <MetricCard
            icon={<FiZap />}
            label="Reaction"
            value={`${Math.round(avgReaction)}ms`}
            color="#570df8"
          />
          <MetricCard
            icon={<FiTarget />}
            label="Stability"
            value={`${cogStability}%`}
            color="#06b6d4"
          />
          <MetricCard
            icon={<FiTrendingUp />}
            label="Growth"
            value={growthLabel}
            color="#10b981"
          />
          <MetricCard
            icon={<FiClock />}
            label="Consistency"
            value={consistencyLabel}
            color="#f59e0b"
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 w-full border-t border-zinc-200 px-10 py-3 bg-white">
        <div className="flex items-center justify-between text-[9px] text-zinc-400">
          <div>Performance Intelligence Analytics™</div>
          <div>www.schultetable.com</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTS
// ============================================

function MetricCard({ icon, label, value, color = "#570df8" }) {
  return (
    <div
      className="bg-zinc-50 border border-zinc-200 p-2.5 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`,
        borderColor: `${color}30`,
      }}
    >
      <div className="flex items-center justify-between">
        <div style={{ color }}>{icon}</div>
        <div className="text-[8px] uppercase text-zinc-400">{label}</div>
      </div>
      <div className="text-lg font-black mt-2">{value}</div>
    </div>
  );
}

function InsightCard({ icon, title, value, color = "#570df8" }) {
  return (
    <div
      className="bg-zinc-50 border border-zinc-200 p-2.5 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`,
        borderColor: `${color}30`,
      }}
    >
      <div className="flex items-center justify-between">
        <div style={{ color }}>{icon}</div>
        <div className="text-[8px] uppercase text-zinc-400">{title}</div>
      </div>
      <div className="text-sm font-black mt-2">{value}</div>
    </div>
  );
}
