"use client";

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Check, Clock, Target, TrendingUp, TrendingDown, Lock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Confetti = dynamic(() => import("react-dom-confetti"), { ssr: false });

const CONFETTI_CONFIG = {
  angle: 90,
  spread: 240,
  startVelocity: 28,
  elementCount: 60,
  duration: 1800,
  colors: ["#F3A83C", "#5B8DEF", "#43C6AC", "#FFD700"],
};

function assessPerformance({ accuracy, avgReactionTimeMs, mistakes, totalTiles }) {
  const mistakeRatio = totalTiles > 0 ? mistakes / totalTiles : 0;
  if (accuracy < 75 || avgReactionTimeMs > 1500 || mistakeRatio > 0.25) return "struggled";
  if (accuracy >= 92 && avgReactionTimeMs < 900 && mistakes === 0) return "excelled";
  return "steady";
}

const MESSAGES = {
  struggled: [
    "Stay with it — every round builds focus.",
    "That one was tough. Shake it off and reset.",
    "Progress isn't always a straight line. Keep going.",
    "Your focus is a muscle — this is the workout.",
  ],
  steady: [
    "Solid round. Keep that focus locked in.",
    "Nice and steady — that's how streaks are built.",
    "You're finding your groove.",
    "Consistent. That's exactly what we want to see.",
  ],
  excelled: [
    "Sharp focus! 🔥",
    "Clean round — no mistakes!",
    "You're on fire right now.",
    "That was fast. Really fast.",
    "Elite-level focus on that one.",
  ],
};

// Module-scoped so a message never repeats back-to-back across the whole
// test, without threading extra state through the parent.
const lastMessageIndexByTier = {};
function pickMessage(tier) {
  const pool = MESSAGES[tier];
  let idx = Math.floor(Math.random() * pool.length);
  if (pool.length > 1 && idx === lastMessageIndexByTier[tier]) {
    idx = (idx + 1) % pool.length;
  }
  lastMessageIndexByTier[tier] = idx;
  return pool[idx];
}

export default function RoundTransition({
  summary,
  roundIndex,
  totalRounds,
  previousScore,
  isGuest,
  onContinue,
}) {
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setConfettiActive(true), 120);
    return () => clearTimeout(t);
  }, []);

  const tier = useMemo(
    () =>
      assessPerformance({
        accuracy: summary.accuracy,
        avgReactionTimeMs: summary.avgReactionTimeMs,
        mistakes: summary.mistakes,
        totalTiles: summary.totalTiles,
      }),
    [summary],
  );

  const message = useMemo(() => pickMessage(tier), [tier]);

  const scoreDelta = previousScore
    ? Math.round(((summary.score - previousScore) / previousScore) * 100)
    : null;

  const isMilestone = roundIndex === 5;
  const isLastTransition = roundIndex === totalRounds - 1;
  const showSignupNudge = isGuest && roundIndex % 3 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto gap-4 text-center px-4"
    >
      <div className="fixed inset-x-0 top-1/3 flex justify-center pointer-events-none z-40">
        <Confetti active={confettiActive} config={CONFETTI_CONFIG} />
      </div>

      {isMilestone && (
        <Badge className="rounded-full px-3 py-1 text-[11px] font-bold bg-primary text-primary-foreground animate-pulse">
          🎉 Halfway there!
        </Badge>
      )}

      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
        <Check className="text-primary" size={26} />
      </div>

      <div>
        <h3 className="text-lg font-extrabold text-foreground">Round {roundIndex} Complete</h3>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-2 w-full">
        <StatChip icon={Clock} label="Time" value={`${(summary.durationMs / 1000).toFixed(2)}s`} />
        <StatChip icon={Target} label="Accuracy" value={`${summary.accuracy}%`} />
        <StatChip
          icon={scoreDelta != null && scoreDelta < 0 ? TrendingDown : TrendingUp}
          label="Score"
          value={summary.score}
          sub={
            scoreDelta != null
              ? `${scoreDelta >= 0 ? "+" : ""}${scoreDelta}% vs last`
              : null
          }
        />
      </div>

      {/* PROGRESS DOTS */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalRounds }).map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i < roundIndex ? "w-5 bg-primary" : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* SAVE STATUS */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Check size={12} className="text-primary" />
          {isGuest ? "Progress saved on this device" : "Progress saved to your account"}
        </span>
        {showSignupNudge && (
          <Link
            href="/auth/register"
            className="flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:underline"
          >
            <Lock size={11} />
            Sign up free to keep this permanently
          </Link>
        )}
      </div>

      <button
        onClick={onContinue}
        className="flex items-center gap-1.5 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
      >
        {isLastTransition ? "Start the Final Round" : `Continue to Round ${roundIndex + 1}`}
        <ChevronRight size={16} />
      </button>
    </motion.div>
  );
}

function StatChip({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-2xl border border-border bg-card py-2.5">
      <Icon size={13} className="text-muted-foreground" />
      <span className="text-sm font-bold text-foreground">{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
      {sub && (
        <span className="text-[9px] text-muted-foreground/70 -mt-0.5">{sub}</span>
      )}
    </div>
  );
}
