"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import confetti from "canvas-confetti";

// ✅ import your compact component
import FocusIQScore from "./AdvancedGameModal/FocusIQScore";
import ReactionTime from "./AdvancedGameModal/ReactionTime";
import ConsistencyScore from "./AdvancedGameModal/ConsistencyScore";
import AccuracyGraph from "./AdvancedGameModal/AccuracyGraph";
import ReactionHistoryGraph from "./AdvancedGameModal/ReactionHistoryGraph";
import DetailedMessage from "./AdvancedGameModal/DetailedMessage";
import BasicStats from "./AdvancedGameModal/BasicStats";

export default function GameDataSummaryModalAdvanced({
  gameSummaryData,
  showModal,
  setShowModal,
  user,
  mode,
}) {
  const [focusIQ, setFocusIQ] = useState(null);
  const [animatedIQ, setAnimatedIQ] = useState(0);

  // ✅ Tier definition
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

  // ✅ Fetch FocusIQ using RPC
  useEffect(() => {
    if (!showModal || !gameSummaryData) return;

    (async () => {
      const { data, error } = await supabase.rpc("calc_focus_iq", {
        game: gameSummaryData,
      });

      if (!error) {
        setFocusIQ(data);

        if (data >= 1500) {
          setTimeout(() => {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
            });
          }, 200);
        }
      }
    })();
  }, [showModal, gameSummaryData]);

  // ✅ animate number
  useEffect(() => {
    if (!focusIQ) return;

    let start = 0;
    const duration = 600;
    const step = 16;
    const steps = duration / step;
    const increment = focusIQ / steps;

    const counter = setInterval(() => {
      start += increment;
      setAnimatedIQ(Math.min(focusIQ, Math.floor(start)));
      if (start >= focusIQ) clearInterval(counter);
    }, step);

    return () => clearInterval(counter);
  }, [focusIQ]);

  if (!showModal) return null;

  const tier = focusIQ ? getTier(focusIQ) : null;

  // ✅ progress
  let progress = 0;
  if (tier && focusIQ) {
    const prev = tiers[tiers.indexOf(tier) - 1];
    const start = prev ? prev.max : 0;
    const end = tier.max === 2001 ? 2000 : tier.max;
    progress = ((focusIQ - start) / (end - start)) * 100;
  }

  return (
    <div className="modal modal-open bg-black/60  ">
      <div className="modal-box max-w-5xl max-h-[85vh] overflow-y-scroll px-2 sm:px-6 py-4 overflow-x-hidden">
        {/* Close Button */}
        <button
          className="btn btn-sm btn-circle absolute right-3 top-3 space-y-6"
          onClick={() => setShowModal(false)}
        >
          ✕
        </button>

        <BasicStats gameSummaryData={gameSummaryData} />
        {/* ✅ Grid layout inside modal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* ✅ LEFT COLUMN */}
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

          {/* ✅ RIGHT COLUMN */}
          <div className="">
            <DetailedMessage
              userId={user?.[0]?.id}
              game={gameSummaryData}
              user={user}
            />

            {/* ✅ (Optional) Consistency Graph */}
            {/* <div className="bg-base-200 rounded-xl p-4">
      <ConsistencyScore game={gameSummaryData} user={user} />
    </div> */}
          </div>
        </div>

        {/* ✅ Modal action */}
        <div className="modal-action mt-4">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
