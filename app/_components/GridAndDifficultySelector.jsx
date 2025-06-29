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
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close on outside click
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
          className="fixed top-20 left-4 z-50 btn btn-circle btn-sm  border border-base-300 shadow-md  btn-primary  transition  tooltip tooltip-right hover:scale-105 "
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
        <div className="form-control">
          <label className="label">
            <span className="label-text text-xs font-semibold">Grid</span>
          </label>
          <select
            className="select select-bordered select-sm rounded-full"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
          >
            {gridOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-xs font-semibold">Difficulty</span>
          </label>
          <select
            className="select select-bordered select-sm rounded-full"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
            <option>Extreme</option>
            <option>Impossible</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Game Mode</label>
          <select
            className="select select-bordered select-sm rounded-full"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            disabled={gameStarted}
          >
            <option value="number">Number Schulte</option>
            <option value="word">Word Schulte</option>
            {gridSize <= 5 && (
              <option value="alphabet">Alphabet Schulte</option>
            )}
            <option value="emoji">Emoji Schulte</option>
            <option value="maths">Maths Schulte</option>
          </select>
        </div>
      </div>
    </>
  );
}
