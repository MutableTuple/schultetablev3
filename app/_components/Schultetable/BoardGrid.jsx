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
  ========================== */
  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    }),
    [gridSize],
  );
  /* ==========================
     4) Memo Skeleton Tiles
  ========================== */
  const skeletonTiles = useMemo(
    () =>
      Array.from({ length: totalTiles }).map((_, i) => (
        <div key={i} className="skeleton aspect-square rounded w-full" />
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
          />
        );
      }),
    [numbers, totalTiles, gameStarted, clickedSet, handleTileClick],
  );

  /* ==========================
     RENDER
  ========================== */
  return (
    <div className="w-full flex justify-center px-3 sm:px-6 lg:px-10">
      <div
        className="
        grid
        w-full
        max-w-[92vw]
        sm:max-w-[80vw]
        md:max-w-[70vw]
        lg:max-w-[60vw]
        xl:max-w-[50vw]
        2xl:max-w-[900px]
        gap-1
      "
        style={gridStyle}
      >
        {loading ? skeletonTiles : numberTiles}
      </div>
    </div>
  );
}
