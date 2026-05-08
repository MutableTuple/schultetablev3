"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/app/_lib/supabase";
import { formatNumber } from "@/app/_utils/formatNumber";
import BackButton from "../BackButton";
import Link from "next/link";
import { FaSquareXTwitter } from "react-icons/fa6";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import UpgradeToProOnLeaderboardButton from "./UpgradeToProOnLeaderboardButton";
import LastGameChallenge from "../LastGameChallenge/LastGameChallenge";

const difficulties = ["Easy", "Medium", "Hard"];
const gridSizes = [3, 4, 5];
const gameModes = ["number", "word", "alphabet", "emoji"];

const GAME_MODE_EMOJI = {
  number: "🔢",
  word: "🔤",
  alphabet: "🔡",
  emoji: "😊",
};

const LIMIT = 10;

const rankMeta = {
  1: { emoji: "🥇", border: "border-yellow-400/50", bg: "bg-yellow-400/5", glow: "shadow-yellow-400/10 shadow-lg" },
  2: { emoji: "🥈", border: "border-slate-400/50", bg: "bg-slate-400/5", glow: "shadow-slate-400/10 shadow-md" },
  3: { emoji: "🥉", border: "border-orange-400/50", bg: "bg-orange-400/5", glow: "shadow-orange-400/10 shadow-md" },
};

export default function GlobalLeaderboard({ user }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gridSize, setGridSize] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [gameMode, setGameMode] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const abortRef = useRef(null);

  const fetchLeaderboard = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.rpc(
        "get_simple_leaderboard_v2",
        {
          p_grid_size: gridSize ? parseInt(gridSize) : null,
          p_difficulty: difficulty || null,
          p_game_mode: gameMode || null,
          p_date_filter: null,
          p_limit: LIMIT + 1,
          p_offset: (page - 1) * LIMIT,
        },
        { signal: controller.signal }
      );

      if (controller.signal.aborted) return;
      if (fetchError) throw fetchError;

      const results = data || [];
      setHasMore(results.length > LIMIT);
      setPlayers(results.slice(0, LIMIT));
    } catch (err) {
      if (err?.name === "AbortError") return;
      setError("Failed to load leaderboard. Please try again.");
      setPlayers([]);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [gridSize, difficulty, gameMode, page]);

  useEffect(() => { setPage(1); }, [gridSize, difficulty, gameMode]);
  useEffect(() => {
    fetchLeaderboard();
    return () => abortRef.current?.abort();
  }, [fetchLeaderboard]);

  const isPro = user && user[0]?.is_pro_user;
  const hasFilters = gridSize || difficulty || gameMode;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        <BackButton />

        {/* Header */}
<div className="card relative overflow-hidden border border-warning/30 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-2xl">
  {/* glow */}
  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/10 pointer-events-none" />

  {/* decorative blur */}
  <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200/30 rounded-full blur-3xl" />
  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-300/20 rounded-full blur-3xl" />

  <div className="card-body relative z-10 items-center text-center py-7 gap-2">
    <div className="text-5xl drop-shadow-lg animate-pulse">🏆</div>

    <h1 className="card-title text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
      Global Leaderboard
    </h1>

    <p className="text-sm sm:text-base text-white/85 font-medium">
      Top players across all game modes
    </p>

    <div className="mt-2 badge badge-lg border-0 bg-white/20 text-white backdrop-blur-md px-4 py-3 font-semibold">
      Elite Rankings
    </div>
  </div>
