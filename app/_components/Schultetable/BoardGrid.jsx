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
     CLICKED SET
  ========================== */
  const clickedSet = useMemo(() => {
    return new Set(
      clickedNumbers.map((n) => (typeof n === "object" ? n.value : n)),
    );
  }, [clickedNumbers]);

  /* ==========================
     STABLE CLICK HANDLER
  ========================== */
  const handleTileClick = useCallback(
    (num) => {
      onClick(num);
    },
    [onClick],
  );

  /* ==========================
     GRID STYLE
  ========================== */
  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
      "--grid-size": gridSize,
    }),
    [gridSize],
  );

  /* ==========================
     SKELETONS
  ========================== */
  const skeletonTiles = useMemo(
    () =>
      Array.from({ length: totalTiles }).map((_, i) => (
        <div
          key={i}
          className="
            skeleton
            aspect-square
            rounded-none
            border
            border-base-300
            bg-base-300
          "
        />
      )),
    [totalTiles],
  );

  /* ==========================
     NUMBER TILES
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

  return (
    <div
      className="
        w-full
        flex
        justify-center
        px-2
        sm:px-4
        lg:px-8
        select-none
      "
    >
      {/* BOARD WRAPPER */}
      <div
        className="
          w-full
          border
          border-base-300
          bg-base-200
          p-2
          sm:p-3
        "
        style={{
          maxWidth: "min(92vw, calc(100vh - 140px), 860px)",
        }}
      >
        {/* GRID */}
        <div
          className="grid w-full"
          style={{
            gap: gridSize >= 7 ? "4px" : "8px",

            ...gridStyle,
          }}
        >
          {loading ? skeletonTiles : numberTiles}
        </div>
      </div>
    </div>
  );
}
