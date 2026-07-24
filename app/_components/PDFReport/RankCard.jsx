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
  FiShield,
  FiStar,
} from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";

import { ResponsiveContainer, AreaChart, Area } from "recharts";

// ============================================
// LOCAL PALETTE — same accent as the rest of this report.
// ============================================
const ACCENT = "#570df8";
const ACCENT_BLUE = "#3b82f6";

function GlobeRingGlyph() {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 64 64"
      className="shrink-0 opacity-90"
    >
      <circle cx="32" cy="32" r="22" fill="rgba(255,255,255,0.12)" />
      <circle
        cx="32"
        cy="32"
        r="22"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
      />
      <ellipse
        cx="32"
        cy="32"
        rx="22"
        ry="9"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.2"
      />
      <path
        d="M32 10v44M12 22h40M12 42h40"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M52 14l1.5 3.5L57 19l-3.5 1.5L52 24l-1.5-3.5L47 19l3.5-1.5Z"
        fill="#fbbf24"
        opacity="0.9"
      />
    </svg>
  );
}

// Honest headline — only claims what the real trend data actually shows.
function getRankHeadline(scoreTrend, reactionTrend) {
  if (scoreTrend != null && scoreTrend > 0)
    return "Your score trend is climbing.";
  if (reactionTrend != null && reactionTrend > 0)
    return "Your reaction speed is climbing.";
  if (scoreTrend != null && scoreTrend < 0)
    return "Your score dipped a little this period.";
  return "Keep playing to build your score trend.";
}

