"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/app/_lib/supabase";
import { FaCrown } from "react-icons/fa6";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FiRefreshCw } from "react-icons/fi";
import { Loader2 } from "lucide-react";

const memoryCache = {};
const CACHE_TTL = 1000 * 20; // 20 seconds — public leaderboard data, brief staleness is fine

export default function UserIcon({ gridSize, difficulty, mode, user }) {
  const [fastestUser, setFastestUser] = useState(undefined); // undefined = no data yet at all
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const cacheKey = `${gridSize}-${difficulty}-${mode}`;

  // Paint instantly from memory/localStorage cache while we revalidate.
  useEffect(() => {
    const now = Date.now();
    const inMemory = memoryCache[cacheKey];

    if (inMemory && now - inMemory.time < CACHE_TTL) {
      setFastestUser(inMemory.value);
      return;
    }

    const stored = localStorage.getItem(`fastestUserIcon:${cacheKey}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.value) setFastestUser(parsed.value);
      } catch {}
    }
  }, [cacheKey]);

  const fetchFastestUser = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("UniversalGameStats")
          .select(
            `
            time_taken,
            User(id, name, is_pro_user)
          `,
          )
          .eq("grid_size", gridSize)
          .eq("difficulty", difficulty)
          .eq("game_mode", mode)
          .gt("time_taken", 0)
          .order("time_taken", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setFastestUser(null);
          return;
        }

        const entry = { value: data, time: Date.now() };
        memoryCache[cacheKey] = entry;
        localStorage.setItem(
          `fastestUserIcon:${cacheKey}`,
          JSON.stringify(entry),
        );

        setFastestUser(data);
      } catch (err) {
        setError("Error fetching user");
        setFastestUser((prev) => prev ?? null);
      } finally {
        setRefreshing(false);
      }
    },
    [gridSize, difficulty, mode, cacheKey],
  );

  useEffect(() => {
    fetchFastestUser(false);
  }, [fetchFastestUser]);

  // Refetch (bypassing the cached paint) whenever a game completes, so a
  // new fastest time for this exact combo shows up without a manual reload.
  useEffect(() => {
    const handleGameFinished = () => fetchFastestUser(true);
    window.addEventListener("game-finished", handleGameFinished);
    return () =>
      window.removeEventListener("game-finished", handleGameFinished);
  }, [fetchFastestUser]);

  if (fastestUser === undefined)
    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5">
        <Loader2 className="w-3 h-3 animate-spin" />
        Loading...
      </div>
    );
  if (error && !fastestUser)
    return <p className="text-xs text-destructive">{error}</p>;
  if (fastestUser === null) return null;

  return (
    <div className="relative inline-flex group">
      <div className="flex items-center gap-2 text-xs border border-border bg-card hover:bg-accent transition-colors rounded-full pl-3 pr-8 py-1.5 cursor-default">
        <FaCrown className="text-primary shrink-0" size={12} />

        <span className="font-semibold text-foreground flex items-center gap-1 truncate max-w-[120px]">
          {fastestUser?.User?.name || "Anonymous"}
          {fastestUser?.User?.is_pro_user && (
            <RiVerifiedBadgeFill className="text-warning shrink-0" size={12} />
          )}
        </span>

        <span className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold tabular-nums shrink-0">
          {fastestUser.time_taken}s
        </span>

        {/* Refresh */}
        <button
          onClick={() => fetchFastestUser(true)}
          disabled={refreshing}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
        >
          <FiRefreshCw size={11} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Tooltip */}
      <div className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap bg-popover border border-border text-popover-foreground text-[10px] font-medium px-2.5 py-1.5 rounded-lg shadow-lg z-10">
        Fastest by {fastestUser?.User?.name || "Anonymous"}
      </div>
    </div>
  );
}
