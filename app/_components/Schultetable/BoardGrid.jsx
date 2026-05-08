"use client";
import React, { useMemo, useCallback } from "react";
import NumberTile from "../NumberTile";

export default function BoardGrid({
  numbers,
  gridSize,
  onClick,
  gameStarted,
  clickedNumbers,
  loading,
}) {
  const totalTiles = gridSize * gridSize;

  /* ==========================
     1) Convert clickedNumbers → Set (O(1) lookup)
  ========================== */
  const clickedSet = useMemo(() => {
    return new Set(
      clickedNumbers.map((n) => (typeof n === "object" ? n.value : n)),
    );
  }, [clickedNumbers]);

  /* ==========================
     2) Stable onClick handler
  ========================== */
  const handleTileClick = useCallback(
    (num) => {
      onClick(num);
    },
    [onClick],
  );

  /* ==========================
     3) Memoized grid styles
     Uses CSS custom property --grid-size so tiles can self-size their font
     via clamp() relative to the grid column width.
  ========================== */
  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
      "--grid-size": gridSize,
    }),
    [gridSize],
  );

  /* ==========================
     4) Memo Skeleton Tiles
  ========================== */
  const skeletonTiles = useMemo(
    () =>
      Array.from({ length: totalTiles }).map((_, i) => (
        <div
          key={i}
          className="skeleton rounded w-full"
          style={{ aspectRatio: "1 / 1" }}
        />
      )),
    [totalTiles],
  );

  /* ==========================
     5) Memo Number Tiles
  ========================== */
  const numberTiles = useMemo(
    () =>
      numbers.slice(0, totalTiles).map((num, index) => {
        const val = typeof num === "object" ? num.value : num;
        const disabled = !gameStarted || clickedSet.has(val);

        return (
          <NumberTile
            key={index}
            num={num}
            onClick={() => handleTileClick(num)}
            disabled={disabled}
            gridSize={gridSize}
          />
        );
      }),
    [numbers, totalTiles, gameStarted, clickedSet, handleTileClick, gridSize],
  );

  /* ==========================
     RENDER

     Layout strategy:
     - Outer wrapper: full width, centered, horizontal padding only
     - Inner grid wrapper: constrained square using min() so the grid
       never exceeds the viewport in either axis, no overflow possible
     - gap scales with grid size via clamp so tiny grids don't look sparse
       and large grids stay readable
  ========================== */
  return (
    <div className="w-full flex justify-center items-center px-2 sm:px-4 lg:px-8">
      <div
        className="grid w-full"
        style={{
          // Square-constrained: won't exceed 92vw wide or 85vh tall
          maxWidth: "min(92vw, 85vh, 860px)",
          // Adaptive gap: smaller grids get more breathing room
          gap: `clamp(2px, calc(6px - ${Math.max(0, gridSize - 5)} * 0.5px), 8px)`,
          ...gridStyle,
        }}
      >
        {loading ? skeletonTiles : numberTiles}
      </div>
    </div>
  );
}
