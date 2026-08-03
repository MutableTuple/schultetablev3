"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Target, Shuffle, Calculator, CheckCircle2, PlayCircle } from "lucide-react";

import BrainTestRound from "./BrainTestRound";
import RoundTransition from "./RoundTransition";
import BrainTestComplete from "./BrainTestComplete";
import BrainTestBranding from "./BrainTestBranding";
import BrainTestLeaderboard from "./BrainTestLeaderboard";
import Navbar from "../Navbar";
import { BRAIN_TEST_TOTAL_ROUNDS, getEffectiveRound } from "./roundPlan";
import {
  getSession,
  createSession,
  addRound,
  clearSession,
  markClaimed,
  saveRoundToGameHistory,
  bumpGamesSinceLastReport,
} from "@/app/_lib/brainTestSession";

const FEATURES = [
  { icon: Zap, label: "Reaction speed" },
  { icon: Target, label: "Focus & attention" },
  { icon: Shuffle, label: "Pattern switching" },
  { icon: Calculator, label: "Mental math" },
];

export default function OfcSchultetableTest({ user }) {
  const [phase, setPhase] = useState("intro"); // intro | countdown | playing | transition | complete
  const [session, setSession] = useState(null);
  const [lastRoundSummary, setLastRoundSummary] = useState(null);
  const [countdownValue, setCountdownValue] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [country, setCountry] = useState("US");
  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);
  const claimAttempted = useRef(false);

  /* INITIAL LOAD */
  useEffect(() => {
    const existing = getSession();
    if (existing) {
      setSession(existing);
      if (existing.rounds.length >= BRAIN_TEST_TOTAL_ROUNDS) {
        setPhase("complete");
      }
    }
  }, []);

  /* VIEWPORT */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* COUNTRY */
  useEffect(() => {
    fetch("/api/region")
      .then((res) => res.json())
      .then((data) => setCountry(data.country))
      .catch(() => {});
  }, []);

  /* CLAIM ANONYMOUS ROUNDS ON LOGIN */
  useEffect(() => {
    if (!user?.id || !session || session.claimed || claimAttempted.current) return;
    if (session.rounds.length === 0) return;

    claimAttempted.current = true;
    fetch("/api/brain-test/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.sessionId }),
    })
      .then((res) => res.json())
      .then(() => {
        setSession((prev) => (prev ? markClaimed(prev) : prev));
      })
      .catch((err) => console.error("Brain test claim failed", err));
  }, [user, session]);

  /* COUNTDOWN */
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdownValue <= 0) {
      setPhase("playing");
      return;
    }
    const t = setTimeout(() => setCountdownValue((v) => v - 1), 700);
    return () => clearTimeout(t);
  }, [phase, countdownValue]);

  const handleStartOrResume = useCallback(() => {
    let s = session;
    if (!s) {
      s = createSession();
      setSession(s);
    }
    if (s.rounds.length === 0) {
      setCountdownValue(3);
      setPhase("countdown");
    } else {
      setPhase("playing");
    }
  }, [session]);

  const handleRoundComplete = useCallback(
    (summary) => {
      const activeSession = session || createSession();
      const roundIndex = activeSession.rounds.length + 1;

      // 1) Persist locally — instant, resilient to refresh.
      const updated = addRound(activeSession, summary);
      setSession(updated);
      saveRoundToGameHistory(summary, user?.id || null);
      bumpGamesSinceLastReport();
      window.dispatchEvent(new Event("game-finished"));

      // 2) Persist to DB — anonymous (user_id null) if guest, real id if not.
      fetch("/api/brain-test/round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameSummary: summary,
          gridSize: summary.gridSize,
          difficulty: summary.difficulty,
          totalTiles: summary.totalTiles,
          mistakes: summary.mistakes,
          elapsed: summary.durationMs,
          score: summary.score,
          mode: summary.mode,
          accuracy: summary.accuracy,
          country,
          fastestMs: summary.fastestMs,
          avgMs: summary.avgReactionTimeMs,
          slowestMs: summary.slowestMs,
          sessionId: updated.sessionId,
          roundIndex,
        }),
      }).catch((err) => console.error("Brain test round save failed", err));

      setLastRoundSummary(summary);

      if (updated.rounds.length >= BRAIN_TEST_TOTAL_ROUNDS) {
        setPhase("complete");

        // 3) Save the finished attempt as one row in the dedicated
        // BrainTestSessions table — this is what feeds the leaderboard.
        fetch("/api/brain-test/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: updated.sessionId,
            rounds: updated.rounds,
            startedAt: updated.startedAt,
            country,
          }),
        })
          .then(() => setLeaderboardRefreshKey((k) => k + 1))
          .catch((err) => console.error("Brain test session save failed", err));
      } else {
        setPhase("transition");
      }
    },
    [session, user, country],
  );

  const handleContinue = useCallback(() => {
    setPhase("playing");
  }, []);

  const handlePlayAgain = useCallback(() => {
    clearSession();
    const fresh = createSession();
    setSession(fresh);
    setLastRoundSummary(null);
    claimAttempted.current = false;
    setPhase("intro");
  }, []);

  const roundsDone = session?.rounds.length || 0;
  const currentRound = getEffectiveRound(roundsDone, isMobile);
  const previousScore =
    session?.rounds.length >= 2 ? session.rounds[session.rounds.length - 2].score : null;

  return (
    <div className="min-h-screen min-h-dvh bg-background">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col xl:flex-row items-start gap-6">
          <BrainTestBranding />

          <div className="flex-1 min-w-0 w-full flex flex-col items-center justify-center min-h-[60vh]">
            {phase === "intro" && (
              <IntroScreen
                key="intro"
                user={user}
                roundsDone={roundsDone}
                onStart={handleStartOrResume}
              />
            )}

            {phase === "countdown" && (
              <motion.div
                key="countdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <motion.span
                  key={countdownValue}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-7xl font-black text-primary"
                >
                  {countdownValue > 0 ? countdownValue : "Go!"}
                </motion.span>
                <p className="text-sm text-muted-foreground">Get ready...</p>
              </motion.div>
            )}

            {phase === "playing" && currentRound && (
              <BrainTestRound
                key={`round-${roundsDone}`}
                round={currentRound}
                roundIndex={roundsDone + 1}
                totalRounds={BRAIN_TEST_TOTAL_ROUNDS}
                onRoundComplete={handleRoundComplete}
              />
            )}

            {phase === "transition" && lastRoundSummary && (
              <RoundTransition
                key={`transition-${roundsDone}`}
                summary={lastRoundSummary}
                roundIndex={roundsDone}
                totalRounds={BRAIN_TEST_TOTAL_ROUNDS}
                previousScore={previousScore}
                isGuest={!user?.id}
                onContinue={handleContinue}
              />
            )}

            {phase === "complete" && session && (
              <BrainTestComplete
                key="complete"
                session={session}
                user={user}
                onPlayAgain={handlePlayAgain}
              />
            )}
          </div>

          <BrainTestLeaderboard refreshKey={leaderboardRefreshKey} />
        </div>
      </div>
    </div>
  );
}

