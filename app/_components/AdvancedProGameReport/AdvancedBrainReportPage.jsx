'use client'
import React from 'react'
import { useState,useEffect } from 'react'
import PageSkeleton from './PageSkeleton'

import {
  LuBadgeAlert,
  LuBrain,
  LuZap,
  LuTarget,
  LuTrendingUp,
  LuActivity,
  LuClock,
  LuShield,
} from "react-icons/lu";



export default function AdvancedBrainReportPage({ user }) {
  const userId = user?.id;
  const isPro = user?.is_pro_user === true;

  const [loading, setLoading] = useState(true);
  const [intel, setIntel] = useState(null);
  const [gameCount, setGameCount] = useState(null);

  // GA4 — report visible
  useEffect(() => {
    if (!loading && intel) {
      window.gtag?.("event", "view_advanced_report_page", {
        user_id: userId,
        game_count: gameCount,
        is_pro_user: isPro,
      });
    }
  }, [loading, intel, userId, gameCount, isPro]);

  // GA4 — paywall shown
  useEffect(() => {
    if (!loading && intel && !isPro) {
      window.gtag?.("event", "advanced_report_paywall_visible", {
        user_id: userId,
      });
    }
  }, [loading, intel, isPro, userId]);

  /* 1. Total games played */
  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { count } = await supabase
        .from("UniversalGameStats")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      setGameCount(count ?? 0);
    })();
  }, [userId]);

  /* 2. RPC — only if enough games */
  useEffect(() => {
    if (!userId) return;
    if (gameCount === null) return;
    if (gameCount < 10) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("calc_message", {
        p_user_id: userId,
      });
      setIntel(error ? null : data);
      setLoading(false);
    })();
  }, [userId, gameCount]);

  /* ── Guards ── */
  if (!userId) return <LoginToViewReport />;
  if (gameCount !== null && gameCount < 10)
    return <MoreDataNeededAlert gameCount={gameCount} />;
  if (loading || !intel) return <PageSkeleton />;

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 space-y-6">
      {/* PAGE HEADER */}
      <PageHeader isPro={isPro} user={user} userId={userId} />

      {/* PAYWALL BANNER (free users) */}
      {!isPro && <PaywallBanner user={user} userId={userId} />}

      {/* KPI STRIP */}
      <KpiStrip intel={intel} isPro={isPro} />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReactionTimeCard intel={intel} isPro={isPro} />
        <ConsistencyCard intel={intel} isPro={isPro} />
        <FatigueCard intel={intel} isPro={isPro} />
        <StabilityCard intel={intel} isPro={isPro} />
      </div>

      {/* FULL-WIDTH SECTIONS */}
      <DriftCard intel={intel} isPro={isPro} />
      <TrendCard intel={intel} isPro={isPro} />
      <GameTable intel={intel} isPro={isPro} />
      <InsightCard insight={intel.insight} isPro={isPro} />
    </div>
  );
}