"use client";
import React, { useState, useEffect } from "react";

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

  const trackGA = (eventName, value) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, {
        value,
        timestamp: Date.now(),
      });
    }
  };

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allGridOptions = isLargeScreen ? [3, 4, 5, 6, 7, 8, 9] : [3, 4, 5];
  const gridOptions =
    mode === "alphabet"
      ? [3, 4, 5]
      : mode === "maths"
        ? allGridOptions.filter((g) => g <= 7)
        : allGridOptions;

  return (
    <>
      {!gameStarted && (
        <div className="fixed top-28 left-4 z-50 flex flex-col gap-2 bg-base-100 border border-base-300 rounded-xl ">
          {/* GRID */}
          <div className="dropdown ">
            <label
              tabIndex={0}
              className="btn btn-xs btn-outline rounded-full w-full justify-center font-semibold"
            >
              {gridSize}×{gridSize}
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 z-50"
            >
              {gridOptions.map((size) => (
                <li key={size}>
                  <button
                    onClick={() => {
                      setGridSize(size);
                      trackGA("game_analytics_grid_change", size);
                    }}
                    className={`${gridSize === size ? "active font-bold" : ""}`}
                  >
                    {size} × {size}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* DIFFICULTY */}
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-xs btn-outline rounded-full w-full justify-center font-semibold"
            >
              {difficulty}
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44 z-50"
            >
              {["Easy", "Medium", "Hard", "Extreme", "Impossible"].map(
                (diff) => (
                  <li key={diff}>
                    <button
                      onClick={() => {
                        setDifficulty(diff);
                        trackGA("game_analytics_difficulty_change", diff);
                      }}
                      className={`${difficulty === diff ? "active font-bold" : ""}`}
                    >
                      {diff}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* MODE */}
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-xs btn-outline rounded-full w-full justify-center font-semibold capitalize"
            >
              {mode}
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50"
            >
              <li>
                <button
                  onClick={() => {
                    setMode("number");
                    trackGA("game_analytics_mode_change", "number");
                  }}
                >
                  Number
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setMode("word");
                    trackGA("game_analytics_mode_change", "word");
                  }}
                >
                  Word
                </button>
              </li>

              {gridSize <= 5 && (
                <li>
                  <button
                    onClick={() => {
                      setMode("alphabet");
                      trackGA("game_analytics_mode_change", "alphabet");
                    }}
                  >
                    Alphabet
                  </button>
                </li>
              )}

              <li>
                <button
                  onClick={() => {
                    setMode("emoji");
                    trackGA("game_analytics_mode_change", "emoji");
                  }}
                >
                  Emoji
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setMode("maths");
                    trackGA("game_analytics_mode_change", "maths");
                  }}
                >
                  Maths
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
