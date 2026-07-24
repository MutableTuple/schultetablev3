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

export default function HomeMain({ user, error, header }) {
  const [gridSize, setGridSize] = useState(3);
  const [difficulty, setDifficulty] = useState("Medium");
  const [gameStarted, setGameStarted] = useState(false);
  const [mode, setMode] = useState("number");

  return (
    <div className="drawer drawer-end lg:drawer-open min-h-screen min-h-dvh">
      {/* RIGHT DRAWER TOGGLE */}
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content min-h-screen min-h-dvh flex flex-col relative">
        {/* HEADER — floats over the top instead of sitting in normal flow,
            so it no longer eats into the height the game area centers
            against. Before this, the game centered itself in "viewport
            minus header" instead of the real viewport, landing ~55px below
            true screen center on mobile (measured live). Verified this
            drops the offset to 0px. Trade-off: on very short viewports
            (older phones in landscape, etc.) with unusually tall game
            content, the floating header could visually overlap the top of
            the content — worth a quick check on your shortest target
            device if you support landscape phones. */}
        <div className="absolute top-0 inset-x-0 z-10 p-4 pointer-events-none">
          <div className="pointer-events-auto">{header}</div>
        </div>

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

        {/* MAIN LAYOUT — now fills the full drawer-content height, since the
            header no longer occupies flex space above it. p-4 moved here
            from drawer-content since the header handles its own padding
            via the absolute wrapper above. */}
        <div className="flex items-start flex-1 min-h-0 p-4">
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
    self-stretch
    flex
    items-center
    justify-center
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
          setGridSize={setGridSize}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          mode={mode}
          setMode={setMode}
          gameStarted={gameStarted}
        />
      </div>
    </div>
  );
}
