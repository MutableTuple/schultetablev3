"use client";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import LastUpdated from "./LastUpdated";
const difficulties = ["Easy", "Medium", "Hard", "Extreme", "Impossible"];
const gridSizes = ["3", "4", "5", "6", "7", "8", "9"];
const gameModes = ["word", "emoji", "maths", "number", "alphabet"];
import { ImCross } from "react-icons/im";
export default function SingleGameCounts({ user }) {
  const [activeMode, setActiveMode] = useState("number");

  const gameCounts = user[0]?.games_played_count?.[activeMode] || {};

  const getCount = (difficulty, size) => {
    return gameCounts?.[difficulty]?.[parseInt(size)] || 0;
  };

  return (
    <div className="mt-10 p-4 rounded-xl bg-base-100 border border-base-300">
      <h2 className="text-sm font-bold text-base-content mb-4">
        🧠 Game Stats by Difficulty & Grid Size
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {gameModes.map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              activeMode === mode
                ? "bg-yellow-400 text-black"
                : "bg-base-200 text-base-content hover:bg-base-300"
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-xs table-zebra w-full">
          <thead>
            <tr>
              <th>Difficulty</th>
              {gridSizes.map((size) => (
                <th key={size}>
                  {size}x{size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {difficulties.map((difficulty) => (
              <tr key={difficulty}>
                <td className="font-medium">{difficulty}</td>
                {gridSizes.map((size) => {
                  const count = getCount(difficulty, size);
                  return (
                    <td key={size}>
                      {count > 0 ? (
                        <span className="badge badge-success badge-soft font-bold">
                          {count}
                        </span>
                      ) : (
                        <span className="badge badge-soft text-xs text-error">
                          <ImCross />
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-1 text-xs px-2 py-2">
        <span className="badge badge-soft text-xs text-error">
          <ImCross />
        </span>
        &rarr; Never played
      </div>
      {gameCounts && <LastUpdated user={user} />}
    </div>
  );
}
