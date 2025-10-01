"use client";

import React, { useState, useEffect } from "react";
import {
  FaChartBar,
  FaRedoAlt,
  FaCogs,
  FaTimes,
  FaWhatsapp,
  FaTwitter,
  FaPinterest,
  FaInstagram,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getCurrentUserGameData } from "../_lib/data-service";
import BrainProfileBtn from "./BrainProfileBtn";
import { supabase } from "../_lib/supabase";
import { trackGAEvent } from "../_utils/helper";
import BrainAgeModalField from "./Modals/BrainAgeModalField";

export default function GameDataSummaryModal({
  gameSummaryData,
  showModal,
  setShowModal,
  onNewGame,
  setGridSize,
  setDifficulty,
  setMode,
  user,
}) {
  const router = useRouter();
  const [nextMode, setNextMode] = useState("");
  const [nextGridSize, setNextGridSize] = useState(0);
  const [nextDifficulty, setNextDifficulty] = useState("");
  const [lastGameId, setLastGameId] = useState("");
  const [isLoadingLastGame, setIsLoadingLastGame] = useState(false);
  const [rankData, setRankData] = useState(null);

  const { durationMs, score, mistakes, accuracy, gridSize, difficulty } =
    gameSummaryData || {};
  const timeTakenSec = (durationMs / 1000).toFixed(2);
  const shareUrl = "https://schultetable.com";
  const shareText = `I just played a game and scored ${score} points with ${accuracy}% accuracy! Can you beat me?`;

  useEffect(() => {
    if (showModal && gameSummaryData) {
      supabase
        .rpc("rank_game", { game: gameSummaryData })
        .then(({ data, error }) => {
          if (error) console.error("Error fetching rank data:", error);
          else setRankData(data);
        });

      const modes = ["number", "word", "alphabet", "emoji", "maths"];
      const difficulties = ["Easy", "Medium", "Hard", "Extreme", "Impossible"];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      const randomDifficulty =
        difficulties[Math.floor(Math.random() * difficulties.length)];
      const isLargeScreen = window.innerWidth >= 768;
      const allGridOptions = isLargeScreen ? [3, 4, 5, 6, 7, 8, 9] : [3, 4, 5];
      const gridOptions =
        randomMode === "alphabet"
          ? [3, 4, 5]
          : randomMode === "maths"
            ? allGridOptions.filter((g) => g <= 7)
            : allGridOptions;
      const randomGridSize =
        gridOptions[Math.floor(Math.random() * gridOptions.length)];

      setNextMode(randomMode);
      setNextDifficulty(randomDifficulty);
      setNextGridSize(randomGridSize);

      if (user) {
        setIsLoadingLastGame(true);
        getCurrentUserGameData(user[0].id)
          .then((data) => setLastGameId(data?.id || ""))
          .catch(() => setLastGameId(""))
          .finally(() => setIsLoadingLastGame(false));
      }
    }
  }, [showModal, user, gameSummaryData]);

  const handlePlayDifferentMode = () => {
    setGridSize(nextGridSize);
    setDifficulty(nextDifficulty);
    setMode(nextMode);
    setShowModal(false);
    onNewGame();
  };

  const handleAdvancedAnalytics = () => {
    if (lastGameId) router.push(`/game-analytics/${lastGameId}`);
  };

  return (
    <>
      {showModal && (
        <div className="modal modal-open fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="modal-box max-w-3xl shadow-lg bg-base-100 relative">
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-ghost btn-sm btn-circle absolute top-3 right-3"
            >
              <FaTimes size={18} />
            </button>

            <div className="flex items-center justify-center gap-2 text-primary text-2xl font-semibold mb-6">
              <FaChartBar /> Game Summary
            </div>

            <p className="text-center text-base-content mb-6">
              Here&apos;s a quick performance overview after your game session
            </p>
            {/* GRID STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="stat bg-base-200 rounded-lg p-4 text-center shadow">
                <div className="stat-title">Score</div>
                <div className="stat-value text-primary">{score}</div>
                <div className="stat-desc truncate">Speed & accuracy</div>
              </div>
              <div className="stat bg-base-200 rounded-lg p-4 text-center shadow">
                <div className="stat-title">Accuracy</div>
                <div className="stat-value text-success">{accuracy}%</div>
                <div className="stat-desc truncate">Mistakes: {mistakes}</div>
              </div>
              <div className="stat bg-base-200 rounded-lg p-4 text-center shadow">
                <div className="stat-title">Time Taken</div>
                <div className="stat-value text-warning">{timeTakenSec} s</div>
                <div className="stat-desc truncate">
                  Grid: {gridSize}x{gridSize}
                </div>
              </div>
              <div className="stat bg-base-200 rounded-lg p-4 text-center shadow">
                <div className="stat-title">Difficulty</div>
                <div className="stat-value text-error">{difficulty}</div>
                <div className="stat-desc truncate">Game level</div>
              </div>
              <BrainAgeModalField gameId={lastGameId} user={user} />
              {/* PRO FIELDS REMOVED FOR NOEW */}
              {/* {rankData && (
                <>
                  <div className="stat bg-base-200 rounded-lg p-4 text-center shadow">
                    <div className="stat-title">Accuracy Percentile</div>
                    <div className="stat-value text-success">
                      {rankData.accuracyPercentile}%
                    </div>
                    <div className="stat-desc truncate">
                      Your Accuracy compared to other games
                    </div>
                  </div>

                  <div className="stat bg-base-200 rounded-lg p-4 text-center shadow">
                    <div className="stat-title">Reaction Speed Percentile</div>
                    <div className="stat-value text-warning">
                      {rankData.reactionSpeedPercentile}%
                    </div>
                    <div className="stat-desc truncate">
                      Your Reaction time compared to other games
                    </div>
                  </div>

                  <div className="stat bg-base-200 rounded-lg p-4 text-center shadow">
                    <div className="stat-title">Consistency Percentile</div>
                    <div className="stat-value text-primary">
                      {rankData.consistencyPercentile}%
                    </div>
                    <div className="stat-desc truncate">
                      Your consistency compared to other games
                    </div>
                  </div>
                </>
              )} */}
              {/*  */}
              {/* ONLY PRO FIELDS */}
            </div>

            {/* SHARE BUTTONS */}
            <div className="flex gap-2 justify-center py-3 mt-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success btn-sm flex items-center justify-center gap-1"
                onClick={() => trackGAEvent("share", "WhatsApp")}
              >
                <FaWhatsapp /> WhatsApp
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-info btn-sm flex items-center justify-center gap-1"
                onClick={() => trackGAEvent("share", "Twitter")}
              >
                <FaTwitter /> X
              </a>

              <a
                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-error btn-sm flex items-center justify-center gap-1"
                onClick={() => trackGAEvent("share", "Pinterest")}
              >
                <FaPinterest /> Pinterest
              </a>

              <button
                onClick={() => {
                  trackGAEvent("share", "Instagram");
                  alert(
                    "Take a screenshot of this modal to share on Instagram!"
                  );
                }}
                className="btn btn-warning btn-sm flex items-center justify-center gap-1"
              >
                <FaInstagram /> IG
              </button>
            </div>

            {/* ACTION BUTTONS */}
            <div className="modal-action justify-center mt-6 gap-4 flex-wrap">
              <button
                onClick={() => {
                  trackGAEvent("game_action", "Play Again");
                  onNewGame();
                }}
                className="btn btn-primary text-white btn-sm"
              >
                <FaRedoAlt className="mr-1" /> Play Again
              </button>

              <button
                onClick={() => {
                  trackGAEvent("game_action", "Play Next");
                  handlePlayDifferentMode();
                }}
                className="btn btn-secondary text-white btn-sm"
              >
                <FaCogs className="mr-1" /> Play Next:{" "}
                {`${nextMode}-${nextGridSize}x${nextGridSize}-${nextDifficulty}`}
              </button>

              <BrainProfileBtn
                isLoadingLastGame={isLoadingLastGame}
                lastGameId={lastGameId}
                user={user}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
