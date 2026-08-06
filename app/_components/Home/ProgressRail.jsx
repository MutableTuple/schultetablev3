"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Brain, Lock, Trophy, ArrowRight, Sparkles } from "lucide-react";
import { trackEvent } from "@/app/_lib/ga";
import { readProgress, getRank } from "@/app/_utils/progress";

const REPORT_GAMES_REQUIRED = 10;

/**
 * The strip directly under the game on `/`.
 *
 * It exists because of a specific hole in the funnel: `free_report_cta_viewed`
 * only fires inside the post-game sheet, so a visitor only ever learns the free
 * Brain Report exists if they finish a game *and* happen to be on their tenth
 * one. Everyone else — the large majority — leaves without knowing the product
 * has a report at all. This surfaces it permanently, on the page 71% of
 * sessions land on, whether or not they've finished a round yet.
 *
 * Renders a stable skeleton on the server and fills in real numbers after
 * mount, since every value comes from localStorage. Without the `mounted` gate
 * this hydration-mismatches on the streak digits.
 */
export default function ProgressRail({ user, isPro }) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState({
    streak: 0,
    lifetimeGames: 0,
    gamesToday: 0,
  });
  const [gamesToReport, setGamesToReport] = useState(REPORT_GAMES_REQUIRED);

  useEffect(() => {
    setProgress(readProgress());

    // Mirrors the exact keys SchulteTable writes, so the count here can't
    // disagree with the one shown in the post-game sheet.
    try {
      const unlocked = localStorage.getItem("report_unlocked") === "true";
      const since = Number(localStorage.getItem("games_since_last_report")) || 0;
      setGamesToReport(
        unlocked ? 0 : Math.max(0, REPORT_GAMES_REQUIRED - since),
      );
    } catch {
      /* private mode / storage blocked — keep the default */
    }

    setMounted(true);
  }, []);

  const rank = getRank(progress.lifetimeGames);
  const reportReady = gamesToReport === 0;
  const played = REPORT_GAMES_REQUIRED - gamesToReport;

  return (
    <section
      id="below-the-game"
      aria-label="Your progress"
      className="mx-auto w-full max-w-5xl scroll-mt-4 px-4 pt-8 sm:pt-10"
    >
      <div className="grid gap-3 md:grid-cols-3">
        {/* ── Streak ─────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <Flame size={15} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Daily streak
            </span>
          </div>
          <p className="text-3xl font-black leading-none tabular-nums text-foreground">
            {mounted ? progress.streak : 0}
            <span className="ml-1.5 text-sm font-bold text-muted-foreground">
              day{(mounted ? progress.streak : 0) === 1 ? "" : "s"}
            </span>
          </p>
          {/* "Safe" is gated on the streak record itself, not on the daily
              counter. They're written together by recordGameCompleted, but an
              existing player can arrive with a legacy `schulte_daily_games`
              value and no streak record yet — which would otherwise render
              "0 days" next to "streak is safe". */}
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {!mounted || progress.streak === 0
              ? "Play one round today to start a streak."
              : progress.gamesToday > 0
                ? `${progress.gamesToday} game${progress.gamesToday === 1 ? "" : "s"} today — streak is safe.`
                : "Play one round today to keep it alive."}
          </p>
        </div>

        {/* ── Rank ───────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <Trophy size={15} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Your rank
            </span>
          </div>
          <p className="text-xl font-black leading-none text-foreground">
            {mounted ? rank.name : RANK_PLACEHOLDER}
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${mounted ? rank.progressPct : 0}%` }}
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {mounted && !rank.isMax
              ? `${rank.gamesToNext} more game${rank.gamesToNext === 1 ? "" : "s"} to reach ${rank.next}.`
              : mounted
                ? "Top rank reached. Now chase the leaderboard."
                : "Play a round to start ranking up."}
          </p>
        </div>

        {/* ── Free Brain Report ──────────────────────────────────────────── */}
        <div
          className={`rounded-2xl border p-4 ${
            reportReady && mounted
              ? "border-success/40 bg-success/10"
              : "border-border bg-card"
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <Brain size={15} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Free Brain Report
            </span>
          </div>

          {mounted && reportReady ? (
            <>
              <p className="text-sm font-bold leading-snug text-foreground">
                Your report is ready.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Focus score, reaction breakdown, best time of day — built from
                your own games.
              </p>
              <Link
                href="/monthly-brain-report"
                onClick={() =>
                  trackEvent("brain_report_clicked", { source: "home_rail" })
                }
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-foreground underline underline-offset-4"
              >
                Open my report <ArrowRight size={13} />
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm font-bold leading-snug text-foreground">
                {mounted
                  ? `${gamesToReport} more game${gamesToReport === 1 ? "" : "s"} to unlock it`
                  : "Play 10 games to unlock it"}
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{
                    width: `${mounted ? (played / REPORT_GAMES_REQUIRED) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs leading-relaxed text-muted-foreground">
                <Lock size={11} className="shrink-0" />A full written analysis of
                your attention — free, no card.
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Save-your-progress nudge (guests) / Pro nudge (signed-in free) ── */}
      {!isPro && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3">
          <p className="flex items-center gap-2 text-xs leading-relaxed text-muted-foreground">
            <Sparkles size={13} className="shrink-0 text-primary" />
            {user ? (
              <span>
                Pro turns these numbers into a full history — percentile rank,
                Focus IQ trend, and every game you&apos;ve ever played.
              </span>
            ) : (
              <span>
                This streak and rank live on this device only. Create a free
                account to keep them everywhere.
              </span>
            )}
          </p>
          <Link
            href={user ? "/get-pro" : "/auth/register"}
            onClick={() =>
              trackEvent(
                user ? "upgrade_offer_clicked" : "signup_nudge_clicked",
                { source: "home_progress_rail" },
              )
            }
            className="shrink-0 rounded-full bg-foreground px-4 py-1.5 text-xs font-bold text-background transition-opacity hover:opacity-90"
          >
            {user ? "See Pro — $4.99 once" : "Save my progress"}
          </Link>
        </div>
      )}
    </section>
  );
}

// Matches the width of the shortest real rank name so the card doesn't jump on
// hydration.
const RANK_PLACEHOLDER = "Rookie";
