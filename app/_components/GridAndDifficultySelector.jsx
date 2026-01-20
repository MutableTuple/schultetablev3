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
    <div className="fixed sm:top-15 top-14 left-4 flex flex-col md:gap-2 gap-1 rounded-xl pointer-events-auto z-10">
      {/* GRID */}
      <div className="dropdown relative ">
        <label
          tabIndex={0}
          className="bg-primary py-1.5 shadow-none hover:shadow-none hover:scale-105 transition-all duration-300  sm:text-sm text-[11px] sm:px-4 px-1 w-full text-base-100  font-semibold tracking-wider cursor-pointer hover:bg-primary/90 "
        >
          Grid Size : {gridSize}×{gridSize}
        </label>

        <ul
          tabIndex={0}
          className="dropdown-content absolute left-full top-0 ml-2 menu p-2 shadow bg-base-100 rounded-box w-40 z-50 max-h-56 overflow-auto"
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
      <div className="dropdown relative z-50">
        <label
          tabIndex={0}
          className="bg-secondary   py-1.5 shadow-none hover:shadow-none hover:scale-105 transition-all duration-300  sm:text-sm text-[11px] sm:px-4 px-1 w-full text-base-100  font-semibold tracking-wider cursor-pointer hover:bg-secondary/90 "
        >
          Difficulty : {difficulty}
        </label>

        <ul
          tabIndex={0}
          className="dropdown-content absolute left-full top-0 ml-2 menu p-2 shadow bg-base-100 rounded-box w-44 z-50"
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
      <div className="dropdown relative z-50">
        <label
          tabIndex={0}
          className="bg-info   py-1.5 shadow-none hover:shadow-none hover:scale-105 transition-all duration-300  sm:text-sm text-[11px] sm:px-4  w-full text-base-100  font-semibold tracking-wider cursor-pointer hover:bg-info/90 px-1 "
        >
          Game Mode : <span>{mode}</span>
        </label>

        <ul
          tabIndex={0}
          className="dropdown-content absolute left-full top-0 ml-2 menu p-2 shadow bg-base-100 rounded-box w-52 z-50"
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
