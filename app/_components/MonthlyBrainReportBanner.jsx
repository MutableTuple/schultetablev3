"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/app/_lib/supabase";
import { HiDocumentReport } from "react-icons/hi";
import { motion } from "framer-motion";
import GetProBtn from "./GetProBtn";
import Link from "next/link";

export default function MonthlyBrainReportBanner({
  progressPercentage,
  totalGames,
  requiredGames = 25,
  reportUnlocked,
  isPro,
  user,
}) {
  // ========================================
  // STATE
  // ========================================

  const [gameData, setGameData] = useState([]);
  const [lastMonthGameData, setLastMonthGameData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const now = new Date();

  // ========================================
  // DATE HELPERS
  // ========================================

  // IS TODAY THE LAST DAY OF THE MONTH?
  const lastDayOfCurrentMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  );
  const isLastDayOfMonth = now.getDate() === lastDayOfCurrentMonth.getDate();

  // CURRENT MONTH RANGE
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  const monthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  );

  // LAST MONTH RANGE
  const lastMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
    0,
    0,
    0,
  );
  const lastMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
  );

  // LAST MONTH NAME (e.g. "May 2025")
  const lastMonthName = lastMonthStart.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // CURRENT MONTH NAME (e.g. "June 2025")
  const currentMonthName = monthStart.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // ========================================
  // FETCH ANALYTICS
  // ========================================

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        if (!user?.id) return;
        setLoadingAnalytics(true);

        // FETCH CURRENT MONTH GAMES
        const { data: games, error: gamesError } = await supabase
          .from("UniversalGameStats")
          .select("*")
          .eq("user_id", user.id)
          .gte("created_at", monthStart.toISOString())
          .lte("created_at", monthEnd.toISOString())
          .order("created_at", { ascending: false });

        if (gamesError) {
          setGameData([]);
        } else {
          setGameData(Array.isArray(games) ? games : []);
        }

        // FETCH LAST MONTH GAMES (always fetch so we can show last month btn)
        const { data: lastGames, error: lastGamesError } = await supabase
          .from("UniversalGameStats")
          .select("*")
          .eq("user_id", user.id)
          .gte("created_at", lastMonthStart.toISOString())
          .lte("created_at", lastMonthEnd.toISOString())
          .order("created_at", { ascending: false });

        if (!lastGamesError) {
          setLastMonthGameData(Array.isArray(lastGames) ? lastGames : []);
        }

        // FETCH ANALYTICS RPC
        const { data: analyticsData, error: analyticsError } =
          await supabase.rpc("get_user_analytics", {
            p_user_id: user.id,
            p_from: monthStart.toISOString(),
            p_to: monthEnd.toISOString(),
          });

        if (analyticsError) {
          setAnalytics(null);
        } else if (analyticsData?.length > 0) {
          setAnalytics(analyticsData[0]);
        } else {
          setAnalytics(null);
        }
      } catch (err) {
        setGameData([]);
        setAnalytics(null);
      } finally {
        setLoadingAnalytics(false);
      }
    }

    fetchAnalytics();
  }, [user]);

  // ========================================
  // COUNTS & UNLOCK LOGIC
  // ========================================

  const REQUIRED_GAMES = 25;

  const monthlyGameCount = gameData.length;
  // const lastMonthGameCount = lastMonthGameData.length;
  const lastMonthGameCount = lastMonthGameData.length;

  // CURRENT MONTH: only unlocked if today is last day AND 25+ games AND isPro
  const currentMonthUnlocked =
    isPro && isLastDayOfMonth && monthlyGameCount >= REQUIRED_GAMES;

  // LAST MONTH: always show if isPro and had 25+ games last month
  const lastMonthUnlocked = isPro && lastMonthGameCount >= REQUIRED_GAMES;

  // PROGRESS BAR based on current month
  const realProgressPercentage = Math.min(
    (monthlyGameCount / REQUIRED_GAMES) * 100,
    100,
  );

  // ========================================
  // COMPARISON LOGIC
  // ========================================

  const comparison = useMemo(() => {
    try {
      const safeData = Array.isArray(gameData) ? [...gameData].reverse() : [];

      if (!safeData.length) {
        return {
          accuracyDiff: "0.0",
          reactionImprovement: "0.0",
          bestScore: 0,
          worstScore: 0,
          avgAccuracy: "0.0",
          totalScore: 0,
          totalGames: 0,
        };
      }

      const avg = (arr, key) => {
        if (!arr.length) return 0;
        return (
          arr.reduce((sum, game) => sum + (Number(game?.[key]) || 0), 0) /
          arr.length
        );
      };

      const midpoint = Math.floor(safeData.length / 2);
      const oldGames = safeData.slice(0, midpoint);
      const newGames = safeData.slice(midpoint);

      const oldAccuracy = avg(oldGames, "accuracy");
      const newAccuracy = avg(newGames, "accuracy");
      const accuracyDiff = newAccuracy - oldAccuracy;

      const oldReaction = avg(oldGames, "reaction_time");
      const newReaction = avg(newGames, "reaction_time");
      const reactionImprovement =
        oldReaction > 0 ? ((oldReaction - newReaction) / oldReaction) * 100 : 0;

      const sortedGames = [...safeData].sort(
        (a, b) => (b?.score || 0) - (a?.score || 0),
      );
      const bestGame = sortedGames[0];
      const worstGame = sortedGames[sortedGames.length - 1];

      const totalScore = safeData.reduce(
        (sum, game) => sum + (Number(game?.score) || 0),
        0,
      );

      return {
        accuracyDiff: Number.isFinite(accuracyDiff)
          ? accuracyDiff.toFixed(1)
          : "0.0",
        reactionImprovement: Number.isFinite(reactionImprovement)
          ? reactionImprovement.toFixed(1)
          : "0.0",
        bestScore: bestGame?.score || 0,
        worstScore: worstGame?.score || 0,
        avgAccuracy: Number(
          analytics?.avg_accuracy || avg(safeData, "accuracy") || 0,
        ).toFixed(1),
        totalScore,
        totalGames: safeData.length,
      };
    } catch (err) {
      return {
        accuracyDiff: "0.0",
        reactionImprovement: "0.0",
        bestScore: 0,
        worstScore: 0,
        avgAccuracy: "0.0",
        totalScore: 0,
        totalGames: 0,
      };
    }
  }, [gameData, analytics]);

  // ========================================
  // LOADING
  // ========================================

  if (loadingAnalytics) {
    return (
      <div className="relative z-10">
        <h2 className="text-lg font-black uppercase tracking-wide flex items-center gap-1">
          <HiDocumentReport />
          Monthly Brain Report
        </h2>
        <div className="mt-4">
          <span className="loading loading-spinner"></span>
        </div>
      </div>
    );
  }

  // ========================================
  // NOT SIGNED IN
  // ========================================

  if (!user) {
    return (
      <div className="relative z-10">
        <h2 className="text-lg font-black uppercase tracking-wide flex items-center gap-1">
          <HiDocumentReport />
          Monthly Brain Report
        </h2>
        <p className="mt-3 text-sm text-base-content/70">
          Sign in to track your monthly brain performance and unlock reports.
        </p>
        <Link href="/login">
          <button className="btn btn-primary mt-4 w-full">
            Sign In To Get Brain Report
          </button>
        </Link>
      </div>
    );
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="relative z-10">
      {/* HEADER */}
      <h2 className="text-lg font-black uppercase tracking-wide flex items-center gap-1">
        <HiDocumentReport />
        Monthly Brain Report
      </h2>

      <p className="mt-1 text-sm text-base-content/60">
        Unlock your Monthly cognitive performance report.
      </p>

      {/* ========================================
          LAST MONTH REPORT SECTION
          Always show if isPro + had 25+ games last month
      ======================================== */}
      {lastMonthUnlocked && (
        <div className="mt-4 border border-success/40 bg-success/10 rounded-lg p-3">
          <p className="text-xs font-bold text-success uppercase tracking-wide">
            {lastMonthName} Report Ready
          </p>
          <p className="mt-1 text-xs text-base-content/70">
            You played {lastMonthGameCount} games last month. Your report is
            available.
          </p>
          <Link
            href={`/monthly-brain-report?month=${lastMonthStart.getFullYear()}-${String(
              lastMonthStart.getMonth() + 1,
            ).padStart(2, "0")}`}
          >
            <button className="btn btn-success btn-sm btn-block mt-3 font-black">
              Download {lastMonthName} Report
            </button>
          </Link>
        </div>
      )}

      {/* ========================================
          CURRENT MONTH PROGRESS
      ======================================== */}
      <div className="mt-4">
        <div className="h-4 overflow-hidden rounded-full bg-base-300">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${realProgressPercentage}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs font-semibold">
          <span>
            {monthlyGameCount}/{REQUIRED_GAMES} games this month
          </span>
          <span>{Math.floor(realProgressPercentage)}%</span>
        </div>

        {/* ========================================
            CURRENT MONTH CTA
        ======================================== */}

        {/* NOT ENOUGH GAMES YET */}
        {monthlyGameCount < REQUIRED_GAMES && (
          <p className="mt-2 text-xs text-base-content/70">
            Play{" "}
            <span className="font-bold">
              {Math.max(REQUIRED_GAMES - monthlyGameCount, 0)}
            </span>{" "}
            more games to unlock your {currentMonthName} brain report.
          </p>
        )}

        {/* ENOUGH GAMES BUT NOT LAST DAY YET */}
        {monthlyGameCount >= REQUIRED_GAMES && !isLastDayOfMonth && (
          <div className="mt-3 border border-primary/30 bg-primary/10 rounded-lg p-3">
            <p className="text-xs font-semibold">
              🎉 {REQUIRED_GAMES} games hit! Report unlocks on the last day of{" "}
              {currentMonthName}.
            </p>
            <p className="mt-1 text-xs text-base-content/60">
              The more you play, the richer your report gets — reaction trends,
              accuracy spikes, your best day of the month. Don't leave data on
              the table. Report available{" "}
              <span className="font-bold">
                {lastDayOfCurrentMonth.toLocaleDateString("default", {
                  month: "long",
                  day: "numeric",
                })}
              </span>
              .
            </p>
          </div>
        )}

        {/* LAST DAY + 25 GAMES + PRO → SHOW DOWNLOAD */}
        {currentMonthUnlocked && (
          <div className="mt-3">
            <Link href="/monthly-brain-report">
              <button className="btn btn-primary btn-block font-black">
                Download {currentMonthName} Brain Report
              </button>
            </Link>
          </div>
        )}

        {/* LAST DAY + 25 GAMES + NOT PRO → UPGRADE */}
        {!isPro && monthlyGameCount >= REQUIRED_GAMES && isLastDayOfMonth && (
          <div className="mt-3 border border-warning bg-warning/10 p-3 rounded-lg">
            <p className="text-xs font-semibold">Brain Report unlocked 🎉</p>
            <p className="mt-1 text-xs text-base-content/70">
              Upgrade to Pro to download your detailed cognitive report.
            </p>
            <div className="mt-3">
              <GetProBtn />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
