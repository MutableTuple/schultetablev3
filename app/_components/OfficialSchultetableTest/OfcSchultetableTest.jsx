"use client";
import React, { useEffect, useState } from "react";
import BrainTestTable from "./BrainTestTable";

import { getGlobalReactionStats } from "@/app/_ofctestlib/lib";
import { calculatePercentile } from "@/app/_ofctestlib/lib";

export default function OfcSchultetableTest() {
  const [gameCount, setGameCount] = useState(1);
  const [gridSize, setGridSize] = useState(3);
  const [roundKey, setRoundKey] = useState(1);
  const [finishedData, setFinishedData] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [percentile, setPercentile] = useState(null);

  function handleGameFinished(summary) {
    const updated = [...finishedData, summary];
    setFinishedData(updated);

    const next = gameCount + 1;

    if (next > 5) {
      sessionStorage.setItem("brain-test-data", JSON.stringify(updated));
      setShowResult(true);
      return;
    }

    if (next <= 2) setGridSize(3);
    else if (next <= 4) setGridSize(4);
    else setGridSize(5);

    setGameCount(next);
    setRoundKey((k) => k + 1);
  }

  useEffect(() => {
    if (!showResult || finishedData.length === 0) return;

    const last = finishedData[finishedData.length - 1];

    getGlobalReactionStats({
      gridSize: last.gridSize,
      difficulty: "Medium",
      gameMode: "number",
    }).then((global) => {
      const p = calculatePercentile(last, global);
      setPercentile(p);
    });
  }, [showResult]);

  const avg = (k) =>
    Math.round(
      finishedData.reduce((a, b) => a + b[k], 0) / finishedData.length
    );
  const min = (k) => Math.min(...finishedData.map((d) => d[k]));
  const max = (k) => Math.max(...finishedData.map((d) => d[k]));
  const sum = (k) => finishedData.reduce((a, b) => a + b[k], 0);

  return (
    <div className="min-h-screen flex bg-base-100">
      {/* LEFT – GAME */}
      <div className="w-[60%] border-r border-base-300 p-6 flex items-center justify-center">
        <BrainTestTable
          key={roundKey}
          roundKey={roundKey}
          gridSize={gridSize}
          onFinish={handleGameFinished}
        />
      </div>

      {/* RIGHT – STATS */}
      <div className="w-[40%] bg-base-200 p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-6">Brain Test</h2>
        <div className="mb-4 opacity-70">Round {gameCount} / 5</div>

        <div className="grid grid-cols-2 gap-4">
          <Stat label="Grid" value={`${gridSize}×${gridSize}`} />
          <Stat label="Completed" value={`${finishedData.length} / 5`} />
        </div>
      </div>

      {/* RESULT MODAL */}
      {showResult && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-xl p-8 w-[420px] text-center space-y-4">
            <h2 className="text-2xl font-bold">🧠 Your Brain Snapshot</h2>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <Metric
                label="Avg Reaction"
                value={`${avg("avgReactionMs")} ms`}
              />
              <Metric label="Fastest Tap" value={`${min("fastestMs")} ms`} />
              <Metric label="Slowest Tap" value={`${max("slowestMs")} ms`} />
              <Metric label="Total Mistakes" value={sum("mistakes")} />
            </div>

            {percentile && (
              <p className="text-sm font-semibold text-primary">
                You are in the {percentile.label} globally.
              </p>
            )}

            <button
              className="btn btn-primary w-full mt-4"
              onClick={() => (window.location.href = "/?from=brain-test")}
            >
              View Full Brain Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat bg-base-100 shadow rounded-box">
      <div className="stat-title text-xs opacity-60">{label}</div>
      <div className="stat-value text-primary text-xl">{value}</div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="bg-base-200 rounded-lg p-3">
      <div className="text-xs opacity-60">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
