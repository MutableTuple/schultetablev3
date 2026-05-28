"use client";

import React from "react";

import {
  FiActivity,
  FiArrowUpRight,
  FiAward,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

import { ResponsiveContainer, AreaChart, Area } from "recharts";

// ============================================
// DATA
// ============================================

const chartData = [
  { score: 55 },
  { score: 62 },
  { score: 59 },
  { score: 68 },
  { score: 72 },
  { score: 76 },
  { score: 84 },
  { score: 91 },
];

// ============================================
// MAIN
// ============================================

export default function CoverPage({
  user = {
    name: "Yogesh Vishwakarma",
    username: "yogeshvishwakarma",
    focusScore: 91,
    percentile: 89,
    reaction: 427,
    sessions: 148,
    streak: 18,
    score: 194417,
  },
}) {
  return (
    <div className="w-full h-full bg-white relative overflow-hidden text-zinc-900">
      {/* LEFT STRIP */}

      <div className="absolute left-0 top-0 h-full w-4 bg-[#570df8]" />

      {/* CONTENT */}

      <div className="px-10 pt-8 pb-20">
        {/* HEADER */}

        <div className="flex items-start justify-between">
          {/* BRAND */}

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#570df8] text-white flex items-center justify-center text-2xl font-black">
              S
            </div>

            <div>
              <div className="text-xl font-black">SchulteTable</div>

              <div className="text-[11px] text-zinc-500 mt-1">
                Cognitive Performance Analytics
              </div>
            </div>
          </div>

          {/* DATE */}

          <div className="text-right">
            <div className="text-[8px] uppercase tracking-[0.25em] text-zinc-400">
              Monthly Report
            </div>

            <div className="text-sm font-semibold mt-2">May 2026</div>
          </div>
        </div>

        {/* HERO */}

        <div className="grid grid-cols-[1fr_240px] gap-5 mt-8">
          {/* LEFT */}

          <div>
            <div className="text-[#570df8] font-semibold tracking-[0.15em] uppercase text-[10px]">
              Personalized Analytics
            </div>

            <h1 className="text-[54px] font-black leading-[0.9] mt-4 tracking-[-0.05em]">
              Brain
              <br />
              Report
            </h1>

            <p className="text-[13px] leading-relaxed text-zinc-600 mt-5 max-w-md">
              A detailed overview of your cognitive performance, focus
              consistency, reaction speed, and visual scanning ability.
            </p>

            {/* USER */}

            <div className="flex items-center gap-4 mt-8">
              <div className="w-16 h-16 bg-[#570df8] text-white flex items-center justify-center text-3xl font-black">
                {user.name?.[0]}
              </div>

              <div>
                <div className="text-2xl font-black">{user.name}</div>

                <div className="text-zinc-500 text-sm mt-1">
                  @{user.username}
                </div>

                <div className="flex items-center gap-2 mt-3 text-[#570df8] font-semibold text-[11px]">
                  <FiArrowUpRight />
                  Top {100 - user.percentile}% Worldwide
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="border border-zinc-200 bg-zinc-50 p-5">
            {/* SCORE */}

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="uppercase tracking-[0.15em] text-[8px] text-zinc-400">
                    Focus Score
                  </div>

                  <div className="text-[54px] font-black leading-none mt-3">
                    {user.focusScore}
                  </div>
                </div>

                <div className="w-14 h-14 bg-[#570df8] text-white flex items-center justify-center">
                  <FiTarget className="text-3xl" />
                </div>
              </div>

              {/* BAR */}

              <div className="w-full h-2 bg-zinc-200 mt-5 overflow-hidden">
                <div
                  className="h-full bg-[#570df8]"
                  style={{
                    width: `${user.focusScore}%`,
                  }}
                />
              </div>

              <div className="flex justify-between mt-2 text-[9px] text-zinc-400">
                <span>Average</span>

                <span>Elite</span>
              </div>
            </div>

            {/* GRID */}

            <div className="grid grid-cols-2 gap-2 mt-5">
              <MetricCard
                icon={<FiZap />}
                label="Reaction"
                value={`${user.reaction}ms`}
              />

              <MetricCard icon={<FiTrendingUp />} label="Growth" value="+18%" />

              <MetricCard
                icon={<FiAward />}
                label="Percentile"
                value={`${user.percentile}%`}
              />

              <MetricCard
                icon={<FiActivity />}
                label="Sessions"
                value={user.sessions}
              />
            </div>
          </div>
        </div>

        {/* CHART */}

        <div className="mt-6 border border-zinc-200 bg-zinc-50 p-5">
          <div className="flex items-end justify-between gap-5">
            {/* TEXT */}

            <div className="max-w-md">
              <div className="text-[8px] uppercase tracking-[0.2em] text-zinc-400">
                Performance Trend
              </div>

              <h2 className="text-xl font-black mt-3 leading-tight">
                Your focus consistency improved faster than most players this
                month.
              </h2>

              <p className="mt-3 text-[11px] text-zinc-600 leading-relaxed">
                Your latest sessions show stronger visual scanning speed and
                improved sustained attention.
              </p>
            </div>

            {/* CHART */}

            <div className="w-[220px] h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
                    strokeWidth={3}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM */}

        <div className="grid grid-cols-3 gap-3 mt-5">
          <BottomCard
            title="Global Score"
            value={user.score.toLocaleString()}
          />

          <BottomCard title="Current Streak" value={`${user.streak} Days`} />

          <BottomCard title="Reaction Avg" value={`${user.reaction}ms`} />
        </div>
      </div>

      {/* FOOTER */}

      <div className="absolute bottom-0 left-0 w-full border-t border-zinc-200 px-10 py-3 bg-white">
        <div className="flex items-center justify-between text-[8px] text-zinc-400">
          <div>SchulteTable Cognitive Analytics™</div>

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
    <div className="bg-white border border-zinc-200 p-2.5">
      <div className="flex items-center justify-between">
        <div className="text-[#570df8] text-sm">{icon}</div>

        <div className="text-[7px] uppercase text-zinc-400">{label}</div>
      </div>

      <div className="text-lg font-black mt-3">{value}</div>
    </div>
  );
}

function BottomCard({ title, value }) {
  return (
    <div className="border border-zinc-200 bg-zinc-50 p-4">
      <div className="text-[8px] uppercase tracking-[0.15em] text-zinc-400">
        {title}
      </div>

      <div className="text-2xl font-black mt-4 leading-none">{value}</div>
    </div>
  );
}
