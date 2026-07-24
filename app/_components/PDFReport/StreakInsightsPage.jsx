"use client";

import React from "react";
import {
  FiAward,
  FiCalendar,
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiZap,
  FiShield,
  FiStar,
} from "react-icons/fi";

const ACCENT = "#570df8";
const ACCENT_PINK = "#ec4899";

// ============================================
// HELPERS
// ============================================

/** Returns { year, month (0-indexed) } for the previous calendar month */
function getReportMonth() {
  const now = new Date();
  let month = now.getMonth() - 1;
  let year = now.getFullYear();
  if (month < 0) {
    month = 11;
    year -= 1;
  }
  return { year, month };
}

/** Filter gameData to only games played in the given year/month */
function filterToMonth(gameData = [], year, month) {
  return gameData.filter((g) => {
    const d = new Date(g.created_at);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

// Local calendar-day key, consistent with Heatmap.jsx's fix — avoids
// mixing UTC/local timezone references, which used to make a session
// near midnight attributable to a different day depending on viewer TZ.
function dayKey(isoString) {
  const d = new Date(isoString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Pure date-string arithmetic, UTC-anchored throughout, so this never
// mixes with the local getters used in dayKey above.
function addDays(key, delta) {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

/**
 * Given filtered game objects, compute:
 * - currentStreak  (consecutive days ending on the last day of the month)
 * - longestStreak  (longest consecutive-day run within the month)
 */
function computeStreaks(gameData = []) {
  if (!gameData.length) return { currentStreak: 0, longestStreak: 0 };

  const dates = [...new Set(gameData.map((g) => dayKey(g.created_at)))].sort();
  const dateSet = new Set(dates);

  let longest = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] === addDays(dates[i - 1], 1)) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  let current = 0;
  let check = dates[dates.length - 1];
  while (dateSet.has(check)) {
    current++;
    check = addDays(check, -1);
  }

  return { currentStreak: current, longestStreak: Math.max(longest, current) };
}

// ============================================
// MAIN
// ============================================

export default function StreakInsightsPage({ user, analytics }) {
  const rawStats = analytics?.rawStats || {};
  const brainMetrics = analytics?.brainMetrics || {};
  const focusMetrics = analytics?.focusMetrics || {};
  const trends = analytics?.trends || {};
  const insights = analytics?.insights || [];
  const gameData = analytics?.gameData || [];
  const fullName = user?.user?.name?.trim() || "";
  const userInitial = (fullName[0] || "?").toUpperCase();

  // ── Scope to last calendar month only ────────────────────────────────────
  const { year: reportYear, month: reportMonth } = getReportMonth();
  const reportMonthName = new Date(reportYear, reportMonth).toLocaleString(
    "default",
    {
      month: "long",
    },
  );

  const monthGames = filterToMonth(gameData, reportYear, reportMonth);

  // ── Streaks (month-scoped) ────────────────────────────────────────────────
  const { currentStreak, longestStreak } = computeStreaks(monthGames);
  const daysToRecord = Math.max(0, longestStreak - currentStreak);

  // ── Other derived values ─────────────────────────────────────────────────
  const consistency = brainMetrics.consistency ?? 0;
  const peakWindow = focusMetrics.peakFocusWindow?.label ?? null;
  const focusEndurance = focusMetrics.focusEndurance ?? "—";
  const reactionTrend = trends.reactionTrend ?? 0;
  const accuracyTrend = trends.accuracyTrend ?? 0;
  const totalGames = monthGames.length;

  const streakGrowthLabel =
    reactionTrend > 0
      ? `${reactionTrend}ms faster`
      : accuracyTrend > 0
        ? `+${accuracyTrend}% accuracy`
        : reactionTrend < 0 || accuracyTrend < 0
          ? "Building back up"
          : "—";

  const consistencyClaim =
    consistency >= 80
      ? "indicating strong habit formation and excellent commitment to cognitive training"
      : consistency >= 60
        ? "showing solid, developing consistency in your training habits"
        : consistency > 0
          ? "showing room to build a more consistent training habit"
          : "with more sessions needed to establish a consistency baseline";

  const analysisInsights = insights.slice(0, 2);

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
                {reportMonthName} {reportYear} · Advanced Analytics
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
                  Streak
                </span>
                <br />
                <span className="text-zinc-900">Insights</span>
              </h1>
            </div>
            <div
              className="w-11 h-11 rounded-2xl text-white flex items-center justify-center shadow-lg shrink-0"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_PINK})`,
                boxShadow: `0 8px 20px ${ACCENT}40`,
              }}
            >
              <FiTrendingUp className="text-lg" />
            </div>
          </div>

          {/* WHY STREAKS MATTER */}
          <div className="mt-4 border border-zinc-200 bg-zinc-50 rounded-2xl p-4">
            <div className="text-[8px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
              Why Streaks Matter
            </div>
            <h2 className="text-lg font-black mt-1.5">
              Consistency Creates Long-Term Gains
            </h2>
            <div className="grid grid-cols-2 gap-2.5 mt-3.5">
              <ImpactCard
                icon={<FiTarget />}
                title="Better Focus"
                desc={
                  focusEndurance !== "—"
                    ? `Regular training improves attention stability. Your focus endurance in ${reportMonthName} is ${focusEndurance}.`
                    : "Regular training improves attention stability over time."
                }
                accent={ACCENT}
              />
              <ImpactCard
                icon={<FiZap />}
                title="Faster Reactions"
                desc={`Consistent repetition sharpens neural timing.${reactionTrend > 0 ? ` You're ${reactionTrend}ms faster this period.` : ""}`}
                accent="#f59e0b"
              />
              <ImpactCard
                icon={<FiClock />}
                title="Reduced Fatigue"
                desc="Stable routines reduce cognitive overload over time."
                accent="#38bdf8"
              />
              <ImpactCard
                icon={<FiTrendingUp />}
                title="Stable Growth"
                desc={`Long streaks drive measurable gains.${accuracyTrend > 0 ? ` Accuracy is up +${accuracyTrend}% in ${reportMonthName}.` : ""}`}
                accent="#10b981"
              />
            </div>
          </div>

          {/* METRICS */}
          <div className="grid grid-cols-4 gap-2.5 mt-4">
            <MetricCard
              icon={<FiCalendar />}
              label="Sessions"
              value={totalGames > 0 ? `${totalGames}` : "—"}
              accent={ACCENT}
            />
            <MetricCard
              icon={<FiAward />}
              label={`${reportMonthName} Best`}
              value={longestStreak > 0 ? `${longestStreak}D` : "—"}
              accent={ACCENT_PINK}
            />
            <MetricCard
              icon={<FiClock />}
              label="Peak Window"
              value={peakWindow ?? "—"}
              accent="#f59e0b"
            />
            <MetricCard
              icon={<FiTrendingUp />}
              label="Progress"
              value={streakGrowthLabel}
              accent="#10b981"
            />
          </div>

          {/* ADVANCED ANALYSIS */}
          <div className="mt-4 border border-zinc-200 bg-zinc-50 rounded-2xl p-4">
            <div className="text-[8px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
              {reportMonthName} Streak Intelligence
            </div>
            <h2 className="text-base font-black mt-1.5">
              Long-Term Consistency Analysis
            </h2>
            <p className="mt-2.5 text-[12px] text-zinc-600 leading-relaxed line-clamp-4">
              Across <strong>{totalGames} sessions</strong> in{" "}
              <strong>{reportMonthName}</strong>, your consistency score is{" "}
              <strong>{consistency}%</strong> — {consistencyClaim}.
              {longestStreak > 0
                ? ` Your longest active streak this month was ${longestStreak} day${longestStreak === 1 ? "" : "s"}.`
                : ""}
              {longestStreak >= 7
                ? " Streaks beyond 7 days tend to build stronger habits and more noticeable improvement."
                : " Keep building — momentum tends to compound past 7 consecutive days."}
            </p>
            {analysisInsights.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {analysisInsights.map((insight, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-[10.5px] text-zinc-600"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: [ACCENT, ACCENT_PINK][i % 2] }}
                    />
                    <span className="line-clamp-2">{insight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RECOMMENDATIONS */}
          <div className="mt-4">
            <div className="text-[8px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
              AI Recommendations
            </div>
            <div className="grid grid-cols-3 gap-2.5 mt-2.5">
              <RecommendationCard
                title="Protect Momentum"
                desc="Avoid missing the next 48 hours to preserve your behavioral momentum."
                accent={ACCENT}
              />
              <RecommendationCard
                title={
                  daysToRecord > 0 ? "Beat Your Record" : "Record Matched!"
                }
                desc={
                  daysToRecord > 0
                    ? `${daysToRecord} more consecutive day${daysToRecord === 1 ? "" : "s"} to match your ${reportMonthName} best streak of ${longestStreak} days.`
                    : `You matched your best streak of ${longestStreak} days in ${reportMonthName}. Keep going to set a new record!`
                }
                accent={ACCENT_PINK}
              />
              <RecommendationCard
                title="Peak Performance"
                desc={
                  peakWindow
                    ? `Your strongest training window in ${reportMonthName} is ${peakWindow}. Scheduling sessions here maximises your cognitive output.`
                    : "Play more sessions to reveal your strongest training window."
                }
                accent="#10b981"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="shrink-0 border-t border-zinc-200 px-9 py-2.5 bg-white flex items-center justify-between">
          <div className="flex items-start gap-2">
            <FiShield size={10} className="text-zinc-400 mt-0.5" />
            <div className="text-[8px] font-bold text-zinc-500">
              Consistency Intelligence Analytics™
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

// ============================================
// COMPONENTS
// ============================================

function MetricCard({ icon, label, value, accent = ACCENT }) {
  return (
    <div
      className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5"
      style={{ borderTopColor: accent, borderTopWidth: 2 }}
    >
      <div className="flex items-center justify-between">
        <div style={{ color: accent }}>{icon}</div>
        <div className="text-[7px] uppercase text-zinc-400 font-bold">
          {label}
        </div>
      </div>
      <div className="text-sm font-black mt-2 truncate">{value}</div>
    </div>
  );
}

function ImpactCard({ icon, title, desc, accent = ACCENT }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-3">
      <div
        className="w-8 h-8 rounded-lg text-white flex items-center justify-center"
        style={{ background: accent }}
      >
        {icon}
      </div>
      <div className="text-sm font-black mt-2.5">{title}</div>
      <p className="text-[10.5px] text-zinc-600 mt-1.5 leading-relaxed line-clamp-2">
        {desc}
      </p>
    </div>
  );
}

function RecommendationCard({ title, desc, accent = ACCENT }) {
  return (
    <div
      className="border border-zinc-200 bg-white rounded-xl p-3"
      style={{ borderTopColor: accent, borderTopWidth: 2 }}
    >
      <div className="font-black text-sm" style={{ color: accent }}>
        {title}
      </div>
      <p className="mt-1.5 text-[10.5px] text-zinc-600 leading-relaxed line-clamp-3">
        {desc}
      </p>
    </div>
  );
}
