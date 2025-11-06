"use client";

import React, { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown, FaMinus } from "react-icons/fa6";

export default function FocusIQScore({
  animatedIQ,
  tier,
  focusIQ,
  progress,
  prevFocusIQ,
}) {
  const [change, setChange] = useState(null);

  // ✅ Calculate improvement
  useEffect(() => {
    if (prevFocusIQ === null || prevFocusIQ === undefined || !focusIQ) {
      setChange(null);
      return;
    }
    setChange(focusIQ - prevFocusIQ);
  }, [focusIQ, prevFocusIQ]);

  // ✅ Choose icon + color for change
  const getChangeBadge = () => {
    if (change === null) {
      return (
        <div className="text-xs text-base-content/60 mt-1 opacity-80">
          First game — welcome 👋
        </div>
      );
    }

    if (change > 0) {
      return (
        <div className="flex items-center justify-center gap-1 mt-1 text-green-500 text-xs animate-[fadeIn_0.4s_ease]">
          <FaArrowTrendUp className="text-sm" />
          <span className="font-semibold">+{change}</span>
        </div>
      );
    }

    if (change < 0) {
      return (
        <div className="flex items-center justify-center gap-1 mt-1 text-red-500 text-xs animate-[fadeIn_0.4s_ease]">
          <FaArrowTrendDown className="text-sm" />
          <span className="font-semibold">{change}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-1 mt-1 text-gray-400 text-xs animate-[fadeIn_0.4s_ease]">
        <FaMinus className="text-sm" />
        <span className="font-semibold">0</span>
      </div>
    );
  };

  return (
    <div className="bg-base-200 rounded-box py-4 p-0 text-center flex items-center justify-center flex-col max-h-48 w-full">
      {/* Header */}
      <div className="flex items-center justify-center gap-1 mb-1">
        <h2 className="font-bold text-lg text-primary">FocusIQ</h2>

        <div
          className="tooltip tooltip-bottom"
          data-tip="Brain performance score based on reaction speed, consistency & accuracy."
        >
          <FaQuestionCircle className="text-primary text-sm cursor-pointer opacity-80 hover:opacity-100" />
        </div>
      </div>

      {/* Score */}
      <div className="mb-1">
        {!focusIQ ? (
          <div className="text-md text-gray-400">Calculating...</div>
        ) : (
          <div className="text-3xl font-extrabold text-green-500 tracking-tight">
            {animatedIQ}
          </div>
        )}
      </div>

      {/* ✅ Improvement / Decline */}
      {getChangeBadge()}

      {/* ✅ Tier Badge */}
      {tier && (
        <>
          <div
            className={`badge ${tier.color} badge-md px-3 py-2 text-sm font-semibold mt-2 ${
              tier.name === "Elite Mind" ||
              tier.name === "Mastermind" ||
              tier.name === "GOD TIER"
                ? "animate-pulse"
                : ""
            }`}
          >
            {tier.name}
          </div>

          <p className="mt-1 text-xs text-base-content/70">
            Better than <span className="font-bold">{tier.percentile}%</span>{" "}
            players
          </p>
        </>
      )}

      {/* ✅ NEW PREMIUM STATS */}
      <div className="mt-3 w-full text-xs text-base-content/60 space-y-1 text-left">
        {/* ✅ Consistency */}
        {tier?.stability !== undefined && (
          <p>
            <b>Stability:</b> {tier.stability}%{" "}
            <span className="opacity-60">(Consistency)</span>
          </p>
        )}

        {/* ✅ Accuracy */}
        {tier?.accuracy !== undefined && (
          <p>
            <b>Accuracy:</b> {tier.accuracy}% correct taps
          </p>
        )}

        {/* ✅ Focus Pattern */}
        {tier?.pattern && (
          <p>
            <b>Focus Pattern:</b> {tier.pattern}
          </p>
        )}

        {/* ✅ Breakdown */}
        {tier?.breakdown && (
          <p>
            <b>Score Breakdown:</b> Speed {tier.breakdown.speed}% • Accuracy{" "}
            {tier.breakdown.accuracy}% • Consistency{" "}
            {tier.breakdown.consistency}%
          </p>
        )}

        {/* ✅ AI Insight */}
        {tier?.insight && (
          <p className="italic text-base-content/70">🧠 {tier.insight}</p>
        )}

        {/* ✅ Points to Next Tier */}
        {tier?.pointsToNext !== undefined && (
          <p className="text-primary font-semibold">
            🔓 {tier.pointsToNext} points to next tier
          </p>
        )}
      </div>

      {/* Progress Bar (optional) */}
      {/* 
      {tier && (
        <div className="mt-2 w-full">
          <progress
            className="progress progress-primary w-full h-2"
            value={progress}
            max="100"
          ></progress>
        </div>
      )} 
      */}
    </div>
  );
}
