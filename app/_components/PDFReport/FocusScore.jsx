"use client";

import React from "react";

import {
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiTarget,
  FiTrendingUp,
  FiZap,
  FiShield,
  FiStar,
} from "react-icons/fi";
import { FaRocket } from "react-icons/fa";

import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

// ============================================
// LOCAL PALETTE — same accent as CoverPage.jsx, kept consistent across
// every page in this report.
// ============================================
const ACCENT = "#570df8";
const ACCENT_BLUE = "#3b82f6";
const ACCENT_PINK = "#ec4899";

// ============================================
// SMALL REUSABLE SPARKLINE — built from real per-game values passed in,
// not decorative fake data.
// ============================================
function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  const w = 100,
    h = 24,
    pad = 2;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return [x, y];
  });
  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0]},${h} L${points[0][0]},${h} Z`;
  const gradId = `spark-${color.replace("#", "")}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-6 mt-1.5"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} stroke="none" />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ============================================
// DECORATIVE INLINE SVGS — no external image dependency. Sized down
// slightly from the previous pass to help everything fit within the
// fixed A4 page height.
// ============================================

function BrainOrbitGlyph() {
  return (
    <svg width="72" height="72" viewBox="0 0 92 92" className="shrink-0">
      <defs>
        <radialGradient id="brainGlow2" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#4c1d95" />
        </radialGradient>
      </defs>
      <ellipse
        cx="46"
        cy="46"
        rx="40"
        ry="16"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="1.5"
        opacity="0.5"
        transform="rotate(-15 46 46)"
      />
      <path
        d="M46 20c-13 0-23 9.5-23 19 0 5.5 2.5 10 6.5 13.5-1.5 3-1.5 7 .5 10 2 3 6 4.5 10 4 1 2.5 2.5 4 3 4 1.5 0 3-1.5 4-4 4 .5 8-1 10-4 2-3 2-7 .5-10 4-3.5 6.5-8 6.5-13.5 0-9.5-10-19-23-19Z"
        fill="url(#brainGlow2)"
        opacity="0.95"
      />
      <path
        d="M46 20c0 6-4 10-8 13M46 20c0 6 4 10 8 13M27 44c4.5-2 9-1.5 14-1M45.5 43c4.5-1 9-1.5 14 1"
        stroke="#ede9fe"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      <circle cx="76" cy="24" r="2.5" fill="#c4b5fd" />
      <circle cx="14" cy="60" r="1.8" fill="#a78bfa" />
      <path
        d="M72 62l1.5 3.5L77 67l-3.5 1.5L72 72l-1.5-3.5L67 67l3.5-1.5Z"
        fill="#c4b5fd"
        opacity="0.8"
      />
    </svg>
  );
}

function SpeedometerGlyph({ color = "#8b5cf6" }) {
  return (
    <svg width="56" height="46" viewBox="0 0 72 60" className="shrink-0">
      <path
        d="M8 52A28 28 0 0 1 64 52"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.25"
      />
      <path
        d="M8 52A28 28 0 0 1 46 26"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <line
        x1="36"
        y1="52"
        x2="52"
        y2="34"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="36" cy="52" r="4" fill={color} />
    </svg>
  );
}

function TargetArrowGlyph({ color = "#3b82f6" }) {
  return (
    <svg width="54" height="54" viewBox="0 0 72 72" className="shrink-0">
      <circle
        cx="36"
        cy="36"
        r="32"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        opacity="0.35"
      />
      <circle
        cx="36"
        cy="36"
        r="21"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        opacity="0.55"
      />
      <circle
        cx="36"
        cy="36"
        r="10"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        opacity="0.8"
      />
      <circle cx="36" cy="36" r="3.5" fill={color} />
      <line
        x1="14"
        y1="58"
        x2="28"
        y2="44"
        stroke="#1e3a8a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M10 62l4.5-1.5-1.5 4.5-3-3Z" fill="#1e3a8a" />
    </svg>
  );
}

