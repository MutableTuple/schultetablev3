"use client";

import React from "react";

import {
  FiArrowUpRight,
  FiAward,
  FiBarChart2,
  FiGlobe,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";

import { ResponsiveContainer, AreaChart, Area } from "recharts";

// ============================================
// DATA
// ============================================

const rankTrend = [
  { value: 820 },
  { value: 760 },
  { value: 710 },
  { value: 640 },
  { value: 590 },
  { value: 480 },
  { value: 390 },
  { value: 184 },
];

// ============================================
// MAIN
// ============================================

export default function RankCard({
  data = {
    globalRank: 184,
    totalPlayers: 1523,
    percentile: 89,
    rankImprovement: 637,
    countryRank: 12,
    country: "India",
    playerType: "Elite Scanner",
    betterThan: 89,
  },
}) {
  return (
    <div className="w-full h-full bg-white text-zinc-900 relative overflow-hidden">
      {/* LEFT STRIP */}

      <div className="absolute left-0 top-0 w-4 h-full bg-[#570df8]" />

      {/* CONTENT */}

      <div className="px-12 pt-10 pb-[120px]">
        {/* HEADER */}

        <div className="flex items-start justify-between">
          <div>
            <div className="uppercase tracking-[0.25em] text-[10px] text-zinc-400">
              Competitive Analytics
            </div>

            <h1 className="text-[48px] leading-[0.9] font-black mt-4">
              Global
              <br />
              Rank
            </h1>
          </div>

          <div className="w-14 h-14 bg-[#570df8] text-white flex items-center justify-center">
            <FiAward className="text-3xl" />
          </div>
        </div>

        {/* HERO */}

        <div className="grid grid-cols-[1fr_280px] gap-8 mt-8 items-start">
          {/* LEFT */}

          <div>
            <div className="inline-flex bg-[#570df8] text-white px-3 py-2 text-[10px] font-semibold">
              Top {100 - data.percentile}% Worldwide
            </div>

            <h2 className="text-[72px] leading-none font-black mt-5 tracking-[-0.05em]">
              #{data.globalRank}
            </h2>

            <p className="text-sm text-zinc-600 leading-relaxed mt-5 max-w-md">
              You currently rank higher than{" "}
              <span className="font-bold text-[#570df8]">
                {data.betterThan}% of players
              </span>{" "}
              globally based on reaction speed, consistency, and cognitive
              scanning ability.
            </p>

            {/* PLAYER TYPE */}

            <div className="mt-6 border border-zinc-200 bg-zinc-50 p-5">
              <div className="uppercase tracking-[0.25em] text-[10px] text-zinc-400">
                Player Archetype
              </div>

              <div className="text-2xl font-black mt-3">{data.playerType}</div>

              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Your performance pattern suggests strong sustained attention and
                fast visual scanning.
              </p>
            </div>
          </div>

          {/* RIGHT */}

          <div>
            {/* IMPROVEMENT */}

            <div className="bg-[#570df8] text-white p-5">
              <div className="uppercase tracking-[0.25em] text-[10px] opacity-70">
                Rank Improvement
              </div>

              <div className="text-5xl font-black mt-4">
                +{data.rankImprovement}
              </div>

              <div className="mt-5 text-xs leading-relaxed opacity-90">
                Significant ranking growth this month.
              </div>
            </div>

            {/* MINI GRID */}

            <div className="grid grid-cols-2 gap-3 mt-4">
              <MiniCard
                icon={<FiUsers />}
                label="Players"
                value={data.totalPlayers}
              />

              <MiniCard
                icon={<FiGlobe />}
                label="Country"
                value={`#${data.countryRank}`}
              />

              <MiniCard icon={<FiZap />} label="Tier" value="Elite" />

              <MiniCard
                icon={<FiBarChart2 />}
                label="Consistency"
                value="High"
              />
            </div>
          </div>
        </div>

        {/* CHART */}

        <div className="mt-7 border border-zinc-200 bg-zinc-50 p-5">
          <div className="flex items-end justify-between gap-8">
            {/* TEXT */}

            <div className="max-w-md">
              <div className="uppercase tracking-[0.25em] text-[10px] text-zinc-400">
                Ranking Progression
              </div>

              <h2 className="text-2xl font-black mt-3 leading-tight">
                Your global ranking continues improving.
              </h2>

              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Players with stable ranking progression usually demonstrate
                stronger focus endurance and reaction consistency.
              </p>

              {/* INSIGHT */}

              <div className="flex items-start gap-3 mt-5">
                <FiArrowUpRight className="text-[#570df8] text-xl mt-1 shrink-0" />

                <div className="text-sm font-semibold leading-relaxed">
                  Your trajectory suggests continued ranking growth if
                  consistency remains stable.
                </div>
              </div>
            </div>

            {/* CHART */}

            <div className="w-[260px] h-[140px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rankTrend}>
                  <defs>
                    <linearGradient
                      id="rankGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#570df8"
                        stopOpacity={0.35}
                      />

                      <stop offset="100%" stopColor="#570df8" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#570df8"
                    strokeWidth={3}
                    fill="url(#rankGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM */}

        <div className="grid grid-cols-3 gap-3 mt-6">
          <BottomCard
            title="Global Rank"
            value={`#${data.globalRank}`}
            desc="Worldwide leaderboard position."
          />

          <BottomCard
            title="Players Beaten"
            value={`${data.betterThan}%`}
            desc="Higher than most active users."
          />

          <BottomCard
            title="Country Rank"
            value={`#${data.countryRank}`}
            desc={`Current position in ${data.country}.`}
          />
        </div>
      </div>

      {/* FOOTER */}

      <div className="absolute bottom-0 left-0 w-full border-t border-zinc-200 px-12 py-5 bg-white">
        <div className="flex items-center justify-between text-[10px] text-zinc-400">
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
    <div className="bg-zinc-50 border border-zinc-200 p-3">
      <div className="flex items-center justify-between">
        <div className="text-[#570df8] text-base">{icon}</div>

        <div className="text-[9px] uppercase text-zinc-400">{label}</div>
      </div>

      <div className="text-xl font-black mt-3">{value}</div>
    </div>
  );
}

function BottomCard({ title, value, desc }) {
  return (
    <div className="border border-zinc-200 bg-zinc-50 p-4">
      <div className="uppercase tracking-[0.2em] text-[9px] text-zinc-400">
        {title}
      </div>

      <div className="text-3xl font-black mt-4">{value}</div>

      <p className="mt-3 text-xs text-zinc-600 leading-relaxed">{desc}</p>
    </div>
  );
}
