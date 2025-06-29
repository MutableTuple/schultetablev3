"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import { FaCrown } from "react-icons/fa6";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FiRefreshCw } from "react-icons/fi";

export default function UserIcon({ gridSize, difficulty, mode, user }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [fastestUser, setFastestUser] = useState(null);

  const fetchFastestUser = async () => {
    setRefreshing(true);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("UniversalGameStats")
        .select("time_taken, user_id")
        .eq("grid_size", gridSize)
        .eq("difficulty", difficulty)
        .eq("game_mode", mode)
        .order("time_taken", { ascending: true })
        .gt("time_taken", 0)
        .limit(1)
        .single();

      if (error || !data) {
        setError("No fastest user found");
        setFastestUser(null);
      } else {
        if (data.user_id) {
          const { data: userData } = await supabase
            .from("User")
            .select("id, name, is_pro_user")
            .eq("id", data.user_id)
            .single();
          setFastestUser({ ...data, User: userData });
        } else {
          setFastestUser({ ...data, User: null });
        }
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching user");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFastestUser();
  }, [gridSize, difficulty, mode]);

  if (loading) return <p className="text-xs">Loading...</p>;
  if (error) return <p className="text-xs text-error">{error}</p>;

  return (
    <div
      className="tooltip tooltip-bottom relative"
      data-tip={`Fastest by ${fastestUser.User?.name || "Anonymous"}`}
    >
      <div className="flex gap-2 items-center text-xs border px-3 py-1 border-base-300 hover:cursor-pointer rounded-md pr-8">
        <p className="font-semibold flex items-center gap-1">
          {fastestUser?.User?.name || "Anonymous"}
          {fastestUser?.User?.is_pro_user && (
            <RiVerifiedBadgeFill className="text-yellow-500" />
          )}
          <FaCrown className="text-primary" />
        </p>
        <div className="badge-sm badge badge-primary/80 font-semibold">
          {fastestUser.time_taken}s
        </div>

        {/* Refresh Icon */}
        <button
          onClick={fetchFastestUser}
          disabled={refreshing}
          className="absolute right-1 top-1/2 -translate-y-1/2 btn btn-xs btn-ghost p-1"
        >
          <FiRefreshCw
            className={`text-base-content text-sm ${
              refreshing ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
