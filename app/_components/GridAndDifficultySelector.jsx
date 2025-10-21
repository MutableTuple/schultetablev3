"use client";
import React, { useState, useEffect, useRef } from "react";
import { BsGrid1X2Fill } from "react-icons/bs";

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
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef();

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

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
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="fixed top-44 left-4 z-50 btn btn-circle btn-sm border border-base-300 shadow-md btn-primary transition hover:scale-105 tooltip tooltip-right"
          data-tip={"Change grid, difficulty & mode"}
        >
          <BsGrid1X2Fill size={16} />
        </button>
      )}

      <div
        ref={panelRef}
        className={`fixed top-30 left-4 bg-base-100 border border-base-300 text-base-content rounded-xl shadow-lg px-4 py-3 flex flex-col md:flex-row md:items-center gap-3 transition-all duration-300 ease-in-out z-50 
        ${
          gameStarted || !isOpen
            ? "opacity-0 scale-95 pointer-events-none"
            : "opacity-100 scale-100"
        }`}
      >
        {/* Grid Size Dropdown */}
        <div className="dropdown dropdown-hover">
          <label tabIndex={0} className="btn btn-sm btn-outline rounded-full">
            Grid: <span className="ml-2 font-semibold">{gridSize}</span>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
          >
            {gridOptions.map((size) => (
              <li key={size}>
                <button
                  onClick={() => setGridSize(size)}
                  className={`${
                    gridSize === size ? "active font-bold" : ""
                  } capitalize`}
                >
                  {size} × {size}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Difficulty Dropdown */}
        <div className="dropdown dropdown-hover">
          <label tabIndex={0} className="btn btn-sm btn-outline rounded-full">
            Difficulty: <span className="ml-2 font-semibold">{difficulty}</span>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44"
          >
            {["Easy", "Medium", "Hard", "Extreme", "Impossible"].map((diff) => (
              <li key={diff}>
                <button
                  onClick={() => setDifficulty(diff)}
                  className={difficulty === diff ? "active font-bold" : ""}
                >
                  {diff}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Mode Dropdown */}
        <div className="dropdown dropdown-hover">
          <label tabIndex={0} className="btn btn-sm btn-outline rounded-full">
            Mode: <span className="ml-2 font-semibold capitalize">{mode}</span>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <button onClick={() => setMode("number")}>Number Schulte</button>
            </li>
            <li>
              <button onClick={() => setMode("word")}>Word Schulte</button>
            </li>
            {gridSize <= 5 && (
              <li>
                <button onClick={() => setMode("alphabet")}>
                  Alphabet Schulte
                </button>
              </li>
            )}
            <li>
              <button onClick={() => setMode("emoji")}>Emoji Schulte</button>
            </li>
            <li>
              <button onClick={() => setMode("maths")}>Maths Schulte</button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
