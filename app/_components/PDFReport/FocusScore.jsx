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

export default function FocusScore({ user, analytics }) {
  const {
    rawStats,
    brainMetrics,
    speedMetrics,
    focusMetrics,
    fatigueMetrics,
    trends,
    rankings,
    insights,
  } = analytics || {};

  // ── Values ─────────────────────────────────────────────────────────────────
  const focusScore = brainMetrics?.brainScore ?? 0;
  const consistency = brainMetrics?.consistency ?? 0;
  const reactionMs = rawStats?.avgReactionTime ?? 0;
  const percentile = rankings?.percentile ?? null;
  const globalRank = rankings?.globalRank ?? null;
  const focusEndurance = focusMetrics?.focusEndurance ?? "—";
  const attentionDrift = focusMetrics?.attentionDrift ?? 0;
  const hesitation = focusMetrics?.hesitationIndex ?? 0;
  const fatigueScore = fatigueMetrics?.fatigueScore ?? 0;
  const accuracyTrend = trends?.accuracyTrend ?? null;
  const reactionTrend = trends?.reactionTrend ?? null;
  const speedTier = speedMetrics?.speedTier ?? "—";
  const avgAccuracy = rawStats?.avgAccuracy ?? 0;

  // Focus level label from brainScore
  const focusLevel =
    focusScore >= 90
      ? "Elite"
      : focusScore >= 75
        ? "Advanced"
        : focusScore >= 60
          ? "Developing"
          : "Beginner";

  // Distraction label derived from hesitation + attentionDrift
  const distractionLabel =
    hesitation < 0.3 && attentionDrift > 80
      ? "Very Low"
      : hesitation < 0.6 && attentionDrift > 65
        ? "Low"
        : hesitation < 1.2
          ? "Moderate"
          : "High";

  // Growth label
  const improvementLabel =
    accuracyTrend != null
      ? `${accuracyTrend > 0 ? "+" : ""}${accuracyTrend}%`
      : reactionTrend != null
        ? `+${reactionTrend}ms`
        : "—";

  // Percentile display
  const percentileDisplay =
    percentile != null ? 100 - Math.round(percentile) : null;

  // Radial chart data driven by real focusScore
  const radialData = [{ name: "Focus", value: focusScore, fill: "#570df8" }];

  // AI insight: pick most relevant from insights array, else generate one
  const aiInsight =
    insights?.[0] ??
    (avgAccuracy > 93
      ? "Your sessions show strong concentration stability with low distraction spikes."
      : "Focus on reducing hesitation pauses to push your score higher.");

  // Dynamic hero headline
  const heroHeadline =
    focusScore >= 85
      ? "Your focus performance is significantly above average."
      : focusScore >= 70
        ? "Your focus performance is above the global average."
        : "You are building strong focus fundamentals.";

  // Impact cards — personalised text
  const processingDesc =
    reactionMs < 450
      ? `You react in ${Math.round(reactionMs)}ms — faster than most players.`
      : `Your ${Math.round(reactionMs)}ms reaction time has room to improve.`;

  const attentionDesc =
    focusEndurance === "Elite" || focusEndurance === "Strong"
      ? `${focusEndurance} endurance — your focus stays stable across the full session.`
      : "Your focus starts to drift in longer sessions.";

  const errorDesc =
    avgAccuracy >= 93
      ? `${avgAccuracy.toFixed(1)}% accuracy — errors are rare for you.`
      : `Improving accuracy from ${avgAccuracy.toFixed(1)}% is your key lever.`;

  const growthDesc =
    accuracyTrend != null && accuracyTrend > 0
      ? `Accuracy improved ${accuracyTrend}% — your consistency is trending up.`
      : reactionTrend != null && reactionTrend > 0
        ? `You're ${reactionTrend}ms faster than earlier this period.`
        : "Keep building session volume to unlock stronger trends.";

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
                <div className="text-4xl font-black">{focusScore}</div>
                <div className="mt-2 bg-[#570df8] text-white px-3 py-1 text-[10px] font-semibold">
                  {focusLevel}
                </div>
              </div>
            </div>
          </div>

          {/* TEXT */}
          <div>
            {percentileDisplay != null ? (
              <div className="inline-flex bg-[#570df8] text-white px-3 py-2 text-[10px] font-semibold">
                Top {percentileDisplay}% Worldwide
              </div>
            ) : (
              <div className="inline-flex bg-[#570df8] text-white px-3 py-2 text-[10px] font-semibold">
                {speedTier} Speed Tier
              </div>
            )}

            <h2 className="text-[30px] font-black leading-tight mt-4">
              {heroHeadline}
            </h2>

            <p className="text-zinc-600 text-sm leading-relaxed mt-4">
              Focus Score measures how efficiently you maintain concentration
              while visually scanning and reacting under pressure.
            </p>

            {/* AI INSIGHT */}
            <div className="mt-5 border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#570df8] text-white flex items-center justify-center shrink-0">
                  <FiCpu className="text-xl" />
                </div>
                <div>
                  <div className="font-black text-base">AI Insight</div>
                  <p className="mt-2 text-zinc-600 text-xs leading-relaxed">
                    {aiInsight}
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
              desc={processingDesc}
            />
            <ImpactCard
              icon={<FiClock />}
              title="Long Attention"
              desc={attentionDesc}
            />
            <ImpactCard
              icon={<FiCheckCircle />}
              title="Low Errors"
              desc={errorDesc}
            />
            <ImpactCard
              icon={<FiTrendingUp />}
              title="Stable Growth"
              desc={growthDesc}
            />
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          <MetricCard
            icon={<FiActivity />}
            label="Consistency"
            value={`${consistency}%`}
          />
          <MetricCard
            icon={<FiZap />}
            label="Reaction"
            value={`${Math.round(reactionMs)}ms`}
          />
          <MetricCard
            icon={<FiTrendingUp />}
            label="Growth"
            value={improvementLabel}
          />
          <MetricCard
            icon={<FiAlertCircle />}
            label="Distraction"
            value={distractionLabel}
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
