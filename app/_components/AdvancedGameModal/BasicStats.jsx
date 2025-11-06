"use client";

import React, { useMemo } from "react";
import { FiTarget, FiPercent, FiClock, FiTrendingUp } from "react-icons/fi";

export default function BasicStatsXS({
  gameSummaryData = null,
  score: scoreProp,
  accuracy: accuracyProp,
  timeTakenSec: timeTakenProp,
  difficulty: difficultyProp,
}) {
  // Extract raw values if gameSummaryData exists
  const {
    durationMs = null,
    score: rawScore = null,
    accuracy: rawAccuracy = null,
    difficulty: rawDifficulty = null,
  } = gameSummaryData || {};

  // ✅ Detect loading state (only values skeleton, not full UI)
  const isLoading =
    gameSummaryData &&
    (rawScore === null || rawAccuracy === null || durationMs === null);

  const score = useMemo(
    () => rawScore ?? scoreProp ?? 0,
    [rawScore, scoreProp]
  );
  const accuracy = useMemo(
    () => rawAccuracy ?? accuracyProp ?? 0,
    [rawAccuracy, accuracyProp]
  );
  const timeTakenSec = useMemo(() => {
    if (durationMs != null) return (durationMs / 1000).toFixed(2);
    return timeTakenProp ?? 0;
  }, [durationMs, timeTakenProp]);

  const difficulty = rawDifficulty ?? difficultyProp ?? "Easy";

  // ✅ Mini skeleton UI chunk
  const Skeleton = () => (
    <div className="h-4 w-8 bg-base-300 rounded animate-pulse"></div>
  );

  return (
    <div className="stats border border-base-300 w-full text-xs mt-10">
      <div className="stat">
        <div className="stat-figure text-primary">
          <FiTarget className="h-5 w-5" />
        </div>
        <div className="stat-title">Score</div>
        <div className="stat-value text-primary text-base">
          {isLoading ? <Skeleton /> : score}
        </div>
        <div className="stat-desc text-[10px] text-base-content/60">
          Higher = better
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-success">
          <FiPercent className="h-5 w-5" />
        </div>
        <div className="stat-title">Accuracy</div>
        <div className="stat-value text-success text-base">
          {isLoading ? <Skeleton /> : `${accuracy}%`}
        </div>
        <div className="stat-desc text-[10px] text-base-content/60">
          Higher = better
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-warning">
          <FiClock className="h-5 w-5" />
        </div>
        <div className="stat-title">Time</div>
        <div className="stat-value text-warning text-base">
          {isLoading ? <Skeleton /> : `${timeTakenSec}s`}
        </div>
        <div className="stat-desc text-[10px] text-base-content/60">
          Lower is faster
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-error">
          <FiTrendingUp className="h-5 w-5" />
        </div>
        <div className="stat-title">Level</div>
        <div className="stat-value text-error text-base">
          {isLoading ? <Skeleton /> : difficulty}
        </div>
        <div className="stat-desc text-[10px] text-base-content/60">
          Game mode
        </div>
      </div>
    </div>
  );
}
