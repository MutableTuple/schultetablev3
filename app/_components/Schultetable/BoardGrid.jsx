import React from "react";
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

  return (
    <div className="bg-base-100 p-4 w-full max-w-full flex justify-center">
      <div
        className={`grid gap-2 w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: `min(${gridSize * 6}rem, 100%)`, // dynamic width with cap
          maxWidth: "100%",
        }}
      >
        {loading
          ? Array.from({ length: totalTiles }).map((_, i) => (
              <div
                key={i}
                className="skeleton aspect-square rounded w-full"
              ></div>
            ))
          : numbers
              .slice(0, totalTiles)
              .map((num, index) => (
                <NumberTile
                  key={index}
                  num={num}
                  onClick={() => onClick(num)}
                  disabled={
                    !gameStarted ||
                    clickedNumbers.includes(
                      typeof num === "object" ? num.value : num
                    )
                  }
                />
              ))}
      </div>
    </div>
  );
}
