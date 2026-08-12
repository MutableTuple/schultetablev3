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
import { recordGameCompleted, readProgress } from "@/app/_utils/progress";
import {
  isOnboarding,
  onboardingGamesLeft,
  ONBOARDING_DIFFICULTIES,
  ONBOARDING_MODES,
  onboardingGridCap,
} from "@/app/_utils/onboarding";

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
   Board-bounds helpers — pure functions, no component state needed.

   clampDifficulty() was removed alongside the auto-advance logic; stepping a
   difficulty index up or down only made sense when the game was choosing for
   the player. clampGrid stays: it's exported and roundPlan.js relies on it to
   keep the official test's boards inside legal sizes.
───────────────────────────────────────────────────────────────────────────── */
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
/* assessPerformance() lived here and classified a round as struggled /
   steady / excelled. Its only consumer was the auto-advance logic that used
   to rewrite the player's grid, difficulty and mode after every game. Board
   selection is manual now, so it had no callers left. Removed rather than
   left dangling — recoverable from git if adaptive suggestions come back as
   an opt-in hint. */

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
  // Lifetime completed games, used only to decide whether the onboarding ramp
  // is still active. Seeded from localStorage after mount (SSR-safe: starts at
  // a value that keeps the ramp ON, so a first-time visitor never sees a hard
  // board during the hydration gap) and kept current by finishGame.
  const [lifetimeGames, setLifetimeGames] = useState(0);
  useEffect(() => {
    setLifetimeGames(readProgress().lifetimeGames);
  }, []);
  /* The Start button states the board the player has selected — it does not
     announce a board chosen for them. Settings persist between rounds now, so
     this is a readout of the current pills rather than a suggestion.
     Memoised because StartBtn is memo'd and SchulteTable re-renders on every
     tile tap during a round. */
  const startLabel = useMemo(
    () => `Start ${gridSize}×${gridSize} ${difficulty}`,
    [gridSize, difficulty],
  );
  const startSub = useMemo(() => `${MODE_LABELS[mode]} mode`, [mode]);

  /* The board is only coherent when the tile count matches the grid it's being
     laid out in. `numbers.length === 0` is the normal pre-generation state and
     is handled by the loading flag instead. */
  const boardMismatched = numbers.length > 0 && numbers.length !== totalTiles;
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
  /* True from the moment a new board is queued until it has actually been
     built. A ref, not state, and that distinction is the whole point:
     handleStartGame runs from a click handler whose closure was captured on
     the last render, so `loadingBoard` read inside it can be stale by exactly
     the window we need to guard. Refs are read synchronously and always
     current. Getting this wrong produced a 5-column grid rendering 16 tiles —
     gridSize had advanced, `numbers` had not. */
  const boardRebuildingRef = useRef(false);
  // A Start tap that arrived while the board was still being dealt. Held until
  // the board is coherent, then fired automatically. See handleStartGame.
  const [startQueued, setStartQueued] = useState(false);
  /* A proposed board for the next round. Purely advisory — it is rendered as a
     tappable chip and is never applied on its own. Cleared the moment a round
     starts so it can't linger over a game. */
  const [suggestion, setSuggestion] = useState(null);
  // Scroll position captured just before the end-of-set sheet opens, so
  // closing it can put the player back on the board instead of at the bottom
  // of the page. See the capture site in finishGame.
  const scrollBeforeModalRef = useRef(0);

  /* Closing the milestone sheet always returns the player to the board.
   *
   * Uses the two-argument window.scrollTo(x, y) rather than the options form:
   * `behavior: "instant"` isn't reliably supported and an unrecognised value
   * can cause the whole call to be ignored — which is exactly what happened in
   * testing (the page stayed at 8503px).
   *
   * Restored across several frames because the sheet's own unmount and
   * scroll-lock release run after ours; a single requestAnimationFrame gets
   * overwritten by that cleanup. Re-asserting at 0ms/60ms/180ms is cheap and
   * survives whatever the popup library does on the way out.
   */
  const closeMilestoneModal = () => {
    setShowMilestoneModal(false);
    if (typeof window === "undefined") return;
    const y = scrollBeforeModalRef.current || 0;
    const restore = () => window.scrollTo(0, y);
    requestAnimationFrame(restore);
    setTimeout(restore, 60);
    setTimeout(restore, 180);
  };

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
    // Never resize mid-round. gridSize feeds totalTiles, which feeds the CSS
    // column count — changing it during a game reflows the board under the
    // player even when the tiles themselves are untouched.
    if (gameStarted) return;
    if (mode === "alphabet" && gridSize > 5) {
      setGridSize(5);
    }
  }, [mode, gridSize, setGridSize, gameStarted]);

  useEffect(() => {
    if (!pendingStart) return;
    // A queued "try this board instead" must wait for the current round to
    // finish rather than swapping grid and mode out from under it.
    if (gameStarted) return;

    // Apply new settings
    setGridSize(pendingStart.grid);
    setMode(pendingStart.mode);
  }, [pendingStart, gameStarted]);
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
    // Same reason as the alphabet clamp: no resizing while a round is live.
    // This one could fire from an orientation change or the mobile browser's
    // URL bar collapsing, which is exactly the "it switched on its own with
    // no input from me" case.
    if (gameStarted) return;
    if (isMobile && gridSize > 4) {
      setGridSize(4);
    }
  }, [isMobile, gridSize, setGridSize, gameStarted]);

  const pickRandom = (arr, exclude) => {
    const options = arr.filter((v) => v !== exclude);
    return options[Math.floor(Math.random() * options.length)] ?? arr[0];
  };

  /* The three quick pills reshuffle grid / difficulty / mode. During the ramp
     they draw from a gentler pool so a brand-new player can't tap their way
     into 7×7 Impossible Maths on game two.

     `pool()` is the guard against the bug this shipped with: a pool of one
     makes a shuffle control silently dead, because pickRandom() removes the
     current value, finds nothing left, and returns the same value. Tapping did
     nothing and the UI gave no reason. Any constrained pool that can't offer
     an actual alternative now falls back to the full list — a pill that always
     responds beats a pill that's quietly inert. */
  const onboarding = isOnboarding(lifetimeGames);
  const pool = (limited, full) =>
    limited.filter((v) => v !== undefined).length >= 2 ? limited : full;

  const randomizeGrid = () =>
    setGridSize(
      pickRandom(
        onboarding
          ? pool(
              gridOptions.filter((g) => g <= onboardingGridCap(isMobile)),
              gridOptions,
            )
          : gridOptions,
        gridSize,
      ),
    );
  const randomizeDifficulty = () =>
    setDifficulty(
      pickRandom(
        onboarding ? pool(ONBOARDING_DIFFICULTIES, DIFFICULTIES) : DIFFICULTIES,
        difficulty,
      ),
    );
  const randomizeMode = () =>
    setMode(
      pickRandom(onboarding ? pool(ONBOARDING_MODES, MODES) : MODES, mode),
    );

  const randomPillClass =
    "px-3 py-1 text-[11px] font-bold rounded-full border bg-muted text-foreground border-border hover:border-primary hover:text-primary transition-colors";

  /* ===========================================
     GENERATE NEW GRID WHEN SETTINGS CHANGE
  =========================================== */
  useEffect(() => {
    /* NEVER REBUILD THE BOARD MID-ROUND.
     *
     * This effect wipes numbers/clickedNumbers/clickData/mistakes and deals a
     * fresh board whenever grid, difficulty or mode changes — and it had no
     * idea whether a game was in progress. Any settings change that landed
     * after the player hit Start swapped the board out from under them,
     * resetting their progress mid-round.
     *
     * The generation is also async (it yields a frame before writing), so an
     * in-flight run queued *before* Start could still land *after* it. Bumping
     * the token on the way out invalidates that pending run, so it can't
     * resolve into a live game.
     *
     * `gameStarted` is in the dep list so the board regenerates normally the
     * moment a round ends.
     */
    if (gameStarted) {
      // Invalidate any generation still in flight so it can't land mid-round.
      generationTokenRef.current += 1;
      // ...and clear the loading flag ourselves. The orphaned run's `finally`
      // is gated on `token === generationTokenRef.current`, which the bump
      // above just falsified — so it will never clear the flag. Without this
      // line the spinner stays over the board for the entire round while the
      // timer counts up behind it. handleStartGame() has already built the
      // board synchronously by this point, so there is nothing left to wait
      // for.
      setLoadingBoard(false);
      return;
    }

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
        // Board and gridSize now agree — Start is safe again.
        boardRebuildingRef.current = false;
      } catch (err) {
        console.error("Grid generation error:", err);
      } finally {
        if (token === generationTokenRef.current) setLoadingBoard(false);
      }
    };
    generate();
  }, [gridSize, difficulty, totalTiles, mode, gameStarted]);

  /* ===========================================
     START GAME
  =========================================== */
  const handleStartGame = () => {
    /* Board isn't ready yet — QUEUE the tap rather than dropping it.
     *
     * Dropping it was the old behaviour and it felt broken: you finish a
     * round, tap Start straight away, and nothing happens. The player has no
     * way to know the board is still being dealt, so they tap again, and
     * again. Now the intent is remembered and the round begins the instant the
     * board is coherent — a fast tap costs you a moment, never a lost press.
     *
     * The ref is the real guard; `loadingBoard` is checked too but can be a
     * render behind. */
    if (boardRebuildingRef.current || loadingBoard) {
      setStartQueued(true);
      return;
    }
    generationTokenRef.current += 1;

    setClickedNumbers([]);
    setClickData([]);
    setMistakes(0);

    const generator = GAME_MODES[mode]?.generate || GAME_MODES.number.generate;
    setNumbers(generator(totalTiles, difficulty));
    // The board exists as of the line above — generated synchronously, not via
    // the async effect. Clear the flag here too so the spinner can never
    // outlive the thing it was waiting for.
    setLoadingBoard(false);
    // The suggestion was for *this* round; it has been taken or declined.
    setSuggestion(null);

    setGameStarted(true);
    const now = Date.now();
    lastClickTime.current = now;
    gameStartTime.current = now;
  };

  /* Fires a queued Start once the board is genuinely ready.
   *
   * "Ready" means all three of: not flagged as rebuilding, not loading, and
   * `numbers` actually matching the current grid. That last condition is the
   * important one — the first two can both read clear for a frame while
   * `numbers` is still the previous round's array, which is exactly the
   * mismatch that produced a 5-wide grid holding 16 tiles. */
  useEffect(() => {
    if (!startQueued || gameStarted) return;
    if (boardRebuildingRef.current || loadingBoard) return;
    if (numbers.length === 0 || numbers.length !== totalTiles) return;

    setStartQueued(false);
    handleStartGame();
  }, [startQueued, gameStarted, loadingBoard, numbers, totalTiles]);

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
    setLifetimeGames(progressAfterGame.lifetimeGames);
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
      // Remember where the player was before the sheet mounts. The sheet is
      // portaled to the end of <body>, and the homepage is now ~9,000px tall
      // on mobile because of the content below the game — a browser scrolling
      // that portal into view dumps the player at the very bottom of the page,
      // with the board off-screen above them. Captured here rather than inside
      // the modal because by the modal's first effect the scroll has already
      // moved.
      scrollBeforeModalRef.current = window.scrollY;
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

    // Confetti removed from the end-of-round path entirely. It fired on every
    // single finish, which meant an animation covering the board between every
    // round — noise, not celebration, once you're playing in sets of five.
    // InstantFeedback already reports the time, score and delta inline.
    //
    // Podium finishes still get a toast: those are rare and worth interrupting
    // for.
    if (position) {
      toast.success(
        `${position === 1 ? "🔥 You're #1 globally!" : `You're #${position} globally!`} ⏱ ${timeTaken.toFixed(2)}s`,
      );
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

    /* SUGGEST A DIFFERENT BOARD — never apply one.
     *
     * This used to silently rewrite grid and mode after every round. That is
     * where every board-switching bug in this file came from: settings moving
     * on their own meant `gridSize` could advance while `numbers` still held
     * the previous round, and a Start tap in that window rendered a 5-wide
     * grid containing 16 tiles.
     *
     * Nothing is applied now. We compute a suggestion, surface it as a chip
     * the player can tap, and leave the pills exactly where they left them.
     * Manual stays manual — the game proposes, the player disposes.
     */
    const gridPool = onboarding
      ? gridOptions.filter((g) => g <= onboardingGridCap(isMobile))
      : gridOptions;
    const modePool = onboarding ? ONBOARDING_MODES : MODES;
    const pickOther = (arr, current) => {
      const others = arr.filter((v) => v !== current);
      return others.length
        ? others[Math.floor(Math.random() * others.length)]
        : null;
    };

    // Clean round -> nudge upward in size. Messy round -> keep the size and
    // offer a change of scenery instead, because handing someone a bigger
    // board right after they struggled is how you lose them.
    const cleanRound = accuracy >= 90 && mistakes === 0;
    const biggerGrids = gridPool.filter((g) => g > gridSize);
    const suggestGrid =
      cleanRound && biggerGrids.length ? biggerGrids[0] : null;
    const suggestMode = suggestGrid ? null : pickOther(modePool, mode);

    if (suggestGrid) {
      setSuggestion({
        kind: "grid",
        grid: suggestGrid,
        mode,
        label: `Try ${suggestGrid}×${suggestGrid}`,
        why: "Clean run — ready for a bigger board?",
      });
    } else if (suggestMode) {
      setSuggestion({
        kind: "mode",
        grid: gridSize,
        mode: suggestMode,
        label: `Try ${MODE_LABELS[suggestMode]} mode`,
        why: cleanRound ? "Nice run — mix it up?" : "Same size, different feel",
      });
    } else {
      setSuggestion(null);
    }
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
          {/* `loading` covers both the board being dealt and a tap already
              queued behind it — either way the press has registered and the
              round is coming, which is what the spinner needs to communicate. */}
          <StartBtn
            label={startLabel}
            sub={startQueued ? "Starting…" : startSub}
            loading={loadingBoard || startQueued}
          />
        </div>
      )}

      {/* SUGGESTION — advisory only. Tapping it applies the change; ignoring
          it leaves everything exactly as the player set it. This replaced the
          old behaviour of silently rewriting grid/mode after every round,
          which is what caused boards to swap mid-game. */}
      {!gameStarted && !showLargeScreenSummaryModal && suggestion && (
        <button
          onClick={() => {
            if (boardRebuildingRef.current || loadingBoard) return;
            if (suggestion.grid !== gridSize) setGridSize(suggestion.grid);
            if (suggestion.mode !== mode) setMode(suggestion.mode);
            setSuggestion(null);
          }}
          className="group flex flex-col items-center gap-0.5 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-2 transition-colors hover:bg-primary/20"
        >
          <span className="text-[11px] font-bold text-primary">
            {suggestion.label} →
          </span>
          <span className="text-[10px] text-muted-foreground">
            {suggestion.why}
          </span>
        </button>
      )}

      {/* QUICK PILLS — grid / difficulty / mode, no dropdown needed.
          The pill the suggestion targets gets a ring, so "you can change this"
          is visible rather than something the player has to already know. */}
      {!gameStarted && !showLargeScreenSummaryModal && (
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={randomizeGrid}
            disabled={loadingBoard}
            className={`${randomPillClass} ${loadingBoard ? "opacity-50 pointer-events-none" : ""} ${
              suggestion?.kind === "grid"
                ? "ring-2 ring-primary/50 border-primary"
                : ""
            }`}
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
            className={`${randomPillClass} ${loadingBoard ? "opacity-50 pointer-events-none" : ""} ${
              suggestion?.kind === "mode"
                ? "ring-2 ring-primary/50 border-primary"
                : ""
            }`}
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

          {/* Naming the ramp turns a silent restriction into a visible plan.
              Without this, an experienced player who clears their storage just
              sees difficulty options that won't move and assumes it's broken. */}
          {onboarding && (
            <p className="text-[10px] text-muted-foreground/70 text-center">
              Warm-up mode · {onboardingGamesLeft(lifetimeGames)} game
              {onboardingGamesLeft(lifetimeGames) === 1 ? "" : "s"} until harder
              boards unlock
            </p>
          )}
        </div>
      )}
      {gameStarted && <GameTimer />}


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

      {/* BOARD
          `boardMismatched` is a render-level invariant, not an optimisation.
          BoardGrid lays out its columns from `gridSize` but renders whatever
          is in `numbers` — so if those two ever disagree you get a visibly
          broken board (a 5-wide grid holding 16 tiles, last row orphaned).
          The guards above should prevent that state existing at all; this
          makes it impossible to *draw* even if a path slips through. */}
      {loadingBoard || boardMismatched ? (
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
        restoreScrollY={scrollBeforeModalRef.current}
        gamesInSet={POPUP_INTERVAL}
        onClose={closeMilestoneModal}
        onPlayAgain={() => {
          if (loadingBoard) return;
          closeMilestoneModal();
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
