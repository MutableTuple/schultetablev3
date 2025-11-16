"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import ReactionTimeSliders from "./ReactionTimeSliders";

export default function ReactionTimeCompare({
  userId,
  gridSize,
  difficulty,
  gameMode,
  currentGame,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ added

  useEffect(() => {
    async function load() {
      setLoading(true); // ✅ added

      const { data: res, error } = await supabase.rpc(
        "reaction_stats_compare",
        {
          p_user_id: userId,
          p_grid_size: gridSize,
          p_difficulty: difficulty,
          p_game_mode: gameMode,
          p_current_game: currentGame,
        },
        { cache: "no-store" }
      );

      if (!error) setData(res);

      setLoading(false); // ✅ added
    }

    load();
  }, [userId, gridSize, difficulty, gameMode, currentGame]);

  if (!data)
    return (
      <div>
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );

  const { current, best, trend, messages } = data;

  const isFirstGame = !best;

  const bestFastest = best?.fastest ?? current.fastest;
  const bestAvg = best?.avg ?? current.avg;
  const bestSlowest = best?.slowest ?? current.slowest;

  const maxFastest = Math.max(current.fastest, bestFastest);
  const maxAvg = Math.max(current.avg, bestAvg);
  const maxSlowest = Math.max(current.slowest, bestSlowest);

  const calcPos = (val, min, max) => {
    if (!val || !min || !max || max === min) return 0;
    return ((val - min) / (max - min)) * 100;
  };

  return (
    <div className="w-full bg-base-200 rounded-xl mt-4">
      <h2 className="divider text-xs font-bold mb-3 text-center">
        Your reaction time vs all players
      </h2>

      {userId ? (
        <ReactionTimeSliders
          isFirstGame={isFirstGame}
          trend={trend}
          data={data}
          messages={messages}
          loading={loading} // ✅ added
        />
      ) : (
        "login in bitch"
      )}

      {/* ✅ SUMMARY MESSAGE */}
      {/* <div className="mt-4 text-center text-sm font-medium">
        {messages?.summary ??
          "Baseline established — future games will compare here."}
      </div> */}
    </div>
  );
}
