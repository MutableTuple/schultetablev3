"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/app/_lib/supabase";
import { FaCrown } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FiRefreshCw } from "react-icons/fi";

const memoryCache = {};
const CACHE_TTL = 1000 * 20; // 20 seconds

export default function UserLargeScreenStat({
  gridSize,
  difficulty,
  mode,
  user,
}) {
  const [fastestUser, setFastestUser] = useState(undefined);
  const [refreshing, setRefreshing] = useState(false);

  const cacheKey = `${gridSize}-${difficulty}-${mode}`;

  // Load from memory cache or localStorage instantly
  useEffect(() => {
    const now = Date.now();
    const inMemory = memoryCache[cacheKey];

    if (inMemory && now - inMemory.time < CACHE_TTL) {
      setFastestUser(inMemory.value);
      return;
    }

    const stored = localStorage.getItem(`fastestUser:${cacheKey}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.value) setFastestUser(parsed.value);
    }
  }, [cacheKey]);

  const fetchFastestUser = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);

      try {
        const { data, error } = await supabase
          .from("UniversalGameStats")
          .select(
            `
            time_taken,
            accuracy,
            game_mode,
            User(id, name, username, image, is_pro_user)
          `
          )
          .eq("grid_size", gridSize)
          .eq("difficulty", difficulty)
          .eq("game_mode", mode)
          .gt("time_taken", 0)
          .order("time_taken", { ascending: true }) // uses index if exists
          .limit(1) // prevents full-table scan
          .maybeSingle();

        if (error) throw error;

        // If nobody has played yet
        if (!data) {
          setFastestUser(null);
          return;
        }

        const entry = { value: data, time: Date.now() };
        memoryCache[cacheKey] = entry;
        localStorage.setItem(`fastestUser:${cacheKey}`, JSON.stringify(entry));

        setFastestUser(data);
      } catch {
        setFastestUser((prev) => prev ?? null);
      } finally {
        setRefreshing(false);
      }
    },
    [gridSize, difficulty, mode, cacheKey]
  );

  // Fetch once when inputs change (grid/difficulty/mode)
  useEffect(() => {
    fetchFastestUser(false);
  }, [fetchFastestUser]);

  const RefreshButton = () => (
    <button
      onClick={() => fetchFastestUser(true)}
      disabled={refreshing}
      className="absolute top-2 right-2 btn btn-xs btn-circle btn-ghost tooltip"
      data-tip="Refresh"
    >
      <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
    </button>
  );

  if (fastestUser === undefined)
    return (
      <div className="stat p-3 relative border rounded-md bg-base-100 ">
        <div className="stat-title text-sm flex items-center gap-2">
          Fetching fastest user…
          <span className="loading loading-spinner loading-xs text-primary" />
        </div>
        <RefreshButton />
      </div>
    );

  if (fastestUser === null)
    return (
      <div className="stat p-3 relative border rounded-md bg-base-100">
        <div className="stat-title text-sm text-error">
          No fastest player yet — be the first!
        </div>
        <RefreshButton />
      </div>
    );

  const isYou = fastestUser?.User?.id === user?.[0]?.id;

  return (
    <div className="relative bg-base-100 border border-base-300 rounded-md hover:shadow transition-shadow z-[9999]">
      <RefreshButton />
      <div className="stat p-3 pt-6 cursor-pointer">
        <div className="stat-value text-primary text-lg">
          {fastestUser.time_taken}s
        </div>

        <div className="stat-title text-sm font-medium flex items-center gap-1">
          {fastestUser?.User?.name || "Anonymous"}
          {isYou && <span>(You)</span>}
          {fastestUser?.User?.is_pro_user && (
            <RiVerifiedBadgeFill className="text-yellow-500" />
          )}
          <FaCrown className="text-primary" />
        </div>

        <div className="stat-desc text-xs">
          {gridSize}×{gridSize} — {mode.toUpperCase()} —{" "}
          {difficulty.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
