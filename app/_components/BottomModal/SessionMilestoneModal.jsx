"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  FaBrain,
  FaTrophy,
  FaLock,
  FaBolt,
  FaTimes,
  FaFire,
  FaChartLine,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { trackEvent } from "@/app/_lib/ga";
import { readProgress, getRank } from "@/app/_utils/progress";

/**
 * The end-of-session modal, shown once every 5 games instead of after every
 * round.
 *
 * Design constraint that drove everything here: it must be on screen the
 * instant the 5th game ends. Nothing in the first paint is allowed to wait on
 * a network call — the aggregate numbers are computed synchronously from the
 * localStorage history the game already writes, and the two values that DO
 * need the server (global rank, percentile) render as skeletons and fill in
 * whenever they arrive. A modal that appears 800ms late reads as a bug; a
 * modal that appears instantly with two shimmering cells reads as fast.
 *
 * Ordering is deliberate and is the monetisation argument:
 *   1. What you just did          (earned attention — pure reward)
 *   2. Your 5-game averages       (the payoff for finishing the set)
 *   3. Brain Report progress      (the free thing, and the reason to continue)
 *   4. Pro                        (the paid thing, once value is demonstrated)
 *   5. Save progress / leaderboard(retention, lowest-commitment asks last)
 *
 * The upsell never precedes the reward. That's not politeness — putting a
 * price in front of someone before they've seen their own numbers is what
 * makes people close a modal without reading it.
 */

const GUEST_HISTORY_KEY = "schulte_history_guest";
const USER_HISTORY_KEY_PREFIX = "schulte_history_user_";

function loadHistory(userId) {
  try {
    if (userId) {
      const h = JSON.parse(
        localStorage.getItem(`${USER_HISTORY_KEY_PREFIX}${userId}`) || "[]",
      );
      if (h.length) return h;
    }
    const gh = JSON.parse(localStorage.getItem(GUEST_HISTORY_KEY) || "[]");
    if (gh.length) return gh;
    return JSON.parse(localStorage.getItem("schulte_last_10_games") || "[]");
  } catch {
    return [];
  }
}

/** Aggregate of the last N games. Pure, synchronous, no network. */
function summarise(history, n = 5) {
  const games = history.slice(0, n);
  if (!games.length) return null;

  const avg = (fn) => games.reduce((a, g) => a + (fn(g) || 0), 0) / games.length;
  const bestTime = Math.min(...games.map((g) => g.durationMs || Infinity));
  const bestScore = Math.max(...games.map((g) => g.score || 0));

  // Improvement across the set: first half vs second half of the window.
  // `games` is newest-first, so "older" is the tail.
  const mid = Math.floor(games.length / 2) || 1;
  const newer = games.slice(0, mid);
  const older = games.slice(-mid);
  const avgOf = (arr) =>
    arr.reduce((a, g) => a + (g.score || 0), 0) / (arr.length || 1);
  const oldAvg = avgOf(older);
  const trendPct = oldAvg ? ((avgOf(newer) - oldAvg) / oldAvg) * 100 : 0;

  return {
    count: games.length,
    avgAccuracy: avg((g) => g.accuracy),
    avgReaction: avg((g) => g.avgReactionTimeMs),
    avgDuration: avg((g) => g.durationMs),
    avgScore: avg((g) => g.score),
    bestTime: Number.isFinite(bestTime) ? bestTime : null,
    bestScore,
    trendPct: Math.round(trendPct * 10) / 10,
  };
}

/* ── Skeleton used for the server-dependent cells only ── */
function Shimmer({ className = "" }) {
  return (
    <span
      className={`inline-block animate-pulse rounded bg-muted align-middle ${className}`}
    />
  );
}

