"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import { formatNumber } from "@/app/_utils/formatNumber";
import BackButton from "../BackButton";
import Link from "next/link";
import StatisticsGlobal from "../StatisticsGlobal";
import { FaSquareXTwitter } from "react-icons/fa6";
import UpgradeToProOnLeaderboardButton from "./UpgradeToProOnLeaderboardButton";

const difficulties = ["Easy", "Medium", "Hard"];
const gridSizes = [3, 4, 5];
const gameModes = ["number", "word", "alphabet", "emoji"];

export default function GlobalLeaderboard({ user }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gridSize, setGridSize] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [gameMode, setGameMode] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_simple_leaderboard_v2", {
        p_grid_size: gridSize ? parseInt(gridSize) : null,
        p_difficulty: difficulty || null,
        p_game_mode: gameMode || null,
        p_date_filter: null,
        p_limit: limit,
        p_offset: (page - 1) * limit,
      });

      if (error) console.error("Leaderboard fetch error:", error);
      else setPlayers(data || []);

      setLoading(false);
    };

    fetchLeaderboard();
  }, [gridSize, difficulty, gameMode, page]);
  // console.log("PLAYER", players);
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <BackButton />
      {/* <StatisticsGlobal /> */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center">
        🏆 Global Leaderboard
      </h1>
      {/* Filters */}
      <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-2 sm:gap-3 w-full px-2">
        {/* Grid Size Dropdown */}
        <div className="dropdown">
          <label
            tabIndex={0}
            className="btn btn-sm btn-outline w-full sm:w-auto"
          >
            {gridSize ? `${gridSize}×${gridSize}` : "All Grid Sizes"}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
          >
            <li>
              <button onClick={() => setGridSize("")}>All Grid Sizes</button>
            </li>
            {gridSizes.map((size) => (
              <li key={size}>
                <button onClick={() => setGridSize(size)}>
                  {size}×{size}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Difficulty Dropdown */}
        <div className="dropdown">
          <label
            tabIndex={0}
            className="btn btn-sm btn-outline w-full sm:w-auto"
          >
            {difficulty || "All Difficulties"}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
          >
            <li>
              <button onClick={() => setDifficulty("")}>
                All Difficulties
              </button>
            </li>
            {difficulties.map((d) => (
              <li key={d}>
                <button onClick={() => setDifficulty(d)}>{d}</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Game Mode Dropdown */}
        <div className="dropdown">
          <label
            tabIndex={0}
            className="btn btn-sm btn-outline w-full sm:w-auto"
          >
            {gameMode || "All Modes"}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
          >
            <li>
              <button onClick={() => setGameMode("")}>All Modes</button>
            </li>
            {gameModes.map((mode) => (
              <li key={mode}>
                <button onClick={() => setGameMode(mode)}>{mode}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {!(user && user[0]?.is_pro_user) && (
        <div className="mt-auto pt-4">
          <UpgradeToProOnLeaderboardButton />
        </div>
      )}

      {/* Leaderboard */}
      {loading ? (
        <div className="text-center">
          <span className="loading loading-spinner loading-xs"></span>
        </div>
      ) : players.length === 0 ? (
        <div className="text-center text-base-content/70">
          No players found for selected filters.
        </div>
      ) : (
        <ul className="space-y-3">
          {players.map((player, index) => {
            const rank = index + 1 + (page - 1) * limit;
            const medal =
              rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
            const borderColor =
              rank === 1
                ? "border-yellow-400"
                : rank === 2
                  ? "border-gray-400"
                  : rank === 3
                    ? "border-orange-400"
                    : "border-base-300";
            return (
              <li
                key={player.user_id || index}
                className={`p-3 sm:p-4 rounded-xl flex flex-row items-center gap-3 sm:gap-4 border ${borderColor} backdrop-blur-lg bg-white/10 dark:bg-white/5 transition hover:scale-[1.01]`}
              >
                {/* Avatar */}
                <div className="avatar">
                  <div className="w-12 sm:w-14 rounded-full bg-neutral text-neutral-content overflow-hidden">
                    {player.image ? (
                      <img src={player.image} alt="avatar" />
                    ) : (
                      <span className="text-lg sm:text-xl font-bold">
                        {player.name?.charAt(0).toUpperCase() || "A"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-sm sm:text-base font-semibold truncate">
                    <span className="badge badge-outline">#{rank}</span>
                    <Link href={`/user/${player.username}`}>
                      <span className="truncate flex items-center gap-1">
                        {player.name}
                        {medal && <span>{medal}</span>}
                        {/* ADD THIS TWITTER LINK FOR PEOPLE WHO WANTS TO LINK TO THEIR SOCIAL MEDIA */}
                        {/* {player?.social_link != NULL ? (
                          <FaSquareXTwitter />
                        ) : (
                          ""
                        )} */}
                      </span>
                    </Link>
                  </div>
                  <div className="text-xs text-base-content/70 truncate">
                    Games: {player.total_games}
                  </div>
                  {/* 
                   | Accuracy:{" "}
                    {player.avg_accuracy && player.avg_accuracy > 0
                      ? `${player.avg_accuracy.toFixed(1)}%`
                      : "N/A"}
                  */}
                </div>

                {/* Score */}
                <div className="text-primary font-bold text-sm sm:text-xl shrink-0">
                  {formatNumber(player.total_score)}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {/* Pagination */}
      {players.length === limit && (
        <div className="join flex justify-center pt-4">
          <button
            className="join-item btn btn-outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Prev
          </button>
          <button
            className="join-item btn btn-outline"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
