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
  FiShield,
  FiStar,
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

const ACCENT = "#570df8";
const ACCENT_PINK = "#ec4899";

const DIST_COLORS = [ACCENT, "#e4e4e7"];

export default function ComparisonCard({ user, analytics }) {
  const rawStats = analytics?.rawStats || {};
  const brainMetrics = analytics?.brainMetrics || {};
  const focusMetrics = analytics?.focusMetrics || {};
  const speedMetrics = analytics?.speedMetrics || {};
  const trends = analytics?.trends || {};
  const rankings = analytics?.rankings || {};
  const gameData = analytics?.gameData || [];
  const fullName = user?.user?.name?.trim() || "";
  const userInitial = (fullName[0] || "?").toUpperCase();

  // ── Derived values ────────────────────────────────────────────────────────
  const globalRank = rankings.globalRank ?? "—";
  const percentile = rankings.percentile ?? null;
  const betterThanPct = percentile !== null ? Math.round(percentile) : null;
  const topXPct = percentile !== null ? 100 - Math.round(percentile) : null;

  const bestReaction = speedMetrics.bestReactionTime ?? null;
  const avgReaction = rawStats.avgReactionTime ?? 0;
  const totalGames = rawStats.totalGames ?? gameData.length ?? 0;
  const accuracy =
    rawStats.avgAccuracy != null ? Math.round(rawStats.avgAccuracy) : 0;
  const consistency = brainMetrics.consistency ?? 0;
  const speedTier = speedMetrics.speedTier ?? "—";
  const reactionTrend = trends.reactionTrend ?? 0;
  const accuracyTrend = trends.accuracyTrend ?? 0;

  // ── Radar — your real profile only, no fabricated "average player"
  // series (those used to be hardcoded 58/62/66/54/60 constants). ─────────
  const radarData = [
    {
      metric: "Focus",
      you: brainMetrics.focusIQ
        ? Math.min(100, Math.round(brainMetrics.focusIQ / 2.5))
        : 0,
    },
    {
      metric: "Reaction",
      you: speedMetrics.bestReactionTime
        ? Math.min(100, Math.round((800 - speedMetrics.bestReactionTime) / 6))
        : 0,
    },
    { metric: "Accuracy", you: accuracy },
    { metric: "Consistency", you: consistency },
    { metric: "Brain", you: Math.min(100, brainMetrics.brainScore ?? 0) },
  ];

  // ── Real score trend from actual game data — replaces a formula that
  // used to linearly interpolate from 50 to the current accuracy and
  // never actually read any real per-game value. ──────────────────────────
  const scoreTrendData = (() => {
    if (gameData.length < 2) return [];
    return [...gameData]
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .slice(-8)
      .map((g, i) => ({ day: String(i + 1), value: g.score ?? 0 }));
  })();

  // ── Distribution — only rendered when real percentile data exists.
  // No longer falls back to substituting accuracy for percentile. ─────────
  const distributionData =
    betterThanPct !== null
      ? [
          { name: "Below You", value: betterThanPct },
          { name: "Above You", value: Math.max(0, 100 - betterThanPct) },
        ]
      : null;

  const insightText = (() => {
    const parts = [];
    if (reactionTrend > 0)
      parts.push(`You're ${reactionTrend}ms faster than when you started.`);
    if (accuracyTrend > 0)
      parts.push(`Accuracy improved +${accuracyTrend}% this period.`);
    if (focusMetrics.focusEndurance) {
      parts.push(
        `Your strongest edge is ${focusMetrics.focusEndurance} focus endurance.`,
      );
    }
    return parts.length > 0
      ? parts.join(" ")
      : "Keep playing to build a clearer performance profile.";
  })();

  const scoreTrendHeadline =
    reactionTrend > 0
      ? `You're ${reactionTrend}ms faster — steady improvement.`
      : accuracyTrend > 0
        ? `Accuracy improved +${accuracyTrend}% — steady improvement.`
        : accuracyTrend < 0 || reactionTrend < 0
          ? "Performance dipped slightly this period — more sessions can help you rebound."
          : "Your performance is holding steady this period.";

  const scoreTrendBadge =
    accuracyTrend > 0
      ? `+${accuracyTrend}% Accuracy`
      : reactionTrend > 0
        ? `${reactionTrend}ms Faster`
        : "Building Momentum";

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
                Competitive Intelligence
              </div>
              <h1 className="text-[34px] leading-[0.9] font-black mt-3 tracking-[-0.03em]">
                <span
                  style={{
                    background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_PINK})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Community
                </span>
                <br />
                <span className="text-zinc-900">Comparison</span>
              </h1>
            </div>
            <div
              className="w-11 h-11 rounded-2xl text-white flex items-center justify-center shadow-lg shrink-0"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_PINK})`,
                boxShadow: `0 8px 20px ${ACCENT}40`,
              }}
            >
              <FiUsers className="text-lg" />
            </div>
          </div>

          {/* HERO */}
          <div className="grid grid-cols-[1fr_200px] gap-3.5 mt-4">
            {/* LEFT */}
            <div>
              {topXPct !== null ? (
                <div
                  className="inline-flex rounded-full text-white px-3 py-1.5 text-[9px] font-bold"
                  style={{
                    background: `linear-gradient(90deg, #f59e0b, ${ACCENT_PINK})`,
                  }}
                >
                  Top {topXPct}% Worldwide
                </div>
              ) : (
                <div
                  className="inline-flex rounded-full text-white px-3 py-1.5 text-[9px] font-bold"
                  style={{
                    background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_PINK})`,
                  }}
                >
                  Rank #{globalRank} Worldwide
                </div>
              )}

              {betterThanPct !== null ? (
                <>
                  <h2
                    className="text-[58px] leading-none font-black tracking-[-0.04em] mt-3"
                    style={{ color: ACCENT }}
                  >
                    {betterThanPct}%
                  </h2>
                  <div className="text-base font-black">
                    Better Than Players
                  </div>
                </>
              ) : (
                <>
                  <h2
                    className="text-[58px] leading-none font-black tracking-[-0.04em] mt-3"
                    style={{ color: ACCENT }}
                  >
                    #{globalRank}
                  </h2>
                  <div className="text-base font-black">Global Rank</div>
                </>
              )}

              <p className="text-[11.5px] text-zinc-600 leading-relaxed mt-3 line-clamp-2">
                {topXPct !== null ? (
                  <>
                    Your cognitive performance ranks in the{" "}
                    <span className="font-bold" style={{ color: ACCENT }}>
                      top {topXPct}%
                    </span>{" "}
                    of players globally, with a {accuracy}% accuracy average
                    across {totalGames} sessions.
                  </>
                ) : (
                  <>
                    Based on your {accuracy}% accuracy average across{" "}
                    <span className="font-bold" style={{ color: ACCENT }}>
                      {totalGames} sessions
                    </span>
                    , your global ranking is still building.
                  </>
                )}
              </p>

              {/* INSIGHT */}
              <div className="mt-3.5 border border-zinc-200 bg-zinc-50 rounded-2xl p-3.5">
                <div className="flex items-start gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0"
                    style={{ background: "#10b981" }}
                  >
                    <FiTrendingUp className="text-xs" />
                  </div>
                  <div>
                    <div className="text-sm font-black">
                      Competitive Insight
                    </div>
                    <p className="mt-1 text-[10.5px] text-zinc-600 leading-relaxed line-clamp-3">
                      {insightText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              {/* RANK CARD */}
              <div
                className="rounded-2xl p-3.5 text-white"
                style={{
                  background: `linear-gradient(145deg, #1e1b4b, ${ACCENT} 60%, ${ACCENT_PINK})`,
                }}
              >
                <div className="text-[8px] uppercase tracking-[0.2em] text-white/70 font-bold">
                  Global Rank
                </div>
                <div className="text-4xl font-black leading-none mt-2">
                  #{globalRank}
                </div>
                <div className="mt-2.5 text-[10px] leading-relaxed text-white/85 line-clamp-2">
                  Brain Score {brainMetrics.brainScore ?? "—"} · Focus IQ{" "}
                  {brainMetrics.focusIQ ?? "—"}
                </div>
              </div>

              {/* MINI CARDS */}
              <div className="grid grid-cols-2 gap-2 mt-2.5">
                <MiniCard
                  icon={<FiZap size={12} />}
                  label="Best RT"
                  value={bestReaction != null ? `${bestReaction}ms` : "—"}
                  accent="#f59e0b"
                />
                <MiniCard
                  icon={<FiActivity size={12} />}
                  label="Avg RT"
                  value={`${Math.round(avgReaction)}ms`}
                  accent="#38bdf8"
                />
                <MiniCard
                  icon={<FiAward size={12} />}
                  label="Tier"
                  value={speedTier}
                  accent={ACCENT_PINK}
                />
                <MiniCard
                  icon={<FiTarget size={12} />}
                  label="Accuracy"
                  value={`${accuracy}%`}
                  accent="#10b981"
                />
              </div>
            </div>
          </div>

          {/* RADAR + DISTRIBUTION */}
          <div className="grid grid-cols-2 gap-3.5 mt-4">
            {/* RADAR */}
            <div className="border border-zinc-200 bg-zinc-50 rounded-2xl p-3.5">
              <div className="text-[8px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                Skill Profile
              </div>
              <h2 className="text-sm font-black mt-1.5 line-clamp-1">
                Your performance across 5 key dimensions.
              </h2>
              <div className="h-[140px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 8 }} />
                    <Radar
                      dataKey="you"
                      stroke={ACCENT}
                      fill={ACCENT}
                      fillOpacity={0.35}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* DISTRIBUTION */}
            <div className="border border-zinc-200 bg-zinc-50 rounded-2xl p-3.5">
              <div className="text-[8px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                Player Distribution
              </div>
              {distributionData ? (
                <>
                  <h2 className="text-sm font-black mt-1.5 line-clamp-1">
                    {betterThanPct}% of players rank below you.
                  </h2>
                  <div className="h-[110px] mt-1.5">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distributionData}
                          dataKey="value"
                          innerRadius={28}
                          outerRadius={48}
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={index} fill={DIST_COLORS[index]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1 mt-1">
                    {distributionData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-[9px]"
                      >
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-2 h-2 rounded-sm"
                            style={{ background: DIST_COLORS[index] }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-bold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[150px] flex items-center justify-center text-center text-[10px] text-zinc-400 px-4">
                  Not enough ranking data yet — play a few more sessions to
                  unlock this.
                </div>
              )}
            </div>
          </div>

          {/* TREND */}
          <div className="mt-4 border border-zinc-200 bg-zinc-50 rounded-2xl p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[8px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                  Score Trend
                </div>
                <h2 className="text-sm font-black mt-1.5 line-clamp-1">
                  {scoreTrendHeadline}
                </h2>
              </div>
              <div
                className="rounded-full text-white px-2.5 py-1 text-[9px] font-bold shrink-0"
                style={{ background: "#10b981" }}
              >
                {scoreTrendBadge}
              </div>
            </div>

            {scoreTrendData.length > 1 ? (
              <div className="h-[100px] mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scoreTrendData}>
                    <defs>
                      <linearGradient
                        id="scoreTrendGrad2"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={ACCENT_PINK}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor={ACCENT_PINK}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={ACCENT_PINK}
                      strokeWidth={2.5}
                      fill="url(#scoreTrendGrad2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[80px] mt-3 flex items-center justify-center text-[10px] text-zinc-400 text-center px-4">
                Play a few more sessions to unlock your score trend.
              </div>
            )}
          </div>

          {/* METRICS */}
          <div className="grid grid-cols-4 gap-2 mt-3.5">
            <MetricCard
              icon={<FiUsers />}
              label="Sessions"
              value={totalGames}
              accent={ACCENT}
            />
            <MetricCard
              icon={<FiAward />}
              label="Brain Score"
              value={brainMetrics.brainScore ?? "—"}
              accent={ACCENT_PINK}
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
        <div className="shrink-0 border-t border-zinc-200 px-9 py-2.5 bg-white flex items-center justify-between">
          <div className="flex items-start gap-2">
            <FiShield size={10} className="text-zinc-400 mt-0.5" />
            <div className="text-[8px] font-bold text-zinc-500">
              Competitive Intelligence Analytics™
            </div>
          </div>
          <span className="text-[8px] font-semibold" style={{ color: ACCENT }}>
            www.schultetable.com
          </span>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ icon, label, value, accent = ACCENT }) {
  return (
    <div
      className="bg-zinc-50 border border-zinc-200 rounded-lg p-2"
      style={{ borderTopColor: accent, borderTopWidth: 2 }}
    >
      <div className="flex items-center justify-between">
        <div style={{ color: accent }}>{icon}</div>
        <div className="text-[7px] uppercase text-zinc-400 font-bold">
          {label}
        </div>
      </div>
      <div className="text-sm font-black mt-1.5 truncate">{value}</div>
    </div>
  );
}

function MetricCard({ icon, label, value, accent = ACCENT }) {
  return (
    <div
      className="bg-zinc-50 border border-zinc-200 rounded-xl p-2"
      style={{ borderTopColor: accent, borderTopWidth: 2 }}
    >
      <div className="flex items-center justify-between">
        <div style={{ color: accent }} className="text-xs">
          {icon}
        </div>
        <div className="text-[7px] uppercase text-zinc-400 font-bold">
          {label}
        </div>
      </div>
      <div className="text-xs font-black mt-1.5 leading-tight truncate">
        {value}
      </div>
    </div>
  );
}
