"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import UserSelection from "./UserSelection";
import ComparedSummary from "./ComparedSummary";

export default function Compare({ user }) {
  const [proUser, setProUser] = useState(false);
  const [usersWithGames, setUsersWithGames] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSummaries, setLoadingSummaries] = useState(false);
  let validAccuracyCount = 0;
  // 1. Check if current user is Pro
  console.log("<USDS", user);
  useEffect(() => {
    const checkProStatus = async () => {
      const { data, error } = await supabase
        .from("User")
        .select("is_pro_user")
        .eq("id", user?.[0]?.id)
        .single();

      if (error) {
        toast.error("Error checking Pro status");
        console.error(error);
      }

      setProUser(data?.is_pro_user || false);
    };

    if (user?.[0]?.id) {
      checkProStatus();
    }
  }, [user]);

  // 2. Fetch all users who have at least one game_summary
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from("UniversalGameStats")
        .select("user_id, User(id, name, image), created_at")
        .not("game_summary", "is", null)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Error fetching users");
        return console.error(error);
      }

      // Only one entry per unique user
      const seen = new Set();
      const uniqueUsers = data
        .filter((entry) => {
          if (!entry.User?.id || seen.has(entry.User.id)) return false;
          seen.add(entry.User.id);
          return true;
        })
        .map((entry) => entry.User);

      setUsersWithGames(uniqueUsers);
      setLoadingUsers(false);
    };

    fetchUsers();
  }, []);

  // 3. Fetch latest summary per selected user
  useEffect(() => {
    const fetchSummaries = async () => {
      setLoadingSummaries(true);
      if (selectedIds.length === 0) {
        setSummaries([]);
        setLoadingSummaries(false); // ✅ stop loading!
        return;
      }

      const { data, error } = await supabase
        .from("UniversalGameStats")
        .select("game_summary, User(id, name, image), user_id, created_at")
        .in("user_id", selectedIds)
        .not("game_summary", "is", null)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Error fetching summaries");
        return console.error(error);
      }

      const summariesPerUser = selectedIds.map((id) => {
        const userGames = data.filter((entry) => entry.user_id === id);

        if (userGames.length === 0) return null;

        const latest = userGames[0];
        const user = latest.User;

        const total = {
          count: 0,
          score: 0,
          accuracy: 0,
          avgReactionTimeMs: 0,
          fastestMs: 0,
          slowestMs: 0,
          consistencyScore: 0,
          durationMs: 0,
          mistakes: 0,
        };

        userGames.forEach(({ game_summary }) => {
          if (!game_summary) return;
          total.count += 1;
          total.score += game_summary.score ?? 0;
          if (
            typeof game_summary.accuracy === "string" &&
            game_summary.accuracy.endsWith("%")
          ) {
            const numericAccuracy = parseFloat(
              game_summary.accuracy.replace("%", "")
            );
            if (!isNaN(numericAccuracy)) {
              total.accuracy += numericAccuracy;
              validAccuracyCount += 1;
            }
          }

          total.avgReactionTimeMs += game_summary.avgReactionTimeMs ?? 0;
          total.fastestMs += game_summary.fastestMs ?? 0;
          total.slowestMs += game_summary.slowestMs ?? 0;
          total.consistencyScore += game_summary.consistencyScore ?? 0;
          total.durationMs += game_summary.durationMs ?? 0;
          total.mistakes += game_summary.mistakes ?? 0;
        });

        const avg = {
          score: total.count ? (total.score / total.count).toFixed(2) : "—",
          accuracy: validAccuracyCount
            ? (total.accuracy / validAccuracyCount).toFixed(2)
            : "—",
          avgReactionTimeMs: total.count
            ? (total.avgReactionTimeMs / total.count).toFixed(2)
            : "—",
          fastestMs: total.count
            ? (total.fastestMs / total.count).toFixed(2)
            : "—",
          slowestMs: total.count
            ? (total.slowestMs / total.count).toFixed(2)
            : "—",
          consistencyScore: total.count
            ? (total.consistencyScore / total.count).toFixed(2)
            : "—",
          durationMs: total.count
            ? (total.durationMs / total.count).toFixed(2)
            : "—",
          mistakes: total.count
            ? (total.mistakes / total.count).toFixed(2)
            : "—",
        };
        console.log(avg);

        return {
          latest: latest.game_summary,
          user,
          average: avg,
        };
      });

      setSummaries(summariesPerUser.filter(Boolean));
      setLoadingSummaries(false);
    };

    fetchSummaries();
  }, [selectedIds]);

  // Handle selection
  const toggleUserSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((uid) => uid !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      toast.error("You can only compare up to 3 users.");
    }
  };

  if (!proUser) {
    return (
      <div className=" text-center">
        <h2 className="text-xl font-bold">🔒 Pro Feature</h2>
        <p className="text-sm mt-2">Upgrade to Pro to compare users.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-xs font-semibold">Compare Players</h2>

        {/* User Selection */}
        {loadingUsers ? (
          <div className="flex justify-center items-center h-24">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : (
          <UserSelection
            usersWithGames={usersWithGames}
            toggleUserSelection={toggleUserSelection}
            selectedIds={selectedIds}
          />
        )}

        {/* Game Summary Cards */}
        {loadingSummaries ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-bars text-primary"></span>
          </div>
        ) : (
          <ComparedSummary summaries={summaries} />
        )}
      </div>
    </>
  );
}
