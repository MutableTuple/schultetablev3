"use client";

import React from "react";

import {
  FiActivity,
  FiArrowUpRight,
  FiAward,
  FiTarget,
  FiTrendingUp,
  FiTrendingDown,
  FiZap,
  FiCalendar,
  FiShield,
  FiStar,
  FiClock,
} from "react-icons/fi";
import { FaTrophy, FaFire, FaStopwatch } from "react-icons/fa";

import { ResponsiveContainer, AreaChart, Area } from "recharts";

// ============================================
// LOCAL PALETTE — this report already established its own indigo/blue
// accent (#570df8) separately from the app's orange brand color, same
// pattern as the Pro upgrade modal elsewhere in this project. Kept and
// extended here rather than introduced fresh.
// ============================================
const ACCENT = "#570df8";
const ACCENT_BLUE = "#3b82f6";

// ============================================
// DECORATIVE INLINE SVGS — no external image dependency, so nothing can
// 404 in a headless-Chrome PDF render.
// ============================================

function BrainGlyph() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0">
      <defs>
        <radialGradient id="brainGlow" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#4c1d95" />
        </radialGradient>
      </defs>
      <circle cx="28" cy="28" r="27" fill="rgba(255,255,255,0.12)" />
      <path
        d="M28 12c-8 0-14 6-14 12 0 3.5 1.5 6.5 4 8.5-1 2-1 4.5.5 6.5 1.5 2 4 3 6.5 2.5.5 1.5 1.5 2.5 3 2.5s2.5-1 3-2.5c2.5.5 5-.5 6.5-2.5 1.5-2 1.5-4.5.5-6.5 2.5-2 4-5 4-8.5 0-6-6-12-14-12Z"
        fill="url(#brainGlow)"
        opacity="0.95"
      />
      <path
        d="M28 12c0 4-2.5 7-5 9M28 12c0 4 2.5 7 5 9M18 28c3-1.5 6-1 9-.5M29.5 27.5c3-.5 6-1 9 .5"
        stroke="#ede9fe"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </svg>
  );
}

function TargetGlyph() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" className="shrink-0">
      <defs>
        <linearGradient id="targetGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <circle
        cx="45"
        cy="45"
        r="42"
        fill="none"
        stroke="url(#targetGrad)"
        strokeWidth="3"
        opacity="0.5"
      />
      <circle
        cx="45"
        cy="45"
        r="29"
        fill="none"
        stroke="url(#targetGrad)"
        strokeWidth="3"
        opacity="0.7"
      />
      <circle
        cx="45"
        cy="45"
        r="16"
        fill="none"
        stroke="url(#targetGrad)"
        strokeWidth="3"
        opacity="0.9"
      />
      <circle cx="45" cy="45" r="5" fill="url(#targetGrad)" />
      <line
        x1="16"
        y1="74"
        x2="38"
        y2="52"
        stroke="#4c1d95"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M12 78l6-2-2 6-4-4Z" fill="#4c1d95" />
    </svg>
  );
}

// ============================================
// HONEST, DATA-DRIVEN COPY — fallbacks only, used when the hook's own
// real computed insights/values aren't available (e.g. brand-new account).
// ============================================

function getFallbackInsight(focusScore) {
  if (!focusScore) {
    return "Play a few more sessions this month to start seeing personalized insights here.";
  }
  if (focusScore >= 85) {
    return "You're performing at an elite level this month. Keep your consistency up to hold this ground.";
  }
  if (focusScore >= 70) {
    return "Strong performance this month — a little more consistency and you'll break into elite territory.";
  }
  if (focusScore >= 50) {
    return "Solid, steady progress this month. A few more focused sessions could meaningfully lift your score.";
  }
  return "You're just getting started — your score sharpens fast with a few more regular sessions.";
}

function getTotalScoreTier(totalScore) {
  if (totalScore >= 15000) return "Excellent";
  if (totalScore >= 8000) return "Good";
  if (totalScore >= 3000) return "Building";
  return "Getting Started";
}

