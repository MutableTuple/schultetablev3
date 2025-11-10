"use client";
import React, { useEffect, useState, useRef } from "react";
import GamePlayedCount from "./GamePlayedCount";
import UserLargeScreenStat from "./UserLargeScreenStat";
import { getCurrentUserGameData } from "../_lib/data-service";
import GetProBtn from "./GetProBtn";
import NotLoggedInRightDrawerNotif from "./NotLoggedInRightDrawerNotif";

export default function RightDrawer({ user, gridSize, difficulty, mode }) {
  const userId = user?.[0]?.id;
  const isPro = user?.[0]?.is_pro_user;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Prevent race conditions
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

      // ✅ Always set the last played game, even if game_summary is null
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
  }, [userId]); // runs only when user changes

  return (
    <div className="relative bg-base-200 text-base-content min-h-full w-80 p-4 flex flex-col z-50">
      {/* Close for mobile */}
      <label
        htmlFor="my-drawer"
        className="btn btn-ghost btn-circle absolute top-4 right-4 lg:hidden"
      >
        ✕
      </label>

      <div className="divider my-2 text-xs opacity-60">Global Fastest Game</div>

      <ul className="menu w-full flex flex-col gap-1">
        <li>
          <UserLargeScreenStat
            gridSize={gridSize}
            difficulty={difficulty}
            mode={mode}
            user={user}
          />
        </li>
      </ul>

      {userId ? (
        <>
          <div className="divider my-2 text-xs opacity-60">
            Your last game data
          </div>

          <ul className="menu w-full flex flex-col gap-1">
            {loading ? (
              <p className="italic px-2 opacity-60">Loading...</p>
            ) : userData ? ( // ✅ show stats if ANY game exists
              <li>
                <GamePlayedCount userData={userData} mode={mode} user={user} />
              </li>
            ) : (
              <p className="italic px-2">
                Play at least one game to see your stats!
              </p>
            )}
          </ul>
        </>
      ) : (
        <NotLoggedInRightDrawerNotif />
      )}

      {!isPro && (
        <div className="mt-auto pt-4">
          <GetProBtn />
        </div>
      )}
    </div>
  );
}
