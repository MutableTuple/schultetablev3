"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Trophy,
  Zap,
  Target,
  Timer,
  TrendingUp,
  RotateCcw,
  FileBarChart,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RibbonConfetti from "./RibbonConfetti";

const CenterConfetti = dynamic(() => import("react-dom-confetti"), { ssr: false });

const CENTER_CONFETTI_CONFIG = {
  angle: 90,
  spread: 360,
  startVelocity: 45,
  elementCount: 220,
  duration: 3200,
  colors: ["#FFD700", "#F3A83C", "#5B8DEF", "#43C6AC", "#FF5E5B", "#C084FC"],
};

function computeAggregates(rounds) {
  const totalScore = rounds.reduce((a, r) => a + r.score, 0);
  const avgReactionMs = Math.round(
    rounds.reduce((a, r) => a + r.avgReactionTimeMs, 0) / rounds.length,
  );
  const fastestMs = Math.min(...rounds.map((r) => r.fastestMs));
  const overallAccuracy = Number(
    (rounds.reduce((a, r) => a + r.accuracy, 0) / rounds.length).toFixed(1),
  );
  const totalMistakes = rounds.reduce((a, r) => a + r.mistakes, 0);
  const totalTimeSec = Math.round(
    rounds.reduce((a, r) => a + r.durationMs, 0) / 1000,
  );

  let mostImprovedIndex = -1;
  let biggestJump = -Infinity;
  for (let i = 1; i < rounds.length; i++) {
    const jump = rounds[i].score - rounds[i - 1].score;
    if (jump > biggestJump) {
      biggestJump = jump;
      mostImprovedIndex = i;
    }
  }

  return {
    totalScore,
    avgReactionMs,
    fastestMs,
    overallAccuracy,
    totalMistakes,
    totalTimeSec,
    mostImprovedRound:
      mostImprovedIndex >= 0 ? rounds[mostImprovedIndex].title : null,
  };
}

export default function BrainTestComplete({ session, user, onPlayAgain }) {
  const [showRibbons, setShowRibbons] = useState(false);
  const [showCenterBurst, setShowCenterBurst] = useState(false);

  const isGuest = !user?.id;
  const stats = useMemo(() => computeAggregates(session.rounds), [session.rounds]);

  useEffect(() => {
    const t1 = setTimeout(() => setShowRibbons(true), 100);
    const t2 = setTimeout(() => setShowCenterBurst(true), 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-background/95 backdrop-blur-sm p-4">
      <RibbonConfetti active={showRibbons} numberOfPieces={320} />

      <div className="fixed inset-x-0 top-1/4 flex justify-center pointer-events-none z-[65]">
        <CenterConfetti active={showCenterBurst} config={CENTER_CONFETTI_CONFIG} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-[66] w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 text-center shadow-2xl"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <Trophy className="text-primary" size={32} />
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-black text-foreground">
          Brain Test Complete!
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          You just finished all {session.rounds.length} rounds. Here's your snapshot.
        </p>

        {/* STAT GRID */}
        <div className="mt-6 grid grid-cols-3 gap-2.5">
          <Stat icon={Zap} label="Avg Reaction" value={`${stats.avgReactionMs}ms`} />
          <Stat icon={Timer} label="Fastest Tap" value={`${stats.fastestMs}ms`} />
          <Stat icon={Target} label="Accuracy" value={`${stats.overallAccuracy}%`} />
          <Stat icon={Trophy} label="Total Score" value={stats.totalScore} />
          <Stat icon={TrendingUp} label="Total Time" value={`${stats.totalTimeSec}s`} />
          <Stat icon={Target} label="Mistakes" value={stats.totalMistakes} />
        </div>

        {stats.mostImprovedRound && (
          <Badge variant="secondary" className="mt-4 rounded-full px-3 py-1.5 text-[11px]">
            🚀 Most improved: {stats.mostImprovedRound}
          </Badge>
        )}

        <p className="mt-4 text-[11px] text-muted-foreground">
          {isGuest
            ? "All 10 rounds are saved on this device."
            : "All 10 rounds are saved to your account."}
        </p>

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            href="/monthly-brain-report"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-transform"
          >
            <FileBarChart size={17} />
            View My Full Brain Report
          </Link>

          {isGuest && (
            <Link
              href="/auth/register"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-primary/40 text-primary text-sm font-bold hover:bg-primary/10 transition-colors"
            >
              <UserPlus size={16} />
              Create Free Account to Save Forever
            </Link>
          )}

          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw size={13} />
            Play the Brain Test Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-background py-3">
      <Icon size={15} className="text-primary" />
      <span className="text-sm font-extrabold text-foreground">{value}</span>
      <span className="text-[9px] text-muted-foreground text-center leading-tight px-1">
        {label}
      </span>
    </div>
  );
}
