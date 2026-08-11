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
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import InstantFeedback from "../InstantFeedback";
import { recordGameCompleted } from "@/app/_utils/progress";

const GameDataSummaryModalAdvanced = dynamic(
  () => import("../GameDataSummaryModalAdvanced"),
  {
    ssr: false,
    loading: () => null,
  },
);

// Deliberately a static import, unlike the code-split modals below.
//
// The requirement is that this paints on the same frame the 5th game ends. A
// dynamic() chunk fetch adds a network round-trip at exactly that moment, and
// `loading: () => null` means the screen shows *nothing* until it lands — the
// player reads that gap as the game hanging. Static import costs a few KB on
// first load and buys a guaranteed instant open.
//
// The modal itself then handles the second-order latency: it computes its
// averages synchronously from localStorage, and shimmers only the one cell
// that needs the server (global percentile).
import SessionMilestoneModal from "../BottomModal/SessionMilestoneModal";

// Only needed after a game finishes — code-split so they don't bloat the
// initial bundle every visitor downloads on page load.
const QuickResultBottomSheet = dynamic(
  () => import("../BottomModal/QuickResultBottomSheet"),
  {
    ssr: false,
    loading: () => null,
  },
);

const LeaderBoardPopup = dynamic(
  () => import("../Notifications/LeaderBoardPopup"),
  {
    ssr: false,
    loading: () => null,
  },
);

const Confetti = dynamic(() => import("react-dom-confetti"), { ssr: false });

const GRID_SIZES = [3, 4, 5, 6, 7, 8, 9];
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Extreme", "Impossible"];
const MODES = ["number", "word", "alphabet", "emoji", "maths"];
const MODE_LABELS = {
  number: "Number",
  word: "Word",
  alphabet: "Alphabet",
  emoji: "Emoji",
  maths: "Maths",
};

/* ─────────────────────────────────────────────────────────────────────────────
   Adaptive next-board helpers — pure functions, no component state needed.
───────────────────────────────────────────────────────────────────────────── */
function clampDifficulty(index) {
  return DIFFICULTIES[Math.min(DIFFICULTIES.length - 1, Math.max(0, index))];
}

export function clampGrid(size, mode, isMobile) {
  let cap;
  if (mode === "alphabet") cap = 5;
  else if (isMobile) cap = 4;
  else if (mode === "maths") cap = 7;
  else cap = 9;
  return Math.min(cap, Math.max(3, size));
}

