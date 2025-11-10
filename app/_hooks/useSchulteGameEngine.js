"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../_lib/supabase";
import { GAME_MODES } from "../_components/Schultetable/numberUtils";

import { calculateScore } from "../_components/Schultetable/scoreUtils";

import { checkAndUpdateUserMissions } from "@/app/_lib/data-service";
import toast from "react-hot-toast";

export function useSchulteGameEngine({
  gridSize,
  difficulty,
  user,
  mode,
  gameStarted,
  setGameStarted,
}) {
  const totalTiles = gridSize * gridSize;

  const [loadingBoard, setLoadingBoard] = useState(false);
  const [numbers, setNumbers] = useState([]);
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const clickData = useRef([]);
  const mistakes = useRef(0);
  const lastClickTime = useRef(null);
  const gameStartTime = useRef(null);

  const [gameSummaryData, setGameSummaryData] = useState(null);
  const [fastestTimeInSec, setFastestTimeInSec] = useState(null);
  const [confettiConfig, setConfettiConfig] = useState({});
  const [confettiActive, setConfettiActive] = useState(false);
  const [showLargeScreenSummaryModal, setShowLargeScreenSummaryModal] =
    useState(false);

  const sortedNumbersRef = useRef([]);
  const currentIndexRef = useRef(0);

  const getComparableValue = (n) => (typeof n === "object" ? n.value : n);

  const nextTarget =
    sortedNumbersRef.current.length > 0
      ? sortedNumbersRef.current[currentIndexRef.current] || null
      : null;

  // Generate board
  useEffect(() => {
    const generateBoard = async () => {
      setLoadingBoard(true);
      setNumbers([]);
      setClickedNumbers([]);
      clickData.current = [];
      mistakes.current = 0;
      currentIndexRef.current = 0;

      try {
        const generator =
          GAME_MODES[mode]?.generate || GAME_MODES["number"].generate;

        await new Promise((r) => setTimeout(r, 30));

        const newNumbers = generator(totalTiles, difficulty);
        setNumbers(newNumbers);

        const sorted = [...newNumbers];
        const f = sorted[0];
        typeof f === "object" && typeof f.value === "number"
          ? sorted.sort((a, b) => a.value - b.value)
          : sorted.sort((a, b) =>
              String(getComparableValue(a)).localeCompare(
                String(getComparableValue(b))
              )
            );

        sortedNumbersRef.current = sorted;
      } finally {
        setLoadingBoard(false);
      }
    };

    generateBoard();
  }, [gridSize, difficulty, totalTiles, mode]);

  const handleStartGame = () => {
    setConfettiActive(false);
    setGameStarted(false);
    setClickedNumbers([]);
    clickData.current = [];
    mistakes.current = 0;
    currentIndexRef.current = 0;

    const generator =
      GAME_MODES[mode]?.generate || GAME_MODES["number"].generate;
    const newNumbers = generator(totalTiles, difficulty);
    setNumbers(newNumbers);

    const sorted = [...newNumbers];
    const f = sorted[0];
    typeof f === "object" && typeof f.value === "number"
      ? sorted.sort((a, b) => a.value - b.value)
      : sorted.sort((a, b) =>
          String(getComparableValue(a)).localeCompare(
            String(getComparableValue(b))
          )
        );
    sortedNumbersRef.current = sorted;

    setGameStarted(true);
    lastClickTime.current = Date.now();
    gameStartTime.current = Date.now();
  };

  const handleTileClick = async (num) => {
    if (!nextTarget) return;
    if (!gameStarted) return;

    const now = Date.now();
    const expected = nextTarget;
    const interval = now - lastClickTime.current;
    const isCorrect = getComparableValue(num) === getComparableValue(expected);

    clickData.current.push({
      number: num,
      expected,
      correct: isCorrect,
      timeTakenMs: interval,
      timestamp: new Date().toISOString(),
    });

    if (!isCorrect) {
      mistakes.current += 1;
      return;
    }

    lastClickTime.current = now;
    setClickedNumbers((prev) => [...prev, getComparableValue(num)]);
    currentIndexRef.current++;

    if (currentIndexRef.current === numbers.length) {
      setGameStarted(false);
      const end = Date.now();

      const correctClicks = clickData.current.filter((d) => d.correct);
      const times = correctClicks.map((d) => d.timeTakenMs);

      const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      const min = Math.min(...times);
      const max = Math.max(...times);
      const std = Math.round(
        Math.sqrt(
          times.reduce((acc, t) => acc + Math.pow(t - avg, 2), 0) / times.length
        )
      );

      const score = calculateScore({
        durationMs: end - gameStartTime.current,
        mistakes: mistakes.current,
        difficulty,
        gridSize,
        avgReactionTimeMs: avg,
        consistencyScore: std,
      });

      const accuracy = parseFloat(
        ((totalTiles / (totalTiles + mistakes.current)) * 100).toFixed(1)
      );

      const gameSummary = {
        completedAt: new Date().toISOString(),
        durationMs: end - gameStartTime.current,
        gridSize,
        difficulty,
        totalTiles,
        accuracy,
        mistakes: mistakes.current,
        avgReactionTimeMs: avg,
        fastestMs: min,
        slowestMs: max,
        consistencyScore: std,
        score,
        clicks: clickData.current,
      };

      setGameSummaryData(gameSummary);

      // Supabase Save
      try {
        const { error } = await supabase.from("UniversalGameStats").insert([
          {
            user_id: user?.[0]?.id || null,
            game_summary: gameSummary,
            grid_size: gridSize,
            difficulty,
            total_right_click: totalTiles,
            total_wrong_click: mistakes.current,
            time_taken: (end - gameStartTime.current) / 1000,
            score,
            game_mode: mode,
            accuracy,
          },
        ]);

        if (!error && user?.[0]?.id) {
          await checkAndUpdateUserMissions(user[0].id);
          await supabase.rpc("increment_user_score", {
            p_user_id: user[0].id,
            p_increment: score,
          });
        }
      } catch (_) {}

      const finishTime = (end - gameStartTime.current) / 1000;

      // Ranking Check
      const { data: ranking } = await supabase
        .from("UniversalGameStats")
        .select("time_taken")
        .eq("grid_size", gridSize)
        .eq("difficulty", difficulty)
        .eq("game_mode", mode)
        .order("time_taken", { ascending: true })
        .limit(3);

      let position = null;
      if (!ranking?.length) position = 1;
      else {
        const t = ranking.map((x) => x.time_taken);
        if (finishTime < t[0]) position = 1;
        else if (t[1] && finishTime < t[1]) position = 2;
        else if (t[2] && finishTime < t[2]) position = 3;
      }

      if (position) {
        const isSmall = window.innerWidth < 768;
        setConfettiConfig({
          angle: 90,
          spread: 360,
          startVelocity: isSmall ? 30 : 50,
          elementCount: isSmall ? 100 : 200,
          dragFriction: 0.12,
          duration: isSmall ? 2000 : 3000,
          stagger: 3,
          width: "10px",
          height: "10px",
          perspective: "500px",
          colors:
            position === 1
              ? ["#FFD700", "#FFFACD", "#F5DEB3"]
              : position === 2
                ? ["#00FF00", "#FF0000", "#FFFF00"]
                : ["#800080", "#DA70D6", "#BA55D3"],
        });

        setTimeout(() => setConfettiActive(true), 120);
      }

      toast.success(`Completed in ${finishTime.toFixed(2)}s`);

      setShowLargeScreenSummaryModal(true);
    }
  };

  return {
    numbers,
    clickedNumbers,
    nextTarget,
    loadingBoard,
    handleStartGame,
    handleTileClick,
    gameSummaryData,
    showLargeScreenSummaryModal,
    setShowLargeScreenSummaryModal,
    confettiActive,
    confettiConfig,
  };
}
