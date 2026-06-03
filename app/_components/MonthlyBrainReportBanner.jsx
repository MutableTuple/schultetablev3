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
  requiredGames,
  reportUnlocked,
  isPro,
  user,
}) {
  // ========================================
  // STATE
  // ========================================

  const [gameData, setGameData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // ========================================
  // FETCH ANALYTICS
  // ========================================

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        if (!user?.id) return;

        setLoadingAnalytics(true);

        // ========================================
        // FETCH LAST 25 GAMES
        // ========================================

        const { data: games, error: gamesError } = await supabase
          .from("UniversalGameStats")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(25);

        if (gamesError) {
          console.log("Games fetch error:", gamesError);
          setGameData([]);
        } else {
          setGameData(Array.isArray(games) ? games : []);
        }

        // ========================================
        // FETCH ANALYTICS
        // ========================================

        const { data: analyticsData, error: analyticsError } =
          await supabase.rpc("get_user_analytics", {
            p_user_id: user.id,
            p_from: null,
            p_to: null,
          });

        if (analyticsError) {
          console.log("Analytics RPC error:", analyticsError);
          setAnalytics(null);
        } else if (analyticsData?.length > 0) {
          setAnalytics(analyticsData[0]);
        } else {
          setAnalytics(null);
        }
      } catch (err) {
        console.log("Analytics fetch failed:", err);

        setGameData([]);
        setAnalytics(null);
      } finally {
        setLoadingAnalytics(false);
      }
    }

    fetchAnalytics();
  }, [user]);

  // ========================================
  // TRUE UNLOCK LOGIC
  // ========================================

  // USE REAL GAME COUNT
  const realGameCount = Math.max(
    Number(totalGames || 0),
    Number(analytics?.total_games || 0),
    Number(gameData?.length || 0),
  );

  // TRUE REPORT UNLOCK
  const realReportUnlocked = realGameCount >= 25;

  // SAFE PERCENTAGE
  const realProgressPercentage = Math.min(
    (realGameCount / requiredGames) * 100,
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

      // ========================================
      // AVG HELPER
      // ========================================

      const avg = (arr, key) => {
        if (!arr.length) return 0;

        return (
          arr.reduce((sum, game) => {
            return sum + (Number(game?.[key]) || 0);
          }, 0) / arr.length
        );
      };

      // ========================================
      // SPLIT OLD VS NEW
      // ========================================

      const midpoint = Math.floor(safeData.length / 2);

      const oldGames = safeData.slice(0, midpoint);

      const newGames = safeData.slice(midpoint);

      // ========================================
      // ACCURACY
      // ========================================

      const oldAccuracy = avg(oldGames, "accuracy");

      const newAccuracy = avg(newGames, "accuracy");

      const accuracyDiff = newAccuracy - oldAccuracy;

      // ========================================
      // REACTION TIME
      // ========================================

      const oldReaction = avg(oldGames, "reaction_time");

      const newReaction = avg(newGames, "reaction_time");

      const reactionImprovement =
        oldReaction > 0 ? ((oldReaction - newReaction) / oldReaction) * 100 : 0;

      // ========================================
      // BEST / WORST
      // ========================================

      const sortedGames = [...safeData].sort(
        (a, b) => (b?.score || 0) - (a?.score || 0),
      );

      const bestGame = sortedGames[0];

      const worstGame = sortedGames[sortedGames.length - 1];

      // ========================================
      // TOTAL SCORE
      // ========================================

      const totalScore = safeData.reduce((sum, game) => {
        return sum + (Number(game?.score) || 0);
      }, 0);

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
      console.log("Comparison failed:", err);

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

  return (
    <div className="relative z-10">
      {/* ======================================== */}
      {/* HEADER */}
      {/* ======================================== */}

      <h2
        className="
          text-lg
          font-black
          uppercase
          tracking-wide
          flex items-center gap-1
        "
      >
        <HiDocumentReport />
        Monthly Brain Report
      </h2>

      <p
        className="
          mt-1
          text-sm
          text-base-content/60
        "
      >
        Unlock your AI-powered cognitive performance report.
      </p>

      {/* ======================================== */}
      {/* PROGRESS */}
      {/* ======================================== */}

      <div className="mt-4">
        <div
          className="
            h-4
            overflow-hidden
            rounded-full
            bg-base-300
          "
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${realProgressPercentage}%`,
            }}
            transition={{
              duration: 0.8,
            }}
            className="
              h-full
              rounded-full
              bg-gradient-to-r
              from-primary
              via-secondary
              to-accent
            "
          />
        </div>

        <div
          className="
            mt-2
            flex
            items-center
            justify-between
            text-xs
            font-semibold
          "
        >
          <span>
            {realGameCount}/{requiredGames} games
          </span>

          <span>{Math.floor(realProgressPercentage)}%</span>
        </div>

        {/* ======================================== */}
        {/* LOCKED */}
        {/* ======================================== */}

        {!realReportUnlocked ? (
          <p
            className="
              mt-2
              text-xs
              text-base-content/70
            "
          >
            Play{" "}
            <span className="font-bold">
              {Math.max(requiredGames - realGameCount, 0)}
            </span>{" "}
            more games to unlock your brain report.
          </p>
        ) : (
          <div className="mt-4">
            {/* ======================================== */}
            {/* ANALYTICS PREVIEW */}
            {/* ======================================== */}

            {/* ======================================== */}
            {/* CTA */}
            {/* ======================================== */}

            {isPro ? (
              <Link href={"/monthly-brain-report"}>
                <button
                  className="
                  btn
                  btn-primary
                  btn-block
                  font-black
                "
                >
                  Download Monthly Brain Report
                </button>
              </Link>
            ) : (
              <div
                className="
                  border
                  border-warning
                  bg-warning/10
                  p-3
                "
              >
                <p
                  className="
                    text-xs
                    font-semibold
                  "
                >
                  Brain Report unlocked 🎉
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-base-content/70
                  "
                >
                  Upgrade to Pro to download your detailed cognitive report.
                </p>

                <div className="mt-3">
                  <GetProBtn />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
