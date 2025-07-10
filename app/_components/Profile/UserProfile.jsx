"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { supabase } from "@/app/_lib/supabase";
import { formatNumber } from "@/app/_utils/formatNumber";
import BackButton from "../BackButton";

const UserProfile = ({ user }) => {
  const [stats, setStats] = useState(null);
  const isPro = user[0].is_pro_user;

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { data: statData, error: statsError },
        { data: rankData, error: rankError },
      ] = await Promise.all([
        supabase.rpc("get_user_profile_stats", { uid: user[0].id }),
        supabase.rpc("get_user_rank", { uid: user[0].id }),
      ]);

      if (statsError || rankError) {
        console.error("Stats error:", statsError);
        console.error("Rank error:", rankError);
      } else {
        setStats({ ...statData[0], rank: rankData[0].rank });
      }
    };

    fetchStats();
  }, [user]);

  if (!stats) {
    return (
      <div className="text-warning flex items-center justify-center h-screen font-semibold">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  const displayValue = (val, suffix = "") =>
    val && val !== 0 ? `${formatNumber(val)}${suffix}` : "NA";

  return (
    <>
      <motion.div
        className={`max-w-3xl mx-auto p-6 border rounded-md flex mt-6 flex-col items-center space-y-6 py-8 ${
          isPro
            ? "bg-base-100 border-yellow-400 "
            : "bg-base-100 border-base-300"
        }`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <BackButton />

        <div className="relative avatar">
          <div
            className={`w-24 rounded-full ring-offset-base-100 ring-offset-2 ${
              isPro ? "ring-4 ring-yellow-400" : "ring ring-primary"
            }`}
          >
            <img src={user[0].image} alt="User Avatar" />
          </div>
          {isPro && (
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-base-100 px-2 py-0.5 text-xs font-semibold rounded-full shadow-md">
              PRO
            </span>
          )}
        </div>

        <div className="space-y-1 text-center">
          <h2 className={`text-xl font-bold ${isPro ? "text-yellow-400" : ""}`}>
            {user[0].name}
          </h2>
          <p
            className={`text-sm flex items-center gap-1 justify-center tooltip ${
              isPro ? "text-yellow-500" : "text-base-content/70"
            }`}
            data-tip={isPro ? "Pro user" : ""}
          >
            @{user[0].username}
            {isPro && <RiVerifiedBadgeFill className="text-yellow-400" />}
          </p>

          <p className="italic">{user[0].bio || "Just chilling!!"}</p>
        </div>

        <div className="divider">Player Stats</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          <StatBox title="Global Rank" value={displayValue(stats.rank, "")} />
          <StatBox
            title="Best Time"
            value={displayValue(stats.best_time_ms, "ms")}
            color="text-primary"
          />
          <StatBox
            title="Accuracy"
            value={displayValue(stats.avg_accuracy, "%")}
            color="text-secondary"
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
          <StatBox title="Total Score" value={displayValue(user[0].score)} />
        </div>
      </motion.div>
    </>
  );
};

const StatBox = ({ title, value, color }) => (
  <div className="stat bg-base-200 rounded-box">
    <div className="stat-title">{title}</div>
    <div className={`stat-value ${color || ""}`}>{value}</div>
  </div>
);

export default UserProfile;
