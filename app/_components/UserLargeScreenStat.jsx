"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/app/_lib/supabase";
import { FaCrown } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          `,
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
    [gridSize, difficulty, mode, cacheKey],
  );

  // Fetch once when inputs change (grid/difficulty/mode)
  useEffect(() => {
    fetchFastestUser(false);
  }, [fetchFastestUser]);

  const RefreshButton = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              onClick={() => fetchFastestUser(true)}
              disabled={refreshing}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 rounded-xl"
            />
          }
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
        </TooltipTrigger>
        <TooltipContent side="bottom">Refresh</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (fastestUser === undefined)
    return (
      <div className="p-3 relative border border-border rounded-2xl bg-card">
        <div className="text-sm flex items-center gap-2 text-foreground">
          Fetching fastest user…
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        </div>
        <RefreshButton />
      </div>
    );

  if (fastestUser === null)
    return (
      <div className="p-3 relative border border-border rounded-2xl bg-card">
        <div className="text-sm text-destructive">
          No fastest player yet — be the first!
        </div>
        <RefreshButton />
      </div>
    );

  const isYou = fastestUser?.User?.id === user?.[0]?.id;

  return (
    <div className="relative bg-card border border-border rounded-2xl hover:shadow transition-shadow z-[9999]">
      <RefreshButton />
      <div className="p-3 pt-6 cursor-pointer">
        <div className="text-primary text-lg font-bold leading-tight">
          {fastestUser.time_taken}s
        </div>

        <div className="text-sm font-medium flex items-center gap-1 text-foreground mt-1">
          {fastestUser?.User?.name || "Anonymous"}
          {isYou && <span>(You)</span>}
          {fastestUser?.User?.is_pro_user && (
            <RiVerifiedBadgeFill className="text-yellow-500" />
          )}
          <FaCrown className="text-primary" />
        </div>

        <div className="text-xs text-muted-foreground mt-1">
          {gridSize}×{gridSize} — {mode.toUpperCase()} —{" "}
          {difficulty.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
