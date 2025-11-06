"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaRedoAlt,
  FaCogs,
  FaTimes,
  FaWhatsapp,
  FaTwitter,
  FaPinterest,
  FaInstagram,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { supabase } from "../_lib/supabase";
import { getCurrentUserGameData } from "../_lib/data-service";
import { trackGAEvent } from "../_utils/helper";
import BrainProfileBtn from "./BrainProfileBtn";
import BrainAgeModalField from "./Modals/BrainAgeModalField";
import GameRankCard from "./GameRankCard";

const MODES = ["number", "word", "alphabet", "emoji", "maths"];
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Extreme", "Impossible"];

export default function GameDataSummaryModal({
  gameSummaryData,
  showModal,
  setShowModal,
  onNewGame,
  setGridSize,
  setDifficulty,
  setMode,
  user,
  current_game_mode,
}) {
  const router = useRouter();
  const [nextMode, setNextMode] = useState("");
  const [nextGridSize, setNextGridSize] = useState(0);
  const [nextDifficulty, setNextDifficulty] = useState("");
  const [lastGameId, setLastGameId] = useState("");
  const [isLoadingLastGame, setIsLoadingLastGame] = useState(false);
  const [rankData, setRankData] = useState(null);

  const {
    durationMs = 0,
    score = 0,
    mistakes = 0,
    accuracy = 0,
    gridSize = 0,
    difficulty = "",
  } = gameSummaryData || {};

  const timeTakenSec = useMemo(
    () => (durationMs / 1000).toFixed(2),
    [durationMs]
  );
  const shareUrl = "https://schultetable.com";
  const shareText = useMemo(
    () =>
      `I just played a game and scored ${score} points with ${accuracy}% accuracy! Can you beat me?`,
    [score, accuracy]
  );

  // Load async data after modal shows
  useEffect(() => {
    if (!showModal || !gameSummaryData) return;

    // Randomize next game settings
    const isLargeScreen = window.innerWidth >= 768;
    const allGridOptions = isLargeScreen ? [3, 4, 5, 6, 7, 8, 9] : [3, 4, 5];
    const randomMode = MODES[Math.floor(Math.random() * MODES.length)];
    const randomDifficulty =
      DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];
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

    // Fetch last game ID async
    if (user?.[0]?.id) {
      setIsLoadingLastGame(true);
      getCurrentUserGameData(user[0].id)
        .then((data) => setLastGameId(data?.id || ""))
        .catch(() => setLastGameId(""))
        .finally(() => setIsLoadingLastGame(false));
    }
  }, [showModal, user, gameSummaryData]);

  const handlePlayDifferentMode = useCallback(() => {
    setGridSize(nextGridSize);
    setDifficulty(nextDifficulty);
    setMode(nextMode);
    setShowModal(false);
    onNewGame();
  }, [
    nextGridSize,
    nextDifficulty,
    nextMode,
    setGridSize,
    setDifficulty,
    setMode,
    setShowModal,
    onNewGame,
  ]);

  const handleInstagramShare = useCallback(() => {
    trackGAEvent("share", "Instagram");
    alert("Take a screenshot of this modal to share on Instagram!");
  }, []);

  if (!showModal) return null;

  return (
    <div className="modal modal-open fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="modal-box max-w-3xl shadow-lg bg-base-100 relative">
        <button
          onClick={() => setShowModal(false)}
          className="btn btn-ghost btn-sm btn-circle absolute top-3 right-3"
        >
          <FaTimes size={18} />
        </button>

        <div className="flex items-center justify-center gap-2 text-primary text-2xl font-semibold mb-6">
          Game Summary
        </div>

        <p className="text-center text-base-content mb-6">
          Here's a quick performance overview after your game session
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
          {/* <GameRankCard
            gameSummaryData={gameSummaryData}
            gridSize={gridSize}
            difficulty={difficulty}
            gameMode={current_game_mode}
          /> */}
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
            onClick={handleInstagramShare}
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
  );
}
