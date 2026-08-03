// GamelistPage.jsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/app/_lib/supabase";
import GameList from "./GameList";
import {
  Gamepad2,
  Grid2x2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Lock,
  Zap,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

const DEFAULT_LIMIT = 5;
const ITEMS_PER_PAGE = 5;

// ─── skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="bg-card rounded-3xl border border-border overflow-hidden animate-pulse">
      <div className="px-6 py-5 border-b border-border flex items-center justify-between">
        <div className="h-3.5 w-28 bg-muted rounded-lg" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-muted rounded-lg" />
          <div className="h-6 w-16 bg-muted rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-4 divide-x divide-border border-b border-border">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="px-5 py-4 space-y-2">
            <div className="h-2.5 w-14 bg-muted rounded" />
            <div className="h-4 w-10 bg-muted rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 divide-x divide-border">
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-5 py-4 space-y-2">
            <div className="h-2.5 w-14 bg-muted rounded" />
            <div className="h-4 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── pagination ───────────────────────────────────────────────────────────────

function getPageList(page, totalPages) {
  if (totalPages <= 1) return [];
  return Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
      acc.push(p);
      return acc;
    }, []);
}

const Pagination = React.memo(function Pagination({
  page,
  totalPages,
  setPage,
}) {
  const pageList = useMemo(
    () => getPageList(page, totalPages),
    [page, totalPages],
  );
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pageList.map((p, i) =>
        p === "…" ? (
          <span key={`d${i}`} className="text-xs text-muted-foreground/50 px-1">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold transition-colors
              ${
                page === p
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:bg-muted"
              }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
});

// ─── game card ────────────────────────────────────────────────────────────────

const GameCard = React.memo(function GameCard({ game, isPro }) {
  const summary = game.game_summary || {};
  const avgReaction = summary.avgReactionTimeMs ?? 0;
  const durationSec = summary.durationMs
    ? (summary.durationMs / 1000).toFixed(2)
    : "0.00";

  const created = new Date(game.created_at);
  const date = created.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = created.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-card rounded-3xl border border-border overflow-hidden hover:border-foreground/20 transition-colors">
      {/* Card header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <Gamepad2 className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-none">
              {date}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{time}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
            <Grid2x2 className="w-3 h-3" />
            {game.grid_size}×{game.grid_size}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-lg capitalize">
            {game.difficulty}
          </span>
        </div>
      </div>

      {/* Stats */}
      <GameList
        summary={summary}
        game={game}
        isPro={isPro}
        avgReaction={avgReaction}
        durationSec={durationSec}
      />
    </div>
  );
});

// ─── empty ────────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="bg-card rounded-3xl border border-border flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Inbox className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground">No games yet</p>
      <p className="text-xs text-muted-foreground mt-1">
        Play your first game to see history here.
      </p>
      <a
        href="/"
        className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/85 transition-colors"
      >
        <Gamepad2 className="w-3.5 h-3.5" /> Play Now
      </a>
    </div>
  );
}

// ─── error ────────────────────────────────────────────────────────────────────
// New — previously a failed fetch silently fell through to EmptyState, so a
// network error and "you genuinely have no games" looked identical to the user.

function ErrorState({ onRetry }) {
  return (
    <div className="bg-card rounded-3xl border border-border flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-5 h-5 text-destructive" />
      </div>
      <p className="text-sm font-semibold text-foreground">
        Couldn't load your games
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Something went wrong. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/85 transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Retry
      </button>
    </div>
  );
}

// ─── pro banner ───────────────────────────────────────────────────────────────

function ProBanner() {
  return (
    <div className="bg-card rounded-3xl border border-border px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Lock className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Showing your last 5 games
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upgrade to Pro for full history, detailed stats and AI insights.
          </p>
        </div>
      </div>
      <a
        href="/get-pro"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
      >
        <Zap className="w-3.5 h-3.5" /> Upgrade to Pro
      </a>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function GamelistPage({ user }) {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [totalGames, setTotalGames] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryTick, setRetryTick] = useState(0);

  const userId = Array.isArray(user) ? user?.[0]?.id : user?.id;
  const isPro = Array.isArray(user)
    ? user?.[0]?.is_pro_user
    : user?.is_pro_user;

  // avoid landing on an out-of-range page if the user or their pro status changes
  useEffect(() => {
    setPage(1);
  }, [userId, isPro]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    const fetchGames = async () => {
      setLoading(true);
      setError(false);
      try {
        if (isPro) {
          const from = (page - 1) * ITEMS_PER_PAGE;
          // count + page data are independent — fetch in parallel instead of sequentially
          const [{ count }, { data, error: dataError }] = await Promise.all([
            supabase
              .from("UniversalGameStats")
              .select("*", { count: "exact", head: true })
              .eq("user_id", userId),
            supabase
              .from("UniversalGameStats")
              .select("*")
              .eq("user_id", userId)
              .order("created_at", { ascending: false })
              .range(from, from + ITEMS_PER_PAGE - 1),
          ]);
          if (dataError) throw dataError;
          if (cancelled) return;
          setTotalGames(count || 0);
          setGames(data);
        } else {
          const { data, error: dataError } = await supabase
            .from("UniversalGameStats")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(DEFAULT_LIMIT);
          if (dataError) throw dataError;
          if (cancelled) return;
          setGames(data);
          setTotalGames(DEFAULT_LIMIT);
        }
      } catch (err) {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchGames();
    return () => {
      cancelled = true;
    };
  }, [userId, page, isPro, retryTick]);

  const totalPages = Math.ceil(totalGames / ITEMS_PER_PAGE);
  const showProBanner = !isPro && !loading && !error && games.length > 0;

  return (
    <div className="space-y-3 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-sm font-bold text-foreground">Game History</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {loading
              ? "Loading…"
              : isPro
                ? `${totalGames} total games`
                : "Last 5 games"}
          </p>
        </div>
        {isPro && !loading && !error && totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        )}
      </div>

      {showProBanner && <ProBanner />}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={() => setRetryTick((t) => t + 1)} />
      ) : games.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="space-y-3">
            {games.map((game) => (
              <GameCard key={game.id} game={game} isPro={isPro} />
            ))}
          </div>
          {isPro && totalPages > 1 && (
            <div className="flex justify-center pt-2">
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
