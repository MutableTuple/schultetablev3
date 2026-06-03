"use client";

import React from "react";

import {
  FiActivity,
  FiAlertTriangle,
  FiCalendar,
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

// ============================================
// MAIN
// ============================================
const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const intensityColors = [
  "#e4e4e7", // 0 games
  "#fde68a", // low  — amber
  "#34d399", // medium — emerald
  "#38bdf8", // high — sky
  "#570df8", // elite — purple
];

export default function Heatmap({ user, analytics }) {
  const rawStats = analytics?.rawStats || {};
  const brainMetrics = analytics?.brainMetrics || {};
  const focusMetrics = analytics?.focusMetrics || {};
  const speedMetrics = analytics?.speedMetrics || {};
  const mentalProfile = analytics?.mentalProfile || "Developing Player";
  const gameData = analytics?.gameData || [];

  // ── Derive "last calendar month" ──────────────────────────────────────────
  const now = new Date();

  let reportMonth = now.getMonth() - 1; // 0-indexed; June(5) → May(4)
  let reportYear = now.getFullYear();

  if (reportMonth < 0) {
    reportMonth = 11; // December of previous year
    reportYear -= 1;
  }

  const reportMonthName = new Date(reportYear, reportMonth).toLocaleString(
    "default",
    { month: "long" },
  );

  const daysInMonth = new Date(reportYear, reportMonth + 1, 0).getDate();

  // ── Filter gameData to ONLY games played in the report month ──────────────
  const lastMonthGames = gameData.filter((game) => {
    const d = new Date(game.created_at);
    return (
      d.getFullYear() === reportYear && d.getMonth() === reportMonth // 0-indexed
    );
  });

  // ── Build day buckets for every day of the report month ───────────────────
  const heatmapDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(reportYear, reportMonth, day);
    heatmapDays.push({
      date: d.toISOString().split("T")[0],
      count: 0,
    });
  }

  lastMonthGames.forEach((game) => {
    const gameDate = new Date(game.created_at).toISOString().split("T")[0];
    const dayBucket = heatmapDays.find((d) => d.date === gameDate);
    if (dayBucket) dayBucket.count += 1;
  });

  const maxGames = Math.max(...heatmapDays.map((d) => d.count), 1);

  const getIntensity = (count) => {
    if (count === 0) return 0;
    return Math.max(1, Math.min(4, Math.ceil((count / maxGames) * 4)));
  };

  // ── Split days into weeks (rows of 7) ─────────────────────────────────────
  const heatmapWeeks = [];
  for (let i = 0; i < heatmapDays.length; i += 7) {
    heatmapWeeks.push(heatmapDays.slice(i, i + 7));
  }

  // Use filtered count for display
  const sessionCount = lastMonthGames.length;

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
              Behavioral Heat Analysis
            </div>
            <h1 className="text-[38px] leading-[0.9] font-black mt-3">
              Performance
              <br />
              Heatmap
            </h1>
          </div>
          <div className="w-11 h-11 bg-[#570df8] text-white flex items-center justify-center">
            <FiActivity className="text-xl" />
          </div>
        </div>

        {/* INTRO */}
        <div className="mt-5 border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#ec4899] text-white flex items-center justify-center shrink-0">
              <FiTrendingUp className="text-sm" />
            </div>
            <div>
              <h2 className="text-lg font-black">
                Understand your strongest patterns.
              </h2>
              <p className="mt-2 text-[11px] text-zinc-600 leading-relaxed">
                Showing your full activity for{" "}
                <strong>
                  {reportMonthName} {reportYear}
                </strong>
                . Darker areas represent stronger focus and better consistency.
              </p>
            </div>
          </div>
        </div>

        {/* HEATMAP */}
        <div className="mt-4 border border-zinc-200 bg-zinc-50 p-4">
          {/* TOP */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="uppercase tracking-[0.2em] text-[8px] text-zinc-400">
                {reportMonthName} {reportYear} — Full Month Activity
              </div>
              <h2 className="text-lg font-black mt-2 leading-tight">
                {sessionCount > 0
                  ? `${sessionCount} training sessions recorded during ${reportMonthName}.`
                  : `No sessions recorded during ${reportMonthName}.`}
              </h2>
            </div>
            <div className="bg-[#f59e0b] text-white px-3 py-1.5 text-[9px] font-semibold shrink-0">
              {focusMetrics?.focusEndurance || "Advanced"}
            </div>
          </div>

          {/* DAY LABELS */}
          <div className="grid grid-cols-7 gap-2 mt-5">
            {labels.map((day) => (
              <div
                key={day}
                className="text-center text-[8px] uppercase tracking-[0.1em] text-zinc-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* GRID */}
          <div className="space-y-2 mt-2">
            {heatmapWeeks.map((week, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-2">
                {week.map((day, colIndex) => (
                  <div
                    key={`${day.date}-${colIndex}`}
                    className="w-full h-[58px] border border-zinc-200 relative overflow-hidden"
                    style={{
                      background: intensityColors[getIntensity(day.count)],
                    }}
                  >
                    {day.count > 0 && (
                      <>
                        <div className="absolute top-1 left-1 text-[7px] text-white font-bold opacity-80">
                          {new Date(day.date).getDate()}
                        </div>
                        <div className="absolute bottom-1 right-1 text-[8px] font-black text-white">
                          {day.count}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* LEGEND */}
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-400">Low Activity</span>
              {intensityColors.map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 border border-zinc-200"
                  style={{ background: color }}
                />
              ))}
              <span className="text-[9px] text-zinc-400">Peak Focus</span>
            </div>
            <div className="text-[10px] font-semibold text-[#570df8]">
              {sessionCount} Sessions Analysed
            </div>
          </div>

          {/* AI INSIGHT */}
          <div className="mt-5 border border-zinc-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#10b981] text-white flex items-center justify-center shrink-0">
                <FiTarget className="text-sm" />
              </div>
              <div className="flex-1">
                <div className="text-base font-black">
                  AI Behavioral Pattern Analysis
                </div>
                <p className="mt-2 text-[11px] text-zinc-600 leading-relaxed">
                  Across <span className="font-bold">{sessionCount}</span>{" "}
                  completed sessions in {reportMonthName}, you achieved a
                  consistency score of{" "}
                  <span className="font-bold">{brainMetrics.consistency}%</span>{" "}
                  and maintained{" "}
                  <span className="font-bold">
                    {focusMetrics.focusEndurance}
                  </span>{" "}
                  focus endurance.
                </p>
                <p className="mt-3 text-[11px] text-zinc-600 leading-relaxed">
                  Your Brain Score of{" "}
                  <span className="font-bold">{brainMetrics.brainScore}</span>,
                  Focus IQ of{" "}
                  <span className="font-bold">{brainMetrics.focusIQ}</span>, and
                  Flow State Score of{" "}
                  <span className="font-bold">
                    {brainMetrics.flowStateScore}
                  </span>{" "}
                  place you among the strongest performers on the platform.
                </p>
                <div className="mt-4 bg-[#570df8]/5 border border-[#570df8]/15 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-[#570df8] font-bold">
                    Mental Profile
                  </div>
                  <div className="text-lg font-black mt-1">{mentalProfile}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STRENGTHS */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#22c55e] text-white flex items-center justify-center">
                <FiZap className="text-sm" />
              </div>
              <div>
                <div className="uppercase tracking-[0.1em] text-[8px] text-zinc-400">
                  Mental Profile
                </div>
                <div className="text-lg font-black mt-1">{mentalProfile}</div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-zinc-600 leading-relaxed">
              Your performance profile indicates exceptional focus stability and
              competitive consistency.
            </p>
          </div>

          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#38bdf8] text-white flex items-center justify-center">
                <FiTarget className="text-sm" />
              </div>
              <div>
                <div className="uppercase tracking-[0.1em] text-[8px] text-zinc-400">
                  Focus Endurance
                </div>
                <div className="text-lg font-black mt-1">
                  {focusMetrics?.focusEndurance || "Advanced"}
                </div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-zinc-600 leading-relaxed">
              You maintain concentration levels for extended periods without
              measurable performance degradation.
            </p>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <MetricCard
            icon={<FiCalendar />}
            label="Games"
            value={sessionCount}
            accent="#570df8"
          />
          <MetricCard
            icon={<FiTarget />}
            label="Focus IQ"
            value={brainMetrics?.focusIQ || 0}
            accent="#ec4899"
          />
          <MetricCard
            icon={<FiClock />}
            label="Reaction"
            value={`${speedMetrics?.bestReactionTime || 0}ms`}
            accent="#f59e0b"
          />
          <MetricCard
            icon={<FiTrendingUp />}
            label="Brain Score"
            value={brainMetrics?.brainScore || 0}
            accent="#10b981"
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 w-full border-t border-zinc-200 px-10 py-2 bg-white">
        <div className="flex items-center justify-between text-[8px] text-zinc-400">
          <div>Behavioral Intelligence Analytics™</div>
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
