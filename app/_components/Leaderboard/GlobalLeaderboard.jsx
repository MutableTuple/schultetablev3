"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/app/_lib/supabase";
import { formatNumber } from "@/app/_utils/formatNumber";
import BackButton from "../BackButton";
import Link from "next/link";
import { FaSquareXTwitter } from "react-icons/fa6";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  1: {
    emoji: "🥇",
    border: "border-yellow-400/50",
    bg: "bg-yellow-400/5",
    glow: "shadow-yellow-400/10 shadow-lg",
  },
  2: {
    emoji: "🥈",
    border: "border-slate-400/50",
    bg: "bg-slate-400/5",
    glow: "shadow-slate-400/10 shadow-md",
  },
  3: {
    emoji: "🥉",
    border: "border-orange-400/50",
    bg: "bg-orange-400/5",
    glow: "shadow-orange-400/10 shadow-md",
  },
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
        { signal: controller.signal },
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

  useEffect(() => {
    setPage(1);
  }, [gridSize, difficulty, gameMode]);
  useEffect(() => {
    fetchLeaderboard();
    return () => abortRef.current?.abort();
  }, [fetchLeaderboard]);

  const isPro = user && user[0]?.is_pro_user;
  const hasFilters = gridSize || difficulty || gameMode;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <BackButton />

        {/* Filters */}
        {/* <div className="rounded-2xl bg-card border border-border">
          <div className="py-4 px-4 flex flex-col gap-3">
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive gap-1"
                  onClick={() => { setGridSize(""); setDifficulty(""); setGameMode(""); }}
                >
                  ✕ Clear
                </Button>
              )}
            </div>

            {/* Active filter pills */}
        {/* {hasFilters && (
              <div className="flex flex-wrap gap-1.5 justify-center">
                {gridSize && (
                  <div className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-foreground">
                    {gridSize}×{gridSize} Grid
                    <button onClick={() => setGridSize("")} className="text-muted-foreground hover:text-foreground">✕</button>
                  </div>
                )}
                {difficulty && (
                  <div className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-foreground">
                    {difficulty}
                    <button onClick={() => setDifficulty("")} className="text-muted-foreground hover:text-foreground">✕</button>
                  </div>
                )}
                {gameMode && (
                  <div className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-foreground">
                    {GAME_MODE_EMOJI[gameMode]} {gameMode}
                    <button onClick={() => setGameMode("")} className="text-muted-foreground hover:text-foreground">✕</button>
                  </div>
                )}
              </div>
            )} */}
        {/* </div> */}
        {/* </div>  */}
        {/* <LastGameChallenge/> */}

        {/* Pro upsell — only for logged-in, non-Pro users */}
        {user && !isPro && (
          <div className="rounded-2xl bg-primary/5 border border-primary/20">
            <div className="py-4 px-4">
              <UpgradeToProOnLeaderboardButton user={user} />
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-destructive">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm flex-1">{error}</span>
            <Button variant="ghost" size="sm" onClick={fetchLeaderboard}>
              Retry
            </Button>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-muted h-[72px] rounded-2xl w-full"
              />
            ))}
          </div>
        ) : !error && players.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border">
            <div className="flex flex-col items-center text-center py-14 gap-2">
              <div className="text-4xl">🤷</div>
              <p className="font-semibold text-muted-foreground">
                No players found
              </p>
              <p className="text-sm text-muted-foreground/60">
                Try adjusting your filters
              </p>
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
                  className={`rounded-2xl border px-4 py-3.5 flex items-center gap-3 transition-all duration-200 hover:scale-[1.01] bg-card
                    ${meta ? `${meta.border} ${meta.bg} ${meta.glow}` : "border-border"}
                    ${isCurrentUser ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
                  `}
                >
                  {/* Rank */}
                  <div className="w-8 flex justify-center shrink-0">
                    {meta ? (
                      <span className="text-xl leading-none">{meta.emoji}</span>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-mono font-bold text-muted-foreground">
                        #{rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="shrink-0">
                    <div className="w-11 h-11 rounded-full ring-2 ring-border overflow-hidden">
                      {player.image ? (
                        <img
                          src={player.image}
                          alt={player.name ?? "Player"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
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
                        className="font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors truncate"
                      >
                        {player.name || "Anonymous"}
                      </Link>
                      {player.is_pro_user && (
                        <RiVerifiedBadgeFill className="text-yellow-400 shrink-0 text-sm" />
                      )}
                      {player.social_link && (
                        <FaSquareXTwitter className="shrink-0 text-muted-foreground/40 hover:text-[#1DA1F2] transition-colors text-sm" />
                      )}
                      {isCurrentUser && (
                        <span className="inline-flex items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 shrink-0">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        {player.total_games} games
                      </span>
                      {player.avg_accuracy > 0 && (
                        <>
                          <span className="text-muted-foreground/30 text-xs">
                            ·
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {player.avg_accuracy.toFixed(1)}% acc
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <div
                      className={`font-extrabold tabular-nums text-base sm:text-lg ${
                        rank === 1
                          ? "text-yellow-500"
                          : rank === 2
                            ? "text-slate-400"
                            : rank === 3
                              ? "text-orange-400"
                              : "text-primary"
                      }`}
                    >
                      {formatNumber(player.total_score)}
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                      pts
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Pagination */}
        {!loading && !error && (page > 1 || hasMore) && (
          <div className="flex items-center justify-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              «
            </Button>
            <span className="flex items-center justify-center rounded-xl border border-border bg-muted px-3 h-9 text-sm font-medium text-foreground">
              Page {page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasMore}
              onClick={() => setPage((p) => p + 1)}
            >
              »
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterDropdown({ label, value, options, onChange, renderOption }) {
  return (
    <div className="group relative inline-block">
      <button
        tabIndex={0}
        type="button"
        className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors ${
          value
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-card text-foreground border-border hover:bg-muted"
        }`}
      >
        {value ? renderOption(value) : label}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>
      <ul
        className="invisible opacity-0 group-focus-within:visible group-focus-within:opacity-100 transition-opacity
          absolute z-50 mt-1 w-44 rounded-xl border border-border bg-card shadow-xl p-1.5"
      >
        <li>
          <button
            type="button"
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm hover:bg-muted transition-colors ${
              !value ? "font-semibold text-primary" : "text-foreground"
            }`}
            onClick={() => onChange("")}
          >
            All {label}s
          </button>
        </li>
        <div className="my-1 h-px bg-border" />
        {options.map((opt) => (
          <li key={opt}>
            <button
              type="button"
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm hover:bg-muted transition-colors ${
                value === String(opt)
                  ? "font-semibold text-primary bg-primary/10"
                  : "text-foreground"
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
