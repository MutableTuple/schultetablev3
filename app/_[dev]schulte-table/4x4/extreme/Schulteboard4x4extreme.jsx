"use client";
import RightDrawer from "@/app/_components/RightDrawer";
import SchulteTable from "@/app/_components/Schultetable/SchulteTable";
import React, { useState } from "react";

export default function Schulteboard4x4extreme({ user }) {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="drawer drawer-end lg:drawer-open min-h-screen">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div>
        <SchulteTable
          gridSize={4}
          difficulty={"Extreme"}
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          user={user}
          mode={"number"}
        />
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <RightDrawer
          user={user}
          gridSize={4}
          difficulty={"Extreme"}
          mode={"number"}
        />
      </div>
    </div>
  );
}