function ShieldCheckGlyph({ color = "#10b981" }) {
  return (
    <svg width="48" height="54" viewBox="0 0 64 72" className="shrink-0">
      <path
        d="M32 4l24 9v18c0 17-10 29-24 37C18 60 8 48 8 31V13Z"
        fill={color}
        opacity="0.18"
      />
      <path
        d="M32 4l24 9v18c0 17-10 29-24 37C18 60 8 48 8 31V13Z"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
      <path
        d="M21 33l8 8 15-16"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BarChartArrowGlyph({ color = "#f59e0b" }) {
  return (
    <svg width="58" height="48" viewBox="0 0 76 64" className="shrink-0">
      <rect
        x="6"
        y="40"
        width="10"
        height="18"
        rx="2"
        fill={color}
        opacity="0.4"
      />
      <rect
        x="22"
        y="30"
        width="10"
        height="28"
        rx="2"
        fill={color}
        opacity="0.6"
      />
      <rect
        x="38"
        y="18"
        width="10"
        height="40"
        rx="2"
        fill={color}
        opacity="0.8"
      />
      <rect x="54" y="6" width="10" height="52" rx="2" fill={color} />
      <path
        d="M50 10l16-4-2 16"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ============================================
// HERO HEADLINE — split into pre/highlight/post so one phrase can be
// gradient-colored while the rest stays black, driven by the real score.
// ============================================
function getHeroHeadline(focusScore) {
  if (focusScore >= 85) {
    return {
      pre: "Your focus performance is ",
      highlight: "significantly",
      post: " above average.",
    };
  }
  if (focusScore >= 70) {
    return {
      pre: "Your focus performance is ",
      highlight: "above",
      post: " the global average.",
    };
  }
  return {
    pre: "You are building ",
    highlight: "strong",
    post: " focus fundamentals.",
  };
}

export default function FocusScore({ user, analytics }) {
  const {
    rawStats,
    brainMetrics,
    speedMetrics,
    focusMetrics,
    trends,
    rankings,
    insights,
    gameData,
  } = analytics || {};

  // ── Values ─────────────────────────────────────────────────────────────────
  const focusScore = brainMetrics?.brainScore ?? 0;
  const consistency = brainMetrics?.consistency ?? 0;
  const reactionMs = rawStats?.avgReactionTime ?? 0;
  const percentile = rankings?.percentile ?? null;
  const focusEndurance = focusMetrics?.focusEndurance ?? "—";
  const attentionDrift = focusMetrics?.attentionDrift ?? 0;
  const hesitation = focusMetrics?.hesitationIndex ?? 0;
  const accuracyTrend = trends?.accuracyTrend ?? null;
  const reactionTrend = trends?.reactionTrend ?? null;
  const speedTier = speedMetrics?.speedTier ?? "—";
  const avgAccuracy = rawStats?.avgAccuracy ?? 0;

  const fullName = user?.user?.name?.trim() || "";
  const userInitial = (fullName[0] || "?").toUpperCase();

  // Real per-game series for sparklines (oldest → newest, last 10 games)
  const recentGames = (gameData ?? []).slice(0, 10).reverse();
  const reactionSeries = recentGames
    .map((g) => g.avg_reaction_ms)
    .filter((v) => v > 0);
  const accuracySeries = recentGames
    .map((g) => g.accuracy)
    .filter((v) => v != null);

  // Focus level label from brainScore
  const focusLevel =
    focusScore >= 90
      ? "Elite"
      : focusScore >= 75
        ? "Advanced"
        : focusScore >= 60
          ? "Developing"
          : "Beginner";

  // Distraction label derived from hesitation + attentionDrift
  const distractionLabel =
    hesitation < 0.3 && attentionDrift > 80
      ? "Very Low"
      : hesitation < 0.6 && attentionDrift > 65
        ? "Low"
        : hesitation < 1.2
          ? "Moderate"
          : "High";

  const improvementLabel =
    accuracyTrend != null
      ? `${accuracyTrend > 0 ? "+" : ""}${accuracyTrend}%`
      : reactionTrend != null
        ? `${reactionTrend > 0 ? "+" : ""}${reactionTrend}ms`
        : "—";

  const percentileDisplay =
    percentile != null ? 100 - Math.round(percentile) : null;

  const radialData = [
    { name: "Focus", value: focusScore, fill: "url(#focusGradient)" },
  ];

  const aiInsight =
    insights?.[0] ??
    (avgAccuracy > 93
      ? "Your sessions show strong concentration stability with low distraction spikes."
      : "Focus on reducing hesitation pauses to push your score higher.");

  const heroHeadline = getHeroHeadline(focusScore);

  // Impact cards — kept to one short sentence each on purpose now, with
  // line-clamp-2 as a hard backstop against any future longer copy.
  const processingDesc =
    reactionMs > 0
      ? reactionMs < 450
        ? `You react in ${Math.round(reactionMs)}ms on average — a quick, competitive pace.`
        : `Your ${Math.round(reactionMs)}ms average reaction time has room to improve.`
      : "Play a few sessions to reveal your reaction speed profile.";

  const attentionDesc =
    focusEndurance === "Elite" || focusEndurance === "Strong"
      ? `${focusEndurance} endurance — your focus stays stable across the full session.`
      : "Your focus starts to drift in longer sessions.";

  const errorDesc =
    avgAccuracy >= 93
      ? `${avgAccuracy.toFixed(1)}% accuracy — errors are rare for you.`
      : `Improving accuracy from ${avgAccuracy.toFixed(1)}% is your key lever.`;

  const growthDesc =
    accuracyTrend != null && accuracyTrend > 0
      ? `Accuracy improved ${accuracyTrend}% — your consistency is trending up.`
      : reactionTrend != null && reactionTrend > 0
        ? `You're ${reactionTrend}ms faster than earlier this period.`
        : "Keep building session volume to unlock stronger trends.";

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
        <div className="flex-1 px-9 pt-8">
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
                Cognitive Breakdown
              </div>
              <h1 className="text-[42px] leading-[0.9] font-black mt-3 tracking-[-0.03em]">
                <span
                  style={{
                    background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_BLUE})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Focus
                </span>
                <br />
                <span className="text-zinc-900">Score</span>
              </h1>
            </div>

            <div
              className="w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-lg shrink-0"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_BLUE})`,
                boxShadow: `0 8px 20px ${ACCENT}40`,
              }}
            >
              <FiTarget className="text-xl" />
            </div>
          </div>

          {/* HERO */}
          <div className="grid grid-cols-[190px_1fr] gap-6 mt-5 items-center">
            {/* CHART */}
            <div className="flex justify-center">
              <div className="relative w-[160px] h-[160px]">
                <div
                  className="absolute inset-3 rounded-full blur-2xl opacity-25"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_PINK})`,
                  }}
                />
                <span className="absolute -top-1 left-5 w-1.5 h-1.5 rounded-full bg-violet-300" />
                <span className="absolute top-6 -right-1 w-1 h-1 rounded-full bg-violet-300" />
                <span className="absolute bottom-1 -left-2 w-1 h-1 rounded-full bg-violet-300" />

                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="74%"
                    outerRadius="100%"
                    data={radialData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <defs>
                      <linearGradient
                        id="focusGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={ACCENT} />
                        <stop offset="100%" stopColor={ACCENT_PINK} />
                      </linearGradient>
                    </defs>
                    <RadialBar background dataKey="value" cornerRadius={20} />
                  </RadialBarChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-black">{focusScore}</div>
                  <div
                    className="mt-1.5 rounded-full text-white px-2.5 py-0.5 text-[9px] font-bold"
                    style={{
                      background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_PINK})`,
                    }}
                  >
                    {focusLevel}
                  </div>
                </div>
              </div>
            </div>

            {/* TEXT */}
            <div>
              {percentileDisplay != null ? (
                <div
                  className="inline-flex items-center gap-1.5 rounded-full text-white px-3 py-1.5 text-[10px] font-bold"
                  style={{
                    background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_BLUE})`,
                  }}
                >
                  <FaRocket size={9} />
                  Top {percentileDisplay}% Worldwide
                </div>
              ) : (
                <div
                  className="inline-flex items-center gap-1.5 rounded-full text-white px-3 py-1.5 text-[10px] font-bold"
                  style={{
                    background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_BLUE})`,
                  }}
                >
                  <FaRocket size={9} />
                  {speedTier} Speed Tier
                </div>
              )}

              <h2 className="text-[24px] font-black leading-tight mt-3">
                {heroHeadline.pre}
                <span
                  style={{
                    background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_BLUE})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {heroHeadline.highlight}
                </span>
                {heroHeadline.post}
              </h2>

              <p className="text-zinc-600 text-[12.5px] leading-relaxed mt-2.5 line-clamp-2">
                Focus Score measures how efficiently you maintain concentration
                while visually scanning and reacting under pressure.
              </p>

              {/* AI INSIGHT */}
              <div className="mt-3.5 border border-zinc-200 bg-zinc-50 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl text-white flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_BLUE})`,
                    }}
                  >
                    <FiCpu className="text-base" />
                  </div>
                  <div>
                    <div className="font-black text-sm">AI Insight</div>
                    <p className="mt-1 text-zinc-600 text-[11px] leading-relaxed max-w-[240px] line-clamp-2">
                      {aiInsight}
                    </p>
                  </div>
                </div>
                <BrainOrbitGlyph />
              </div>
            </div>
          </div>

          {/* IMPACT */}
          <div className="mt-5 border border-zinc-200 bg-zinc-50 rounded-2xl p-4">
            <div className="text-[9px] uppercase tracking-[0.25em] text-zinc-400 font-bold">
              Real World Impact
            </div>
            <h2 className="text-xl font-black mt-2">
              What this means for you.
            </h2>

            <div className="grid grid-cols-2 gap-2.5 mt-3.5">
              <ImpactCard
                icon={<FiZap />}
                iconBg="bg-violet-500"
                title="Fast Processing"
                desc={processingDesc}
                illustration={<SpeedometerGlyph color="#8b5cf6" />}
              />
              <ImpactCard
                icon={<FiClock />}
                iconBg="bg-blue-500"
                title="Long Attention"
                desc={attentionDesc}
                illustration={<TargetArrowGlyph color="#3b82f6" />}
              />
              <ImpactCard
                icon={<FiCheckCircle />}
                iconBg="bg-emerald-500"
                title="Low Errors"
                desc={errorDesc}
                illustration={<ShieldCheckGlyph color="#10b981" />}
              />
              <ImpactCard
                icon={<FiTrendingUp />}
                iconBg="bg-amber-500"
                title="Stable Growth"
                desc={growthDesc}
                illustration={<BarChartArrowGlyph color="#f59e0b" />}
              />
            </div>
          </div>

          {/* METRICS */}
          <div className="grid grid-cols-4 gap-2.5 mt-4">
            <MetricCard
              icon={<FiActivity />}
              label="Consistency"
              value={`${consistency}%`}
              sparkData={reactionSeries}
              sparkColor={ACCENT}
            />
            <MetricCard
              icon={<FiZap />}
              label="Reaction"
              value={`${Math.round(reactionMs)}ms`}
              sparkData={reactionSeries}
              sparkColor={ACCENT}
            />
            <MetricCard
              icon={<FiTrendingUp />}
              label="Growth"
              value={improvementLabel}
              sparkData={accuracySeries}
              sparkColor="#22c55e"
            />
            <MetricCard
              icon={<FiAlertCircle />}
              label="Distraction"
              value={distractionLabel}
              sparkData={null}
              sparkColor="#f59e0b"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="shrink-0 border-t border-zinc-200 px-9 py-3 bg-white flex items-center justify-between">
          <div className="flex items-start gap-2">
            <FiShield size={11} className="text-zinc-400 mt-0.5" />
            <div>
              <div className="text-[9px] font-bold text-zinc-500">
                Focus Intelligence Analytics™
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

function MetricCard({ icon, label, value, sparkData, sparkColor }) {
  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5">
      <div className="flex items-center justify-between">
        <div style={{ color: sparkColor }} className="text-sm">
          {icon}
        </div>
        <div className="text-[7px] uppercase text-zinc-400 font-bold tracking-wide">
          {label}
        </div>
      </div>
      <div className="text-base font-black mt-2 truncate">{value}</div>
      {sparkData?.length > 1 && (
        <Sparkline data={sparkData} color={sparkColor} />
      )}
    </div>
  );
}

function ImpactCard({ icon, iconBg, title, desc, illustration }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-3 relative overflow-hidden flex items-start justify-between gap-2">
      <div className="relative z-10 max-w-[62%]">
        <div
          className={`w-8 h-8 rounded-xl ${iconBg} text-white flex items-center justify-center`}
        >
          {icon}
        </div>
        <div className="text-sm font-black mt-2">{title}</div>
        <p className="text-[10px] text-zinc-600 leading-relaxed mt-1 line-clamp-2">
          {desc}
        </p>
      </div>
      <div className="opacity-90 shrink-0">{illustration}</div>
    </div>
  );
}
