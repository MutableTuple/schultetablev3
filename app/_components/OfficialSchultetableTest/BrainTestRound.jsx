"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, Zap } from "lucide-react";

import { GAME_MODES } from "../Schultetable/numberUtils";
import { calculateScore } from "../Schultetable/scoreUtils";
import BoardGrid from "../Schultetable/BoardGrid";
import GameTimer from "../GameTimer";
import { Badge } from "@/components/ui/badge";

const MODE_LABELS = {
  number: "Number",
  word: "Word",
  alphabet: "Alphabet",
  emoji: "Emoji",
  maths: "Maths",
};

const getComparableValue = (n) => (typeof n === "object" ? n.value : n);

export default function BrainTestRound({ round, roundIndex, totalRounds, onRoundComplete }) {
  const { grid: gridSize, difficulty, mode, title, subtitle } = round;
  const totalTiles = gridSize * gridSize;

  const [loadingBoard, setLoadingBoard] = useState(true);
  const [numbers, setNumbers] = useState([]);
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const [clickData, setClickData] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [started, setStarted] = useState(false);

  const lastClickTime = useRef(null);
  const gameStartTime = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingBoard(true);
    setNumbers([]);
    setClickedNumbers([]);
    setClickData([]);
    setMistakes(0);
    setStarted(false);

    (async () => {
      const generator = GAME_MODES[mode]?.generate || GAME_MODES.number.generate;
      await new Promise((r) => setTimeout(r, 260));
      if (cancelled) return;
      setNumbers(generator(totalTiles, difficulty));
      setLoadingBoard(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize, difficulty, mode]);

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

  const handleStart = () => {
    if (loadingBoard) return;
    setStarted(true);
    const now = Date.now();
    lastClickTime.current = now;
    gameStartTime.current = now;
  };

  const handleTileClick = (num) => {
    if (!started) return;

    const now = Date.now();
    const expected = nextTarget;
    const actualValue = getComparableValue(num);
    const expectedValue = getComparableValue(expected);
    const correct = actualValue === expectedValue;
    const timeTakenMs = now - lastClickTime.current;

    setClickData((p) => [
      ...p,
      { number: num, expected, correct, timeTakenMs, timestamp: new Date().toISOString() },
    ]);

    if (!correct) {
      setMistakes((m) => m + 1);
      return;
    }

    lastClickTime.current = now;
    const updated = [...clickedNumbers, actualValue];
    setClickedNumbers(updated);

    if (updated.length !== numbers.length) return;

    /* ROUND COMPLETE */
    const endTime = Date.now();
    const elapsed = endTime - gameStartTime.current;
    const allCorrect = [
      ...clickData,
      { number: num, expected, correct: true, timeTakenMs, timestamp: new Date().toISOString() },
    ].filter((d) => d.correct);

    const times = allCorrect.map((d) => d.timeTakenMs);
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const min = Math.min(...times);
    const max = Math.max(...times);
    const std = Math.round(
      Math.sqrt(times.reduce((acc, t) => acc + (t - avg) ** 2, 0) / times.length),
    );

    const score = calculateScore({
      durationMs: elapsed,
      mistakes,
      difficulty,
      gridSize,
      avgReactionTimeMs: avg,
      consistencyScore: std,
    });

    const accuracy = Number(((totalTiles / (totalTiles + mistakes)) * 100).toFixed(1));

    const summary = {
      completedAt: new Date().toISOString(),
      durationMs: elapsed,
      gridSize,
      difficulty,
      mode,
      totalTiles,
      accuracy,
      mistakes,
      avgReactionTimeMs: avg,
      fastestMs: min,
      slowestMs: max,
      consistencyScore: std,
      score,
      title,
    };

    onRoundComplete(summary);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col items-center justify-center w-full h-full gap-3"
    >
      {/* ROUND HEADER */}
      <div className="flex flex-col items-center gap-1 text-center">
        <Badge className="rounded-full px-3 py-1 text-[11px] font-bold" variant="secondary">
          Round {roundIndex} of {totalRounds}
        </Badge>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">{title}</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <Badge variant="outline" className="text-[10px] rounded-full">
            {gridSize}×{gridSize}
          </Badge>
          <Badge variant="outline" className="text-[10px] rounded-full">
            {difficulty}
          </Badge>
          <Badge variant="outline" className="text-[10px] rounded-full">
            {MODE_LABELS[mode]}
          </Badge>
        </div>
      </div>

      {started && (
        <div className="flex items-center gap-3">
          <GameTimer />
          {mistakes > 0 && (
            <Badge variant="destructive" className="rounded-full text-[11px]">
              {mistakes} mistake{mistakes === 1 ? "" : "s"}
            </Badge>
          )}
        </div>
      )}

      {started && nextTarget && (
        <Badge
          className="rounded-full px-4 py-1.5 text-base font-bold shadow-sm"
          style={{ background: "#F3A83C", color: "#1a1206" }}
        >
          Next:{" "}
          {mode === "maths" ? getComparableValue(nextTarget) : (nextTarget.expr ?? nextTarget)}
        </Badge>
      )}

      {/* BOARD */}
      <div className="relative">
        {loadingBoard ? (
          <div className="flex flex-col items-center justify-center h-[300px] w-full max-w-sm rounded-3xl border border-border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Preparing board...</p>
          </div>
        ) : (
          <div className={!started ? "pointer-events-none opacity-30 blur-[2px]" : ""}>
            <BoardGrid
              numbers={numbers}
              gridSize={gridSize}
              onClick={handleTileClick}
              gameStarted={started}
              clickedNumbers={clickedNumbers}
              loading={loadingBoard}
            />
          </div>
        )}

        {!loadingBoard && !started && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              <Zap size={16} className="fill-current" />
              Start Round {roundIndex}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
