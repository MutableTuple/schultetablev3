"use client";

import React from "react";

import {
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

const radialData = [
  {
    name: "Focus",
    value: 91,
    fill: "#570df8",
  },
];

export default function FocusScore({
  data = {
    focusScore: 91,
    focusLevel: "Elite",
    reaction: 427,
    consistency: 94,
    percentile: 89,
    distraction: "Low",
    improvement: "+18%",
  },
}) {
  return (
    <div className="w-full h-full bg-white text-zinc-900 relative overflow-hidden">
      {/* LEFT STRIP */}

      <div className="absolute left-0 top-0 w-4 h-full bg-[#570df8]" />

      {/* MAIN CONTENT */}

      <div className="px-12 pt-10 pb-[120px]">
        {/* HEADER */}

        <div className="flex items-start justify-between">
          <div>
            <div className="uppercase tracking-[0.25em] text-[10px] text-zinc-400">
              Cognitive Breakdown
            </div>

            <h1 className="text-[48px] leading-[0.9] font-black mt-4">
              Focus
              <br />
              Score
            </h1>
          </div>

          <div className="w-14 h-14 bg-[#570df8] text-white flex items-center justify-center">
            <FiTarget className="text-3xl" />
          </div>
        </div>

        {/* HERO */}

        <div className="grid grid-cols-[220px_1fr] gap-8 mt-8 items-center">
          {/* CHART */}

          <div className="flex justify-center">
            <div className="relative w-[190px] h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="74%"
                  outerRadius="100%"
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar background dataKey="value" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-black">{data.focusScore}</div>

                <div className="mt-2 bg-[#570df8] text-white px-3 py-1 text-[10px] font-semibold">
                  {data.focusLevel}
                </div>
              </div>
            </div>
          </div>

          {/* TEXT */}

          <div>
            <div className="inline-flex bg-[#570df8] text-white px-3 py-2 text-[10px] font-semibold">
              Top {100 - data.percentile}% Worldwide
            </div>

            <h2 className="text-[30px] font-black leading-tight mt-4">
              Your focus performance is significantly above average.
            </h2>

            <p className="text-zinc-600 text-sm leading-relaxed mt-4">
              Focus Score measures how efficiently you maintain concentration
              while visually scanning and reacting under pressure.
            </p>

            {/* INSIGHT */}

            <div className="mt-5 border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#570df8] text-white flex items-center justify-center shrink-0">
                  <FiCpu className="text-xl" />
                </div>

                <div>
                  <div className="font-black text-base">AI Insight</div>

                  <p className="mt-2 text-zinc-600 text-xs leading-relaxed">
                    Your sessions show strong concentration stability with low
                    distraction spikes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IMPACT */}

        <div className="mt-7 border border-zinc-200 bg-zinc-50 p-5">
          <div className="uppercase tracking-[0.25em] text-[10px] text-zinc-400">
            Real World Impact
          </div>

          <h2 className="text-2xl font-black mt-3">What this means for you.</h2>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <ImpactCard
              icon={<FiZap />}
              title="Fast Processing"
              desc="You react faster than most players."
            />

            <ImpactCard
              icon={<FiClock />}
              title="Long Attention"
              desc="Your focus remains stable longer."
            />

            <ImpactCard
              icon={<FiCheckCircle />}
              title="Low Errors"
              desc="Better focus reduces mistakes."
            />

            <ImpactCard
              icon={<FiTrendingUp />}
              title="Stable Growth"
              desc="Your consistency is improving."
            />
          </div>
        </div>

        {/* METRICS */}

        <div className="grid grid-cols-4 gap-3 mt-6">
          <MetricCard
            icon={<FiActivity />}
            label="Consistency"
            value={`${data.consistency}%`}
          />

          <MetricCard
            icon={<FiZap />}
            label="Reaction"
            value={`${data.reaction}ms`}
          />

          <MetricCard
            icon={<FiTrendingUp />}
            label="Growth"
            value={data.improvement}
          />

          <MetricCard
            icon={<FiAlertCircle />}
            label="Distraction"
            value={data.distraction}
          />
        </div>
      </div>

      {/* FOOTER */}

      <div className="absolute bottom-0 left-0 w-full border-t border-zinc-200 px-12 py-5 bg-white">
        <div className="flex items-center justify-between text-[10px] text-zinc-400">
          <div>Focus Intelligence Analytics™</div>

          <div>www.schultetable.com</div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }) {
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

function ImpactCard({ icon, title, desc }) {
  return (
    <div className="bg-white border border-zinc-200 p-3">
      <div className="w-9 h-9 bg-[#570df8] text-white flex items-center justify-center">
        {icon}
      </div>

      <div className="text-base font-black mt-3">{title}</div>

      <p className="text-[11px] text-zinc-600 leading-relaxed mt-2">{desc}</p>
    </div>
  );
}
