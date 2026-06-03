"use client";

import React from "react";
import {
  FiAward,
  FiCalendar,
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

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

/**
 * Given filtered game objects, compute:
 * - currentStreak  (consecutive days ending on the last day of the month)
 * - longestStreak  (longest consecutive-day run within the month)
 */
function computeStreaks(gameData = []) {
  if (!gameData.length) return { currentStreak: 0, longestStreak: 0 };

  const dates = [
    ...new Set(
      gameData.map((g) => new Date(g.created_at).toISOString().split("T")[0]),
    ),
  ].sort();

  // Longest streak within the month
  let longest = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff =
      (new Date(dates[i]) - new Date(dates[i - 1])) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      run++;
      longest = Math.max(longest, run);
    } else run = 1;
  }

  // "Current" streak = streak ending on the last recorded date of the month
  const dateSet = new Set(dates);
  let current = 0;
  let check = new Date(dates[dates.length - 1]); // start from last played day
  while (dateSet.has(check.toISOString().split("T")[0])) {
    current++;
    check.setDate(check.getDate() - 1);
  }

  return { currentStreak: current, longestStreak: Math.max(longest, current) };
}

// ============================================
// MAIN
// ============================================

export default function StreakInsightsPage({ analytics }) {
  const rawStats = analytics?.rawStats || {};
  const brainMetrics = analytics?.brainMetrics || {};
  const focusMetrics = analytics?.focusMetrics || {};
  const trends = analytics?.trends || {};
  const insights = analytics?.insights || [];
  const gameData = analytics?.gameData || [];

  // ── Scope to last calendar month only ────────────────────────────────────
  const { year: reportYear, month: reportMonth } = getReportMonth();
  const reportMonthName = new Date(reportYear, reportMonth).toLocaleString(
    "default",
    { month: "long" },
  );

  const monthGames = filterToMonth(gameData, reportYear, reportMonth);

  // ── Streaks (month-scoped) ────────────────────────────────────────────────
  const { currentStreak, longestStreak } = computeStreaks(monthGames);
  const daysToRecord = Math.max(0, longestStreak - currentStreak);

  // ── Other derived values ─────────────────────────────────────────────────
  const consistency = brainMetrics.consistency ?? 0;
  const peakWindow = focusMetrics.peakFocusWindow?.label ?? "10AM – 12PM";
  const focusEndurance = focusMetrics.focusEndurance ?? "—";
  const reactionTrend = trends.reactionTrend ?? 0;
  const accuracyTrend = trends.accuracyTrend ?? 0;
  const totalGames = monthGames.length;

  const streakGrowthLabel =
    reactionTrend > 0
      ? `${reactionTrend}ms faster`
      : accuracyTrend > 0
        ? `+${accuracyTrend}% accuracy`
        : "Improving";

  const analysisInsights = insights.slice(0, 2);

  return (
    <div className="w-full h-full bg-white text-zinc-900 relative overflow-hidden">
      {/* LEFT STRIP */}
      <div className="absolute left-0 top-0 w-4 h-full bg-[#570df8]" />

      <div className="px-10 pt-8 pb-12">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <div className="uppercase tracking-[0.2em] text-[8px] text-zinc-400">
              {reportMonthName} {reportYear} · Advanced Analytics
            </div>
            <h1 className="text-[38px] leading-[0.9] font-black mt-3">
              Streak
              <br />
              Insights
            </h1>
          </div>
          <div className="w-11 h-11 bg-[#ec4899] text-white flex items-center justify-center">
            <FiTrendingUp className="text-xl" />
          </div>
        </div>

        {/* WHY STREAKS MATTER */}
        <div className="mt-8 border border-zinc-200 bg-zinc-50 p-5">
          <div className="uppercase tracking-[0.2em] text-[8px] text-zinc-400">
            Why Streaks Matter
          </div>
          <h2 className="text-2xl font-black mt-3">
            Consistency Creates Long-Term Gains
          </h2>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <ImpactCard
              icon={<FiTarget />}
              title="Better Focus"
              desc={`Regular training improves attention stability. Your focus endurance in ${reportMonthName} is ${focusEndurance}.`}
              accent="#570df8"
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
        <div className="grid grid-cols-4 gap-3 mt-6">
          <MetricCard
            icon={<FiCalendar />}
            label="Sessions"
            value={totalGames > 0 ? `${totalGames}` : "—"}
            accent="#570df8"
          />
          <MetricCard
            icon={<FiAward />}
            label={`${reportMonthName} Best`}
            value={longestStreak > 0 ? `${longestStreak}D` : "—"}
            accent="#ec4899"
          />
          <MetricCard
            icon={<FiClock />}
            label="Peak Window"
            value={peakWindow}
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
        <div className="mt-6 border border-zinc-200 bg-zinc-50 p-5">
          <div className="uppercase tracking-[0.2em] text-[8px] text-zinc-400">
            {reportMonthName} Streak Intelligence
          </div>
          <h2 className="text-xl font-black mt-3">
            Long-Term Consistency Analysis
          </h2>
          <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
            Across <strong>{totalGames} sessions</strong> in{" "}
            <strong>{reportMonthName}</strong>, your consistency score is{" "}
            <strong>{consistency}%</strong> — indicating strong habit formation
            and above-average commitment to cognitive training.
            {longestStreak > 0
              ? ` Your longest active streak this month was ${longestStreak} day${longestStreak === 1 ? "" : "s"}.`
              : ""}
            {longestStreak >= 7
              ? " Users maintaining streaks beyond 7 days show stronger engagement and greater improvement within the month."
              : " Keep building — the real gains kick in past 7 consecutive days."}
          </p>
          {analysisInsights.length > 0 && (
            <div className="mt-4 space-y-2">
              {analysisInsights.map((insight, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-[11px] text-zinc-600"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ background: ["#570df8", "#ec4899"][i % 2] }}
                  />
                  {insight}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RECOMMENDATIONS */}
        <div className="mt-6">
          <div className="uppercase tracking-[0.2em] text-[8px] text-zinc-400">
            AI Recommendations
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <RecommendationCard
              title="Protect Momentum"
              desc="Avoid missing the next 48 hours to preserve your behavioral momentum."
              accent="#570df8"
            />
            <RecommendationCard
              title={daysToRecord > 0 ? "Beat Your Record" : "Record Matched!"}
              desc={
                daysToRecord > 0
                  ? `Only ${daysToRecord} more day${daysToRecord === 1 ? "" : "s"} to surpass your ${reportMonthName} best streak of ${longestStreak} days.`
                  : `You matched your best streak of ${longestStreak} days in ${reportMonthName}. Keep going!`
              }
              accent="#ec4899"
            />
            <RecommendationCard
              title="Peak Performance"
              desc={`Your strongest training window in ${reportMonthName} is ${peakWindow}. Scheduling sessions here maximises your cognitive output.`}
              accent="#10b981"
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 w-full border-t border-zinc-200 px-10 py-2 bg-white">
        <div className="flex items-center justify-between text-[8px] text-zinc-400">
          <div>Consistency Intelligence Analytics™</div>
          <div>www.schultetable.com</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTS
// ============================================

function MetricCard({ icon, label, value, accent = "#570df8" }) {
  return (
    <div
      className="bg-zinc-50 border border-zinc-200 p-3"
      style={{ borderTopColor: accent, borderTopWidth: 2 }}
    >
      <div className="flex items-center justify-between">
        <div style={{ color: accent }}>{icon}</div>
        <div className="text-[7px] uppercase text-zinc-400">{label}</div>
      </div>
      <div className="text-sm font-black mt-3">{value}</div>
    </div>
  );
}

function ImpactCard({ icon, title, desc, accent = "#570df8" }) {
  return (
    <div className="bg-white border border-zinc-200 p-4">
      <div
        className="w-10 h-10 text-white flex items-center justify-center"
        style={{ background: accent }}
      >
        {icon}
      </div>
      <div className="text-sm font-black mt-4">{title}</div>
      <p className="text-[11px] text-zinc-600 mt-2 leading-relaxed">{desc}</p>
    </div>
  );
}

function RecommendationCard({ title, desc, accent = "#570df8" }) {
  return (
    <div
      className="border border-zinc-200 bg-white p-4"
      style={{ borderTopColor: accent, borderTopWidth: 2 }}
    >
      <div className="font-black text-sm" style={{ color: accent }}>
        {title}
      </div>
      <p className="mt-2 text-[11px] text-zinc-600 leading-relaxed">{desc}</p>
    </div>
  );
}
