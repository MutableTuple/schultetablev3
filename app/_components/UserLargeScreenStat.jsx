"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import { FaCrown } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FiRefreshCw } from "react-icons/fi";

export default function UserLargeScreenStat({
  gridSize,
  difficulty,
  mode,
  user,
}) {
  const [fastestUser, setFastestUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFastestUser = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("UniversalGameStats")
        .select(
          "time_taken, accuracy, game_mode, User(id, name, username, image, is_pro_user)"
        )
        .eq("grid_size", gridSize)
        .eq("difficulty", difficulty)
        .eq("game_mode", mode)
        .order("time_taken", { ascending: true })
        .gt("time_taken", 0)
        .limit(1)
        .single();

      if (error || !data) {
        setError("No fastest user! You can be the first.");
        setFastestUser(null);
      } else {
        setFastestUser(data);
        setError(null);
      }
    } catch (err) {
      // console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFastestUser();
  }, [gridSize, difficulty, mode]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFastestUser();
  };

  const RefreshButton = () => (
    <button
      onClick={handleRefresh}
      disabled={refreshing}
      className="absolute top-2 right-2 btn btn-xs btn-circle btn-ghost tooltip"
      data-tip="Refresh"
    >
      <FiRefreshCw
        className={`text-base-content transition-transform ${
          refreshing ? "animate-spin" : "hover:rotate-90"
        }`}
      />
    </button>
  );

  if (loading) {
    return (
      <div className="stat p-3 relative border rounded-md bg-base-100">
        <div className="stat-title text-sm flex items-center gap-2">
          Fetching fastest user
          <span className="loading loading-spinner loading-xs text-primary" />
        </div>
        <RefreshButton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="stat p-3 relative border rounded-md bg-base-100">
        <div className="stat-title text-sm text-error">{error}</div>
        <RefreshButton />
      </div>
    );
  }

  const durationInSec = fastestUser.time_taken;

  return (
    <div
      className="relative tooltip tooltip-bottom bg-base-100 border border-base-300 rounded-md hover:shadow transition-shadow"
      data-tip={`Fastest time for ${gridSize}×${gridSize} (${difficulty})`}
    >
      <RefreshButton />
      <div className="stat p-3 pt-6 cursor-pointer">
        <div className="stat-value text-primary text-lg">{durationInSec}s</div>
        <div className="flex gap-1 items-center">
          <div className="stat-title text-sm font-medium flex items-center gap-1">
            {fastestUser?.User?.name ? (
              <>
                {fastestUser.User.name}
                {fastestUser.User.id === user?.[0]?.id && <span>(You)</span>}
              </>
            ) : (
              "Anonymous"
            )}
            {fastestUser?.User?.is_pro_user && (
              <RiVerifiedBadgeFill className="text-yellow-500" />
            )}
            <FaCrown className="text-primary" />
          </div>
        </div>
        <div className="stat-desc text-xs">
          {gridSize} × {gridSize} &mdash;{" "}
          {fastestUser?.game_mode?.toUpperCase?.() || "UNKNOWN"} &mdash;{" "}
          {difficulty.toUpperCase?.()}
        </div>
      </div>
    </div>
  );
}
