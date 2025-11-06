"use client";

import React, { useEffect, useState, Suspense } from "react";
import { supabase } from "@/app/_lib/supabase";
import PaginationForList from "./PaginationForList";
import GameList from "./GameList";

const DEFAULT_LIMIT = 5;
const ITEMS_PER_PAGE = 5;

export default function GamelistPage({ user }) {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [totalGames, setTotalGames] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Fix: handle object or array user format
  const userId = Array.isArray(user) ? user?.[0]?.id : user?.id;
  const isPro = Array.isArray(user)
    ? user?.[0]?.is_pro_user
    : user?.is_pro_user;

  useEffect(() => {
    const fetchGames = async () => {
      // If no user, stop loading
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        if (isPro) {
          // Get total game count
          const { count } = await supabase
            .from("UniversalGameStats")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId);

          setTotalGames(count || 0);

          const from = (page - 1) * ITEMS_PER_PAGE;
          const to = from + ITEMS_PER_PAGE - 1;

          // Fetch games for current page
          const { data, error } = await supabase
            .from("UniversalGameStats")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .range(from, to);

          if (error) throw error;
          setGames(data);
        } else {
          // Non-pro users see only latest 5
          const { data, error } = await supabase
            .from("UniversalGameStats")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(DEFAULT_LIMIT);

          if (error) throw error;

          setGames(data);
          setTotalGames(DEFAULT_LIMIT);
        }
      } catch (err) {
        // console.error("Failed to fetch games:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [userId, page, isPro]);

  const totalPages = Math.ceil(totalGames / ITEMS_PER_PAGE);
  const showTopBanner = !isPro && !loading && games.length > 0;

  return (
    <div className="space-y-6">
      {/* Pagination */}
      {isPro && (
        <PaginationForList
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      )}
      {/* Top Banner for non-pro users */}
      {showTopBanner && (
        <div className="alert alert-info shadow text-sm">
          <span>
            You’re seeing your last{" "}
            <span className="font-bold">5 recent games</span>. Unlock complete
            history and stats by upgrading to
            <span className="font-semibold"> Pro</span>.
            <a href="/get-pro" className="ml-2 link link-primary underline">
              Upgrade now →
            </a>
          </span>
        </div>
      )}

      {/* Lazy loading */}
      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : games.length === 0 ? (
        <div className="text-sm opacity-60">No games found.</div>
      ) : (
        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          }
        >
          <div className="space-y-6">
            {games.map((game) => {
              const summary = game.game_summary || {};
              const avgReaction = summary.avgReactionTimeMs ?? 0;
              const durationSec = summary.durationMs
                ? (summary.durationMs / 1000).toFixed(2)
                : "0.00";

              return (
                <div key={game.id}>
                  <div
                    key={game.id}
                    className=" flex flex-col gap-4 rounded-md"
                  >
                    {/* Game date + badge */}
                    <div className="flex justify-between items-center text-sm ">
                      <div className="badge badge-sm badge-secondary">
                        {new Date(game.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="badge badge-sm badge-outline outline-base-300 text-xs">
                        Grid: {game.grid_size} | {game.difficulty}
                      </div>
                    </div>

                    {/* Game details */}
                    <GameList
                      summary={summary}
                      game={game}
                      isPro={isPro}
                      avgReaction={avgReaction}
                      durationSec={durationSec}
                    />

                    {/* Non-pro upsell */}
                    {!isPro && (
                      <div className="text-xs text-accent mt-1 text-center bg-base-100 border border-dashed border-accent p-2 rounded-md">
                        ✨ You're viewing a preview of your progress. Unlock{" "}
                        <span className="font-semibold">full game history</span>
                        , <span className="font-semibold">detailed stats</span>,
                        and{" "}
                        <span className="font-semibold">advanced insights</span>{" "}
                        by upgrading to{" "}
                        <span className="text-primary font-bold">Pro</span>.
                        <br />
                        <a
                          href="/get-pro"
                          className="link link-primary font-medium mt-1 inline-block"
                        >
                          Explore Pro Benefits →
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="divider"></div>
                </div>
              );
            })}

            {/* Pagination */}
            {isPro && (
              <PaginationForList
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            )}
          </div>
        </Suspense>
      )}
    </div>
  );
}
