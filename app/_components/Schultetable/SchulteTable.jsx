"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import StartBtn from "../StartBtn";
import GameTimer from "../GameTimer";
import UserIcon from "../UserIcon";
import { supabase } from "../../_lib/supabase";
import toast from "react-hot-toast";
import { calculateScore } from "./scoreUtils";
import BoardGrid from "./BoardGrid";
import { GAME_MODES } from "./numberUtils";
import { checkAndUpdateUserMissions } from "@/app/_lib/data-service";
import dynamic from "next/dynamic";
import GameDataSummaryModalAdvanced from "../GameDataSummaryModalAdvanced";

const Confetti = dynamic(() => import("react-dom-confetti"), { ssr: false });

/* ===========================================
   COMPONENT
=========================================== */
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
  /* ===========================================
     STATE
  =========================================== */
  const totalTiles = gridSize * gridSize;
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [numbers, setNumbers] = useState([]);
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const [clickData, setClickData] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(true);
  const [gameSummaryData, setGameSummaryData] = useState(null);
  const [fastestTimeInSec, setFastestTimeInSec] = useState(null);
  const [confettiConfig, setConfettiConfig] = useState({});
  const [confettiActive, setConfettiActive] = useState(false);
  const [showLargeScreenSummaryModal, setShowLargeScreenSummaryModal] =
    useState(false);

  /* ===========================================
     REFS
  =========================================== */
  const lastClickTime = useRef(null);
  const gameStartTime = useRef(null);

  /* ===========================================
     HELPERS
  =========================================== */
  const getComparableValue = (n) => (typeof n === "object" ? n.value : n);

  const nextTarget = useMemo(() => {
    const remaining = numbers.filter(
      (n) => !clickedNumbers.includes(getComparableValue(n))
    );
    if (!remaining.length) return null;

    const first = remaining[0];
    return typeof first === "object" && typeof first.value === "number"
      ? [...remaining].sort((a, b) => a.value - b.value)[0]
      : [...remaining].sort((a, b) =>
          String(getComparableValue(a)).localeCompare(
            String(getComparableValue(b))
          )
        )[0];
  }, [numbers, clickedNumbers]);

  /* ===========================================
     GENERATE NEW GRID WHEN SETTINGS CHANGE
  =========================================== */
  useEffect(() => {
    const generate = async () => {
      setLoadingBoard(true);
      setNumbers([]);
      setClickedNumbers([]);
      setClickData([]);
      setMistakes(0);

      try {
        const generator =
          GAME_MODES[mode]?.generate || GAME_MODES.number.generate;
        await new Promise((r) => setTimeout(r, 40));
        setNumbers(generator(totalTiles, difficulty));
      } catch (err) {
        console.error("Grid generation error:", err);
      } finally {
        setLoadingBoard(false);
      }
    };
    generate();
  }, [gridSize, difficulty, totalTiles, mode]);

  /* ===========================================
     START GAME
  =========================================== */
  const handleStartGame = () => {
    setConfettiActive(false);
    setClickedNumbers([]);
    setClickData([]);
    setMistakes(0);

    const generator = GAME_MODES[mode]?.generate || GAME_MODES.number.generate;
    setNumbers(generator(totalTiles, difficulty));

    setGameStarted(true);
    const now = Date.now();
    lastClickTime.current = now;
    gameStartTime.current = now;
  };

  /* ===========================================
     TILE CLICK LOGIC
  =========================================== */
  const handleTileClick = async (num) => {
    if (!gameStarted) return;

    const now = Date.now();
    const expected = nextTarget;
    const actualValue = getComparableValue(num);
    const expectedValue = getComparableValue(expected);
    const correct = actualValue === expectedValue;
    const timeTakenMs = now - lastClickTime.current;

    setClickData((p) => [
      ...p,
      {
        number: num,
        expected,
        correct,
        timeTakenMs,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (!correct) {
      setMistakes((m) => m + 1);
      return;
    }

    lastClickTime.current = now;
    const updated = [...clickedNumbers, actualValue];
    setClickedNumbers(updated);

    if (updated.length !== numbers.length) return;

    /* GAME COMPLETED */
    setGameStarted(false);
    const endTime = Date.now();
    const elapsed = endTime - gameStartTime.current;
    const allCorrect = [
      ...clickData,
      {
        number: num,
        expected,
        correct: true,
        timeTakenMs,
        timestamp: new Date().toISOString(),
      },
    ].filter((d) => d.correct);

    const times = allCorrect.map((d) => d.timeTakenMs);
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const min = Math.min(...times);
    const max = Math.max(...times);
    const std = Math.round(
      Math.sqrt(
        times.reduce((acc, t) => acc + (t - avg) ** 2, 0) / times.length
      )
    );

    const score = calculateScore({
      durationMs: elapsed,
      mistakes,
      difficulty,
      gridSize,
      avgReactionTimeMs: avg,
      consistencyScore: std,
    });

    const accuracy = Number(
      ((totalTiles / (totalTiles + mistakes)) * 100).toFixed(1)
    );

    const gameSummary = {
      completedAt: new Date().toISOString(),
      durationMs: elapsed,
      gridSize,
      difficulty,
      totalTiles,
      accuracy,
      mistakes,
      avgReactionTimeMs: avg,
      fastestMs: min,
      slowestMs: max,
      consistencyScore: std,
      score,
      clicks: allCorrect,
    };

    /* SAVE RESULTS */
    try {
      await supabase.from("UniversalGameStats").insert([
        {
          user_id: user?.[0]?.id || null,
          game_summary: gameSummary,
          grid_size: gridSize,
          difficulty,
          total_right_click: totalTiles,
          total_wrong_click: mistakes,
          time_taken: elapsed / 1000,
          score,
          game_mode: mode,
          accuracy,
        },
      ]);

      if (user?.[0]?.id) {
        await supabase.rpc("increment_user_score", {
          p_user_id: user[0].id,
          p_increment: score,
        });
        await checkAndUpdateUserMissions(user[0].id);
      }
    } catch (err) {
      console.error(err);
    }

    /* GLOBAL TIME RANK CHECK */
    const timeTaken = elapsed / 1000;
    const { data: timeData } = await supabase
      .from("UniversalGameStats")
      .select("time_taken")
      .eq("grid_size", gridSize)
      .eq("difficulty", difficulty)
      .eq("game_mode", mode)
      .order("time_taken", { ascending: true })
      .limit(3);

    const top = timeData?.map((d) => d.time_taken) || [];
    const position =
      top.length === 0
        ? 1
        : timeTaken < top[0]
          ? 1
          : top[1] && timeTaken < top[1]
            ? 2
            : top[2] && timeTaken < top[2]
              ? 3
              : null;

    if (position) {
      const colorSets = {
        1: ["#FFD700", "#FFFACD", "#F5DEB3"],
        2: ["#00FF00", "#FF0000", "#FFFF00"],
        3: ["#800080", "#DA70D6", "#BA55D3"],
      };

      setConfettiConfig({
        angle: 90,
        spread: 360,
        startVelocity: window.innerWidth < 768 ? 30 : 50,
        elementCount: window.innerWidth < 768 ? 100 : 200,
        duration: 2500,
        colors: colorSets[position],
      });

      setTimeout(() => setConfettiActive(true), 80);

      toast.success(
        `${position === 1 ? "🔥 You're #1 globally!" : `You're #${position} globally!`} ⏱ ${timeTaken.toFixed(2)}s`
      );
    } else {
      toast(`Completed in ${timeTaken.toFixed(2)}s 👏`);
    }

    setGameSummaryData(gameSummary);
    setShowLargeScreenSummaryModal(true);
    window.dispatchEvent(new Event("game-finished"));
  };

  /* ===========================================
     FETCH FASTEST USER TIME
  =========================================== */
  useEffect(() => {
    if (!user?.[0]?.id) return;
    supabase
      .from("UniversalGameStats")
      .select("time_taken")
      .eq("user_id", user[0].id)
      .eq("grid_size", gridSize)
      .eq("difficulty", difficulty)
      .eq("game_mode", mode)
      .order("time_taken", { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (data?.length) setFastestTimeInSec(data[0].time_taken);
      });
  }, [user, gridSize, difficulty, mode]);

  /* ===========================================
     UI
  =========================================== */
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 gap-2">
      {!gameStarted && (
        <div onClick={handleStartGame}>
          <StartBtn />
        </div>
      )}
      {gameStarted && <GameTimer />}

      {/* CONFETTI */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <Confetti active={confettiActive} config={confettiConfig} />
      </div>

      {/* NEXT TARGET */}
      {gameStarted && nextTarget && (
        <div className="text-xl font-bold text-primary">
          Next:{" "}
          {mode === "maths"
            ? getComparableValue(nextTarget)
            : (nextTarget.expr ?? nextTarget)}
        </div>
      )}

      {/* MOBILE UI */}
      <div className="block lg:hidden">
        {/* <ShineButton
          text="Get pro access"
          icon={<MdVerified />}
          variant="gold"
          href="/get-pro"
        /> */}
      </div>
      <div className="block lg:hidden">
        <UserIcon
          mode={mode}
          gridSize={gridSize}
          difficulty={difficulty}
          user={user}
        />
      </div>

      {/* BOARD */}
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

      {/* SUMMARY MODAL */}
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
