"use client";

import React, { useEffect, useState, useRef } from "react";

import GamePlayedCount from "./GamePlayedCount";
import UserLargeScreenStat from "./UserLargeScreenStat";
import { getCurrentUserGameData } from "../_lib/data-service";
import GetProBtn from "./GetProBtn";
import NotLoggedInRightDrawerNotif from "./NotLoggedInRightDrawerNotif";

import Confetti from "react-confetti";
import MonthlyBrainReportBanner from "./MonthlyBrainReportBanner";

export default function RightDrawer({ user, gridSize, difficulty, mode }) {
  const userId = user?.id;
  const isPro = user?.is_pro_user;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showConfetti, setShowConfetti] = useState(false);

  const requestRef = useRef(0);

  useEffect(() => {
    let ignore = false;

    requestRef.current++;

    async function load() {
      if (!userId) {
        setUserData(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const result = await getCurrentUserGameData(userId);

      if (ignore) return;

      setUserData(result ?? null);

      setLoading(false);
    }

    load();

    const handleGameFinished = () => {
      setTimeout(load, 250);
    };

    window.addEventListener("game-finished", handleGameFinished);

    return () => {
      ignore = true;

      window.removeEventListener("game-finished", handleGameFinished);
    };
  }, [userId]);

  /*
    -----------------------------------------
    TOTAL GAMES
    -----------------------------------------
  */

  const totalGames =
    userData?.total_games_played || userData?.games_played || 0;

  const requiredGames = 25;

  const progressPercentage = Math.min((totalGames / requiredGames) * 100, 100);

  const reportUnlocked = totalGames >= requiredGames;

  /*
    -----------------------------------------
    CONFETTI
    -----------------------------------------
  */

  useEffect(() => {
    if (reportUnlocked) {
      setShowConfetti(true);

      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [reportUnlocked]);

  return (
    <div
      className="
        relative
        flex
        min-h-full
        w-[320px]
        flex-col
        border-l
        border-base-300
        bg-base-100
        p-4
        text-base-content
      "
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      {/* MOBILE CLOSE */}
      <label
        htmlFor="my-drawer"
        className="
          btn
          btn-circle
          btn-ghost
          absolute
          right-4
          top-4
          lg:hidden
        "
      >
        ✕
      </label>

      {/* HEADER */}
      <div className="mb-4">
        <div
          className="
            border
            border-base-300
            bg-base-200
            p-4
            overflow-hidden
            relative
          "
        >
          <div
            className="
              absolute
              inset-0
              opacity-10
              bg-gradient-to-br
              from-primary
              via-secondary
              to-accent
            "
          />

          <MonthlyBrainReportBanner
            progressPercentage={progressPercentage}
            totalGames={totalGames}
            requiredGames={requiredGames}
            reportUnlocked={reportUnlocked}
            isPro={isPro}
            user={user}
          />
        </div>
      </div>

      {/* GLOBAL */}
      <div className="mb-5">
        <div
          className="
            mb-3
            flex
            items-center
            justify-between
          "
        >
          <h3
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.2em]
              text-base-content/50
            "
          >
            Global Fastest Game
          </h3>
        </div>

        <div
          className="
            border
            border-base-300
            bg-base-200
            p-3
          "
        >
          <UserLargeScreenStat
            gridSize={gridSize}
            difficulty={difficulty}
            mode={mode}
            user={user}
          />
        </div>
      </div>

      {/* USER SECTION */}
      {userId ? (
        <>
          <div className="mb-3">
            <h3
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
                text-base-content/50
              "
            >
              Prev Game Stats
            </h3>
          </div>

          <div
            className="
              border
              border-base-300
              bg-base-200
              p-3
            "
          >
            {loading ? (
              <div
                className="
                  flex
                  h-[200px]
                  items-center
                  justify-center
                "
              >
                <span
                  className="
                    loading
                    loading-spinner
                    loading-md
                    text-primary
                  "
                />
              </div>
            ) : userData ? (
              <GamePlayedCount userData={userData} mode={mode} user={user} />
            ) : (
              <div
                className="
                  flex
                  h-[160px]
                  items-center
                  justify-center
                  border
                  border-dashed
                  border-base-300
                  text-center
                  text-sm
                  text-base-content/50
                "
              >
                Play at least one game to unlock analytics.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="mt-4">
          <NotLoggedInRightDrawerNotif />
        </div>
      )}

      {/* PRO BUTTON */}
      {!isPro && (
        <div className="mt-auto pt-5">
          <GetProBtn />
        </div>
      )}
    </div>
  );
}
