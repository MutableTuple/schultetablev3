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
  FiShield,
  FiStar,
} from "react-icons/fi";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  BarChart,
  Bar,
  Cell,
  XAxis,
  Tooltip,
} from "recharts";
const ACCENT = "#570df8";
const ACCENT_CYAN = "#06b6d4";

const METRIC_COLORS = {
  Reaction: "#570df8",
  Focus: "#06b6d4",
  Accuracy: "#10b981",
  Consistency: "#f59e0b",
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
  const errorRate = performanceMetrics?.errorRate ?? 0;
  const speedTier = speedMetrics?.speedTier ?? "—";
  const accuracyTrend = trends?.accuracyTrend ?? null;
  const reactionTrend = trends?.reactionTrend ?? null;
  const scoreTrend = trends?.scoreTrend ?? null;
  const fullName = user?.user?.name?.trim() || "";
  const userInitial = (fullName[0] || "?").toUpperCase();

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

  // ── Your own 4 real metrics, normalized to a comparable 0-100 scale.
  // No fabricated "community average" bars — that never had real data
  // behind it (see the removed hardcoded 60/58/66/55 constants).
  const reactionScore = Math.round(
    Math.min(100, (1000 / Math.max(avgReaction, 1)) * 55),
  );
  const focusScoreValue = Math.round(attentionDrift);
  const accuracyScore = Math.round(avgAccuracy);
  const consistencyScore = Math.round(consistency);

  const metricsSnapshot = [
    { name: "Reaction", you: reactionScore },
    { name: "Focus", you: focusScoreValue },
    { name: "Accuracy", you: accuracyScore },
    { name: "Consistency", you: consistencyScore },
  ];

  const strongestMetric = metricsSnapshot.reduce((a, b) =>
    b.you > a.you ? b : a,
  );

  // ── Peak & weak day — real data ───────────────────────────────────────────
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

  // ── Trend headline — now has a real "declined" branch instead of
  // quietly calling any non-positive trend "stable".
  const trendHeadline =
    scoreTrend != null && scoreTrend > 0
      ? `Your performance improved ${scoreTrend}% this period.`
      : reactionTrend != null && reactionTrend > 0
        ? `You're ${reactionTrend}ms faster than when you started.`
        : accuracyTrend != null && accuracyTrend > 0
          ? `Your accuracy improved +${accuracyTrend}% this period.`
          : scoreTrend != null && scoreTrend < 0
            ? "Your performance dipped slightly this period — more sessions can help you rebound."
            : "Your performance remained stable this period.";

  return (
    <div
      className="w-full h-full bg-white text-zinc-900 relative flex"
      style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
    >
      {/* ── SIDEBAR ── */}
      <div
        className="w-24 h-full shrink-0 flex flex-col items-center py-5 relative"
        style={{
          background: `linear-gradient(180deg, #1e1b4b, ${ACCENT} 55%, #7c3aed)`,
        }}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white font-black text-base shrink-0">
          S
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-5">
          <span
            className="text-white font-black text-sm tracking-[0.18em] whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            SCHULTETABLE
          </span>
          <span
            className="text-white/60 font-semibold text-[8px] tracking-[0.3em] whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            COGNITIVE PERFORMANCE ANALYTICS
          </span>
        </div>

        <div className="flex flex-col items-center gap-2.5 shrink-0">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/40 shrink-0 flex items-center justify-center bg-white/10 text-white font-bold text-sm">
            {user?.user?.image ? (
              <img
                src={user.user.image}
                alt={fullName || "avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              userInitial
            )}
          </div>
          {fullName && (
            <span
              className="text-white font-bold text-[11px] tracking-wide whitespace-nowrap"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {fullName}
            </span>
          )}
          <FiStar size={12} className="text-white/50 mt-1" />
        </div>
      </div>

      {/* ── MAIN COLUMN ── */}
      <div className="flex-1 h-full flex flex-col">
        <div className="flex-1 px-9 pt-7">
          {/* HEADER */}
          <div className="flex items-start justify-between">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em]"
                style={{ background: `${ACCENT}1a`, color: ACCENT }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: ACCENT }}
                />
                Deep Analytics
              </div>
              <h1 className="text-[38px] leading-[0.9] font-black mt-3 tracking-[-0.03em]">
                <span
                  style={{
                    background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_CYAN})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Performance
                </span>
                <br />
                <span className="text-zinc-900">Graphs</span>
              </h1>
            </div>

            <div
              className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg shrink-0"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_CYAN})`,
                boxShadow: `0 8px 20px ${ACCENT}40`,
              }}
            >
              <FiBarChart2 className="text-xl" />
            </div>
          </div>

          {/* INTRO */}
          <div className="mt-4 border border-zinc-200 bg-zinc-50 rounded-2xl p-3.5">
            <div className="flex items-start gap-2.5">
              <div
                className="w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_CYAN})`,
                }}
              >
                <FiTrendingUp className="text-sm" />
              </div>
              <div>
                <h2 className="text-base font-black">
                  Understanding Your Performance
                </h2>
                <p className="mt-1 text-[11px] text-zinc-600 leading-relaxed line-clamp-2">
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
          <div className="grid grid-cols-[1fr_190px] gap-3.5 mt-4">
            {/* AREA CHART */}
            <div className="border border-zinc-200 bg-zinc-50 rounded-2xl p-3.5">
              <div className="text-[9px] uppercase tracking-[0.22em] text-zinc-400 font-bold">
                Performance Trend
              </div>
              <h2 className="text-base font-black mt-1.5 line-clamp-1">
                {trendHeadline}
              </h2>
              <div className="h-[100px] mt-2">
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
                        <stop
                          offset="0%"
                          stopColor={ACCENT}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="50%"
                          stopColor={ACCENT_CYAN}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="100%"
                          stopColor={ACCENT}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke={ACCENT}
                      strokeWidth={2.5}
                      fill="url(#scoreGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* FOCUS GAUGE — replaces the fabricated 3-way pie split with
                the one real signal we actually have: attentionDrift. */}
            <div className="border border-zinc-200 bg-zinc-50 rounded-2xl p-3.5 flex flex-col items-center">
              <div className="text-[9px] uppercase tracking-[0.22em] text-zinc-400 font-bold self-start">
                Focus Consistency
              </div>
              <div className="relative w-[90px] h-[90px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="72%"
                    outerRadius="100%"
                    data={[
                      { value: focusScoreValue, fill: "url(#focusGaugeGrad)" },
                    ]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <defs>
                      <linearGradient
                        id="focusGaugeGrad"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={ACCENT} />
                        <stop offset="100%" stopColor={ACCENT_CYAN} />
                      </linearGradient>
                    </defs>
                    <RadialBar background dataKey="value" cornerRadius={16} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-xl font-black">{focusScoreValue}%</div>
                </div>
              </div>
              <p className="text-[9px] text-zinc-500 text-center mt-2 leading-snug line-clamp-2">
                How steadily you stay locked in during a session.
              </p>
            </div>
          </div>

          {/* INSIGHT CARDS */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <InsightCard
              icon={<FiArrowUpRight />}
              title="Peak Day"
              value={peakDay}
              color={ACCENT}
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

          {/* METRICS SNAPSHOT — your own 4 real scores, no invented
              "community average" bars alongside them. */}
          <div className="mt-4 border border-zinc-200 bg-zinc-50 rounded-2xl p-3.5">
            <div className="text-[9px] uppercase tracking-[0.22em] text-zinc-400 font-bold">
              Your Metrics Snapshot
            </div>
            <h2 className="text-base font-black mt-1.5">
              {strongestMetric.name} is your strongest metric this period.
            </h2>
            <div className="h-[110px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metricsSnapshot} barCategoryGap="30%">
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
                      borderRadius: 8,
                    }}
                    formatter={(val) => [`${val}`, "You"]}
                  />
                  <Bar dataKey="you" radius={[4, 4, 0, 0]}>
                    {metricsSnapshot.map((entry, i) => (
                      <Cell key={i} fill={METRIC_COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[9px] text-zinc-500 mt-1.5 line-clamp-1">
              Each metric shown on a comparable 0–100 scale, based on your own
              real session data.
            </p>
          </div>

          {/* BOTTOM METRICS */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <MetricCard
              icon={<FiZap />}
              label="Reaction"
              value={`${Math.round(avgReaction)}ms`}
              color={ACCENT}
            />
            <MetricCard
              icon={<FiTarget />}
              label="Stability"
              value={`${cogStability}%`}
              color={ACCENT_CYAN}
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
        <div className="shrink-0 border-t border-zinc-200 px-9 py-3 bg-white flex items-center justify-between">
          <div className="flex items-start gap-2">
            <FiShield size={11} className="text-zinc-400 mt-0.5" />
            <div>
              <div className="text-[9px] font-bold text-zinc-500">
                Performance Intelligence Analytics™
              </div>
              <div className="text-[8px] text-zinc-400">
                Your data is private and secure. We will never share your
                information.
              </div>
            </div>
          </div>
          <span className="text-[9px] font-semibold" style={{ color: ACCENT }}>
            www.schultetable.com
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTS
// ============================================

function MetricCard({ icon, label, value, color = ACCENT }) {
  return (
    <div
      className="rounded-xl p-2.5 border"
      style={{
        background: `linear-gradient(135deg, ${color}0d 0%, transparent 60%)`,
        borderColor: `${color}30`,
      }}
    >
      <div className="flex items-center justify-between">
        <div style={{ color }}>{icon}</div>
        <div className="text-[7px] uppercase text-zinc-400 font-bold">
          {label}
        </div>
      </div>
      <div className="text-base font-black mt-1.5 truncate">{value}</div>
    </div>
  );
}

function InsightCard({ icon, title, value, color = ACCENT }) {
  return (
    <div
      className="rounded-xl p-2.5 border"
      style={{
        background: `linear-gradient(135deg, ${color}0d 0%, transparent 60%)`,
        borderColor: `${color}30`,
      }}
    >
      <div className="flex items-center justify-between">
        <div style={{ color }}>{icon}</div>
        <div className="text-[7px] uppercase text-zinc-400 font-bold">
          {title}
        </div>
      </div>
      <div className="text-sm font-black mt-1.5 truncate">{value}</div>
    </div>
  );
}
