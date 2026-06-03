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
import QuickResultBottomSheet from "../BottomModal/QuickResultBottomSheet";
import dynamic from "next/dynamic";
import LeaderBoardPopup from "../Notifications/LeaderBoardPopup";
import { useRouter } from "next/navigation";
const GameDataSummaryModalAdvanced = dynamic(
  () => import("../GameDataSummaryModalAdvanced"),
  {
    ssr: false,
    loading: () => null,
  },
);

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
  const router = useRouter();
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
  const [pendingStart, setPendingStart] = useState(null);
  // const [gameLocked, setGameLocked] = useState(false);
  const [showQuickSheet, setShowQuickSheet] = useState(false);
  const [showLeaderboardPopup, setShowLeaderboardPopup] = useState(false);
  const [leaderboardGamesPlayed, setLeaderboardGamesPlayed] = useState(1);
  const [gamesSinceLastReport, setGamesSinceLastReport] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem("games_since_last_report");
    return saved ? Number(saved) : 0;
  });
  const [country, setCountry] = useState("US");
  const [isMobile, setIsMobile] = useState(false);

  const [reportUnlocked, setReportUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("report_unlocked") === "true";
  });

  useEffect(() => {
    localStorage.setItem("games_since_last_report", gamesSinceLastReport);
  }, [gamesSinceLastReport]);
  useEffect(() => {
    localStorage.setItem("report_unlocked", reportUnlocked);
  }, [reportUnlocked]);

  // get country
  useEffect(() => {
    fetch("/api/region")
      .then((res) => res.json())
      .then((data) => {
        setCountry(data.country);
      });
  }, []);
  // ============================================
  // check mobile

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => {
    if (!pendingStart) return;

    // Apply new settings
    setGridSize(pendingStart.grid);
    setMode(pendingStart.mode);
  }, [pendingStart]);
  useEffect(() => {
    if (!pendingStart) return;

    // Wait until numbers are regenerated for new grid
    if (numbers.length === pendingStart.grid * pendingStart.grid) {
      handleStartGame();
      setPendingStart(null);
    }
  }, [numbers, pendingStart]);

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
      (n) => !clickedNumbers.includes(getComparableValue(n)),
    );
    if (!remaining.length) return null;

    const first = remaining[0];
    return typeof first === "object" && typeof first.value === "number"
      ? [...remaining].sort((a, b) => a.value - b.value)[0]
      : [...remaining].sort((a, b) =>
          String(getComparableValue(a)).localeCompare(
            String(getComparableValue(b)),
          ),
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
  const saveGameToLocalHistory = (summary) => {
    try {
      // OLD key (keep for backward compatibility)
      const oldKey = "schulte_last_10_games";

      const oldHistory = JSON.parse(localStorage.getItem(oldKey) || "[]");

      const updatedOld = [summary, ...oldHistory].slice(0, 100);

      localStorage.setItem(oldKey, JSON.stringify(updatedOld));

      // NEW unified key (THIS FIXES YOUR PROBLEM)
      const newKey = user?.id
        ? `schulte_history_user_${user.id}`
        : "schulte_history_guest";

      const newHistory = JSON.parse(localStorage.getItem(newKey) || "[]");

      const updatedNew = [summary, ...newHistory].slice(0, 100);

      localStorage.setItem(newKey, JSON.stringify(updatedNew));
    } catch (e) {
      console.error("Failed to save game history", e);
    }
  };
  const maybeShowLeaderboardPopup = () => {
    if (typeof window === "undefined") return;

    const now = Date.now();

    const lastShown = Number(localStorage.getItem("lb_popup_last")) || 0;

    const gamesSince = Number(localStorage.getItem("lb_popup_games")) || 0;

    const guestTotalGames =
      Number(localStorage.getItem("lb_guest_total_games")) || 0;

    const newGamesSince = gamesSince + 1;
    const newGuestTotal = guestTotalGames + 1;

    localStorage.setItem("lb_popup_games", newGamesSince);
    localStorage.setItem("lb_guest_total_games", newGuestTotal);

    const cooldownPassed = now - lastShown > 12 * 60 * 1000;

    const shouldShow =
      newGamesSince >= 5 && (newGamesSince >= 10 || Math.random() < 0.35);

    if (cooldownPassed && shouldShow) {
      setShowLeaderboardPopup(true);

      localStorage.setItem("lb_popup_last", now);
      localStorage.setItem("lb_popup_games", 0);
    }
  };
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
    // if (!isMobile && gamesSinceLastReport + 1 >= 10) {
    //   setGameLocked(true);
    // }
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
        times.reduce((acc, t) => acc + (t - avg) ** 2, 0) / times.length,
      ),
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
      ((totalTiles / (totalTiles + mistakes)) * 100).toFixed(1),
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
      const res = await fetch("/api/games/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || null,
          gameSummary,
          gridSize,
          difficulty,
          totalTiles,
          mistakes,
          elapsed,
          score,
          mode,
          accuracy,
          country,
          fastestMs: min,
          avgMs: avg,
          slowestMs: max,
        }),
      });

      const result = await res.json();

      if (result.position) {
        toast.success(
          result.position === 1
            ? "🔥 You're #1 globally!"
            : `You're #${result.position} globally!`,
        );
      }
    } catch (err) {
      console.error("Game save failed", err);
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
    ``;

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
        `${position === 1 ? "🔥 You're #1 globally!" : `You're #${position} globally!`} ⏱ ${timeTaken.toFixed(2)}s`,
      );
    } else {
      toast(`Completed in ${timeTaken.toFixed(2)}s 👏`);
    }

    // save FIRST
    saveGameToLocalHistory(gameSummary);

    // THEN update state
    setGameSummaryData(gameSummary);

    setGamesSinceLastReport((prev) => {
      const newCount = prev + 1;
      const isMilestone = newCount >= 10;

      if (isMilestone) {
        setReportUnlocked(true); // unlock permanently

        toast.success("🔓 Advanced Performance Report Unlocked!");

        setShowQuickSheet(true); // 👈 show bottom sheet instead
        return 10;
      }

      setShowQuickSheet(true);
      return newCount;
    });

    maybeShowLeaderboardPopup();
    window.dispatchEvent(new Event("game-finished"));
  };

  /* ===========================================
     FETCH FASTEST USER TIME
  =========================================== */
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("UniversalGameStats")
      .select("time_taken")
      .eq("user_id", user.id)
      .eq("grid_size", gridSize)
      .eq("difficulty", difficulty)
      .eq("game_mode", mode)
      .order("time_taken", { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (data?.length) setFastestTimeInSec(data[0].time_taken);
      });
  }, [user, gridSize, difficulty, mode]);

  // 🔥 ADD THIS RIGHT BELOW IT

  useEffect(() => {
    if (!user) return;

    const currentUser = user;

    // Lifetime / Pro users always unlocked
    if (currentUser.purchase_plan || currentUser.is_pro_user) {
      setReportUnlocked(true);
      setGamesSinceLastReport(10);
      return;
    }

    const totalGames = getTotalGamesPlayed(currentUser.games_played_count);

    if (totalGames >= 10) {
      setReportUnlocked(true);
      setGamesSinceLastReport(10);
    }
  }, [user]);
  /* ===========================================
     UI
  =========================================== */

  const getTotalGamesPlayed = (gamesPlayedCount) => {
    if (!gamesPlayedCount) return 0;

    let total = 0;

    Object.values(gamesPlayedCount).forEach((mode) => {
      Object.values(mode).forEach((difficulty) => {
        Object.values(difficulty).forEach((count) => {
          total += Number(count || 0);
        });
      });
    });

    return total;
  };
  const getPopupGamesPlayed = () => {
    if (user?.games_played_count) {
      return getTotalGamesPlayed(user.games_played_count);
    }

    return Number(localStorage.getItem("lb_guest_total_games") || 1);
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 gap-2">
      <LeaderBoardPopup
        open={showLeaderboardPopup}
        gamesPlayed={getPopupGamesPlayed()}
        onClose={() => setShowLeaderboardPopup(false)}
        onView={() => {
          setShowLeaderboardPopup(false);
          window.location.href = "/leaderboard";
        }}
      />
      {!gameStarted && !showLargeScreenSummaryModal && (
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
        <div
          className={
            showLargeScreenSummaryModal ? "pointer-events-none opacity-40" : ""
          }
        >
          <BoardGrid
            numbers={numbers}
            gridSize={gridSize}
            onClick={handleTileClick}
            gameStarted={gameStarted}
            clickedNumbers={clickedNumbers}
            loading={loadingBoard}
          />
        </div>
      )}

      {/* SUMMARY MODAL */}
      <GameDataSummaryModalAdvanced
        gameSummaryData={gameSummaryData}
        showModal={!!gameSummaryData && showLargeScreenSummaryModal}
        setShowModal={(v) => {
          setShowLargeScreenSummaryModal(v);
        }}
        user={user}
        mode={mode}
      />
      <QuickResultBottomSheet
        visible={showQuickSheet}
        gameSummaryData={gameSummaryData}
        gamesRemaining={
          reportUnlocked ? 0 : Math.max(0, 10 - gamesSinceLastReport)
        }
        user={user || null}
        isProUser={user?.is_pro_user || false}
        dailyUsers={1242 + Math.floor(Math.random() * 80)}
        onLogin={() => router.push("/login")}
        onUpgrade={() => router.push("/get-pro")}
        onClose={() => setShowQuickSheet(false)}
        onPlayAgain={() => {
          setShowQuickSheet(false);
          handleStartGame();
        }}
        onTryRecommendation={({ grid, mode }) => {
          setShowQuickSheet(false);
          setPendingStart({ grid, mode });
        }}
        onViewReport={() => {
          setShowQuickSheet(false);
          setShowLargeScreenSummaryModal(true);
        }}
      />
    </div>
  );
}
