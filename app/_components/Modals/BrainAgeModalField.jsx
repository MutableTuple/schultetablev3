"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import Link from "next/link";

// Props: gameId (required), userAge (optional), user (required)
export default function BrainAgeModalField({ gameId, userAge = 18, user }) {
  const [brainAge, setBrainAge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch brain age only if user is logged in and Pro
  useEffect(() => {
    if (!gameId || !user?.[0]?.id || !user?.[0]?.is_pro_user) return;

    const fetchBrainAge = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: rpcError } = await supabase.rpc(
          "get_brain_age_simple",
          {
            game_id: gameId,
            user_age: userAge,
          }
        );

        if (rpcError) throw rpcError;

        setBrainAge(data);
      } catch (err) {
        console.error("Error fetching brain age:", err);
        setError("Failed to load brain age");
      } finally {
        setLoading(false);
      }
    };

    fetchBrainAge();
  }, [gameId, userAge, user]);

  // Not logged in
  if (!user || !user[0]?.id) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-base-200 rounded-lg p-6 gap-3 text-center">
        <div className="text-sm font-semibold">Login to view Brain Age</div>
        <div className="text-gray-600 text-xs">
          Sign in to see your personalized brain age.
        </div>
        <Link href="/login" className="btn btn-primary mt-2">
          Login
        </Link>
      </div>
    );
  }

  // Logged in but not Pro
  if (!user[0]?.is_pro_user) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-base-200 rounded-lg p-6 gap-3 text-center">
        <div className="text-lg font-semibold">Upgrade to Pro</div>
        <div className="text-gray-600">
          Brain Age feature is for Pro users only.
        </div>
        <Link href="/get-pro" className="btn btn-primary mt-2">
          Go Pro
        </Link>
      </div>
    );
  }

  // Logged in and Pro → show Brain Age
  return (
    <div className="stat bg-base-200 rounded-lg p-4 text-center shadow">
      <div className="stat-title">Brain Age</div>
      <div className={`stat-value ${error ? "text-neutral" : "text-error"}`}>
        {loading ? "..." : error ? "N/A" : brainAge?.toFixed(1)}
      </div>
      <div className="stat-desc truncate">
        {loading
          ? "Calculating..."
          : error
            ? error
            : userAge
              ? "Your brain age based on this game"
              : "Standard baseline used. Provide your age for personalized results."}
      </div>
    </div>
  );
}
