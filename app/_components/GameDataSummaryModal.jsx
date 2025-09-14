// NOT WORKING
"use client";

import React, { useState, useEffect } from "react";
import { FaChartBar, FaRedoAlt, FaCogs, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getCurrentUserGameData } from "../_lib/data-service";
import Link from "next/link";
import BrainProfileBtn from "./BrainProfileBtn";

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

  const { durationMs, score, mistakes, accuracy, gridSize, difficulty } =
    gameSummaryData;
  console.log("USER", user);
  const timeTakenSec = (durationMs / 1000).toFixed(2);
  useEffect(() => {
    if (showModal) {
      // Random next game values — independent of user
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

      // Fetch last game ID only if user exists
      if (user) {
        setIsLoadingLastGame(true);
        getCurrentUserGameData(user[0].id)
          .then((data) => {
            console.log("DATA", data);
            if (data) {
              setLastGameId(data.id);
            } else {
              setLastGameId("");
            }
          })
          .catch(() => setLastGameId(""))
          .finally(() => setIsLoadingLastGame(false));
      }
    }
  }, [showModal, user]);

  const handlePlayDifferentMode = () => {
    setGridSize(nextGridSize);
    setDifficulty(nextDifficulty);
    setMode(nextMode);

    setShowModal(false);
    onNewGame();
  };

  const handleAdvancedAnalytics = () => {
    if (lastGameId) {
      router.push(`/game-analytics/${lastGameId}`);
    }
  };
  console.log("LAST GAME ID", lastGameId);
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
              Here’s a quick performance overview after your game session
            </p>

            <div className="stats shadow stats-horizontal text-xs w-full overflow-x-auto">
              <div className="stat">
                <div className="stat-title">Score</div>
                <div className="stat-value text-primary">{score}</div>
                <div className="stat-desc truncate">Speed & accuracy</div>
              </div>

              <div className="stat">
                <div className="stat-title">Accuracy</div>
                <div className="stat-value text-success">{accuracy}%</div>
                <div className="stat-desc truncate">Mistakes: {mistakes}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Time Taken</div>
                <div className="stat-value text-warning">{timeTakenSec} s</div>
                <div className="stat-desc truncate">
                  Grid: {gridSize}x{gridSize}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Difficulty</div>
                <div className="stat-value text-error">{difficulty}</div>
                <div className="stat-desc truncate">Game level</div>
              </div>
            </div>

            <div className="modal-action justify-center mt-6 gap-4">
              <button
                onClick={onNewGame}
                className="btn btn-primary text-white btn-sm"
              >
                <FaRedoAlt className="mr-1" /> Play Again
              </button>

              <button
                onClick={handlePlayDifferentMode}
                className="btn btn-secondary text-white btn-sm"
              >
                <FaCogs className="mr-1" /> Play Next:{" "}
                {`${nextMode}-${nextGridSize}x${nextGridSize}-${nextDifficulty}`}
              </button>
              <Link
                href={
                  user?.[0]
                    ? user?.[0].is_pro_user
                      ? `/game-analytics/${lastGameId}`
                      : `https://schultetable.lemonsqueezy.com/buy/a7ae0450-6c1d-4aa1-92c0-dfce4e3edf6e?checkout[custom][user_id]=${user[0]?.id}`
                    : "/auth/login"
                }
                target="_blank"
              >
                <BrainProfileBtn
                  isLoadingLastGame={isLoadingLastGame}
                  lastGameId={lastGameId}
                  user={user}
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
