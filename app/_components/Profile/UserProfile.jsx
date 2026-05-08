"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { HiStar } from "react-icons/hi";
import { supabase } from "@/app/_lib/supabase";
import { formatNumber } from "@/app/_utils/formatNumber";
import BackButton from "../BackButton";

const UserProfile = ({ user }) => {
  const [stats, setStats] = useState(null);
  const isPro = user.is_pro_user;

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { data: statData, error: statsError },
        { data: rankData, error: rankError },
      ] = await Promise.all([
        supabase.rpc("get_user_profile_stats", { uid: user.id }),
        supabase.rpc("get_user_rank", { uid: user.id }),
      ]);

      if (!statsError && !rankError) {
        setStats({ ...statData[0], rank: rankData[0].rank });
      }
    };

    fetchStats();
  }, [user]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg text-warning"></span>
      </div>
    );
  }

  const displayValue = (val, suffix = "") =>
    val && val !== 0 ? `${formatNumber(val)}${suffix}` : "NA";

  return (
    <div className="min-h-screen bg-base-200 flex items-start justify-center py-8 px-4">
      <motion.div
        className={`card w-full max-w-md bg-base-100 ${
          isPro ? "border border-yellow-400/50" : "border border-base-300"
        }`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Hero strip */}
        <figure
          className={`h-24 w-full ${
            isPro
              ? "bg-gradient-to-br from-yellow-400/20 to-base-100"
              : "bg-gradient-to-br from-primary/10 to-base-100"
          }`}
        />

        <div className="card-body pt-0 -mt-12 items-center gap-0">

          {/* Avatar */}
          <div className="avatar mb-3">
            <div
              className={`w-24 rounded-full ring-offset-base-100 ring-offset-2 ${
                isPro
                  ? "ring-4 ring-yellow-400"
                  : "ring-2 ring-primary"
              }`}
            >
              <img src={user.image} alt={user.name} />
            </div>
          </div>

          {/* PRO badge */}
          {isPro && (
            <div className="badge bg-yellow-400 text-yellow-900 border-none gap-1 mb-2 font-semibold text-[10px]">
              <HiStar className="text-yellow-700" />
              PRO
            </div>
          )}

          {/* Name */}
          <h2
            className={`card-title text-xl tracking-tight ${
              isPro ? "text-yellow-400" : ""
            }`}
          >
            {user.name}
          </h2>

          {/* Username */}
          <p
            className={`flex items-center gap-1 text-sm mb-1 ${
              isPro ? "text-yellow-500" : "text-base-content/50"
            }`}
          >
            @{user.username}
            {isPro && (
              <RiVerifiedBadgeFill className="text-yellow-400" />
            )}
          </p>

          {/* Bio */}
          <p className="text-sm text-base-content/50 italic text-center">
            {user.bio || "Just chilling!!"}
          </p>

          {/* Divider */}
          <div className="divider text-[11px] uppercase tracking-widest text-base-content/30 w-full my-4">
            Player Stats
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 w-full">

            {/* Rank — full width, special pro treatment */}
            <div
              className={`stats col-span-2 shadow-none border ${
                isPro
                  ? "border-yellow-400/30 bg-yellow-400/10"
                  : "border-base-300 bg-base-200"
              }`}
            >
              <div className="stat py-3 px-4">
                <div className={`stat-title text-xs ${isPro ? "text-yellow-600" : ""}`}>
                  Global Rank
                </div>
                <div
                  className={`stat-value text-3xl ${
                    isPro ? "text-yellow-400" : ""
                  }`}
                >
                  {displayValue(stats.rank)}
                </div>
              </div>
            </div>

            <StatBox
              title="Best Time"
              value={displayValue(stats.best_time_ms, "ms")}
              valueClass="text-primary"
            />
            <StatBox
              title="Accuracy"
              value={displayValue(stats.avg_accuracy, "%")}
              valueClass="text-secondary"
            />
            <StatBox
              title="Games Played"
              value={displayValue(stats.games_played)}
            />
            <StatBox
              title="Fastest Click"
              value={displayValue(stats.fastest_tile_ms, "ms")}
            />
            <StatBox
              title="Avg Reaction"
              value={displayValue(stats.avg_reaction_ms, "ms")}
            />
            <StatBox
              title="Total Score"
              value={displayValue(user.score)}
              full
            />
          </div>

          {/* Back button */}
          <div className="card-actions mt-6 w-full">
            <BackButton />
          </div>

        </div>
      </motion.div>
    </div>
  );
};

const StatBox = ({ title, value, valueClass = "", full = false }) => (
  <div
    className={`stats shadow-none bg-base-200 border border-base-300 ${
      full ? "col-span-2" : ""
    }`}
  >
    <div className="stat py-3 px-4">
      <div className="stat-title text-xs">{title}</div>
      <div className={`stat-value text-xl ${valueClass}`}>{value}</div>
    </div>
  </div>
);

export default UserProfile;