"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import AnalyticsData from "./AnalyticsData";
import GameChart from "./GameChart";
import ContributionHeatmap from "./ContributionHeatmap";

const DATE_RANGES = [
  { value: "28d", label: "28D" },
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
  { value: "all", label: "All" },
  { value: "custom", label: "Custom" },
];

export default function AdvancedAnalyticsPage({ user }) {
  const [gameData, setGameData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("28d");
  const [customRange, setCustomRange] = useState({ from: null, to: null });
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const formatMs = (ms) => `${(ms / 1000).toFixed(2)}s`;
  const formatPercent = (val) =>
    typeof val === "string" ? val : `${val.toFixed(1)}%`;

  const fetchGameData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const now = new Date();
    let from = null,
      to = null;

    if (dateRange === "28d") {
      from = new Date();
      from.setDate(now.getDate() - 28);
    } else if (dateRange === "3m") {
      from = new Date();
      from.setMonth(now.getMonth() - 3);
    } else if (dateRange === "6m") {
      from = new Date();
      from.setMonth(now.getMonth() - 6);
    } else if (dateRange === "custom") {
      from = customRange.from;
      to = customRange.to;
    }

    const { data: analyticsData, error: analyticsError } = await supabase.rpc(
      "get_user_analytics",
      {
        p_user_id: user.id,
        p_from: from ? from.toISOString() : null,
        p_to: to ? to.toISOString() : null,
      },
    );

    if (!analyticsError && analyticsData?.length > 0)
      setAnalytics(analyticsData[0]);

    let query = supabase
      .from("UniversalGameStats")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(0, 100);

    if (from) query = query.gte("created_at", from.toISOString());
    if (to) query = query.lte("created_at", to.toISOString());
    if (!user.is_pro_user) query = query.limit(5);

    const { data, error } = await query;
    if (!error) setGameData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchGameData();
  }, [user, dateRange, customRange]);

  const totalGames = analytics?.total_games || 0;
  const totalScore = analytics?.total_score || 0;
  const totalRightClicks = analytics?.total_right_clicks || 0;
  const totalWrongClicks = analytics?.total_wrong_clicks || 0;
  const avgAccuracy = analytics?.avg_accuracy || 0;
  const avgReactionTime = analytics?.avg_reaction_time || 0;
  const avgDuration = analytics?.avg_duration || 0;

  const customLabel =
    customRange.from && customRange.to
      ? `${customRange.from.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} – ${customRange.to.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`
      : "Pick range";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <span className="loading loading-bars loading-lg text-primary" />
        <p className="text-sm text-base-content/30 animate-pulse">
          Loading your analytics…
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 sm:py-4 py-4 space-y-8">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-base-content/30 uppercase tracking-widest mb-1">
            Dashboard
          </p>
          <h1 className="text-2xl font-bold text-base-content tracking-tight">
            Advanced Analytics
          </h1>
        </div>

        {/* Date range toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="join rounded-xl border border-base-300 bg-base-200 p-0.5">
            {DATE_RANGES.filter((r) => r.value !== "custom").map((r) => (
              <button
                key={r.value}
                onClick={() => {
                  setDateRange(r.value);
                  setShowCustomPicker(false);
                }}
                className={`join-item btn btn-xs rounded-lg font-medium transition-all duration-150 border-0 ${
                  dateRange === r.value
                    ? "bg-base-100 text-base-content shadow-sm"
                    : "bg-transparent text-base-content/40 hover:text-base-content"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Custom range button */}
          <div className="relative">
            <button
              onClick={() => {
                setDateRange("custom");
                setShowCustomPicker((v) => !v);
              }}
              className={`btn btn-xs rounded-xl border font-medium transition-all duration-150 ${
                dateRange === "custom"
                  ? "btn-primary border-primary"
                  : "border-base-300 bg-base-200 text-base-content/50 hover:text-base-content"
              }`}
            >
              📅 {dateRange === "custom" ? customLabel : "Custom"}
            </button>

            {showCustomPicker && (
              <div className="absolute right-0 top-10 z-50 bg-base-100 border border-base-300 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 min-w-[260px]">
                <p className="text-xs font-semibold text-base-content/40 uppercase tracking-wider">
                  Custom Range
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-base-content/40">From</label>
                    <input
                      type="date"
                      className="input input-sm input-bordered rounded-xl w-full"
                      onChange={(e) =>
                        setCustomRange((p) => ({
                          ...p,
                          from: e.target.value
                            ? new Date(e.target.value)
                            : null,
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-base-content/40">To</label>
                    <input
                      type="date"
                      className="input input-sm input-bordered rounded-xl w-full"
                      onChange={(e) =>
                        setCustomRange((p) => ({
                          ...p,
                          to: e.target.value ? new Date(e.target.value) : null,
                        }))
                      }
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-sm rounded-xl w-full"
                  onClick={() => {
                    setShowCustomPicker(false);
                    fetchGameData();
                  }}
                >
                  Apply Range
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PRO upsell banner ── */}
      {!user?.is_pro_user && (
        <div className="rounded-2xl border border-warning/20 bg-warning/6 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-sm font-semibold text-base-content">
                You're on the free plan
              </p>
              <p className="text-xs text-base-content/50 mt-0.5">
                Viewing stats from your{" "}
                <strong className="text-base-content/70">last 5 games</strong>{" "}
                only. Upgrade for full history, exports & more.
              </p>
            </div>
          </div>
          <a
            href="/get-pro"
            className="btn btn-sm btn-warning rounded-xl font-semibold shrink-0 shadow-lg shadow-warning/20"
          >
            ✦ Upgrade to PRO
          </a>
        </div>
      )}

      {/* ── Stats grid ── */}
      <AnalyticsData
        user={user}
        loading={loading}
        totalGames={totalGames}
        gameData={gameData}
        totalScore={totalScore}
        totalRightClicks={totalRightClicks}
        totalWrongClicks={totalWrongClicks}
        avgAccuracy={avgAccuracy}
        avgDuration={avgDuration}
        avgReactionTime={avgReactionTime}
        formatMs={formatMs}
        formatPercent={formatPercent}
      />

      {/* ── Divider ── */}
      <div className="h-px bg-base-300 w-full" />

      {/* ── Chart ── */}
      <section>
        <GameChart
          gameData={gameData}
          totalRightClicks={totalRightClicks}
          totalWrongClicks={totalWrongClicks}
        />
      </section>

      {/* ── Heatmap ── */}
      <section>
        <ContributionHeatmap user={user} />
      </section>

      {/* ── Footer note ── */}
      <p className="text-center text-xs text-base-content/20 pb-4">
        Data refreshes on each page load · Showing{" "}
        {dateRange === "28d"
          ? "last 28 days"
          : dateRange === "3m"
            ? "last 3 months"
            : dateRange === "6m"
              ? "last 6 months"
              : dateRange === "all"
                ? "all-time"
                : "custom range"}
      </p>
    </div>
  );
}
