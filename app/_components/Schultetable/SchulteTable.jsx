"use client";
import React, { useState, useEffect, useRef } from "react";
import { MdVerified } from "react-icons/md";
import StartBtn from "../StartBtn";
import GameTimer from "../GameTimer";
import UserIcon from "../UserIcon";
import { supabase } from "../../_lib/supabase";
import toast from "react-hot-toast";
import { calculateScore } from "./scoreUtils";
import BoardGrid from "./BoardGrid";
import { GAME_MODES } from "./numberUtils";

import ShineButton from "../ShineButton";
import { checkAndUpdateUserMissions } from "@/app/_lib/data-service";
import dynamic from "next/dynamic";

import GameDataSummaryModalAdvanced from "../GameDataSummaryModalAdvanced";
const Confetti = dynamic(() => import("react-dom-confetti"), { ssr: false });

export default function SchulteTable({
  gridSize,
  gameStarted,
  difficulty,
  setGameStarted,
  user,
  mode,
  setGridSize,
  setDifficulty,
  setMode,
}) {
  const totalTiles = gridSize * gridSize;
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [numbers, setNumbers] = useState([]);
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const clickData = useRef([]); // ref (no re-render per click)
  const mistakes = useRef(0); // ref (no re-render per mistake)
  const lastClickTime = useRef(null);
  const gameStartTime = useRef(null);
  const [gameSummaryData, setGameSummaryData] = useState(null);
  const [fastestTimeInSec, setFastestTimeInSec] = useState(null);
  const confettiRef = useRef(null);
  const [confettiConfig, setConfettiConfig] = useState({});
  const [confettiActive, setConfettiActive] = useState(false);
  const [showLargeScreenSummaryModal, setShowLargeScreenSummaryModal] =
    useState(false);

  const getComparableValue = (n) => (typeof n === "object" ? n.value : n);

  // New pointer-based ordering (O(1) next target lookup)
  const sortedNumbersRef = useRef([]);
  const currentIndexRef = useRef(0);

  const nextTarget =
    sortedNumbersRef.current.length > 0
      ? sortedNumbersRef.current[currentIndexRef.current] || null
      : null;

  // Generate board once per settings
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

        await new Promise((resolve) => setTimeout(resolve, 50)); // avoid blocking

        const newNumbers = generator(totalTiles, difficulty);
        setNumbers(newNumbers);

        // Pre-sort values once (not every render)
        const sortedCopy = [...newNumbers];
        const first = sortedCopy[0];

        if (typeof first === "object" && typeof first.value === "number") {
          sortedCopy.sort((a, b) => a.value - b.value);
        } else {
          sortedCopy.sort((a, b) =>
            String(getComparableValue(a)).localeCompare(
              String(getComparableValue(b))
            )
          );
        }

        sortedNumbersRef.current = sortedCopy;
      } catch (err) {
        console.error("Error generating grid:", err);
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

    const sortedCopy = [...newNumbers];
    const first = sortedCopy[0];
    if (typeof first === "object" && typeof first.value === "number") {
      sortedCopy.sort((a, b) => a.value - b.value);
    } else {
      sortedCopy.sort((a, b) =>
        String(getComparableValue(a)).localeCompare(
          String(getComparableValue(b))
        )
      );
    }
    sortedNumbersRef.current = sortedCopy;

    setGameStarted(true);
    lastClickTime.current = Date.now();
    gameStartTime.current = Date.now();
  };

  const handleTileClick = async (num) => {
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
    setClickedNumbers((c) => [...c, getComparableValue(num)]);
    currentIndexRef.current++;

    if (currentIndexRef.current === numbers.length) {
      // Game finished — unchanged logic below
      const endTime = Date.now();
      const correctClicks = clickData.current.filter((d) => d.correct);
      const timeList = correctClicks.map((d) => d.timeTakenMs);

      const avg = Math.round(
        timeList.reduce((a, b) => a + b, 0) / timeList.length
      );
      const min = Math.min(...timeList);
      const max = Math.max(...timeList);
      const std = Math.round(
        Math.sqrt(
          timeList.reduce((acc, t) => acc + Math.pow(t - avg, 2), 0) /
            timeList.length
        )
      );

      const score = calculateScore({
        durationMs: endTime - gameStartTime.current,
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
        durationMs: endTime - gameStartTime.current,
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

      setGameStarted(false);

      // ----------- unchanged supabase code -------------
      try {
        const { error: insertError } = await supabase
          .from("UniversalGameStats")
          .insert([
            {
              user_id: user?.[0]?.id || null,
              game_summary: gameSummary,
              grid_size: gridSize,
              difficulty,
              total_right_click: totalTiles,
              total_wrong_click: mistakes.current,
              time_taken: (endTime - gameStartTime.current) / 1000,
              score,
              game_mode: mode,
              accuracy,
            },
          ]);

        if (!insertError && user?.[0]?.id) {
          await checkAndUpdateUserMissions(user[0].id);
          await supabase.rpc("increment_user_score", {
            p_user_id: user[0].id,
            p_increment: score,
          });
        }
      } catch (err) {
        console.error(err);
      }

      const timeTaken = (endTime - gameStartTime.current) / 1000;

      const { data: timeData } = await supabase
        .from("UniversalGameStats")
        .select("time_taken")
        .eq("grid_size", gridSize)
        .eq("difficulty", difficulty)
        .eq("game_mode", mode)
        .gt("time_taken", 0)
        .order("time_taken", { ascending: true })
        .limit(3);

      let position = null;
      if (!timeData?.length) position = 1;
      else {
        const t = timeData.map((x) => x.time_taken);
        if (timeTaken < t[0]) position = 1;
        else if (t[1] && timeTaken < t[1]) position = 2;
        else if (t[2] && timeTaken < t[2]) position = 3;
      }

      if (position) {
        setConfettiActive(false);
        let colors = ["#ccc"];
        let msg = "";
        if (position === 1) {
          colors = ["#FFD700", "#FFFACD", "#F5DEB3"];
          msg = "🔥 You're the fastest globally! #1 🥇";
        } else if (position === 2) {
          colors = ["#00FF00", "#FF0000", "#FFFF00"];
          msg = "Great job! You're ranked #2 globally! 🥈";
        } else {
          colors = ["#800080", "#DA70D6", "#BA55D3"];
          msg = "Nice! You're ranked #3 globally! 🥉";
        }

        const isSmallScreen = window.innerWidth < 768;
        setConfettiConfig({
          angle: 90,
          spread: 360,
          startVelocity: isSmallScreen ? 30 : 50,
          elementCount: isSmallScreen ? 100 : 200,
          dragFriction: 0.12,
          duration: isSmallScreen ? 2000 : 3000,
          stagger: 3,
          width: "10px",
          height: "10px",
          perspective: "500px",
          colors,
        });

        setTimeout(() => setConfettiActive(true), 100);
        toast.success(`${msg}\n⏱️ ${timeTaken.toFixed(2)}s`);
      } else {
        toast(`Good Job! ${timeTaken.toFixed(2)}s 👏`);
      }

      setGameSummaryData(gameSummary);
      setShowLargeScreenSummaryModal(true);
      window.dispatchEvent(new Event("game-finished"));
    }
  };

  useEffect(() => {
    const fetchFastestTime = async () => {
      if (!user?.[0]?.id) return;
      const { data } = await supabase
        .from("UniversalGameStats")
        .select("time_taken")
        .eq("user_id", user[0].id)
        .eq("grid_size", gridSize)
        .eq("difficulty", difficulty)
        .eq("game_mode", mode)
        .order("time_taken", { ascending: true })
        .limit(1);
      if (data?.length > 0) setFastestTimeInSec(data[0].time_taken);
    };
    fetchFastestTime();
  }, [user, gridSize, difficulty, mode]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 gap-2">
      {!gameStarted && (
        <div onClick={handleStartGame}>
          <StartBtn />
        </div>
      )}
      {gameStarted && <GameTimer />}

      <div
        className="fixed z-50 pointer-events-none"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <Confetti active={confettiActive} config={confettiConfig} />
      </div>

      <div className="text-xl font-bold text-primary">
        {gameStarted && nextTarget && (
          <div className="text-xl font-bold text-primary">
            Next:{" "}
            {mode === "maths"
              ? getComparableValue(nextTarget)
              : typeof nextTarget === "object"
                ? nextTarget.expr
                : nextTarget}
          </div>
        )}
      </div>

      <div className="block lg:hidden">
        <ShineButton
          text="Get pro access"
          icon={<MdVerified />}
          variant="gold"
          href="/get-pro"
        />
      </div>

      <div className="block lg:hidden">
        <UserIcon
          mode={mode}
          gridSize={gridSize}
          difficulty={difficulty}
          user={user}
        />
      </div>

      {loadingBoard ? (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <span className="loading loading-infinity loading-xl text-primary" />
          <p className="mt-4 text-sm text-gray-500">Setting up your board...</p>
        </div>
      ) : (
        <BoardGrid
          numbers={numbers}
          gridSize={gridSize}
          onClick={handleTileClick}
          gameStarted={gameStarted}
          clickedNumbers={clickedNumbers}
          loading={loadingBoard}
        />
      )}

      <GameDataSummaryModalAdvanced
        gameSummaryData={gameSummaryData}
        showModal={!!gameSummaryData && showLargeScreenSummaryModal}
        setShowModal={setShowLargeScreenSummaryModal}
        user={user}
        mode={mode}
      />
    </div>
  );
}
