"use client";
import React, { useEffect, useState } from "react";
import GamePlayedCount from "./GamePlayedCount";
import UserLargeScreenStat from "./UserLargeScreenStat";
import { getCurrentUserGameData } from "../_lib/data-service";
import GetProBtn from "./GetProBtn";
import Link from "next/link";
import NotLoggedInRightDrawerNotif from "./NotLoggedInRightDrawerNotif";

export default function RightDrawer({ user, gridSize, difficulty, mode }) {
  const [userData, setUserData] = useState(undefined); // undefined = not loaded, null = no data

  useEffect(() => {
    const fetchData = async () => {
      if (user && user[0]?.id) {
        const data = await getCurrentUserGameData(user[0].id);
        setUserData(data || null); // null if no data returned
      }
    };

    fetchData();

    const handleGameFinished = () => {
      fetchData();
    };

    window.addEventListener("game-finished", handleGameFinished);
    return () =>
      window.removeEventListener("game-finished", handleGameFinished);
  }, [user]);

  return (
    <div className="bg-base-200 text-base-content min-h-full w-80 p-4 flex flex-col z-50 relative">
      {/* ✕ Close Button for Mobile */}
      <label
        htmlFor="my-drawer"
        className="btn btn-ghost btn-circle absolute top-4 right-4 lg:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </label>

      {/* Global Fastest Game */}
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

      {/* User Stats Section */}
      {user && user[0]?.id ? (
        <>
          <div className="divider my-2 text-xs opacity-60">
            Your last game data
          </div>
          <ul className="menu w-full flex flex-col gap-1">
            {userData && userData.game_summary ? (
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

      {/* Always at the bottom */}
      <div className="mt-auto pt-4">
        <GetProBtn />
      </div>
    </div>
  );
}
