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
      window.gtag("event", name, {
        value,
        ts: Date.now(),
      });
    }
  }, []);

  const gridOptions = useMemo(() => {
    const base = isLargeScreen ? [3, 4, 5, 6, 7, 8] : [3, 4, 5];

    if (mode === "alphabet") return [3, 4, 5];

    if (mode === "maths") {
      return base.filter((g) => g <= 7);
    }

    return base;
  }, [isLargeScreen, mode]);

  const handleSelect = (setter, gaName, value) => {
    setter(value);

    trackGA(gaName, value);

    document.activeElement?.blur();
  };

  const getButtonClass = (active, variant = "primary") =>
    `
      btn
      h-auto
      min-h-[56px]
      text-sm
      font-semibold
      capitalize
      transition-all
      duration-300
      hover:scale-[1.03]
      active:scale-95
      border

      ${
        active
          ? `btn-${variant} rounded-none`
          : "btn-ghost border-base-300 hover:border-primary rounded-none"
      }
    `;

  if (gameStarted) return null;

  return (
    <div className="w-full ">
      {/* GAME MODE */}
      <div className="mb-5">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-base-content/50">
          Game Mode
        </h2>

        <div className="grid grid-cols-3 gap-2">
          {[
            "number",
            "word",
            ...(gridSize <= 5 ? ["alphabet"] : []),
            "emoji",
            "maths",
          ].map((m) => (
            <button
              key={m}
              onClick={() => handleSelect(setMode, "mode_change", m)}
              className={getButtonClass(mode === m, "primary")}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* GRID SIZE */}
      <div className="mb-5">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-base-content/50">
          Grid Size
        </h2>

        <div className="grid grid-cols-3 gap-2">
          {gridOptions.map((size) => (
            <button
              key={size}
              onClick={() => handleSelect(setGridSize, "grid_change", size)}
              className={getButtonClass(gridSize === size, "accent")}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>

      {/* DIFFICULTY */}
      <div>
        <h2 className="mb-3 text-xs uppercase tracking-widest text-base-content/50">
          Difficulty
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {["Easy", "Medium", "Hard", "Extreme", "Impossible"].map((diff) => (
            <button
              key={diff}
              onClick={() =>
                handleSelect(setDifficulty, "difficulty_change", diff)
              }
              className={getButtonClass(difficulty === diff, "secondary")}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
