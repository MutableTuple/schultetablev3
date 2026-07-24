"use client";

import React from "react";

import {
  FiActivity,
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

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const intensityColors = [
  "#e4e4e7", // 0 games
  "#fde68a", // low
  "#34d399", // medium
  "#38bdf8", // high
  "#570df8", // most active
];

function dateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function Heatmap({ user, analytics }) {
  const rawStats = analytics?.rawStats || {};
  const brainMetrics = analytics?.brainMetrics || {};
  const focusMetrics = analytics?.focusMetrics || {};
  const speedMetrics = analytics?.speedMetrics || {};
  const mentalProfile = analytics?.mentalProfile || "—";
  const focusEndurance = focusMetrics?.focusEndurance || "—";
  const gameData = analytics?.gameData || [];
  const fullName = user?.user?.name?.trim() || "";
  const userInitial = (fullName[0] || "?").toUpperCase();

  // ── Derive "last calendar month" ──────────────────────────────────────────
  const now = new Date();
  let reportMonth = now.getMonth() - 1;
  let reportYear = now.getFullYear();
  if (reportMonth < 0) {
    reportMonth = 11;
    reportYear -= 1;
  }

  const reportMonthName = new Date(reportYear, reportMonth).toLocaleString(
    "default",
    {
      month: "long",
    },
  );
  const daysInMonth = new Date(reportYear, reportMonth + 1, 0).getDate();

  // ── Filter gameData to ONLY games played in the report month ──────────────
  const lastMonthGames = gameData.filter((game) => {
    const d = new Date(game.created_at);
    return d.getFullYear() === reportYear && d.getMonth() === reportMonth;
  });

  // ── Build day buckets, keyed with local getters throughout (not
  // toISOString) so results can't shift by a day depending on timezone. ────
  const dayBuckets = {};
  for (let day = 1; day <= daysInMonth; day++) {
    dayBuckets[dateKey(reportYear, reportMonth, day)] = { day, count: 0 };
  }
  lastMonthGames.forEach((game) => {
    const d = new Date(game.created_at);
    const key = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
    if (dayBuckets[key]) dayBuckets[key].count += 1;
  });

  const maxGames = Math.max(
    ...Object.values(dayBuckets).map((d) => d.count),
    1,
  );
  const getIntensity = (count) => {
    if (count === 0) return 0;
    return Math.max(1, Math.min(4, Math.ceil((count / maxGames) * 4)));
  };

  // ── Real calendar alignment — pad the grid so day 1 lands under its
  // actual weekday instead of always starting in the first column. ────────
  const firstWeekday = new Date(reportYear, reportMonth, 1).getDay(); // 0=Sun..6=Sat
  const mondayFirstOffset = (firstWeekday + 6) % 7; // 0=Mon..6=Sun

  const heatmapCells = [];
  for (let i = 0; i < mondayFirstOffset; i++) heatmapCells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    heatmapCells.push({
      day,
      ...dayBuckets[dateKey(reportYear, reportMonth, day)],
    });
  }
  while (heatmapCells.length % 7 !== 0) heatmapCells.push(null);

  const heatmapWeeks = [];
  for (let i = 0; i < heatmapCells.length; i += 7) {
    heatmapWeeks.push(heatmapCells.slice(i, i + 7));
  }

  const sessionCount = lastMonthGames.length;

  // ── Honest, conditional copy — no claim shown regardless of real data ────
  const archetypeDesc =
    mentalProfile === "Elite Competitor"
      ? "Your performance pattern reflects elite sustained attention and fast visual scanning."
      : mentalProfile === "Precision Specialist"
        ? "Your performance pattern reflects exceptional accuracy with strong cognitive control."
        : mentalProfile === "Speed Demon"
          ? "Your performance pattern reflects rapid visual processing and fast decision making."
          : mentalProfile !== "—"
            ? "Your performance pattern reflects steady, developing focus and consistency."
            : "Play more sessions to reveal your player archetype.";

  const focusEnduranceDesc =
    focusEndurance === "Elite" || focusEndurance === "Strong"
      ? "You maintain concentration levels for extended periods with minimal performance drop-off."
      : focusEndurance !== "—"
        ? "Your focus tends to soften in longer sessions — shorter, frequent sessions may help."
        : "Play more sessions to reveal your focus endurance profile.";

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
                Behavioral Heat Analysis
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
                  Performance
                </span>
                <br />
                <span className="text-zinc-900">Heatmap</span>
              </h1>
            </div>
            <div
              className="w-11 h-11 rounded-2xl text-white flex items-center justify-center shadow-lg shrink-0"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_PINK})`,
                boxShadow: `0 8px 20px ${ACCENT}40`,
              }}
            >
              <FiActivity className="text-lg" />
            </div>
          </div>

          {/* INTRO */}
          <div className="mt-3.5 border border-zinc-200 bg-zinc-50 rounded-2xl p-3">
            <div className="flex items-start gap-2.5">
              <div
                className="w-7 h-7 rounded-xl text-white flex items-center justify-center shrink-0"
                style={{ background: ACCENT_PINK }}
              >
                <FiTrendingUp className="text-xs" />
              </div>
              <div>
                <h2 className="text-sm font-black">
                  See your session activity at a glance.
                </h2>
                <p className="mt-1 text-[10.5px] text-zinc-600 leading-relaxed line-clamp-2">
                  Showing your full activity for{" "}
                  <strong>
                    {reportMonthName} {reportYear}
                  </strong>
                  . Darker squares mean more sessions played that day.
                </p>
              </div>
            </div>
          </div>

          {/* HEATMAP */}
          <div className="mt-3 border border-zinc-200 bg-zinc-50 rounded-2xl p-3.5">
            {/* TOP */}
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[8px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                  {reportMonthName} {reportYear} — Full Month Activity
                </div>
                <h2 className="text-sm font-black mt-1 leading-tight line-clamp-1">
                  {sessionCount > 0
                    ? `${sessionCount} sessions recorded during ${reportMonthName}.`
                    : `No sessions recorded during ${reportMonthName}.`}
                </h2>
              </div>
              <div
                className="rounded-full text-white px-2.5 py-1 text-[9px] font-bold shrink-0"
                style={{
                  background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_PINK})`,
                }}
              >
                {focusEndurance}
              </div>
            </div>

            {/* DAY LABELS */}
            <div className="grid grid-cols-7 gap-1.5 mt-3">
              {labels.map((day) => (
                <div
                  key={day}
                  className="text-center text-[7px] uppercase tracking-[0.1em] text-zinc-400 font-bold"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* GRID */}
            <div className="space-y-1.5 mt-1.5">
              {heatmapWeeks.map((week, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-7 gap-1.5">
                  {week.map((cell, colIndex) =>
                    cell ? (
                      <div
                        key={colIndex}
                        className="w-full h-[30px] rounded-md relative overflow-hidden"
                        style={{
                          background: intensityColors[getIntensity(cell.count)],
                        }}
                      >
                        <div className="absolute top-0.5 left-1 text-[6px] text-white font-bold opacity-80">
                          {cell.day}
                        </div>
                        {cell.count > 0 && (
                          <div className="absolute bottom-0.5 right-1 text-[7px] font-black text-white">
                            {cell.count}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div key={colIndex} className="w-full h-[30px]" />
                    ),
                  )}
                </div>
              ))}
            </div>

            {/* LEGEND */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] text-zinc-400">Fewer Sessions</span>
                {intensityColors.map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-sm"
                    style={{ background: color }}
                  />
                ))}
                <span className="text-[8px] text-zinc-400">Most Sessions</span>
              </div>
              <div className="text-[9px] font-bold" style={{ color: ACCENT }}>
                {sessionCount} Sessions Analysed
              </div>
            </div>

            {/* AI INSIGHT */}
            <div className="mt-3 border border-zinc-200 bg-white rounded-2xl p-3">
              <div className="flex items-start gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0"
                  style={{ background: "#10b981" }}
                >
                  <FiTarget className="text-xs" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black">
                    AI Behavioral Pattern Analysis
                  </div>
                  <p className="mt-1 text-[10.5px] text-zinc-600 leading-relaxed line-clamp-2">
                    Across <span className="font-bold">{sessionCount}</span>{" "}
                    completed sessions in {reportMonthName}, you achieved a
                    consistency score of{" "}
                    <span className="font-bold">
                      {brainMetrics.consistency ?? 0}%
                    </span>{" "}
                    and maintained{" "}
                    <span className="font-bold">{focusEndurance}</span> focus
                    endurance.
                  </p>
                  <p className="mt-1.5 text-[10.5px] text-zinc-600 leading-relaxed line-clamp-2">
                    Your Brain Score of{" "}
                    <span className="font-bold">
                      {brainMetrics.brainScore ?? 0}
                    </span>
                    , Focus IQ of{" "}
                    <span className="font-bold">
                      {brainMetrics.focusIQ ?? 0}
                    </span>
                    , and Flow State Score of{" "}
                    <span className="font-bold">
                      {brainMetrics.flowStateScore ?? 0}
                    </span>{" "}
                    reflect your training this month.
                  </p>
                  <div
                    className="mt-2.5 rounded-xl p-2"
                    style={{
                      background: `${ACCENT}0d`,
                      border: `1px solid ${ACCENT}26`,
                    }}
                  >
                    <div
                      className="text-[8px] uppercase tracking-wider font-bold"
                      style={{ color: ACCENT }}
                    >
                      Mental Profile
                    </div>
                    <div className="text-sm font-black mt-0.5">
                      {mentalProfile}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STRENGTHS */}
          <div className="grid grid-cols-2 gap-2.5 mt-3.5">
            <div className="border border-zinc-200 bg-zinc-50 rounded-2xl p-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg text-white flex items-center justify-center shrink-0"
                  style={{ background: "#22c55e" }}
                >
                  <FiZap className="text-xs" />
                </div>
                <div className="min-w-0">
                  <div className="text-[7px] uppercase tracking-[0.1em] text-zinc-400 font-bold">
                    Mental Profile
                  </div>
                  <div className="text-sm font-black mt-0.5 truncate">
                    {mentalProfile}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[10px] text-zinc-600 leading-relaxed line-clamp-2">
                {archetypeDesc}
              </p>
            </div>

            <div className="border border-zinc-200 bg-zinc-50 rounded-2xl p-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg text-white flex items-center justify-center shrink-0"
                  style={{ background: "#38bdf8" }}
                >
                  <FiTarget className="text-xs" />
                </div>
                <div className="min-w-0">
                  <div className="text-[7px] uppercase tracking-[0.1em] text-zinc-400 font-bold">
                    Focus Endurance
                  </div>
                  <div className="text-sm font-black mt-0.5 truncate">
                    {focusEndurance}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[10px] text-zinc-600 leading-relaxed line-clamp-2">
                {focusEnduranceDesc}
              </p>
            </div>
          </div>

          {/* METRICS */}
          <div className="grid grid-cols-4 gap-2 mt-3.5">
            <MetricCard
              icon={<FiCalendar />}
              label="Games"
              value={sessionCount}
              accent={ACCENT}
            />
            <MetricCard
              icon={<FiTarget />}
              label="Focus IQ"
              value={brainMetrics?.focusIQ ?? "—"}
              accent={ACCENT_PINK}
            />
            <MetricCard
              icon={<FiClock />}
              label="Reaction"
              value={
                speedMetrics?.bestReactionTime != null
                  ? `${speedMetrics.bestReactionTime}ms`
                  : "—"
              }
              accent="#f59e0b"
            />
            <MetricCard
              icon={<FiTrendingUp />}
              label="Brain Score"
              value={brainMetrics?.brainScore ?? "—"}
              accent="#10b981"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="shrink-0 border-t border-zinc-200 px-9 py-2.5 bg-white flex items-center justify-between">
          <div className="flex items-start gap-2">
            <FiShield size={10} className="text-zinc-400 mt-0.5" />
            <div className="text-[8px] font-bold text-zinc-500">
              Behavioral Intelligence Analytics™
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