function buildTrendHeadline({ accuracyTrend, reactionTrend, percentile }) {
  const percentileNote =
    percentile != null
      ? ` You're in the top ${Math.round(100 - percentile)}% worldwide.`
      : "";

  if (accuracyTrend != null && accuracyTrend > 0) {
    return `Your accuracy improved ${accuracyTrend}% this month.${percentileNote}`;
  }
  if (reactionTrend != null && reactionTrend > 0) {
    return `Your reaction time improved ${reactionTrend}ms this month.${percentileNote}`;
  }
  if (accuracyTrend != null && accuracyTrend < 0) {
    return "Your accuracy dipped a little this month — a few more focused sessions can turn that around.";
  }
  if (reactionTrend != null && reactionTrend < 0) {
    return "Your reaction time slowed slightly this month — a few more focused sessions can turn that around.";
  }
  return "Play a few more sessions this month to start seeing your personalized trend.";
}

// ============================================
// MAIN
// ============================================

export default function CoverPage({ user, analytics }) {
  const {
    rawStats,
    brainMetrics,
    speedMetrics,
    focusMetrics,
    trends,
    rankings,
    insights,
    mentalProfile,
    loading,
  } = analytics || {};

  // ── Derived display values ─────────────────
  const focusScore = brainMetrics?.brainScore ?? 0;
  const reactionMs = rawStats?.avgReactionTime ?? 0;
  const totalGames = rawStats?.totalGames ?? 0;
  const totalScore = rawStats?.totalScore ?? 0;
  const percentile = rankings?.percentile ?? null;
  const globalRank = rankings?.globalRank ?? null;
  const speedTier = speedMetrics?.speedTier ?? "—";
  const speedImprove = speedMetrics?.speedImprovement ?? null;
  const accuracyTrend = trends?.accuracyTrend ?? null;
  const reactionTrend = trends?.reactionTrend ?? null;
  const peakFocusWindow = focusMetrics?.peakFocusWindow ?? null;

  const growthLabel =
    accuracyTrend != null
      ? `${accuracyTrend > 0 ? "+" : ""}${accuracyTrend}%`
      : speedImprove != null
        ? `+${speedImprove}%`
        : "—";
  const growthIsPositive =
    accuracyTrend != null
      ? accuracyTrend > 0
      : speedImprove != null
        ? speedImprove > 0
        : null;

  const percentileDisplay =
    percentile != null
      ? `Top ${Math.round(100 - percentile)}%`
      : globalRank != null
        ? `#${globalRank}`
        : "—";

  const streak = user?.user?.streak ?? user?.streak ?? "—";

  const chartData = loading
    ? Array(8).fill({ score: 0 })
    : (analytics?.gameData ?? [])
        .slice(0, 8)
        .reverse()
        .map((g) => ({ score: g.score ?? 0 }));

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const fullName = user?.user?.name?.trim() || "";
  const firstName = fullName.split(" ")[0] || "";
  const userInitial = (fullName[0] || "?").toUpperCase();

  const insightCopy =
    insights && insights.length > 0
      ? insights[0]
      : getFallbackInsight(focusScore);

  const totalScoreTier = getTotalScoreTier(totalScore);
  const trendHeadline = buildTrendHeadline({
    accuracyTrend,
    reactionTrend,
    percentile,
  });

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
          {/* HEADER — brand/logo now lives in the sidebar, so this is
              just the date/report label, right-aligned. */}
          <div className="flex items-center justify-end">
            <div className="text-right">
              <div className="text-[8px] uppercase tracking-[0.25em] text-zinc-400 font-bold">
                Monthly Report
              </div>
              <div className="flex items-center gap-1.5 justify-end mt-1.5">
                <FiCalendar size={13} style={{ color: ACCENT }} />
                <span className="text-sm font-bold">{monthLabel}</span>
              </div>
            </div>
          </div>

          {/* HERO */}
          <div className="grid grid-cols-[1fr_250px] gap-5 mt-4">
            {/* LEFT */}
            <div>
              {firstName && (
                <p className="text-[13px] text-zinc-500 mb-2">
                  Hey{" "}
                  <span className="font-bold text-zinc-800">{firstName}</span> —
                  here's your
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.15em]"
                  style={{ background: `${ACCENT}1a`, color: ACCENT }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: ACCENT }}
                  />
                  Personalized Analytics
                </div>

                {mentalProfile && (
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] border"
                    style={{ borderColor: `${ACCENT}40`, color: "#1e1b4b" }}
                  >
                    <FiAward size={9} />
                    {mentalProfile}
                  </div>
                )}
              </div>

              <h1 className="text-[52px] font-black leading-[0.88] mt-4 tracking-[-0.04em]">
                Brain
                <br />
                <span
                  style={{
                    background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_BLUE})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Report
                </span>
              </h1>

              <p className="text-[13px] leading-relaxed text-zinc-600 mt-4 max-w-md line-clamp-2">
                A detailed overview of your cognitive performance, focus
                consistency, reaction speed, and visual scanning ability.
              </p>

              {/* USER */}
              <div className="flex items-center gap-4 mt-5 bg-zinc-50 border border-zinc-200 rounded-2xl p-3 max-w-md">
                <div
                  className="w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-white font-black text-xl"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_BLUE})`,
                  }}
                >
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

                <div className="min-w-0">
                  <div className="text-base font-black truncate">
                    {fullName || "Player"}
                  </div>
                  {user?.user?.username && (
                    <div className="text-zinc-500 text-xs mt-0.5 truncate">
                      @{user.user.username}
                    </div>
                  )}
                  {percentileDisplay !== "—" && (
                    <div
                      className="flex items-center gap-1.5 mt-1.5 font-bold text-[11px]"
                      style={{ color: ACCENT }}
                    >
                      <FiArrowUpRight size={12} />
                      {percentileDisplay} Worldwide
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT — BRAIN SCORE CARD */}
            <div
              className="rounded-2xl p-4 text-white relative overflow-hidden"
              style={{
                background: `linear-gradient(145deg, #1e1b4b, ${ACCENT} 55%, ${ACCENT_BLUE})`,
              }}
            >
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="uppercase tracking-[0.15em] text-[8px] text-white/70 font-bold">
                    Brain Score
                  </div>
                  <div className="text-[44px] font-black leading-none mt-2">
                    {focusScore}
                  </div>
                </div>
                <BrainGlyph />
              </div>

              <div className="mt-3.5 relative z-10">
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(90deg, #ef4444, #f59e0b, #eab308, #22c55e, #3b82f6, #8b5cf6)",
                  }}
                />
                <div className="flex justify-between mt-1.5 text-[9px] text-white/60 font-bold uppercase tracking-wide">
                  <span>Average</span>
                  <span>Elite</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3.5 relative z-10">
                <MetricCard
                  icon={<FiZap />}
                  label="Reaction"
                  value={`${Math.round(reactionMs)}ms`}
                />
                <MetricCard
                  icon={
                    growthIsPositive === false ? (
                      <FiTrendingDown />
                    ) : (
                      <FiTrendingUp />
                    )
                  }
                  label="Growth"
                  value={growthLabel}
                />
                <MetricCard
                  icon={<FiAward />}
                  label={percentile != null ? "Percentile" : "Rank"}
                  value={percentileDisplay}
                />
                <MetricCard
                  icon={<FiActivity />}
                  label="Sessions"
                  value={totalGames}
                />
              </div>
            </div>
          </div>

          {/* PERFORMANCE TREND */}
          <div className="mt-4 border border-zinc-200 rounded-2xl bg-zinc-50 p-4">
            <div className="flex items-end justify-between gap-6">
              <div className="max-w-md">
                <div className="text-[8px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                  Performance Trend
                </div>

                <h2 className="text-lg font-black mt-2 leading-tight line-clamp-2">
                  {trendHeadline}
                </h2>

                <p className="mt-2 text-[11px] text-zinc-600 leading-relaxed line-clamp-2">
                  {speedTier !== "—"
                    ? `Your speed tier is ${speedTier}. Keep sessions regular to build on it.`
                    : "Play a few more sessions to unlock your speed tier and trend insights."}
                </p>

                {growthLabel !== "—" && (
                  <div
                    className="inline-flex items-center gap-1.5 mt-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={
                      growthIsPositive
                        ? { background: "#ecfdf5", color: "#059669" }
                        : { background: "#fef2f2", color: "#dc2626" }
                    }
                  >
                    {growthIsPositive ? (
                      <FiTrendingUp size={11} />
                    ) : (
                      <FiTrendingDown size={11} />
                    )}
                    {growthLabel} {growthIsPositive ? "Improvement" : "Change"}
                  </div>
                )}
              </div>

              <div className="w-[200px] h-[105px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
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
                          stopOpacity={0.35}
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
                      strokeWidth={3}
                      fill="url(#scoreGradient)"
                      dot={{ r: 3, fill: ACCENT, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* BOTTOM CARDS — Peak Focus is real per-user data (the hour-of-day
              this specific user performs best, computed from their own game
              history — not a generic stat) */}
          <div className="grid grid-cols-4 gap-2.5 mt-4">
            <BottomCard
              icon={<FaTrophy size={13} />}
              iconBg="bg-blue-500"
              gradient="from-blue-50 to-indigo-50"
              title="Total Score"
              value={totalScore.toLocaleString()}
              sub={totalScoreTier}
            />
            <BottomCard
              icon={<FaFire size={13} />}
              iconBg="bg-orange-500"
              gradient="from-orange-50 to-red-50"
              title="Streak"
              value={streak !== "—" ? `${streak}d` : "—"}
              sub={streak !== "—" ? "Keep it going!" : "Start one this month"}
            />
            <BottomCard
              icon={<FaStopwatch size={13} />}
              iconBg="bg-emerald-500"
              gradient="from-emerald-50 to-teal-50"
              title="Reaction Avg"
              value={`${Math.round(reactionMs)}ms`}
              sub={speedTier !== "—" ? speedTier : null}
            />
            <BottomCard
              icon={<FiClock size={13} />}
              iconBg="bg-violet-500"
              gradient="from-violet-50 to-purple-50"
              title="Peak Focus"
              value={peakFocusWindow?.label ?? "—"}
              sub={
                peakFocusWindow
                  ? `${peakFocusWindow.avgAccuracy}% accuracy`
                  : "Play more to unlock"
              }
            />
          </div>

          {/* INSIGHTS BANNER */}
          <div
            className="mt-4 rounded-2xl p-4 relative overflow-hidden flex items-center justify-between gap-4"
            style={{ background: "linear-gradient(120deg, #fdf2f8, #ede9fe)" }}
          >
            <div className="flex items-start gap-2.5 relative z-10 max-w-lg">
              <FiStar
                className="mt-0.5 shrink-0"
                size={15}
                style={{ color: "#f59e0b" }}
              />
              <div>
                <div className="text-[8px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-1">
                  Insights
                </div>
                <p className="text-[12px] leading-relaxed text-zinc-700 font-medium line-clamp-2">
                  {insightCopy}
                </p>
              </div>
            </div>
            <TargetGlyph />
          </div>
        </div>

        {/* FOOTER */}
        <div className="shrink-0 border-t border-zinc-200 px-9 py-3 bg-white flex items-center justify-center gap-2">
          <FiShield size={11} className="text-zinc-400" />
          <span className="text-[9px] text-zinc-400">
            Your data is private and secure. We will never share your
            information.
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTS
// ============================================

function MetricCard({ icon, label, value }) {
  return (
    <div className="bg-white/95 rounded-xl p-2 text-zinc-900">
      <div className="flex items-center justify-between">
        <div style={{ color: ACCENT }} className="text-sm">
          {icon}
        </div>
        <div className="text-[7px] uppercase text-zinc-400 font-bold tracking-wide">
          {label}
        </div>
      </div>
      <div className="text-base font-black mt-2 truncate">{value}</div>
    </div>
  );
}

function BottomCard({ icon, iconBg, gradient, title, value, sub }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-3`}>
      <div
        className={`w-6 h-6 rounded-full ${iconBg} text-white flex items-center justify-center mb-2`}
      >
        {icon}
      </div>
      <div className="text-[7px] uppercase tracking-[0.15em] text-zinc-500 font-bold">
        {title}
      </div>
      <div className="text-lg font-black mt-1.5 leading-none text-zinc-900 truncate">
        {value}
      </div>
      {sub && (
        <div className="text-[8.5px] text-zinc-600 font-semibold mt-1.5 truncate">
          {sub}
        </div>
      )}
    </div>
  );
}
