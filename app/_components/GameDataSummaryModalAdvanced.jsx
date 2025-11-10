"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/app/_lib/supabase";
import confetti from "canvas-confetti";

import FocusIQScore from "./AdvancedGameModal/FocusIQScore";
import ReactionTime from "./AdvancedGameModal/ReactionTime";
import ConsistencyScore from "./AdvancedGameModal/ConsistencyScore";
import AccuracyGraph from "./AdvancedGameModal/AccuracyGraph";
import ReactionHistoryGraph from "./AdvancedGameModal/ReactionHistoryGraph";
import DetailedMessage from "./AdvancedGameModal/DetailedMessage";
import BasicStats from "./AdvancedGameModal/BasicStats";

const tiers = [
  {
    max: 600,
    name: "Beginner",
    color: "badge-error",
    percentile: 12,
    msg: "You're getting warmed up!",
  },
  {
    max: 900,
    name: "Learner",
    color: "badge-warning",
    percentile: 34,
    msg: "Good start — keep going!",
  },
  {
    max: 1100,
    name: "Intermediate",
    color: "badge-info",
    percentile: 52,
    msg: "Solid performance!",
  },
  {
    max: 1300,
    name: "Advanced",
    color: "badge-success",
    percentile: 68,
    msg: "Great focus and speed!",
  },
  {
    max: 1500,
    name: "Pro Focus",
    color: "badge-primary",
    percentile: 79,
    msg: "Your focus is impressive!",
  },
  {
    max: 1700,
    name: "Elite Mind",
    color: "badge-accent",
    percentile: 90,
    msg: "You think fast and accurately!",
  },
  {
    max: 1850,
    name: "Mastermind",
    color: "badge-secondary",
    percentile: 94,
    msg: "Your mind is elite level!",
  },
  {
    max: 2001,
    name: "GOD TIER",
    color: "badge-success",
    percentile: 97,
    msg: "You're an absolute focus BEAST.",
  },
];

const getTier = (score) => tiers.find((t) => score < t.max);

export default function GameDataSummaryModalAdvanced({
  gameSummaryData,
  showModal,
  setShowModal,
  user,
  mode,
}) {
  const [focusIQ, setFocusIQ] = useState(null);
  const [animatedIQ, setAnimatedIQ] = useState(0);
  const hasConfettiFired = useRef(false);

  /* =============================
     ✅ Fetch Focus IQ only once per game
  ============================== */
  useEffect(() => {
    if (!showModal || !gameSummaryData || focusIQ !== null) return;

    (async () => {
      const { data } = await supabase.rpc("calc_focus_iq", {
        game: gameSummaryData,
      });

      if (data) {
        setFocusIQ(data);

        // Fire confetti once
        if (data >= 1500 && !hasConfettiFired.current) {
          hasConfettiFired.current = true;
          setTimeout(() => {
            confetti({
              particleCount: 120,
              spread: 70,
              ticks: 80,
              scalar: 1.1,
              origin: { y: 0.6 },
            });
          }, 250);
        }
      }
    })();
  }, [showModal, gameSummaryData, focusIQ]);

  /* =============================
     ✅ Smooth number animation (RAF)
  ============================== */
  useEffect(() => {
    if (!focusIQ) return;
    let start = 0;
    const duration = 600;
    const startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * focusIQ);
      setAnimatedIQ(value);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [focusIQ]);

  if (!showModal) return null;

  const tier = focusIQ ? getTier(focusIQ) : null;

  let progress = 0;
  if (tier && focusIQ) {
    const prev = tiers[tiers.indexOf(tier) - 1];
    const start = prev ? prev.max : 0;
    const end = tier.max === 2001 ? 2000 : tier.max;
    progress = ((focusIQ - start) / (end - start)) * 100;
  }

  return (
    <div className="modal modal-open bg-black/70 backdrop-blur-sm">
      <div className="modal-box max-w-5xl h-[90dvh] p-0 flex flex-col">
        {/* Header */}
        <div className="flex justify-end p-3">
          <button
            className="btn btn-sm btn-circle"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-2 sm:px-6 pb-6 overflow-y-auto">
          <BasicStats gameSummaryData={gameSummaryData} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-4">
              <FocusIQScore
                animatedIQ={animatedIQ}
                tier={tier}
                focusIQ={focusIQ}
                progress={progress}
                prevFocusIQ={0}
                user={user}
              />

              <div className="bg-base-200 rounded-xl p-4">
                <ReactionTime
                  game={gameSummaryData}
                  user={user}
                  prevAvg={10}
                  mode={mode}
                />
              </div>
            </div>

            <div>
              <DetailedMessage
                userId={user?.[0]?.id}
                game={gameSummaryData}
                user={user}
              />
            </div>
          </div>

          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
