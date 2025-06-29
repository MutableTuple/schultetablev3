"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import StartBtn from "../StartBtn";
import GameTimer from "../GameTimer";
import UserIcon from "../UserIcon";
import { supabase } from "../../_lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import { generateNumbers } from "./numberUtils";
import { calculateScore } from "./scoreUtils";
import BoardGrid from "./BoardGrid";
import { GAME_MODES } from "./numberUtils";
import SmallScreenDetailsModal from "./SmallScreenDetailsModal";

export default function SchulteTable({
  gridSize,
  gameStarted,
  difficulty,
  setGameStarted,
  user,
  mode,
}) {
  const totalTiles = gridSize * gridSize;
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [numbers, setNumbers] = useState([]);
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const [clickData, setClickData] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const lastClickTime = useRef(null);
  const gameStartTime = useRef(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(true); // toggle option
  const [gameSummaryData, setGameSummaryData] = useState(null);
  const [fastestTimeInSec, setFastestTimeInSec] = useState(null);
  const getComparableValue = (n) => (typeof n === "object" ? n.value : n);

  const nextTarget = useMemo(() => {
    const remaining = numbers.filter(
      (n) => !clickedNumbers.includes(getComparableValue(n))
    );
    return typeof remaining[0] === "object"
      ? remaining.sort((a, b) => a.value - b.value)[0]
      : Math.min(...remaining);
  }, [numbers, clickedNumbers]);

  useEffect(() => {
    const generateBoard = async () => {
      setLoadingBoard(true);
      setNumbers([]);
      setClickedNumbers([]);
      setClickData([]);
      setMistakes(0);

      try {
        const generator =
          GAME_MODES[mode]?.generate || GAME_MODES["number"].generate;

        // Simulate async for heavy modes like maths
        await new Promise((resolve) => setTimeout(resolve, 50));

        const newNumbers = generator(totalTiles, difficulty);
        setNumbers(newNumbers);
      } catch (err) {
        console.error("Error generating grid:", err);
      } finally {
        setLoadingBoard(false);
      }
    };

    generateBoard();
  }, [gridSize, difficulty, totalTiles, mode]);

  const handleStartGame = () => {
    setGameStarted(false);
    setClickedNumbers([]);
    setClickData([]);
    setMistakes(0);
    setLoadingBoard(true);

    const generator =
      GAME_MODES[mode]?.generate || GAME_MODES["number"].generate;
    const newNumbers = generator(totalTiles, difficulty);
    setNumbers(newNumbers);
    setLoadingBoard(false);

    setGameStarted(true);
    lastClickTime.current = Date.now();
    gameStartTime.current = Date.now();
  };
  const handleTileClick = async (num) => {
    const now = Date.now();
    const expected = nextTarget;
    const actualValue = typeof num === "object" ? num.value : num;

    const isCorrect = getComparableValue(num) === getComparableValue(expected);

    const interval = now - lastClickTime.current;

    if (!gameStarted) return;

    setClickData((prev) => [
      ...prev,
      {
        number: num,
        expected,
        correct: isCorrect,
        timeTakenMs: interval,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (!isCorrect) {
      setMistakes((prev) => prev + 1);
      return;
    }

    lastClickTime.current = now;

    const updatedClickedNumbers = [...clickedNumbers, getComparableValue(num)];
    setClickedNumbers(updatedClickedNumbers);

    if (updatedClickedNumbers.length === numbers.length) {
      setGameStarted(false);
      const endTime = Date.now();

      const correctClicks = [
        ...clickData,
        {
          number: num,
          expected,
          correct: true,
          timeTakenMs: interval,
          timestamp: new Date().toISOString(),
        },
      ].filter((d) => d.correct);

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
        mistakes,
        difficulty,
        gridSize,
        avgReactionTimeMs: avg,
        consistencyScore: std,
      });

      const accuracy = parseFloat(
        ((totalTiles / (totalTiles + mistakes)) * 100).toFixed(1)
      );

      const gameSummary = {
        completedAt: new Date().toISOString(),
        durationMs: endTime - gameStartTime.current,
        gridSize,
        difficulty,
        totalTiles,
        accuracy: accuracy,
        mistakes,
        avgReactionTimeMs: avg,
        fastestMs: min,
        slowestMs: max,
        consistencyScore: std,
        score,
        clicks: [
          ...clickData,
          {
            number: num,
            expected,
            correct: true,
            timeTakenMs: interval,
            timestamp: new Date().toISOString(),
          },
        ],
      };
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
              total_wrong_click: mistakes,
              time_taken: (endTime - gameStartTime.current) / 1000,
              score,
              game_mode: mode,
              accuracy,
            },
          ]);

        if (insertError) {
          console.error("Error saving to Supabase:", insertError.message);
        } else if (user?.[0]?.id) {
          // Increment the user’s total score
          const { error: updateError } = await supabase.rpc(
            "increment_user_score",
            {
              p_user_id: user[0].id,
              p_increment: score,
            }
          );

          if (updateError) {
            console.error("Error updating user score:", updateError.message);
          }
        }
      } catch (err) {
        console.error("Unexpected Supabase error:", err);
      }

      const timeTaken = (endTime - gameStartTime.current) / 1000;
      toast(`Good Job! completed it ${timeTaken.toFixed(2)}`, {
        icon: "👏",
      });

      setGameSummaryData(gameSummary);
      if (window.innerWidth < 768) setShowSummaryModal(true); // only on small screens
      window.dispatchEvent(new Event("game-finished"));
    }
  };
  useEffect(() => {
    const fetchFastestTime = async () => {
      if (!user?.[0]?.id) return;

      try {
        const { data, error } = await supabase
          .from("UniversalGameStats")
          .select("time_taken")
          .eq("user_id", user[0].id)
          .eq("grid_size", gridSize)
          .eq("difficulty", difficulty)
          .eq("game_mode", mode)
          .order("time_taken", { ascending: true })
          .limit(1);

        if (!error && data && data.length > 0) {
          setFastestTimeInSec(data[0].time_taken);
        }
      } catch (err) {
        console.error("Error fetching fastest time:", err);
      }
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
        <UserIcon
          mode={mode}
          gridSize={gridSize}
          difficulty={difficulty}
          user={user}
        />
      </div>

      {loadingBoard ? (
        <div className="w-full h-[300px] flex items-center justify-center text-lg font-bold text-primary">
          <span className="loading loading-infinity loading-xl"></span>
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

      {gameSummaryData && (
        <SmallScreenDetailsModal
          showSummaryModal={showSummaryModal}
          summaryVisible={summaryVisible}
          gameSummaryData={gameSummaryData}
          setSummaryVisible={setSummaryVisible}
          setShowSummaryModal={setShowSummaryModal}
          user={user}
        />
      )}
    </div>
  );
}