// Was the player struggling, cruising, or somewhere in between? Drives the
// next board's size/difficulty so a rough game is followed by something
// easier, not a bigger, harder one.
function assessPerformance({
  accuracy,
  avgReactionTimeMs,
  mistakes,
  totalTiles,
}) {
  const mistakeRatio = totalTiles > 0 ? mistakes / totalTiles : 0;
  if (accuracy < 75 || avgReactionTimeMs > 1500 || mistakeRatio > 0.25) {
    return "struggled";
  }
  if (accuracy >= 92 && avgReactionTimeMs < 900 && mistakes === 0) {
    return "excelled";
  }
  return "steady";
}

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
  const [gameSummaryData, setGameSummaryData] = useState(null);
  const [confettiConfig, setConfettiConfig] = useState({});
  const [confettiActive, setConfettiActive] = useState(false);
  const [showLargeScreenSummaryModal, setShowLargeScreenSummaryModal] =
    useState(false);
  const [pendingStart, setPendingStart] = useState(null);
  const [showQuickSheet, setShowQuickSheet] = useState(false);
  // End-of-set modal (every 5th game) + the one server-derived number it
  // shows. Kept separate from gameSummaryData so the modal can paint before
  // the save round-trip resolves.
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [sessionServerStats, setSessionServerStats] = useState(null);
  const [sessionProgress, setSessionProgress] = useState(null);
  // Describes the board the adaptive engine picked for the next round, so the
  // Start button can name it. null until at least one game has been played.
  const [nextChallenge, setNextChallenge] = useState(null);

  // Memoised so StartBtn (memo'd) keeps referentially-stable props across the
  // re-render that fires on every tile tap during a round.
  const startLabel = useMemo(
    () =>
      nextChallenge
        ? `Start ${nextChallenge.grid}×${nextChallenge.grid} ${nextChallenge.difficulty}`
        : "Start game",
    [nextChallenge],
  );
  const [showLeaderboardPopup, setShowLeaderboardPopup] = useState(false);
  const [instantFeedback, setInstantFeedback] = useState(null);
  const [gamesSinceLastReport, setGamesSinceLastReport] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem("games_since_last_report");
    return saved ? Number(saved) : 0;
  });

  // Separate from the report-unlock counter above — this one just controls
  // how often the post-game results sheet pops up (every 5 games), so
  // players aren't interrupted after every single round.
  const [gamesSincePopup, setGamesSincePopup] = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem("games_since_popup");
    return saved ? Number(saved) : 0;
  });
  const POPUP_INTERVAL = 5;

  const [country, setCountry] = useState("US");

  const [reportUnlocked, setReportUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("report_unlocked") === "true";
  });

  const previousScoreRef = useRef(null);
  // Guards against stale async writes when gridSize/difficulty/mode change
  // faster than the 40ms generation delay can resolve (e.g. adaptive
  // board-change immediately followed by a rapid Play Again tap).
  const generationTokenRef = useRef(0);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    localStorage.setItem("games_since_last_report", gamesSinceLastReport);
  }, [gamesSinceLastReport]);
  useEffect(() => {
    localStorage.setItem("games_since_popup", gamesSincePopup);
  }, [gamesSincePopup]);
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

  // Alphabet mode can't fill a 6×6 board (only 26 letters) — clamp down to
  // a supported size if someone quick-switches into it from a larger grid.
  useEffect(() => {
    if (mode === "alphabet" && gridSize > 5) {
      setGridSize(5);
    }
  }, [mode, gridSize, setGridSize]);

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

  const baseGridOptions =
    mode === "alphabet"
      ? [3, 4, 5]
      : mode === "maths"
        ? GRID_SIZES.filter((g) => g <= 7)
        : GRID_SIZES;
  const gridOptions = isMobile
    ? baseGridOptions.filter((g) => g <= 4)
    : baseGridOptions;

  // A 5×5/6×6 board picked on desktop would overflow a phone screen, so
  // drop it to 4×4 the moment the viewport crosses into mobile width (e.g.
  // resizing, or rotating a tablet).
  useEffect(() => {
    if (isMobile && gridSize > 4) {
      setGridSize(4);
    }
  }, [isMobile, gridSize, setGridSize]);

  const pickRandom = (arr, exclude) => {
    const options = arr.filter((v) => v !== exclude);
    return options[Math.floor(Math.random() * options.length)] ?? arr[0];
  };

  const randomizeGrid = () => setGridSize(pickRandom(gridOptions, gridSize));
  const randomizeDifficulty = () =>
    setDifficulty(pickRandom(DIFFICULTIES, difficulty));
  const randomizeMode = () => setMode(pickRandom(MODES, mode));

  const randomPillClass =
    "px-3 py-1 text-[11px] font-bold rounded-full border bg-muted text-foreground border-border hover:border-primary hover:text-primary transition-colors";

  /* ===========================================
     GENERATE NEW GRID WHEN SETTINGS CHANGE
  =========================================== */
  useEffect(() => {
    const token = ++generationTokenRef.current;
    const generate = async () => {
      setLoadingBoard(true);
      setNumbers([]);
      setClickedNumbers([]);
      setClickData([]);
      setMistakes(0);

      try {
        const generator =
          GAME_MODES[mode]?.generate || GAME_MODES.number.generate;
        // Just enough to let the loading skeleton actually paint a frame
        // before swapping in the new board — not a deliberate wait.
        await new Promise((r) => setTimeout(r, 0));
        // A newer generation superseded this one (e.g. adaptive board
        // change immediately followed by another change) — drop it.
        if (token !== generationTokenRef.current) return;
        setNumbers(generator(totalTiles, difficulty));
      } catch (err) {
        console.error("Grid generation error:", err);
      } finally {
        if (token === generationTokenRef.current) setLoadingBoard(false);
      }
    };
    generate();
  }, [gridSize, difficulty, totalTiles, mode]);

  /* ===========================================
     START GAME
  =========================================== */
  const handleStartGame = () => {
    // Board isn't ready yet — ignore rapid double-taps so a game can't
    // start against a half-generated grid.
    if (loadingBoard) return;
    generationTokenRef.current += 1;

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
      // OLD key (kept — QuickResultBottomSheet's loadHistory() still falls
      // back to this if the newer keys are empty)
      const oldKey = "schulte_last_10_games";

      const oldHistory = JSON.parse(localStorage.getItem(oldKey) || "[]");

      const updatedOld = [summary, ...oldHistory].slice(0, 100);

      localStorage.setItem(oldKey, JSON.stringify(updatedOld));

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

    // Instant, non-blocking feedback for EVERY game — computed and shown
    // immediately, before any network calls, so it's actually "instant"
    // and doesn't briefly show stale data from the previous round while
    // the save/rank-check requests are in flight.
    const prevScore = previousScoreRef.current;
    const scoreDelta = prevScore
      ? Math.round(((score - prevScore) / prevScore) * 100)
      : null;
    previousScoreRef.current = score;
    setInstantFeedback({ score, accuracy, scoreDelta, timeMs: elapsed });

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

    /* ── OPEN THE END-OF-SET MODAL BEFORE THE NETWORK CALL ──────────────
       Everything the modal shows on first paint (the 5-game averages, streak,
       rank, Brain Report progress) comes from localStorage, so none of it
       needs the save below to have finished.

       This block used to sit after the `await` on saveGame, which meant the
       modal waited on a server round-trip — measured at 1133ms locally, and
       worse on real mobile networks. A second of blank screen after the last
       tile reads as the game freezing.

       Now: history is written, progression is recorded, the modal opens, and
       the save runs afterwards. `fasterThanPct` arrives later and populates
       the one line that needs it. */
    saveGameToLocalHistory(gameSummary);
    const progressAfterGame = recordGameCompleted();
    setSessionProgress(progressAfterGame);
    setGameSummaryData(gameSummary);

    // ── SESSION RHYTHM ───────────────────────────────────────────────────
    // Games 1–4 of a set finish completely uninterrupted: confetti, the inline
    // InstantFeedback line, and a Start button that names the next board. No
    // modal, no sheet, no leaderboard popup. Interrupting a player mid-flow
    // with a dialog they have to dismiss is what was costing us the session.
    //
    // The 5th game closes the set and opens SessionMilestoneModal, where the
    // averages, Brain Report progress and Pro offer live. Earning attention
    // across five rounds and asking once converts better than asking five
    // times.
    const isSetComplete = gamesSincePopup + 1 >= POPUP_INTERVAL;
    setGamesSincePopup((prev) => (prev + 1 >= POPUP_INTERVAL ? 0 : prev + 1));
    if (isSetComplete) {
      setSessionServerStats(null); // local-only view until/unless rank lands
      setShowMilestoneModal(true);
    }

    /* SAVE RESULTS — position/percentile now come from a single server call,
       no separate client-side rank check (that used to fire a second,
       redundant Supabase query and a duplicate toast). */
    let position = null;
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
      position = result.position ?? null;
      gameSummary.fasterThanPct = result.fasterThanPct ?? null;
    } catch (err) {
      console.error("Game save failed", err);
    }

    const timeTaken = elapsed / 1000;

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
      // Every finish deserves a little celebration, not just podium
      // finishes — lighter burst, same instant trigger.
      setConfettiConfig({
        angle: 90,
        spread: 100,
        startVelocity: window.innerWidth < 768 ? 18 : 28,
        elementCount: window.innerWidth < 768 ? 40 : 70,
        duration: 1400,
        colors: ["#F3A83C", "#5B8DEF", "#43C6AC"],
      });
      setTimeout(() => setConfettiActive(true), 80);
      // No toast for an ordinary finish. Confetti fires, and InstantFeedback
      // already renders the time, score and delta inline above the Start
      // button — a toast on top of both was a third notification for one
      // event. Podium finishes above keep their toast: rare and worth
      // interrupting for.
    }

    // The local write, progression record, and modal open all happened before
    // the await above — see the block above the save. Only the things that
    // genuinely depend on the server response are left down here.

    // `fasterThanPct` resolved from the save — feed it to the already-open
    // modal so its global-rank line appears without having delayed the paint.
    if (gameSummary.fasterThanPct != null) {
      setSessionServerStats({ fasterThanPct: gameSummary.fasterThanPct });
    }

    // Report-unlock tracking — still counts every game toward 10, unrelated
    // to how often the results sheet itself pops up.
    setGamesSinceLastReport((prev) => {
      const newCount = prev + 1;
      const isMilestone = newCount >= 10;

      if (isMilestone) {
        setReportUnlocked(true); // unlock permanently
        toast.success("🔓 Advanced Performance Report Unlocked!");
      }

      return isMilestone ? 10 : newCount;
    });

    // Leaderboard popup only mid-set — never stacked on top of the milestone
    // modal, which has already opened above if this game closed the set.
    if (!isSetComplete) maybeShowLeaderboardPopup();

    window.dispatchEvent(new Event("game-finished"));

    // Adapt the NEXT board to how this one went. A rough game (low
    // accuracy, slow reactions, lots of mistakes) steps difficulty/size
    // DOWN instead of handing back something bigger and harder — that's
    // how you overwhelm someone who's already struggling. A clean game
    // steps up. This only updates state for the next round; it does NOT
    // start a new game — the player still has to hit Play Again/Start.
    const difficultyIndex = DIFFICULTIES.indexOf(difficulty);
    const performance = assessPerformance({
      accuracy,
      avgReactionTimeMs: avg,
      mistakes,
      totalTiles,
    });

    let nextMode = mode;
    let nextDifficulty = difficulty;
    let nextGrid = gridSize;

    if (performance === "struggled") {
      nextDifficulty = clampDifficulty(difficultyIndex - 1);
      nextGrid = clampGrid(gridSize - 1, mode, isMobile);
    } else if (performance === "excelled") {
      nextDifficulty = clampDifficulty(difficultyIndex + 1);
      // Only introduce a new symbol set on a clean win — someone already
      // struggling shouldn't also have to relearn a mode.
      nextMode = Math.random() < 0.3 ? pickRandom(MODES, mode) : mode;
      nextGrid = clampGrid(gridSize + 1, nextMode, isMobile);
    } else {
      nextMode = Math.random() < 0.35 ? pickRandom(MODES, mode) : mode;
      nextGrid = clampGrid(gridSize, nextMode, isMobile);
    }

    setMode(nextMode);
    setDifficulty(nextDifficulty);
    setGridSize(nextGrid);

    // Publish the pick so StartBtn can name it. `reason` is what turns a
    // silent difficulty bump into something the player reads as a response to
    // how they just did — the step down in particular needs saying out loud,
    // otherwise an easier board after a bad round feels like the game
    // glitched rather than like it adapted.
    const changed =
      nextGrid !== gridSize ||
      nextDifficulty !== difficulty ||
      nextMode !== mode;
    setNextChallenge({
      grid: nextGrid,
      difficulty: nextDifficulty,
      mode: nextMode,
      reason:
        performance === "excelled"
          ? "You earned the step up"
          : performance === "struggled"
            ? "Dialled back — rebuild the rhythm"
            : changed
              ? "New board, same pace"
              : "Beat your last run",
    });
  };

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

  const pillClass = (active) =>
    `px-3 py-1 text-[11px] font-bold rounded-full border transition-colors ${
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-muted text-muted-foreground border-border hover:text-foreground"
    }`;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
      <LeaderBoardPopup
        open={showLeaderboardPopup}
        gamesPlayed={getPopupGamesPlayed()}
        onClose={() => setShowLeaderboardPopup(false)}
        onView={() => {
          setShowLeaderboardPopup(false);
          window.location.href = "/leaderboard";
        }}
      />

      {/* FEEDBACK — above the Start button */}
      {!gameStarted && instantFeedback && (
        <InstantFeedback feedback={instantFeedback} />
      )}

      {!gameStarted && !showLargeScreenSummaryModal && (
        <div
          onClick={loadingBoard ? undefined : handleStartGame}
          aria-disabled={loadingBoard}
        >
          {/* One element in both states — the spinner lives inside StartBtn,
              so the button keeps its size, position and label while the board
              generates instead of being swapped for a differently-shaped pill. */}
          <StartBtn
            label={startLabel}
            sub={nextChallenge?.reason ?? null}
            loading={loadingBoard}
          />
        </div>
      )}

      {/* QUICK PILLS — grid / difficulty / mode, no dropdown needed */}
      {!gameStarted && !showLargeScreenSummaryModal && (
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={randomizeGrid}
            disabled={loadingBoard}
            className={`${randomPillClass} ${loadingBoard ? "opacity-50 pointer-events-none" : ""}`}
          >
            {gridSize}×{gridSize}
          </button>
          <button
            onClick={randomizeDifficulty}
            disabled={loadingBoard}
            className={`${randomPillClass} ${loadingBoard ? "opacity-50 pointer-events-none" : ""}`}
          >
            {difficulty}
          </button>
          <button
            onClick={randomizeMode}
            disabled={loadingBoard}
            className={`${randomPillClass} ${loadingBoard ? "opacity-50 pointer-events-none" : ""}`}
          >
            {MODE_LABELS[mode]}
          </button>
        </div>
      )}
      {!gameStarted && !showLargeScreenSummaryModal && (
        <div className="w-full max-w-[240px] flex flex-col items-center gap-1.5 mt-1">
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-150"
              style={{
                width: `${Math.min((gamesSincePopup / POPUP_INTERVAL) * 100, 100)}%`,
              }}
            />
          </div>
          {/* Names the payoff at the end of the set. "See your stats" was
              vague enough to be ignorable; the player needs to know a real
              summary is waiting, otherwise there's no reason to finish the
              five. */}
          <p className="text-[11px] text-muted-foreground text-center">
            {gamesSincePopup === 0
              ? `${POPUP_INTERVAL} games → your session report`
              : `${POPUP_INTERVAL - gamesSincePopup} more game${
                  POPUP_INTERVAL - gamesSincePopup === 1 ? "" : "s"
                } → your session report`}
          </p>
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

      {/* NEXT TARGET — fixed inline colors so it's always legible in dark mode,
          regardless of how bg-accent/text-accent-foreground resolve elsewhere */}
      {gameStarted && nextTarget && (
        <Badge
          className="rounded-full px-4 py-1.5 text-base font-bold shadow-sm"
          style={{ background: "#F3A83C", color: "#1a1206" }}
        >
          Next:{" "}
          {mode === "maths"
            ? getComparableValue(nextTarget)
            : (nextTarget.expr ?? nextTarget)}
        </Badge>
      )}

      {/* FASTEST USER — between the start controls and the board, shown on
          every screen size now (used to be mobile-only). */}
      {!gameStarted && (
        <UserIcon
          mode={mode}
          gridSize={gridSize}
          difficulty={difficulty}
          user={user}
        />
      )}

      {/* BOARD */}
      {loadingBoard ? (
        <div className="flex flex-col items-center justify-center h-[300px] w-full max-w-sm rounded-3xl border border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Setting up your board...
          </p>
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
      {/* END-OF-SET MODAL — every 5th game. This is now the only scheduled
          interruption in the loop.

          Mount-gated, not just visibility-gated: the import is static (so the
          module is parsed and ready for an instant open), but there's no
          reason for its hooks, memos and effects to run on every page load for
          a component that appears once per five games. Static import + mount
          gate gives instant open AND zero cost while closed. */}
      {showMilestoneModal && (
      <SessionMilestoneModal
        visible={showMilestoneModal}
        user={user || null}
        isProUser={user?.is_pro_user || user?.purchase_plan ? true : false}
        gamesRemaining={
          reportUnlocked ? 0 : Math.max(0, 10 - gamesSinceLastReport)
        }
        serverStats={sessionServerStats}
        sessionProgress={sessionProgress}
        isMobile={isMobile}
        gamesInSet={POPUP_INTERVAL}
        onClose={() => setShowMilestoneModal(false)}
        onPlayAgain={() => {
          if (loadingBoard) return;
          setShowMilestoneModal(false);
          handleStartGame();
        }}
        onUpgrade={() => router.push("/get-pro")}
        onLogin={() => router.push("/auth/register")}
      />
      )}

      {/* Per-round sheet. No longer part of the default loop — the session
          rhythm above routes every 5th game to SessionMilestoneModal instead
          and leaves rounds 1–4 uninterrupted. Kept mounted only when actually
          shown so its dynamic chunk isn't fetched for a component that can't
          appear; still wired up so a per-round sheet can be switched back on
          by setting showQuickSheet. */}
      {showQuickSheet && (
      <QuickResultBottomSheet
        visible={showQuickSheet}
        sessionProgress={sessionProgress}
        gameSummaryData={gameSummaryData}
        gamesRemaining={
          reportUnlocked ? 0 : Math.max(0, 10 - gamesSinceLastReport)
        }
        user={user || null}
        isProUser={user?.is_pro_user || false}
        onLogin={() => router.push("/login")}
        onUpgrade={() => router.push("/get-pro")}
        onClose={() => setShowQuickSheet(false)}
        onPlayAgain={() => {
          if (loadingBoard) return;
          setShowQuickSheet(false);
          handleStartGame();
        }}
        onTryRecommendation={({ grid, mode }) => {
          if (loadingBoard) return;
          setShowQuickSheet(false);
          setPendingStart({ grid, mode });
        }}
        onViewReport={() => {
          setShowQuickSheet(false);
          setShowLargeScreenSummaryModal(true);
        }}
      />
      )}
    </div>
  );
}
