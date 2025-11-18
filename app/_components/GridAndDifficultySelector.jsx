"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

export default function GridAndDifficultySelector({
  gridSize,
  setGridSize,
  difficulty,
  setDifficulty,
  gameStarted,
  mode,
  setMode,
}) {
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => setIsLargeScreen(e.matches);
    setIsLargeScreen(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const trackGA = useCallback((name, value) => {
    if (window?.gtag) {
      window.gtag("event", name, { value, ts: Date.now() });
    }
  }, []);

  const gridOptions = useMemo(() => {
    const base = isLargeScreen ? [3, 4, 5, 6, 7, 8, 9] : [3, 4, 5];
    if (mode === "alphabet") return [3, 4, 5];
    if (mode === "maths") return base.filter((g) => g <= 7);
    return base;
  }, [isLargeScreen, mode]);

  const handleSelect = (setter, gaName, value) => {
    setter(value);
    trackGA(gaName, value);
    document.activeElement?.blur();
  };

  if (gameStarted) return null;

  return (
    <div className="fixed top-14 left-4 z-[99999] flex flex-col gap-2 rounded-xl pointer-events-auto">
      {/* GRID */}
      <div className="dropdown relative z-[99999]">
        <label
          tabIndex={0}
          className="btn btn-xs w-full bg-success text-base-100"
        >
          {gridSize}×{gridSize}
        </label>

        <ul
          tabIndex={0}
          className="dropdown-content absolute left-full top-0 ml-2 menu p-2 shadow bg-base-100 rounded-box w-40 z-[99999] max-h-56 overflow-auto"
        >
          {gridOptions.map((size) => (
            <li key={size}>
              <button
                className={gridSize === size ? "font-bold" : ""}
                onClick={() => handleSelect(setGridSize, "grid_change", size)}
              >
                {size} × {size}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* DIFFICULTY */}
      <div className="dropdown relative z-[99999]">
        <label
          tabIndex={0}
          className="btn btn-xs w-full bg-primary text-base-100 capitalize"
        >
          {difficulty}
        </label>

        <ul
          tabIndex={0}
          className="dropdown-content absolute left-full top-0 ml-2 menu p-2 shadow bg-base-100 rounded-box w-44 z-[99999]"
        >
          {["Easy", "Medium", "Hard", "Extreme", "Impossible"].map((diff) => (
            <li key={diff}>
              <button
                className={difficulty === diff ? "font-bold" : ""}
                onClick={() =>
                  handleSelect(setDifficulty, "difficulty_change", diff)
                }
              >
                {diff}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* MODE */}
      <div className="dropdown relative z-[99999]">
        <label
          tabIndex={0}
          className="btn btn-xs w-full bg-error text-base-100 capitalize"
        >
          {mode}
        </label>

        <ul
          tabIndex={0}
          className="dropdown-content absolute left-full top-0 ml-2 menu p-2 shadow bg-base-100 rounded-box w-52 z-[99999]"
        >
          {[
            "number",
            "word",
            ...(gridSize <= 5 ? ["alphabet"] : []),
            "emoji",
            "maths",
          ].map((m) => (
            <li key={m}>
              <button
                className={mode === m ? "font-bold capitalize" : "capitalize"}
                onClick={() => handleSelect(setMode, "mode_change", m)}
              >
                {m}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
