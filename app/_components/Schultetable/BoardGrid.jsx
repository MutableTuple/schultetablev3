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
      clickedNumbers.map((n) => (typeof n === "object" ? n.value : n))
    );
  }, [clickedNumbers]);

  /* ==========================
     2) Stable onClick handler
  ========================== */
  const handleTileClick = useCallback(
    (num) => {
      onClick(num);
    },
    [onClick]
  );

  /* ==========================
     3) Memoized grid styles
  ========================== */
  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
      width: `min(${gridSize * 6}rem, 100%)`,
      maxWidth: "100%",
    }),
    [gridSize]
  );

  /* ==========================
     4) Memo Skeleton Tiles
  ========================== */
  const skeletonTiles = useMemo(
    () =>
      Array.from({ length: totalTiles }).map((_, i) => (
        <div key={i} className="skeleton aspect-square rounded w-full" />
      )),
    [totalTiles]
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
    [numbers, totalTiles, gameStarted, clickedSet, handleTileClick]
  );

  /* ==========================
     RENDER
  ========================== */
  return (
    <div className="bg-base-100 p-4 w-full max-w-full flex justify-center">
      <div
        className="grid gap-2 w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg"
        style={gridStyle}
      >
        {loading ? skeletonTiles : numberTiles}
      </div>
    </div>
  );
}