function Stat({ label, value, pending }) {
  return (
    <div className="text-center">
      <div className="text-base font-black tabular-nums leading-none text-foreground">
        {pending ? <Shimmer className="h-4 w-10" /> : value}
      </div>
      <div className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export default function SessionMilestoneModal({
  visible,
  onClose,
  onPlayAgain,
  onUpgrade,
  onLogin,
  user,
  isProUser,
  gamesRemaining,
  serverStats,
  // Result of SchulteTable's recordGameCompleted() for the game that just
  // closed the set. Preferred over readProgress() because it's already the
  // post-increment value — re-reading storage races the write on slow devices.
  sessionProgress,
  gamesInSet = 5,
  // Reused from the parent's existing breakpoint state rather than duplicating
  // a resize listener here.
  isMobile = false,
}) {
  const trackedRef = useRef(false);

  // isDesktop comes from the parent, which already runs exactly this listener
  // for its own layout. Owning a second one here meant every visitor paid for
  // a resize handler that only matters for a modal shown once per five games —
  // and this component is statically imported, so it mounts on page load.
  const isDesktop = !isMobile;

  // Computed synchronously on the very first render — this is what makes the
  // modal paint complete instead of empty. Gated on `visible` so a closed
  // modal never touches localStorage or JSON.parse.
  const summary = useMemo(
    () => (visible ? summarise(loadHistory(user?.id), gamesInSet) : null),
    [visible, user?.id, gamesInSet],
  );
  const progress = useMemo(
    () => (visible ? (sessionProgress ?? readProgress()) : null),
    [visible, sessionProgress],
  );
  const rank = progress
    ? (progress.rank ?? getRank(progress.lifetimeGames))
    : null;

  useEffect(() => {
    if (!visible) {
      trackedRef.current = false;
      return;
    }
    if (trackedRef.current) return;
    trackedRef.current = true;

    trackEvent("session_milestone_viewed", {
      games_in_set: gamesInSet,
      avg_accuracy: summary ? Math.round(summary.avgAccuracy) : null,
      trend_pct: summary?.trendPct ?? null,
      streak: progress?.streak ?? 0,
      rank: rank?.name ?? null,
      is_pro_user: !!isProUser,
      is_logged_in: !!user,
      games_remaining_to_report: gamesRemaining,
    });
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  const improving = (summary?.trendPct ?? 0) > 1;
  const reportReady = gamesRemaining === 0;

  // Headline reacts to what actually happened across the set. A flat set gets
  // "consistent", not fake enthusiasm — overclaiming on a mediocre run is how
  // you teach someone to stop reading these.
  const headline = improving
    ? "You got faster across those 5."
    : (summary?.avgAccuracy ?? 0) >= 90
      ? "Five clean games. That's control."
      : "Set complete. Here's the read.";

  const body = (
    <>
      <button
        onClick={() => {
          trackEvent("session_milestone_closed", { source: "close_button" });
          onClose?.();
        }}
        className="absolute right-3 top-3 z-30 flex h-7 w-7 items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground"
        aria-label="Close"
      >
        <FaTimes size={13} />
      </button>

      {/* ── 1. The moment ──────────────────────────────────────────────── */}
      <div className="px-5 pt-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
          <HiSparkles size={22} className="text-primary" />
        </div>
        <h2 className="text-xl font-black leading-tight text-foreground">
          {headline}
        </h2>
        {progress?.streak > 0 && (
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
            <FaFire size={11} /> {progress.streak}-day streak
            {rank && !rank.isMax && (
              <span className="font-semibold text-muted-foreground">
                · {rank.gamesToNext} to {rank.next}
              </span>
            )}
          </p>
        )}
      </div>

      {/* ── 2. The averages ────────────────────────────────────────────── */}
      <div className="px-5 pt-5">
        <div className="rounded-2xl border border-border bg-card px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Last {summary?.count ?? gamesInSet} games — average
            </span>
            {summary && summary.trendPct !== 0 && (
              <span
                className={`text-[10px] font-bold tabular-nums ${
                  improving ? "text-success" : "text-warning"
                }`}
              >
                {summary.trendPct > 0 ? "+" : ""}
                {summary.trendPct}%
              </span>
            )}
          </div>

          {/* `pending` covers the one case where these genuinely aren't
              available on first paint: localStorage blocked (private mode,
              strict ITP) or the history write not yet flushed. Normally
              `summary` is computed synchronously and every cell paints filled
              on frame one. */}
          <div className="grid grid-cols-4 gap-2">
            <Stat
              label="Accuracy"
              pending={!summary}
              value={`${Math.round(summary?.avgAccuracy ?? 0)}%`}
            />
            <Stat
              label="Reaction"
              pending={!summary}
              value={`${Math.round(summary?.avgReaction ?? 0)}ms`}
            />
            <Stat
              label="Avg time"
              pending={!summary}
              value={`${((summary?.avgDuration ?? 0) / 1000).toFixed(1)}s`}
            />
            {/* All four cells are local-only, so the grid is always complete on
                first paint. The global percentile used to sit here as a
                shimmering placeholder — but it's only returned when the score
                save succeeds, so for guests and any failed save it shimmered
                forever. A permanent skeleton reads as broken; it now renders
                as its own line below, only when the number actually exists. */}
            <Stat
              label="Best run"
              pending={!summary}
              value={
                summary?.bestTime != null
                  ? `${(summary.bestTime / 1000).toFixed(2)}s`
                  : "—"
              }
            />
          </div>

          {serverStats?.fasterThanPct != null && (
            <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-[11px] font-bold text-primary">
              <FaTrophy size={10} /> That last run put you in the top{" "}
              {100 - serverStats.fasterThanPct}% on this board
            </p>
          )}

          {summary?.bestScore > 0 && (
            <p className="mt-3 border-t border-border pt-2.5 text-[11px] text-muted-foreground">
              Best score this set:{" "}
              <span className="font-bold tabular-nums text-foreground">
                {Math.round(summary.bestScore).toLocaleString()}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* ── 3. Brain Report — the free unlock ──────────────────────────── */}
      <div className="px-5 pt-3">
        {reportReady ? (
          <Link
            href="/monthly-brain-report"
            onClick={() =>
              trackEvent("brain_report_clicked", { source: "session_milestone" })
            }
            className="flex items-center justify-between gap-2 rounded-2xl bg-success px-4 py-3.5"
          >
            <span className="flex items-center gap-2 text-sm font-black text-white">
              <FaBrain size={15} /> Your free Brain Report is ready
            </span>
            <IoIosArrowRoundForward size={20} className="shrink-0 text-white" />
          </Link>
        ) : (
          <Link
            href="/monthly-brain-report"
            onClick={() =>
              trackEvent("brain_report_clicked", {
                source: "session_milestone_locked",
                games_remaining: gamesRemaining,
              })
            }
            className="block rounded-2xl border border-border bg-card px-4 py-3.5"
          >
            <div className="flex items-center gap-2">
              <FaLock size={11} className="shrink-0 text-muted-foreground" />
              <span className="text-xs font-bold text-foreground">
                {gamesRemaining} more game{gamesRemaining === 1 ? "" : "s"} to
                unlock your free Brain Report
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-700"
                style={{ width: `${((10 - gamesRemaining) / 10) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
              A written analysis of your attention — focus score, where you lose
              time, your best hours. Free, no card. See what&apos;s in it →
            </p>
          </Link>
        )}
      </div>

      {/* ── 4. Pro ─────────────────────────────────────────────────────── */}
      {!isProUser && (
        <div className="px-5 pt-3">
          <button
            onClick={() => {
              trackEvent("upgrade_offer_clicked", {
                source: "session_milestone",
              });
              onUpgrade?.();
            }}
            className="w-full rounded-2xl bg-[var(--ink)] px-4 py-4 text-left"
          >
            <div className="mb-3 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                <FaChartLine size={15} className="text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black leading-tight text-background">
                  You just saw 5 games. Pro reads all of them.
                </div>
                <div className="mt-1 text-xs leading-relaxed text-background/50">
                  Full history, percentile rank, Focus IQ trend, fatigue
                  analysis — and no sponsored blocks anywhere.
                </div>
              </div>
            </div>
            <div className="flex h-10 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              Unlock Pro — $4.99 once
            </div>
          </button>
        </div>
      )}

      {/* ── 5. Retention asks ──────────────────────────────────────────── */}
      <div className="px-5 pb-6 pt-3">
        {!user && (
          <button
            onClick={() => {
              trackEvent("signup_nudge_clicked", {
                source: "session_milestone",
              });
              onLogin?.();
            }}
            className="mb-2 flex w-full items-center justify-between gap-2 rounded-2xl border border-border bg-card px-4 py-3"
          >
            <span className="text-left text-xs font-semibold text-foreground">
              Your streak and these stats live on this device only.
              <span className="block font-normal text-muted-foreground">
                Create a free account to keep them.
              </span>
            </span>
            <IoIosArrowRoundForward
              size={20}
              className="shrink-0 text-muted-foreground"
            />
          </button>
        )}

        <Button
          onClick={() => {
            trackEvent("play_again_clicked", { source: "session_milestone" });
            onPlayAgain?.();
          }}
          className="h-auto w-full rounded-2xl py-3.5 text-sm font-bold"
        >
          <FaBolt size={12} className="mr-1.5" />
          Play 5 more
        </Button>

        <Link
          href="/leaderboard"
          onClick={() =>
            trackEvent("leaderboard_clicked", { source: "session_milestone" })
          }
          className="mt-2 flex w-full items-center justify-center gap-1.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <FaTrophy size={10} /> See where you rank globally
        </Link>
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open onOpenChange={() => {}}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[88vh] max-w-sm gap-0 overflow-y-auto overflow-x-hidden rounded-3xl border-border bg-background p-0"
        >
          <DialogTitle className="sr-only">Session summary</DialogTitle>
          {body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open onOpenChange={() => {}}>
      <SheetContent
        showCloseButton={false}
        side="bottom"
        className="relative max-h-[90dvh] gap-0 overflow-y-auto overflow-x-hidden rounded-t-3xl border-border bg-background p-0"
      >
        <SheetTitle className="sr-only">Session summary</SheetTitle>
        <div className="flex justify-center pb-1 pt-2.5">
          <div className="h-1 w-10 rounded-full bg-muted" />
        </div>
        {body}
      </SheetContent>
    </Sheet>
  );
}
