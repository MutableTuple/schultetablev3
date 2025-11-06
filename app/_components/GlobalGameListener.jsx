"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import toast from "react-hot-toast";

export default function GlobalGameListener() {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel("realtime:public:UniversalGameStats")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "UniversalGameStats",
        },
        async ({ new: game }) => {
          const {
            score,
            grid_size,
            game_mode,
            difficulty,
            user_id,
            player_name,
          } = game;

          const name = player_name || "Someone";
          const size = `${grid_size}×${grid_size}`;
          let rankText = "";

          try {
            const { data: rank, error } = await supabase.rpc(
              "get_player_rank",
              {
                p_score: score,
                p_grid_size: grid_size,
                p_difficulty: difficulty,
                p_game_mode: game_mode,
              }
            );

            if (!error && rank) {
              rankText = ` (Rank: #${rank})`;
            }
          } catch (err) {
            // console.error("Rank fetch failed:", err);
          }

          toast.success(
            `${name} just scored ${score} on a ${size} ${game_mode} game!${rankText}`,
            { icon: "🔥" }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  return null;
}
