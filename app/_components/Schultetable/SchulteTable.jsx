"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { MdVerified } from "react-icons/md";
import StartBtn from "../StartBtn";
import GameTimer from "../GameTimer";
import UserIcon from "../UserIcon";
import { supabase } from "../../_lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import { calculateScore } from "./scoreUtils";
import BoardGrid from "./BoardGrid";
import { GAME_MODES } from "./numberUtils";
import SmallScreenDetailsModal from "./SmallScreenDetailsModal";
import ShineButton from "../ShineButton";
import Confetti from "react-dom-confetti";
import { checkAndUpdateUserMissions } from "@/app/_lib/data-service";

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
  const confettiRef = useRef(null);
  const [confettiConfig, setConfettiConfig] = useState({});
  const [confettiActive, setConfettiActive] = useState(false);

  const nextTarget = useMemo(() => {
    const remaining = numbers.filter(
      (n) => !clickedNumbers.includes(getComparableValue(n))
    );

    if (remaining.length === 0) return null;

    const first = remaining[0];

    if (typeof first === "object" && typeof first.value === "number") {
      // Number-based modes (like maths)
      return remaining.sort((a, b) => a.value - b.value)[0];
    }

    // Non-number modes (emoji, word, alphabet)
    return [...remaining].sort((a, b) =>
      String(getComparableValue(a)).localeCompare(String(getComparableValue(b)))
    )[0];
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
    setConfettiActive(false);
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

        if (!insertError && user?.[0]?.id) {
          const missioN_data = await checkAndUpdateUserMissions(user[0].id);
          console.log(missioN_data);
        }

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
      } finally {
        const played = Number(localStorage.getItem("gamesPlayed") || 0);
        localStorage.setItem("gamesPlayed", played + 1);
        window.dispatchEvent(new Event("gamesPlayedUpdated"));
      }

      const timeTaken = (endTime - gameStartTime.current) / 1000;

      // 🔍 Get top 3 fastest GLOBAL times for current grid/difficulty/mode
      const { data: timeData, error: timeError } = await supabase
        .from("UniversalGameStats")
        .select("time_taken")
        .eq("grid_size", gridSize)
        .eq("difficulty", difficulty)
        .eq("game_mode", mode)
        .gt("time_taken", 0)
        .order("time_taken", { ascending: true })
        .limit(3);

      const currentTimeTaken = timeTaken;
      let position = null;

      if (timeData?.length > 0) {
        const topTimes = timeData.map((entry) => entry.time_taken);

        if (currentTimeTaken < topTimes[0]) position = 1;
        else if (topTimes[1] && currentTimeTaken < topTimes[1]) position = 2;
        else if (topTimes[2] && currentTimeTaken < topTimes[2]) position = 3;
      } else {
        // If no times exist, you're automatically 1st!
        position = 1;
      }

      if (position) {
        setConfettiActive(false); // reset

        let colors = ["#ccc", "#eee"]; // default fallback
        let positionText = "";

        if (position === 1) {
          colors = ["#FFD700", "#FFFACD", "#F5DEB3"]; // Gold
          positionText = "🔥 You're the fastest globally! #1 🥇";
        } else if (position === 2) {
          colors = ["#00FF00", "#FF0000", "#FFFF00"]; // Green, Red, Yellow
          positionText = "Great job! You're ranked #2 globally! 🥈";
        } else if (position === 3) {
          colors = ["#800080", "#DA70D6", "#BA55D3"]; // Purple shades
          positionText = "Nice! You're ranked #3 globally! 🥉";
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

        setTimeout(() => {
          setConfettiActive(true);
        }, 100);

        // Show special toast
        toast.success(
          `${positionText}\n⏱️ Completed in ${timeTaken.toFixed(2)} seconds!`
        );
      } else {
        // fallback normal toast if not in top 3
        toast(`Good Job! Completed in ${timeTaken.toFixed(2)} seconds 👏`);
      }

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
      {/* Confetti pop from center */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
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
