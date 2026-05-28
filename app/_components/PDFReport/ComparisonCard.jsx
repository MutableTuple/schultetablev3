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

// ============================================
// DATA
// ============================================

const radarData = [
  { metric: "Focus", you: 91, avg: 58 },
  { metric: "Reaction", you: 88, avg: 62 },
  { metric: "Accuracy", you: 94, avg: 66 },
  { metric: "Consistency", you: 89, avg: 54 },
  { metric: "Speed", you: 86, avg: 60 },
];

const percentileTrend = [
  { day: "1", value: 52 },
  { day: "5", value: 58 },
  { day: "10", value: 64 },
  { day: "15", value: 71 },
  { day: "20", value: 77 },
  { day: "25", value: 84 },
  { day: "30", value: 89 },
];

const distributionData = [
  { name: "Below You", value: 89 },
  { name: "Above You", value: 11 },
];

const COLORS = ["#570df8", "#e5e7eb"];

// ============================================
// MAIN
// ============================================

export default function ComparisonCard({
  data = {
    percentile: 89,
    globalRank: 184,
    totalPlayers: 1523,
    betterThan: 89,
    avgPlayerReaction: 612,
    yourReaction: 427,
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
              Competitive Intelligence
            </div>

            <h1 className="text-[38px] leading-[0.9] font-black mt-3">
              Community
              <br />
              Comparison
            </h1>
          </div>

          <div className="w-11 h-11 bg-[#570df8] text-white flex items-center justify-center">
            <FiUsers className="text-xl" />
          </div>
        </div>

        {/* HERO */}

        <div className="grid grid-cols-[1fr_220px] gap-4 mt-5">
          {/* LEFT */}

          <div>
            <div className="inline-flex bg-[#570df8] text-white px-3 py-1.5 text-[9px] font-semibold">
              Top {100 - data.percentile}% Worldwide
            </div>

            <h2 className="text-[72px] leading-none font-black tracking-[-0.05em] mt-4">
              {data.betterThan}%
            </h2>

            <div className="text-xl font-black">Better Than Players</div>

            <p className="text-[11px] text-zinc-600 leading-relaxed mt-5">
              Your cognitive performance currently ranks above most active users
              globally.
            </p>

            {/* INSIGHT */}

            <div className="mt-5 border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#570df8] text-white flex items-center justify-center shrink-0">
                  <FiTrendingUp className="text-sm" />
                </div>

                <div>
                  <div className="text-base font-black">
                    Competitive Insight
                  </div>

                  <p className="mt-2 text-[11px] text-zinc-600 leading-relaxed">
                    Your strongest advantage comes from faster focus stability
                    and visual reaction timing.
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
                Global Rank
              </div>

              <div className="text-[56px] font-black leading-none mt-3">
                #{data.globalRank}
              </div>

              <div className="mt-4 text-[11px] leading-relaxed opacity-90">
                Ranked among {data.totalPlayers} active players worldwide.
              </div>
            </div>

            {/* MINI */}

            <div className="grid grid-cols-2 gap-2 mt-3">
              <MiniCard
                icon={<FiZap />}
                label="Reaction"
                value={`${data.yourReaction}ms`}
              />

              <MiniCard
                icon={<FiActivity />}
                label="Avg"
                value={`${data.avgPlayerReaction}ms`}
              />

              <MiniCard icon={<FiAward />} label="Tier" value="Elite" />

              <MiniCard icon={<FiTarget />} label="Best" value="Focus" />
            </div>
          </div>
        </div>

        {/* RADAR + PIE */}

        <div className="grid grid-cols-2 gap-4 mt-5">
          {/* RADAR */}

          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <div className="uppercase tracking-[0.2em] text-[8px] text-zinc-400">
              Skill Comparison
            </div>

            <h2 className="text-lg font-black mt-2">
              You outperform average players.
            </h2>

            <div className="h-[180px] mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />

                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{
                      fontSize: 9,
                    }}
                  />

                  <Radar
                    dataKey="you"
                    stroke="#570df8"
                    fill="#570df8"
                    fillOpacity={0.35}
                  />

                  <Radar
                    dataKey="avg"
                    stroke="#d4d4d8"
                    fill="#d4d4d8"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE */}

          <div className="border border-zinc-200 bg-zinc-50 p-4">
            <div className="uppercase tracking-[0.2em] text-[8px] text-zinc-400">
              Player Distribution
            </div>

            <h2 className="text-lg font-black mt-2">
              Most players rank below you.
            </h2>

            <div className="h-[150px] mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    dataKey="value"
                    innerRadius={35}
                    outerRadius={60}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* LEGEND */}

            <div className="space-y-1.5 mt-1">
              {distributionData.map((item, index) => (
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

        {/* TREND */}

        <div className="mt-5 border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="uppercase tracking-[0.2em] text-[8px] text-zinc-400">
                Rank Progression
              </div>

              <h2 className="text-lg font-black mt-2">
                Your percentile improved steadily.
              </h2>
            </div>

            <div className="bg-[#22c55e] text-white px-3 py-1.5 text-[9px] font-semibold shrink-0">
              Strong Growth
            </div>
          </div>

          {/* GRAPH */}

          <div className="h-[120px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={percentileTrend}>
                <defs>
                  <linearGradient
                    id="percentileGradient"
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
                  dataKey="value"
                  stroke="#570df8"
                  strokeWidth={2.5}
                  fill="url(#percentileGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* METRICS */}

        <div className="grid grid-cols-4 gap-2 mt-4">
          <MetricCard
            icon={<FiUsers />}
            label="Players"
            value={data.totalPlayers}
          />

          <MetricCard
            icon={<FiAward />}
            label="Percentile"
            value={`${data.percentile}%`}
          />

          <MetricCard
            icon={<FiArrowUpRight />}
            label="Advantage"
            value="+32%"
          />

          <MetricCard icon={<FiTrendingUp />} label="Growth" value="Rising" />
        </div>
      </div>

      {/* FOOTER */}

      <div className="absolute bottom-0 left-0 w-full border-t border-zinc-200 px-10 py-2 bg-white">
        <div className="flex items-center justify-between text-[8px] text-zinc-400">
          <div>Competitive Intelligence Analytics™</div>

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
