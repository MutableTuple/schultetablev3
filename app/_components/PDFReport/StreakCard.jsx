"use client";

import React from "react";

import {
  FiActivity,
  FiAward,
  FiCalendar,
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiZap,
  FiCheckCircle,
} from "react-icons/fi";

import { ResponsiveContainer, AreaChart, Area } from "recharts";

// ============================================
// DATA
// ============================================

const streakChart = [
  { day: "1", streak: 1 },
  { day: "5", streak: 4 },
  { day: "10", streak: 7 },
  { day: "15", streak: 11 },
  { day: "20", streak: 14 },
  { day: "25", streak: 17 },
  { day: "30", streak: 18 },
];

// ============================================
// MAIN
// ============================================

export default function StreakCard({
  data = {
    currentStreak: 18,
    longestStreak: 32,
    consistency: 91,
    totalSessions: 148,
    missedDays: 2,
    bestTime: "8PM - 10PM",
    percentile: 89,
    streakGrowth: "+42%",
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
              Consistency Analytics
            </div>

            <h1 className="text-[38px] leading-[0.9] font-black mt-3">
              Streak
              <br />
              Analysis
            </h1>
          </div>

          <div className="w-11 h-11 bg-[#570df8] text-white flex items-center justify-center">
            <FiZap className="text-xl" />
          </div>
        </div>

        {/* HERO */}

        <div className="grid grid-cols-[1fr_220px] gap-4 mt-5">
          {/* LEFT */}

          <div>
            <div className="inline-flex bg-[#570df8] text-white px-3 py-1.5 text-[9px] font-semibold">
              Top {100 - data.percentile}% Consistency
            </div>

            <h2 className="text-[72px] leading-none font-black tracking-[-0.05em] mt-4">
              {data.currentStreak}
            </h2>

            <div className="text-xl font-black">Day Streak</div>

            <p className="text-[11px] text-zinc-600 leading-relaxed mt-5">
              Your streak measures how consistently you train and maintain
              cognitive engagement over time.
            </p>

            {/* INSIGHT */}

            <div className="mt-5 border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#570df8] text-white flex items-center justify-center shrink-0">
                  <FiTrendingUp className="text-sm" />
                </div>

                <div>
                  <div className="text-base font-black">
                    AI Consistency Insight
                  </div>

                  <p className="mt-2 text-[11px] text-zinc-600 leading-relaxed">
                    Your streak pattern suggests strong behavioral consistency
                    and improving cognitive discipline.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div>
            {/* SCORE */}

            <div className="bg-[#570df8] text-white p-4">
              <div className="uppercase tracking-[0.2em] text-[8px] opacity-70">
                Consistency Score
              </div>

              <div className="text-[56px] font-black leading-none mt-3">
                {data.consistency}%
              </div>

              {/* BAR */}

              <div className="w-full h-2 bg-white/20 mt-5 overflow-hidden">
                <div
                  className="h-full bg-white"
                  style={{
                    width: `${data.consistency}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[9px] opacity-70 mt-2">
                <span>Unstable</span>

                <span>Elite</span>
              </div>
            </div>

            {/* MINI */}

            <div className="grid grid-cols-2 gap-2 mt-3">
              <MiniCard
                icon={<FiAward />}
                label="Best"
                value={data.longestStreak}
              />

              <MiniCard
                icon={<FiActivity />}
                label="Sessions"
                value={data.totalSessions}
              />

              <MiniCard
                icon={<FiCheckCircle />}
                label="Missed"
                value={data.missedDays}
              />

              <MiniCard
                icon={<FiTrendingUp />}
                label="Growth"
                value={data.streakGrowth}
              />
            </div>
          </div>
        </div>

        {/* CHART */}

        <div className="mt-5 border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="uppercase tracking-[0.2em] text-[8px] text-zinc-400">
                Streak Progression
              </div>

              <h2 className="text-lg font-black mt-2 leading-tight">
                Your consistency improved steadily.
              </h2>
            </div>

            <div className="bg-[#22c55e] text-white px-3 py-1.5 text-[9px] font-semibold shrink-0">
              Excellent Momentum
            </div>
          </div>

          {/* GRAPH */}

          <div className="h-[130px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={streakChart}>
                <defs>
                  <linearGradient
                    id="streakGradient"
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
                  dataKey="streak"
                  stroke="#570df8"
                  strokeWidth={2.5}
                  fill="url(#streakGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* IMPACT */}

        {/* AI SUMMARY */}

        <div className="mt-6 border border-zinc-200 bg-[#570df8] text-white p-6">
          <div className="uppercase tracking-[0.2em] text-[8px] opacity-70">
            AI Summary
          </div>

          <h3 className="text-2xl font-black mt-3">
            Elite Consistency Potential
          </h3>

          <p className="mt-4 text-sm leading-relaxed opacity-90">
            A consistency score of {data.consistency}% places you among the
            strongest performing users. Maintaining your current pace will
            likely lead to continued gains in focus, processing speed, attention
            control and cognitive endurance.
          </p>
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

function MiniCard({ icon, label, value }) {
  return (
    <div className="bg-zinc-50 border border-zinc-200 p-2">
      <div className="flex items-center justify-between">
        <div className="text-[#570df8] text-xs">{icon}</div>

        <div className="text-[7px] uppercase text-zinc-400">{label}</div>
      </div>

      <div className="text-sm font-black mt-2">{value}</div>
    </div>
  );
}

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

function ImpactCard({ icon, title, desc }) {
  return (
    <div className="bg-white border border-zinc-200 p-3">
      <div className="w-8 h-8 bg-[#570df8] text-white flex items-center justify-center">
        {icon}
      </div>

      <div className="text-sm font-black mt-3">{title}</div>

      <p className="mt-2 text-[10px] text-zinc-600 leading-relaxed">{desc}</p>
    </div>
  );
}
