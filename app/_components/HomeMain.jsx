"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

import RightDrawer from "./RightDrawer";
import LeftSidebar from "./LeftSidebar";

const SchulteTable = dynamic(() => import("./Schultetable/SchulteTable"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-40">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  ),
});

export default function HomeMain({ user, error }) {
  const [gridSize, setGridSize] = useState(3);
  const [difficulty, setDifficulty] = useState("Medium");
  const [gameStarted, setGameStarted] = useState(false);
  const [mode, setMode] = useState("number");

  return (
    <div className="drawer drawer-end lg:drawer-open min-h-screen">
      {/* RIGHT DRAWER TOGGLE */}
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content min-h-screen p-4">
        {/* MOBILE RIGHT DRAWER BUTTON */}
        <label
          htmlFor="my-drawer"
          className="
            btn
            btn-ghost
            btn-circle
            fixed
            top-4
            right-4
            z-50
            drawer-button
            lg:hidden
          "
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>

        {/* MAIN LAYOUT */}
        <div
          className="
            flex
            items-start
            gap-6
          "
        >
          {/* LEFT SIDEBAR */}
          <LeftSidebar
            gridSize={gridSize}
            setGridSize={setGridSize}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            gameStarted={gameStarted}
            mode={mode}
            setMode={setMode}
            user={user}
          />

          {/* GAME AREA */}
          <main
            className="
              flex-1
              min-w-0
              flex
              items-center
              justify-center
              min-h-[calc(100vh-2rem)]
            "
          >
            <SchulteTable
              gridSize={gridSize}
              difficulty={difficulty}
              gameStarted={gameStarted}
              setGameStarted={setGameStarted}
              user={user}
              mode={mode}
              setGridSize={setGridSize}
              setDifficulty={setDifficulty}
              setMode={setMode}
            />
          </main>
        </div>
      </div>

      {/* RIGHT DRAWER */}
      <div className="drawer-side z-[60]">
        <label htmlFor="my-drawer" className="drawer-overlay" />

        <RightDrawer
          user={user}
          gridSize={gridSize}
          difficulty={difficulty}
          mode={mode}
        />
      </div>
    </div>
  );
}
