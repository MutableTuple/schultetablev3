"use client";

import React, { use, useState } from "react";
import {
  ComposedChart,
  Area,
  Bar,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  BarChart,
} from "recharts";
import AnalyticsFilter from "./AnalyticsFilter";
import HistoryInsightsModal from "./HistoryInsightsModal";

export default function DetailedExpandedConsistencyModal({
  expanded,
  setExpanded,
  clickTable,
  tier,
  tierColor,
  percentile,
  motivation,
  points,
  peakSpike,
  trendPoints,
  trend14 = [],
  trend21 = [],
  trendAll = [],
  graphColor,
  user,
}) {
  const [range, setRange] = useState("7");
  const [difficulty, setDifficulty] = useState("");
  const [gridSize, setGridSize] = useState("");
  const [gameMode, setGameMode] = useState("");

  // ✅ Same color logic as main card
  if (tier === "Zen Mode") graphColor = "#10b981";
  else if (tier === "Iron Focus") graphColor = "#3b82f6";
  else if (tier === "Balanced Mind") graphColor = "#f59e0b";
  else graphColor = "#ef4444";

  // ✅ Historical dataset selection
  const rawTrend =
    range === "7"
      ? trendPoints
      : range === "14"
        ? trend14
        : range === "21"
          ? trend21
          : trendAll;

  // ✅ Convert trend scores → combined chart-friendly format
  const chartData = rawTrend.map((d, i) => ({
    value: d.value,
    rt: d.value, // treat historical score as RT for graph
    spike: i === 0 ? 0 : Math.abs(d.value - rawTrend[i - 1].value), // diff between points
  }));

  // ✅ Compute extended analytics
  const rtArray = clickTable.map((c) => c.t);
  const spikeArray = clickTable.map((c) => c.spike);

  const avgRT =
    rtArray.length > 0
      ? (rtArray.reduce((a, b) => a + b, 0) / rtArray.length).toFixed(1)
      : null;

  const sortedRT = [...rtArray].sort((a, b) => a - b);
  const medianRT =
    rtArray.length > 0 ? sortedRT[Math.floor(sortedRT.length / 2)] : null;

  const stdRT =
    rtArray.length > 0
      ? Math.sqrt(
          rtArray.map((rt) => (rt - avgRT) ** 2).reduce((a, b) => a + b, 0) /
            rtArray.length
        ).toFixed(1)
      : null;

  const stabilityScore =
    spikeArray.length > 0
      ? (1000 / (1 + spikeArray.reduce((a, b) => a + b))).toFixed(1)
      : null;

  // ✅ Best stability streak
  let bestStreak = 1,
    worstStreak = 1,
    currentStreak = 1;

  for (let i = 1; i < spikeArray.length; i++) {
    if (spikeArray[i] <= 15) currentStreak++;
    else {
      bestStreak = Math.max(bestStreak, currentStreak);
      currentStreak = 1;
    }
  }
  bestStreak = Math.max(bestStreak, currentStreak);

  // ✅ Worst instability streak
  currentStreak = 1;
  for (let i = 1; i < spikeArray.length; i++) {
    if (spikeArray[i] >= 40) currentStreak++;
    else {
      worstStreak = Math.max(worstStreak, currentStreak);
      currentStreak = 1;
    }
  }
  worstStreak = Math.max(worstStreak, currentStreak);

  // ✅ Most stable & unstable clicks
  const lowestSpike = Math.min(...spikeArray);
  const highestSpike = Math.max(...spikeArray);

  // ✅ Recovery time
  let recoverySum = 0,
    recoveryCount = 0;
  for (let i = 1; i < spikeArray.length; i++) {
    if (spikeArray[i] >= 35) {
      // mistake threshold
      const mistakeSpike = spikeArray[i];

      for (let j = i + 1; j < spikeArray.length; j++) {
        // ✅ Option 1: Soft recovery threshold
        if (spikeArray[j] <= 20) {
          recoverySum += j - i;
          recoveryCount++;
          break;
        }

        // ✅ Option 2: Recovery if spike drops by 60%
        if (spikeArray[j] <= mistakeSpike * 0.4) {
          recoverySum += j - i;
          recoveryCount++;
          break;
        }
      }
    }
  }

  const avgRecovery =
    recoveryCount > 0 ? (recoverySum / recoveryCount).toFixed(1) : 0;

  return (
    <dialog
      className={`modal overflow-y-scroll ${expanded ? "modal-open" : ""}`}
    >
      <div className="modal-box max-w-5xl bg-base-200 border border-base-300 max-h-[90vh] overflow-y-auto no-scrollbar rounded-xl shadow-xl relative">
        {/* Close */}
        <button
          className="btn btn-sm btn-circle absolute right-3 top-3"
          onClick={() => setExpanded(false)}
        >
          ✕
        </button>

        <h3 className="font-bold text-xl mb-4">Consistency Breakdown</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ✅ LEFT SIDE — CURRENT GAME */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Current Game</h3>

            {/* ✅ Combined Chart */}
            <div className="w-full h-48 bg-base-100 rounded-xl p-2 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={points.map((p, i) => ({
                    spike: p.value,
                    rt: clickTable[i]?.t,
                  }))}
                >
                  <defs>
                    <linearGradient id="cgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={graphColor}
                        stopOpacity={0.65}
                      />
                      <stop
                        offset="100%"
                        stopColor={graphColor}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <Tooltip
                    contentStyle={{
                      background: "white",
                      borderRadius: "12px",
                      padding: "10px 14px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      fontSize: "12px",
                    }}
                    labelStyle={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#6b7280",
                    }}
                    itemStyle={{
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                    formatter={(v, name) =>
                      name === "rt"
                        ? [`${v} ms`, "Reaction Time"]
                        : [`+${v}`, "Spike"]
                    }
                  />

                  <Bar
                    dataKey="rt"
                    fill={graphColor}
                    opacity={0.25}
                    radius={[6, 6, 0, 0]}
                  />
                  <Area
                    dataKey="spike"
                    type="monotone"
                    stroke={graphColor}
                    strokeWidth={2.4}
                    fill="url(#cgGrad)"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* ✅ Peak Spike */}
            <p className="text-sm text-base-content/70 mb-3">
              Peak spike: <b>+{peakSpike}ms</b>
            </p>

            {/* ✅ Advanced Metrics */}
            <div className="bg-base-100 rounded-xl p-3 mb-4 border border-base-300">
              <h4 className="font-semibold mb-3 text-sm">Advanced Metrics</h4>

              {/* ✅ METRIC ROW COMPONENT */}
              {[
                {
                  label: "Average RT",
                  value: `${avgRT} ms`,
                  tooltip:
                    "Your average reaction time across all clicks. Lower = faster and more stable performance.",
                },
                {
                  label: "Median RT",
                  value: `${medianRT} ms`,
                  tooltip:
                    "The middle reaction time value. Great for detecting if a few slow clicks skew your average.",
                },
                {
                  label: "RT Std Dev",
                  value: `${stdRT} ms`,
                  tooltip:
                    "Standard deviation measures how much your reaction times fluctuate. Lower = more consistent.",
                },
                {
                  label: "Stability Score",
                  value: stabilityScore,
                  tooltip:
                    "Calculated using all spike values. Higher = smoother reaction flow across the entire game.",
                },
                {
                  label: "Best Stable Streak",
                  value: `${bestStreak} clicks`,
                  tooltip:
                    "Longest chain of back-to-back stable reactions (low spikes). Shows mental focus duration.",
                },
                {
                  label: "Worst Instability Streak",
                  value: `${worstStreak} clicks`,
                  tooltip:
                    "Longest chain of unstable reactions (high spikes). Helps identify fatigue or distraction points.",
                },
                {
                  label: "Most Stable Click",
                  value: `+${lowestSpike} ms`,
                  tooltip:
                    "The smallest spike in the game. Represents your most controlled reaction.",
                },
                {
                  label: "Most Unstable Click",
                  value: `+${highestSpike} ms`,
                  tooltip:
                    "The largest spike between clicks. Often happens during distraction or cognitive overload.",
                },
                {
                  label: "Avg Recovery Time",
                  value: `${avgRecovery} clicks`,
                  tooltip:
                    "How many clicks you need to return to stable performance after a big mistake.",
                },
              ].map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm mb-2"
                >
                  <div className="flex items-center gap-1">
                    {m.label}
                    <div
                      className="tooltip tooltip-top max-w-xs"
                      data-tip={m.tooltip}
                    >
                      <span className="badge badge-xs bg-base-300 text-base-content/70 cursor-pointer">
                        ?
                      </span>
                    </div>
                  </div>

                  <b>{m.value}</b>
                </div>
              ))}
            </div>

            {/* ✅ Per-Click Table */}
            <h3 className="font-semibold text-md mb-2">Per-Click Breakdown</h3>
            <div className="overflow-x-auto bg-base-100 rounded-xl p-2 no-scrollbar mb-4">
              <table className="table table-xs">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>RT (ms)</th>
                    <th>Spike</th>
                  </tr>
                </thead>
                <tbody>
                  {clickTable.map((c, i) => (
                    <tr key={i}>
                      <td>{c.num}</td>
                      <td>{c.t}</td>
                      <td className="font-semibold">+{c.spike}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ✅ RIGHT SIDE — HISTORY */}
          <HistoryInsightsModal
            range={range}
            setRange={setRange}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            gridSize={gridSize}
            setGridSize={setGridSize}
            gameMode={gameMode}
            setGameMode={setGameMode}
            chartData={chartData}
            graphColor={graphColor}
            tier={tier}
            percentile={percentile}
            motivation={motivation}
            user={user}
          />
        </div>

        <div className="modal-action">
          <button className="btn" onClick={() => setExpanded(false)}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
