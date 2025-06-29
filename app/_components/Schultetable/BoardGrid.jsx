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
    <div className="bg-base-100 p-4 w-fit max-w-full overflow-x-auto">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(2rem, 1fr))`,
        }}
      >
        {loading
          ? Array.from({ length: totalTiles }).map((_, i) => (
              <div
                key={i}
                className="skeleton h-10 w-10 md:h-12 md:w-12 rounded"
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
