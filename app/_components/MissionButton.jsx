"use client";
import React from "react";
import { GiCrossedSwords } from "react-icons/gi"; // Battle icon
import { useRouter } from "next/navigation";

export default function MissionButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/missions");
  };

  return (
    <div className="fixed top-44 left-4 z-30">
      <div className="tooltip tooltip-right" data-tip="View Missions">
        <button
          onClick={handleClick}
          className="btn btn-success btn-circle btn-sm shadow-md hover:scale-105 transition-all"
        >
          <GiCrossedSwords size={20} />
        </button>
      </div>
    </div>
  );
}
