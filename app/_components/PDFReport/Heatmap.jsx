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
// DATA
// ============================================

const heatmapData = [
  [1, 2, 2, 3, 0, 1, 2],
  [2, 3, 4, 4, 1, 2, 3],
  [0, 1, 2, 3, 4, 4, 3],
  [1, 2, 2, 3, 3, 4, 4],
  [2, 3, 4, 4, 4, 3, 2],
];

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const intensityColors = ["#e4e4e7", "#ddd6fe", "#a78bfa", "#7c3aed", "#570df8"];

// ============================================
// MAIN
// ============================================

export default function Heatmap({
  data = {
    bestDay: "Saturday",
    weakestDay: "Monday",
    consistency: "High",
    peakHours: "7PM - 10PM",
    strongestWeek: "Week 4",
    avgFocus: 91,
  },
}) {
  return (
    <div className="w-full h-full bg-white text-zinc-900 relative overflow-hidden">
      {/* LEFT STRIP */}

      <div className="absolute left-0 top-0 w-4 h-full bg-[#570df8]" />

      {/* CONTENT */}

      <div className="px-10 pt-8 pb-20">
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
            <div className="w-8 h-8 bg-[#570df8] text-white flex items-center justify-center shrink-0">
              <FiTrendingUp className="text-sm" />
            </div>

            <div>
              <h2 className="text-lg font-black">
                Understand your strongest patterns.
              </h2>

              <p className="mt-2 text-[11px] text-zinc-600 leading-relaxed">
                Darker areas represent stronger focus and better consistency.
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
                Monthly Activity
              </div>

              <h2 className="text-lg font-black mt-2 leading-tight">
                Your strongest sessions appeared later in the month.
              </h2>
            </div>

            <div className="bg-[#570df8] text-white px-3 py-1.5 text-[9px] font-semibold shrink-0">
              High Consistency
            </div>
          </div>

          {/* LABELS */}

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
            {heatmapData.map((week, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-2">
                {week.map((value, colIndex) => (
                  <div
                    key={colIndex}
                    className="w-full h-[58px] border border-zinc-200"
                    style={{
                      background: intensityColors[value],
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* LEGEND */}

          <div className="flex items-center gap-2 mt-5">
            <div className="text-[9px] text-zinc-400">Low</div>

            {intensityColors.map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 border border-zinc-200"
                style={{
                  background: color,
                }}
              />
            ))}

            <div className="text-[9px] text-zinc-400">Elite</div>
          </div>

          {/* INSIGHT */}

          <div className="mt-5 border border-zinc-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#570df8] text-white flex items-center justify-center shrink-0">
                <FiTarget className="text-sm" />
              </div>

              <div>
                <div className="text-base font-black">AI Pattern Insight</div>

                <p className="mt-2 text-[11px] text-zinc-600 leading-relaxed">
                  Your heatmap suggests increasing focus stability throughout
                  the month.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STRENGTHS */}

        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* STRONG */}

          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#22c55e] text-white flex items-center justify-center">
                <FiZap className="text-sm" />
              </div>

              <div>
                <div className="uppercase tracking-[0.1em] text-[8px] text-zinc-400">
                  Strongest
                </div>

                <div className="text-lg font-black mt-1">{data.bestDay}</div>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-zinc-600 leading-relaxed">
              Highest concentration and strongest reaction consistency appeared
              here.
            </p>
          </div>

          {/* WEAK */}

          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#f59e0b] text-white flex items-center justify-center">
                <FiAlertTriangle className="text-sm" />
              </div>

              <div>
                <div className="uppercase tracking-[0.1em] text-[8px] text-zinc-400">
                  Weakest
                </div>

                <div className="text-lg font-black mt-1">{data.weakestDay}</div>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-zinc-600 leading-relaxed">
              Lower focus consistency appeared here.
            </p>
          </div>
        </div>

        {/* METRICS */}

        <div className="grid grid-cols-4 gap-2 mt-4">
          <MetricCard
            icon={<FiCalendar />}
            label="Best Week"
            value={data.strongestWeek}
          />

          <MetricCard
            icon={<FiClock />}
            label="Peak Hours"
            value={data.peakHours}
          />

          <MetricCard
            icon={<FiTarget />}
            label="Avg Focus"
            value={`${data.avgFocus}%`}
          />

          <MetricCard
            icon={<FiTrendingUp />}
            label="Consistency"
            value={data.consistency}
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

function MetricCard({ icon, label, value }) {
  return (
    <div className="bg-zinc-50 border border-zinc-200 p-2">
      <div className="flex items-center justify-between">
        <div className="text-[#570df8] text-xs">{icon}</div>

        <div className="text-[7px] uppercase text-zinc-400">{label}</div>
      </div>

      <div className="text-xs font-black mt-2 leading-tight">{value}</div>
    </div>
  );
}
