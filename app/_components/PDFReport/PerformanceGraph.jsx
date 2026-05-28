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
} from "react-icons/fi";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// ============================================
// DATA
// ============================================

const performanceTrend = [
  { day: "1", score: 58 },
  { day: "5", score: 63 },
  { day: "10", score: 61 },
  { day: "15", score: 72 },
  { day: "20", score: 76 },
  { day: "25", score: 83 },
  { day: "30", score: 91 },
];

const focusBreakdown = [
  { name: "Focused", value: 74 },
  { name: "Average", value: 18 },
  { name: "Distracted", value: 8 },
];

const comparisonData = [
  {
    name: "Reaction",
    you: 91,
    avg: 62,
  },
  {
    name: "Focus",
    you: 88,
    avg: 58,
  },
  {
    name: "Accuracy",
    you: 94,
    avg: 66,
  },
  {
    name: "Consistency",
    you: 86,
    avg: 55,
  },
];

const COLORS = ["#570df8", "#7c3aed", "#c4b5fd"];

// ============================================
// MAIN
// ============================================

export default function PerformanceGraph({
  data = {
    highestScore: 94,
    lowestScore: 58,
    avgReaction: 427,
    focusStability: 91,
    peakDay: "May 27",
    weakDay: "May 3",
  },
}) {
  return (
    <div className="w-full h-full bg-white text-zinc-900 relative overflow-hidden">
      {/* LEFT STRIP */}

      <div className="absolute left-0 top-0 w-4 h-full bg-[#570df8]" />

      {/* CONTENT */}

      <div className="px-10 pt-8 pb-24">
        {/* HEADER */}

        <div className="flex items-start justify-between">
          <div>
            <div className="uppercase tracking-[0.22em] text-[9px] text-zinc-400">
              Deep Analytics
            </div>

            <h1 className="text-[42px] leading-[0.9] font-black mt-3">
              Performance
              <br />
              Graphs
            </h1>
          </div>

          <div className="w-12 h-12 bg-[#570df8] text-white flex items-center justify-center">
            <FiBarChart2 className="text-2xl" />
          </div>
        </div>

        {/* INTRO */}

        <div className="mt-6 border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-[#570df8] text-white flex items-center justify-center shrink-0">
              <FiTrendingUp className="text-lg" />
            </div>

            <div>
              <h2 className="text-xl font-black">
                Understanding Your Performance
              </h2>

              <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                These charts visualize your reaction speed, focus consistency,
                and cognitive stability.
              </p>
            </div>
          </div>
        </div>

        {/* TOP SECTION */}

        <div className="grid grid-cols-[1fr_220px] gap-4 mt-5">
          {/* AREA */}

          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <div className="uppercase tracking-[0.22em] text-[9px] text-zinc-400">
              Performance Trend
            </div>

            <h2 className="text-xl font-black mt-2">
              Your performance improved steadily.
            </h2>

            <div className="h-[120px] mt-3">
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
                      <stop offset="0%" stopColor="#570df8" stopOpacity={0.3} />

                      <stop offset="100%" stopColor="#570df8" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#570df8"
                    strokeWidth={2.5}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE */}

          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <div className="uppercase tracking-[0.22em] text-[9px] text-zinc-400">
              Focus State
            </div>

            <div className="h-[110px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={focusBreakdown}
                    dataKey="value"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                  >
                    {focusBreakdown.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 mt-1">
              {focusBreakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-[10px]"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2"
                      style={{
                        background: COLORS[index],
                      }}
                    />

                    <span>{item.name}</span>
                  </div>

                  <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INSIGHTS */}

        <div className="grid grid-cols-4 gap-2 mt-5">
          <InsightCard
            icon={<FiArrowUpRight />}
            title="Peak"
            value={data.peakDay}
          />

          <InsightCard
            icon={<FiArrowDownRight />}
            title="Weak"
            value={data.weakDay}
          />

          <InsightCard
            icon={<FiTarget />}
            title="Best"
            value={data.highestScore}
          />

          <InsightCard
            icon={<FiAlertTriangle />}
            title="Lowest"
            value={data.lowestScore}
          />
        </div>

        {/* BAR CHART */}

        <div className="mt-5 border border-zinc-200 bg-zinc-50 p-4">
          <div className="uppercase tracking-[0.22em] text-[9px] text-zinc-400">
            Community Comparison
          </div>

          <h2 className="text-xl font-black mt-2">
            You outperform average players.
          </h2>

          <div className="h-[140px] mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <Bar dataKey="you" fill="#570df8" />

                <Bar dataKey="avg" fill="#d4d4d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* METRICS */}

        <div className="grid grid-cols-4 gap-2 mt-5">
          <MetricCard
            icon={<FiZap />}
            label="Reaction"
            value={`${data.avgReaction}ms`}
          />

          <MetricCard
            icon={<FiTarget />}
            label="Stability"
            value={`${data.focusStability}%`}
          />

          <MetricCard icon={<FiTrendingUp />} label="Growth" value="+18%" />

          <MetricCard icon={<FiClock />} label="Consistency" value="High" />
        </div>
      </div>

      {/* FOOTER */}

      <div className="absolute bottom-0 left-0 w-full border-t border-zinc-200 px-10 py-3 bg-white">
        <div className="flex items-center justify-between text-[9px] text-zinc-400">
          <div>Performance Intelligence Analytics™</div>

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
    <div className="bg-zinc-50 border border-zinc-200 p-2.5">
      <div className="flex items-center justify-between">
        <div className="text-[#570df8] text-sm">{icon}</div>

        <div className="text-[8px] uppercase text-zinc-400">{label}</div>
      </div>

      <div className="text-lg font-black mt-2">{value}</div>
    </div>
  );
}

function InsightCard({ icon, title, value }) {
  return (
    <div className="bg-zinc-50 border border-zinc-200 p-2.5">
      <div className="flex items-center justify-between">
        <div className="text-[#570df8] text-sm">{icon}</div>

        <div className="text-[8px] uppercase text-zinc-400">{title}</div>
      </div>

      <div className="text-sm font-black mt-2">{value}</div>
    </div>
  );
}
