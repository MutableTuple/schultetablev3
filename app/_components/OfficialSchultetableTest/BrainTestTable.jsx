"use client";
import React, { useEffect, useRef, useState } from "react";

export default function BrainTestTable({ gridSize, roundKey, onFinish }) {
  const total = gridSize * gridSize;

  const [numbers, setNumbers] = useState([]);
  const [clicked, setClicked] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [clicks, setClicks] = useState([]);

  const startTime = useRef(0);
  const lastClick = useRef(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    const arr = Array.from({ length: total }, (_, i) => i + 1).sort(
      () => Math.random() - 0.5
    );

    setNumbers(arr);
    setClicked([]);
    setMistakes(0);
    setClicks([]);
    finishedRef.current = false;

    const now = Date.now();
    startTime.current = now;
    lastClick.current = now;
  }, [gridSize, roundKey, total]);

  function handleClick(n) {
    if (finishedRef.current) return;

    const expected = clicked.length + 1;
    const now = Date.now();
    const timeTakenMs = now - lastClick.current;

    setClicks((p) => [
      ...p,
      { number: n, expected, correct: n === expected, timeTakenMs },
    ]);

    if (n !== expected) {
      setMistakes((m) => m + 1);
      return;
    }

    lastClick.current = now;
    setClicked((p) => [...p, n]);
  }

  useEffect(() => {
    if (clicked.length !== total || finishedRef.current) return;

    finishedRef.current = true;

    const duration = Date.now() - startTime.current;
    const correctTimes = clicks
      .filter((c) => c.correct)
      .map((c) => c.timeTakenMs);

    const avg = Math.round(
      correctTimes.reduce((a, b) => a + b, 0) / correctTimes.length
    );
    const fastest = Math.min(...correctTimes);
    const slowest = Math.max(...correctTimes);

    onFinish({
      durationMs: duration,
      gridSize,
      mistakes,
      avgReactionMs: avg,
      fastestMs: fastest,
      slowestMs: slowest,
      clicks,
    });
  }, [clicked, clicks, gridSize, mistakes, total, onFinish]);

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))` }}
    >
      {numbers.map((n) => (
        <button
          key={n}
          onClick={() => handleClick(n)}
          className={`w-20 h-20 flex items-center justify-center text-xl font-bold 
            border border-base-300 bg-base-100 hover:bg-primary hover:text-white
            ${clicked.includes(n) ? "opacity-40 pointer-events-none" : ""}`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