export default function RankCard({ user, analytics }) {
  const {
    rawStats,
    rankings,
    brainMetrics,
    trends,
    speedMetrics,
    gameData,
    mentalProfile,
  } = analytics || {};

  // ── Values ──────────────────────────────────────────────────────────────
  const globalRank = rankings?.globalRank ?? null;
  const percentile = rankings?.percentile ?? null;
  const totalGames = rawStats?.totalGames ?? 0;
  const consistency = brainMetrics?.consistency ?? 0;
  const speedTier = speedMetrics?.speedTier ?? "—";
  const reactionTrend = trends?.reactionTrend ?? null;
  const scoreTrend = trends?.scoreTrend ?? null;
  const country = user?.user?.country ?? gameData?.[0]?.country ?? "—";
  const fullName = user?.user?.name?.trim() || "";
  const userInitial = (fullName[0] || "?").toUpperCase();

  const betterThan = percentile != null ? Math.round(percentile) : null;

  // Real score trend from actual game data — no invented "rank" formula,
  // no fake flat-line fallback when there's no data (just don't render it).
  const scoreTrendData = (() => {
    if (!gameData?.length) return [];
    return [...gameData]
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .slice(-8)
      .map((g) => ({ value: g.score || 0 }));
  })();

  const consistencyLabel =
    consistency >= 90
      ? "Elite"
      : consistency >= 75
        ? "High"
        : consistency >= 60
          ? "Moderate"
          : "Developing";

  const insightText =
    reactionTrend != null && reactionTrend > 0
      ? `Your reaction speed improved ${reactionTrend}ms this period — a strong driver of rank growth.`
      : scoreTrend != null && scoreTrend > 0
        ? `Your score improved ${scoreTrend}% this period — your trajectory suggests continued ranking growth.`
        : "Keep building session volume to accelerate your ranking progression.";

  const archetypeDesc =
    mentalProfile === "Elite Competitor"
      ? "Your performance pattern suggests elite sustained attention and fast visual scanning."
      : mentalProfile === "Precision Specialist"
        ? "Your performance pattern suggests exceptional accuracy with strong cognitive control."
        : mentalProfile === "Speed Demon"
          ? "Your performance pattern suggests rapid visual processing and fast decision making."
          : "Your performance pattern suggests strong sustained attention and visual scanning ability.";

  const rankHeadline = getRankHeadline(scoreTrend, reactionTrend);

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
                Competitive Analytics
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
                  Global
                </span>
                <br />
                <span className="text-zinc-900">Rank</span>
              </h1>
            </div>

            <div
              className="w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-lg shrink-0"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_BLUE})`,
                boxShadow: `0 8px 20px ${ACCENT}40`,
              }}
            >
              <FiAward className="text-xl" />
            </div>
          </div>

          {/* HERO */}
          <div className="grid grid-cols-[1fr_260px] gap-6 mt-5 items-start">
            {/* LEFT */}
            <div>
              {betterThan != null ? (
                <div
                  className="inline-flex rounded-full text-white px-3 py-1.5 text-[10px] font-bold"
                  style={{
                    background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_BLUE})`,
                  }}
                >
                  Top {100 - betterThan}% Worldwide
                </div>
              ) : (
                <div
                  className="inline-flex rounded-full text-white px-3 py-1.5 text-[10px] font-bold"
                  style={{
                    background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_BLUE})`,
                  }}
                >
                  {speedTier} Speed Tier
                </div>
              )}

              <h2 className="text-[58px] leading-none font-black mt-4 tracking-[-0.04em]">
                {globalRank != null ? `#${globalRank}` : "—"}
              </h2>

              <p className="text-[13px] text-zinc-600 leading-relaxed mt-4 max-w-md line-clamp-3">
                {betterThan != null ? (
                  <>
                    You currently rank higher than{" "}
                    <span className="font-bold" style={{ color: ACCENT }}>
                      {betterThan}% of players
                    </span>{" "}
                    globally.
                  </>
                ) : (
                  <>
                    Based on your{" "}
                    <span className="font-bold" style={{ color: ACCENT }}>
                      {totalGames} sessions
                    </span>{" "}
                    and {consistencyLabel.toLowerCase()} consistency, your
                    ranking is building steadily.
                  </>
                )}
              </p>

              {/* PLAYER ARCHETYPE */}
              <div className="mt-4 border border-zinc-200 bg-zinc-50 rounded-2xl p-4">
                <div className="text-[9px] uppercase tracking-[0.25em] text-zinc-400 font-bold">
                  Player Archetype
                </div>
                <div className="text-xl font-black mt-2">
                  {mentalProfile ?? "—"}
                </div>
                <p className="mt-2 text-[12px] text-zinc-600 leading-relaxed line-clamp-2">
                  {archetypeDesc}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              {/* SCORE GROWTH */}
              <div
                className="rounded-2xl p-4 text-white relative overflow-hidden flex items-start justify-between gap-2"
                style={{
                  background: `linear-gradient(145deg, #1e1b4b, ${ACCENT} 60%, ${ACCENT_BLUE})`,
                }}
              >
                <div className="relative z-10 min-w-0">
                  <div className="text-[9px] uppercase tracking-[0.2em] text-white/70 font-bold">
                    Score Growth
                  </div>
                  <div className="text-4xl font-black mt-2.5">
                    {scoreTrend != null
                      ? `${scoreTrend > 0 ? "+" : ""}${scoreTrend}%`
                      : "—"}
                  </div>
                  <div className="mt-2.5 text-[10.5px] leading-relaxed text-white/80 line-clamp-2">
                    {scoreTrend != null && scoreTrend > 0
                      ? "Your score is trending up this period."
                      : scoreTrend != null
                        ? "Your score held steady this period."
                        : "Play more sessions to start tracking your trend."}
                  </div>
                </div>
                <GlobeRingGlyph />
              </div>

              {/* MINI GRID */}
              <div className="grid grid-cols-2 gap-2.5 mt-3">
                <MiniCard
                  icon={<FiUsers size={13} />}
                  iconBg="bg-violet-500"
                  label="Sessions"
                  value={totalGames}
                />
                <MiniCard
                  icon={<FiGlobe size={13} />}
                  iconBg="bg-blue-500"
                  label="Country"
                  value={country}
                />
                <MiniCard
                  icon={<FiZap size={13} />}
                  iconBg="bg-amber-500"
                  label="Speed Tier"
                  value={speedTier}
                />
                <MiniCard
                  icon={<FiBarChart2 size={13} />}
                  iconBg="bg-emerald-500"
                  label="Consistency"
                  value={consistencyLabel}
                />
              </div>
            </div>
          </div>

          {/* CHART */}
          <div className="mt-5 border border-zinc-200 bg-zinc-50 rounded-2xl p-4">
            <div className="flex items-end justify-between gap-6">
              {/* TEXT */}
              <div className="max-w-md">
                <div className="text-[9px] uppercase tracking-[0.25em] text-zinc-400 font-bold">
                  Score Trend
                </div>

                <h2 className="text-xl font-black mt-2 leading-tight">
                  {rankHeadline}
                </h2>

                <p className="mt-2 text-[12px] text-zinc-600 leading-relaxed line-clamp-2">
                  Players with stable score progression usually demonstrate
                  stronger focus endurance and reaction consistency.
                </p>

                {/* INSIGHT */}
                <div className="flex items-start gap-2 mt-3">
                  <FiArrowUpRight
                    style={{ color: ACCENT }}
                    className="text-base mt-0.5 shrink-0"
                  />
                  <div className="text-[12px] font-semibold leading-relaxed line-clamp-2">
                    {insightText}
                  </div>
                </div>
              </div>

              {/* CHART */}
              {scoreTrendData.length > 1 ? (
                <div className="w-[220px] h-[110px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scoreTrendData}>
                      <defs>
                        <linearGradient
                          id="scoreTrendGrad"
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
                        dataKey="value"
                        stroke={ACCENT}
                        strokeWidth={3}
                        fill="url(#scoreTrendGrad)"
                        dot={{ r: 3, fill: ACCENT, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="w-[220px] h-[110px] shrink-0 flex items-center justify-center text-[11px] text-zinc-400 text-center px-4">
                  Play a few more sessions to unlock your score trend chart.
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM */}
          <div className="grid grid-cols-3 gap-2.5 mt-5">
            <BottomCard
              icon={<FaTrophy size={13} />}
              iconBg="bg-blue-500"
              gradient="from-blue-50 to-indigo-50"
              title="Global Rank"
              value={globalRank != null ? `#${globalRank}` : "—"}
              desc="Worldwide leaderboard position."
            />
            <BottomCard
              icon={<FiUsers size={13} />}
              iconBg="bg-violet-500"
              gradient="from-violet-50 to-purple-50"
              title="Players Beaten"
              value={betterThan != null ? `${betterThan}%` : "—"}
              desc="Higher than this share of active users."
            />
            <BottomCard
              icon={<FiGlobe size={13} />}
              iconBg="bg-emerald-500"
              gradient="from-emerald-50 to-teal-50"
              title="Country"
              value={country}
              desc="Based on your registered region."
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="shrink-0 border-t border-zinc-200 px-9 py-3 bg-white flex items-center justify-between">
          <div className="flex items-start gap-2">
            <FiShield size={11} className="text-zinc-400 mt-0.5" />
            <div>
              <div className="text-[9px] font-bold text-zinc-500">
                Competitive Intelligence Analytics™
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

function MiniCard({ icon, iconBg, label, value }) {
  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5">
      <div
        className={`w-6 h-6 rounded-lg ${iconBg} text-white flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="text-[7px] uppercase text-zinc-400 font-bold tracking-wide mt-2">
        {label}
      </div>
      <div className="text-base font-black mt-1 truncate">{value}</div>
    </div>
  );
}

function BottomCard({ icon, iconBg, gradient, title, value, desc }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-3.5`}>
      <div
        className={`w-7 h-7 rounded-full ${iconBg} text-white flex items-center justify-center mb-2.5`}
      >
        {icon}
      </div>
      <div className="text-[8px] uppercase tracking-[0.15em] text-zinc-500 font-bold">
        {title}
      </div>
      <div className="text-xl font-black mt-1.5 leading-none text-zinc-900 truncate">
        {value}
      </div>
      <p className="text-[9px] text-zinc-600 leading-relaxed mt-1.5 line-clamp-2">
        {desc}
      </p>
    </div>
  );
}
