"use client";

import React, { useState, useRef } from "react";
import Confetti from "react-dom-confetti";
import { MdVerified } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
const getConfettiColors = (index) => {
  switch (index) {
    case 0:
      return ["#FFD700", "#FFF8DC"];
    case 1:
      return ["#C0C0C0", "#E0E0E0"];
    case 2:
      return ["#CD7F32", "#D2B48C"];
    default:
      return ["#a3e635"];
  }
};

export default function MissionsUserCard({
  users = [],
  title = "Top Performers",
}) {
  const [activeFire, setActiveFire] = useState({});
  const [celebrateCounts, setCelebrateCounts] = useState({});
  const btnRefs = useRef({});
  const handleCelebrate = (index) => {
    // Confetti fire
    setActiveFire((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setActiveFire((prev) => ({ ...prev, [index]: false }));
    }, 800);
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "celebrate_user", {
        event_category: "engagement",
        event_label: "celebrated_button_clicked",
        index,
      });
    }
    // Increment celebration count
    // setCelebrateCounts((prev) => ({
    //   ...prev,
    //   [index]: (prev[index] || 0) + 1,
    // }));
  };

  return (
    <>
      <ul className="list bg-base-100 rounded-box flex flex-col gap-2">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">{title}</li>

        {users.map((user, index) => {
          if (!btnRefs.current[index]) {
            btnRefs.current[index] = React.createRef();
          }

          return (
            <li
              key={index}
              className="list-row flex items-center gap-4 px-4 py-3 hover:bg-base-200 rounded-sm transition border border-base-300"
            >
              {/* Avatar */}
              <div>
                <img
                  className="size-10 rounded-full outline outline-offset-1 outline-base-300"
                  src={user?.image}
                  alt={user?.username || "User Avatar"}
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="font-semibold text-sm flex items-center gap-0.5 justify-center">
                  {user?.username || "Mystery Player"}{" "}
                  {user?.is_pro ? (
                    <RiVerifiedBadgeFill className="text-yellow-400" />
                  ) : (
                    ""
                  )}
                </div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {user?.nationality || "Unknown Nation"}
                </div>
              </div>

              {/* Stats */}
              <div className="text-center">
                <div className="text-xs text-base-content/70">Games</div>
                <div className="text-sm font-bold text-warning">
                  {user?.gamesPlayed || 0}
                </div>
              </div>

              {/* Celebrate Button */}
              <div className="tooltip" data-tip="Celebrate">
                <button
                  className="btn btn-square btn-ghost flex flex-col gap-1"
                  onClick={() => handleCelebrate(index)}
                  ref={btnRefs.current[index]}
                >
                  🎉
                  {/* <span className="text-xs">{celebrateCounts[index] || 0}</span> */}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Confetti Render */}
      {users.map((_, index) => {
        const ref = btnRefs.current[index];
        if (!ref?.current) return null;

        const rect = ref.current.getBoundingClientRect();
        const left = rect.left + rect.width / 2;
        const top = rect.top + rect.height / 2;

        return (
          <div
            key={`confetti-${index}`}
            style={{
              position: "fixed",
              top,
              left,
              pointerEvents: "none",
              zIndex: 9999,
            }}
          >
            <Confetti
              active={activeFire[index]}
              config={{
                angle: 90,
                spread: 60,
                startVelocity: 45,
                elementCount: 60,
                dragFriction: 0.15,
                duration: 3000,
                stagger: 3,
                width: "8px",
                height: "8px",
                colors: getConfettiColors(index),
              }}
            />
          </div>
        );
      })}
    </>
  );
}
