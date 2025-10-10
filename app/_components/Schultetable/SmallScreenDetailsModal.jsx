"use client";
import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { supabase } from "@/app/_lib/supabase";
import { formatNumber } from "@/app/_utils/formatNumber";
import Link from "next/link";
import { getRandomGameSettings } from "@/app/_utils/randomGameSettings";

export default function SmallScreenDetailsModal({
  showSummaryModal,
  summaryVisible,
  gameSummaryData,
  setSummaryVisible,
  setShowSummaryModal,
  fastestTimeInSec = null,
  setGridSize,
  setDifficulty,
  setMode,
  setGameStarted,
  user = [],
}) {
  const [scorePercentile, setScorePercentile] = useState(null);
  const [accuracyPercentile, setAccuracyPercentile] = useState(null);
  const [timePercentile, setTimePercentile] = useState(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const setting = getRandomGameSettings();
  const isPro = user?.[0]?.is_pro_user;
  const userId = user?.[0]?.id;
  // console.log("GSD", gameSummaryData);
  const currentTimeInSec = gameSummaryData.durationMs / 1000;
  const percentageOfBest =
    fastestTimeInSec && fastestTimeInSec > 0
      ? `${Math.round((currentTimeInSec / fastestTimeInSec) * 100)}%`
      : null;

  useEffect(() => {
    // Check localStorage flag
    const hideModal = localStorage.getItem("hide_summary_modal");
    if (hideModal === "true") {
      setShowSummaryModal(false);
    }
  }, [setShowSummaryModal]);

  useEffect(() => {
    const fetchPercentiles = async () => {
      if (!gameSummaryData || !isPro || !userId) return;

      const baseParams = {
        p_user_id: userId,
        p_game_mode: gameSummaryData.game_mode,
        p_grid_size: gameSummaryData.gridSize,
        p_difficulty: gameSummaryData.difficulty,
      };

      const calculatedAccuracy = gameSummaryData.accuracy;

      try {
        const [{ data: scoreData }, { data: accData }, { data: timeData }] =
          await Promise.all([
            supabase.rpc("get_score_percentile_jsonb", {
              ...baseParams,
              p_score: gameSummaryData.score,
            }),
            supabase.rpc("get_accuracy_percentile_jsonb", {
              ...baseParams,
              p_accuracy: calculatedAccuracy,
            }),
            supabase.rpc("get_time_percentile_jsonb", {
              ...baseParams,
              p_duration_ms: gameSummaryData.durationMs,
            }),
          ]);

        setScorePercentile(scoreData ? (scoreData * 100).toFixed(1) : "N/A");
        setAccuracyPercentile(accData ? (accData * 100).toFixed(1) : "N/A");
        setTimePercentile(timeData ? (timeData * 100).toFixed(1) : "N/A");
      } catch (err) {
        console.error("Percentile fetch error:", err);
      }
    };

    fetchPercentiles();
  }, [gameSummaryData, isPro, userId]);

  const handleDontShowAgain = () => {
    localStorage.setItem("hide_summary_modal", "true");
    setDontShowAgain(true);
    setShowSummaryModal(false);
  };

  if (dontShowAgain) return null;

  return (
    <dialog
      id="my_modal_3"
      className={`modal ${showSummaryModal ? "modal-open" : ""}`}
    >
      <div className="modal-box p-4 max-w-sm w-full rounded-lg text-sm">
        {/* Close Button */}
        <button
          className="btn btn-xs btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => setShowSummaryModal(false)}
        >
          ✕
        </button>

        <h3 className="text-base font-bold text-center mb-4">
          📊 Game Summary
        </h3>

        {summaryVisible && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatItem title="Time" value={`${currentTimeInSec.toFixed(2)}s`} />
            <StatItem
              title="Accuracy"
              value={`${gameSummaryData.accuracy}%`}
              color="text-secondary"
            />
            <StatItem
              title="Score"
              value={formatNumber(gameSummaryData.score)}
              color="text-accent"
            />
            <StatItem title="Mistakes" value={gameSummaryData.mistakes} />
            <StatItem
              title="Avg Reaction"
              value={`${gameSummaryData.avgReactionTimeMs}ms`}
            />
            <StatItem
              title="Fastest"
              value={`${gameSummaryData.fastestMs}ms`}
            />
            <StatItem
              title="Slowest"
              value={`${gameSummaryData.slowestMs}ms`}
            />
            {percentageOfBest && (
              <StatItem
                title="% of Best Time"
                value={percentageOfBest}
                color="text-primary"
              />
            )}
            {isPro && (
              <>
                <StatItem
                  title="Score Percentile"
                  value={`${scorePercentile}%`}
                  color="text-success"
                />
                <StatItem
                  title="Accuracy Percentile"
                  value={`${accuracyPercentile}%`}
                  color="text-warning"
                />
                <StatItem
                  title="Time Percentile"
                  value={`${timePercentile}%`}
                  color="text-info"
                />
              </>
            )}
          </div>
        )}

        <p className="text-xs badge badge-soft badge-primary flex items-center gap-1 opacity-80 italic mt-2 text-center w-full">
          Pro tip: use <GiHamburgerMenu /> to see more details
        </p>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => setSummaryVisible(!summaryVisible)}
            className="btn btn-sm btn-outline w-full"
          >
            {summaryVisible ? "Hide Details" : "Show Details"}
          </button>
          <div className="flex gap-0.5">
            <button
              className="btn btn-sm btn-primary w-full"
              onClick={() => {
                setGridSize(setting.gridSize);
                setMode(setting.mode);
                setDifficulty(setting.difficulty);
                setGameStarted(true);
                setShowSummaryModal(false);
              }}
            >
              Play again
            </button>
            {/* <Link
              href={`/game-analytics/f294038c-30ba-4446-9a2e-85a1f95785eb`}
              className="btn btn-sm btn-primary w-1/2 btn-ghost border border-base-300 bg-success"
            >
              View advanced data
            </Link> */}
          </div>
        </div>
      </div>
    </dialog>
  );
}

function StatItem({ title, value, color = "text-base-content" }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-xs text-base-content/60">{title}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}
