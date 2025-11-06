"use client";

import React from "react";

export default function AnalyticsFilter({
  range,
  setRange,
  difficulty,
  setDifficulty,
  gridSize,
  setGridSize,
  gameMode,
  setGameMode,
}) {
  return (
    <div className="flex flex-wrap gap-3 mb-4 border border-base-300">
      {/* ✅ RANGE DROPDOWN */}
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn btn-sm bg-base-300">
          {range === "all" ? "All" : range}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow z-[100]"
        >
          <li>
            <a onClick={() => setRange("7")}>Last 7 games</a>
          </li>
          <li>
            <a onClick={() => setRange("14")}>Last 14 games</a>
          </li>
          <li>
            <a onClick={() => setRange("21")}>Last 21 games</a>
          </li>
          <li>
            <a onClick={() => setRange("all")}>All games</a>
          </li>
        </ul>
      </div>

      {/* ✅ DIFFICULTY DROPDOWN */}
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn btn-sm bg-base-300">
          {difficulty || "All"}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow z-[100]"
        >
          <li>
            <a onClick={() => setDifficulty("")}>All</a>
          </li>
          <li>
            <a onClick={() => setDifficulty("Easy")}>Easy</a>
          </li>
          <li>
            <a onClick={() => setDifficulty("Medium")}>Medium</a>
          </li>
          <li>
            <a onClick={() => setDifficulty("Hard")}>Hard</a>
          </li>
        </ul>
      </div>

      {/* ✅ GRID SIZE DROPDOWN */}
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn btn-sm bg-base-300">
          {gridSize || "All"}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow z-[100]"
        >
          <li>
            <a onClick={() => setGridSize("")}>All</a>
          </li>
          <li>
            <a onClick={() => setGridSize("3")}>3×3</a>
          </li>
          <li>
            <a onClick={() => setGridSize("4")}>4×4</a>
          </li>
          <li>
            <a onClick={() => setGridSize("5")}>5×5</a>
          </li>
        </ul>
      </div>

      {/* ✅ GAME MODE DROPDOWN */}
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn btn-sm bg-base-300">
          {gameMode || "All"}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow z-[100]"
        >
          <li>
            <a onClick={() => setGameMode("")}>All</a>
          </li>
          <li>
            <a onClick={() => setGameMode("number")}>Number</a>
          </li>
          <li>
            <a onClick={() => setGameMode("alphabet")}>Alphabet</a>
          </li>
          <li>
            <a onClick={() => setGameMode("color")}>Color</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
