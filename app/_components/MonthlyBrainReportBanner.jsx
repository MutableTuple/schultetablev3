"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/app/_lib/supabase";
import { FileText, Loader2, PartyPopper, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import GetProBtn from "./GetProBtn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MonthlyBrainReportBanner({
  progressPercentage,
  totalGames,
  requiredGames = 25,
  reportUnlocked,
  isPro,
  user,
}) {
  const [gameData, setGameData] = useState([]);
  const [lastMonthGameData, setLastMonthGameData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const now = new Date();

  const lastDayOfCurrentMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  );
  const isLastDayOfMonth = now.getDate() === lastDayOfCurrentMonth.getDate();

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  const monthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  );

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

  const lastMonthName = lastMonthStart.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const currentMonthName = monthStart.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        if (!user?.id) return;
        setLoadingAnalytics(true);

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

  const REQUIRED_GAMES = 25;

  const monthlyGameCount = gameData.length;
  const lastMonthGameCount = lastMonthGameData.length;

  const currentMonthUnlocked =
    isPro && isLastDayOfMonth && monthlyGameCount >= REQUIRED_GAMES;

  const lastMonthUnlocked = isPro && lastMonthGameCount >= REQUIRED_GAMES;

  const realProgressPercentage = Math.min(
    (monthlyGameCount / REQUIRED_GAMES) * 100,
    100,
  );

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

  if (loadingAnalytics) {
    return (
      <div className="relative z-10">
        <h2 className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Monthly Brain Report
        </h2>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading your report status…
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative z-10">
        <h2 className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Monthly Brain Report
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in to track your monthly brain performance and unlock reports.
        </p>
        <Button
          render={<Link href="/login" />}
          className="mt-4 w-full h-auto py-2.5 rounded-xl"
        >
          Sign In To Get Brain Report
        </Button>
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <h2 className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Monthly Brain Report
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Unlock your monthly cognitive performance report.
      </p>

      {lastMonthUnlocked && (
        <div className="mt-4 border border-success/40 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-success uppercase tracking-wide">
              {lastMonthName} Report
            </p>
            <Badge variant="outline" className="border-success text-success">
              Ready
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            You played {lastMonthGameCount} games last month. Your report is
            available.
          </p>
          <Button
            render={
              <Link
                href={`/monthly-brain-report?month=${lastMonthStart.getFullYear()}-${String(
                  lastMonthStart.getMonth() + 1,
                ).padStart(2, "0")}`}
              />
            }
            variant="outline"
            className="mt-3 w-full h-auto py-2 rounded-xl font-black border-success text-success hover:bg-success hover:text-success-foreground"
          >
            Download {lastMonthName} Report
          </Button>
        </div>
      )}

      <div className="mt-4">
        <div className="h-3 overflow-hidden rounded-full border border-border">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${realProgressPercentage}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs font-semibold text-foreground">
          <span>
            {monthlyGameCount}/{REQUIRED_GAMES} games this month
          </span>
          <span>{Math.floor(realProgressPercentage)}%</span>
        </div>

        {monthlyGameCount < REQUIRED_GAMES && (
          <p className="mt-2 text-xs text-muted-foreground">
            Play{" "}
            <span className="font-bold text-foreground">
              {Math.max(REQUIRED_GAMES - monthlyGameCount, 0)}
            </span>{" "}
            more games to unlock your {currentMonthName} brain report.
          </p>
        )}

        {monthlyGameCount >= REQUIRED_GAMES && !isLastDayOfMonth && (
          <div className="mt-3 border border-primary/30 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <PartyPopper className="h-4 w-4 text-primary shrink-0" />
              <p className="text-xs font-semibold text-foreground">
                {REQUIRED_GAMES} games hit! Report unlocks on the last day of{" "}
                {currentMonthName}.
              </p>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              The more you play, the richer your report gets — reaction trends,
              accuracy spikes, your best day of the month. Don't leave data on
              the table. Report available{" "}
              <span className="font-bold text-foreground">
                {lastDayOfCurrentMonth.toLocaleDateString("default", {
                  month: "long",
                  day: "numeric",
                })}
              </span>
              .
            </p>
          </div>
        )}

        {currentMonthUnlocked && (
          <div className="mt-3">
            <Button
              render={<Link href="/monthly-brain-report" />}
              className="w-full h-auto py-2.5 rounded-xl font-black"
            >
              Download {currentMonthName} Brain Report
            </Button>
          </div>
        )}

        {!isPro && monthlyGameCount >= REQUIRED_GAMES && isLastDayOfMonth && (
          <div className="mt-3 border border-warning rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-warning shrink-0" />
              <p className="text-xs font-semibold text-foreground">
                Brain Report unlocked
              </p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
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