function IntroScreen({ user, roundsDone, onStart }) {
  const isResume = roundsDone > 0 && roundsDone < BRAIN_TEST_TOTAL_ROUNDS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-10 text-center shadow-xl"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
        <Brain className="text-primary" size={30} />
      </div>

      <h1 className="mt-4 text-2xl sm:text-3xl font-black text-foreground">The Brain Test</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        10 rounds. Different grids, difficulties, and games. One report on your mind.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2.5 text-left">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5"
          >
            <Icon size={15} className="text-primary shrink-0" />
            <span className="text-xs font-semibold text-foreground">{label}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[11px] text-muted-foreground">⏱️ Takes about 5 minutes</p>

      {isResume && (
        <p className="mt-2 text-[11px] font-semibold text-primary">
          You're {roundsDone}/{BRAIN_TEST_TOTAL_ROUNDS} rounds in — pick up where you left off.
        </p>
      )}

      <button
        onClick={onStart}
        className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-transform"
      >
        <PlayCircle size={18} />
        {isResume ? "Resume the Brain Test" : "Start the Brain Test"}
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        {user?.id ? (
          <>
            <CheckCircle2 size={12} className="text-primary" />
            Signed in — results save to your account
          </>
        ) : (
          "Playing as guest — your progress is saved on this device"
        )}
      </p>
    </motion.div>
  );
}