</div>

        {/* Filters */}
        {/* <div className="card bg-base-100 border border-base-300">
          <div className="card-body py-4 px-4 gap-3">
            <div className="flex flex-wrap gap-2 justify-center">
              <FilterDropdown
                label="Grid Size"
                value={gridSize}
                options={gridSizes}
                onChange={setGridSize}
                renderOption={(v) => `${v}×${v}`}
              />
              <FilterDropdown
                label="Difficulty"
                value={difficulty}
                options={difficulties}
                onChange={setDifficulty}
                renderOption={(v) => v}
              />
              <FilterDropdown
                label="Mode"
                value={gameMode}
                options={gameModes}
                onChange={setGameMode}
                renderOption={(v) =>
                  `${GAME_MODE_EMOJI[v] ?? ""} ${v.charAt(0).toUpperCase() + v.slice(1)}`
                }
              />
              {hasFilters && (
                <button
                  className="btn btn-sm btn-ghost text-error gap-1"
                  onClick={() => { setGridSize(""); setDifficulty(""); setGameMode(""); }}
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {/* Active filter pills */}
            {/* {hasFilters && (
              <div className="flex flex-wrap gap-1.5 justify-center">
                {gridSize && (
                  <div className="badge badge-outline badge-sm gap-1">
                    {gridSize}×{gridSize} Grid
                    <button onClick={() => setGridSize("")} className="opacity-60 hover:opacity-100">✕</button>
                  </div>
                )}
                {difficulty && (
                  <div className="badge badge-outline badge-sm gap-1">
                    {difficulty}
                    <button onClick={() => setDifficulty("")} className="opacity-60 hover:opacity-100">✕</button>
                  </div>
                )}
                {gameMode && (
                  <div className="badge badge-outline badge-sm gap-1">
                    {GAME_MODE_EMOJI[gameMode]} {gameMode}
                    <button onClick={() => setGameMode("")} className="opacity-60 hover:opacity-100">✕</button>
                  </div>
                )}
              </div>
            )} */}
          {/* </div> */}
        {/* </div>  */}
{/* <LastGameChallenge/> */}
        {/* Pro upsell */}
        {!isPro && (
          <div className="card bg-primary/5 border border-primary/20">
            <div className="card-body py-4 px-4">
              <UpgradeToProOnLeaderboardButton />
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="alert alert-error rounded-2xl">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
            </svg>
            <span className="text-sm">{error}</span>
            <button className="btn btn-sm btn-ghost" onClick={fetchLeaderboard}>Retry</button>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-[72px] rounded-2xl w-full" />
            ))}
          </div>
        ) : !error && players.length === 0 ? (
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body items-center text-center py-14 gap-2">
              <div className="text-4xl">🤷</div>
              <p className="font-semibold text-base-content/70">No players found</p>
              <p className="text-sm text-base-content/40">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {players.map((player, index) => {
              const rank = index + 1 + (page - 1) * LIMIT;
              const meta = rankMeta[rank];
              const isCurrentUser = user && user[0]?.id === player.user_id;

              return (
                <li
                  key={player.user_id || index}
                  className={`rounded-2xl border px-4 py-3.5 flex items-center gap-3 transition-all duration-200 hover:scale-[1.01] bg-base-100
                    ${meta ? `${meta.border} ${meta.bg} ${meta.glow}` : "border-base-300"}
                    ${isCurrentUser ? "ring-2 ring-primary ring-offset-base-100 ring-offset-1" : ""}
                  `}
                >
                  {/* Rank */}
                  <div className="w-8 flex justify-center shrink-0">
                    {meta ? (
                      <span className="text-xl leading-none">{meta.emoji}</span>
                    ) : (
                      <span className="badge badge-ghost badge-sm font-mono font-bold text-base-content/50">
                        #{rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="avatar shrink-0">
                    <div className="w-11 rounded-full ring-2 ring-base-300">
                      {player.image ? (
                        <img
                          src={player.image}
                          alt={player.name ?? "Player"}
                          className="object-cover"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-primary/30 to-secondary/30 w-full h-full flex items-center justify-center text-base font-bold text-primary">
                          {player.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Link
                        href={`/user/${player.username}`}
                        className="font-semibold text-sm sm:text-base hover:text-primary transition-colors truncate"
                      >
                        {player.name || "Anonymous"}
                      </Link>
                      {player.is_pro_user && (
                        <RiVerifiedBadgeFill className="text-yellow-400 shrink-0 text-sm" />
                      )}
                      {player.social_link && (
                        <FaSquareXTwitter className="shrink-0 text-base-content/30 hover:text-[#1DA1F2] transition-colors text-sm" />
                      )}
                      {isCurrentUser && (
                        <span className="badge badge-primary badge-xs shrink-0">You</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-base-content/40">{player.total_games} games</span>
                      {player.avg_accuracy > 0 && (
                        <>
                          <span className="text-base-content/20 text-xs">·</span>
                          <span className="text-xs text-base-content/40">
                            {player.avg_accuracy.toFixed(1)}% acc
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <div className={`font-extrabold tabular-nums text-base sm:text-lg ${
                      rank === 1 ? "text-yellow-500" :
                      rank === 2 ? "text-slate-400" :
                      rank === 3 ? "text-orange-400" :
                      "text-primary"
                    }`}>
                      {formatNumber(player.total_score)}
                    </div>
                    <div className="text-[10px] text-base-content/30 uppercase tracking-widest">pts</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Pagination */}
        {!loading && !error && (page > 1 || hasMore) && (
          <div className="join flex justify-center pt-1">
            <button
              className="join-item btn btn-sm btn-outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              «
            </button>
            <button className="join-item btn btn-sm btn-outline btn-active pointer-events-none">
              Page {page}
            </button>
            <button
              className="join-item btn btn-sm btn-outline"
              disabled={!hasMore}
              onClick={() => setPage((p) => p + 1)}
            >
              »
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

function FilterDropdown({ label, value, options, onChange, renderOption }) {
  return (
    <div className="dropdown dropdown-bottom">
      <label
        tabIndex={0}
        className={`btn btn-sm gap-1 font-medium ${value ? "btn-primary" : "btn-outline"}`}
      >
        {value ? renderOption(value) : label}
        <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-50 menu p-1.5 shadow-xl bg-base-100 border border-base-300 rounded-xl w-44 mt-1"
      >
        <li>
          <button
            className={`text-sm ${!value ? "font-semibold text-primary" : ""}`}
            onClick={() => onChange("")}
          >
            All {label}s
          </button>
        </li>
        <div className="divider my-0.5 h-px" />
        {options.map((opt) => (
          <li key={opt}>
            <button
              className={`text-sm ${
                value === String(opt) ? "font-semibold text-primary bg-primary/10" : ""
              }`}
              onClick={() => onChange(String(opt))}
            >
              {renderOption(String(opt))}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}