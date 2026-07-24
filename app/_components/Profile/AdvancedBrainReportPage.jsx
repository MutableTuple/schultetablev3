"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import LoginToViewReport from "../AdvancedGameModal/LoginToViewReport";
import MoreDataNeededAlert from "../AdvancedGameModal/MoreDataNeededAlert";
import PageSkeleton from "../AdvancedProGameReport/PageSkeleton";
import PageHeader from "../AdvancedProGameReport/PageHeader";
import PaywallBanner from "../AdvancedProGameReport/PaywallBanner";
import KpiStrip from "../AdvancedProGameReport/KpiStrip";
import ReactionTimeCard from "../AdvancedProGameReport/ReactionTimeCard";
import ConsistencyCard from "../AdvancedProGameReport/ConsistencyCard";
import DriftCard from "../AdvancedProGameReport/DriftCard";
import TrendCard from "../AdvancedProGameReport/TrendCard";
import GameTable from "../AdvancedProGameReport/GameTable";
import InsightCard from "../AdvancedProGameReport/InsightCard";
import BrainHealthCard from "../AdvancedProGameReport/BrainHealthCard";
import PersonalBestCard from "../AdvancedProGameReport/PersonalBestCard";
import BrainScoreCard from "../AdvancedProGameReport/BrainScoreCard";

// ─── section label ─────────────────────────────────────────────────────────────

function Section({ label, children }) {
  return (
    <div className="space-y-3">
      {label && (
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest px-1">
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

// ─── page ──────────────────────────────────────────────────────────────────────

export default function AdvancedBrainReportPage({ user }) {
  const userId = user?.id;

  const [loading, setLoading] = useState(true);
  const [intel, setIntel] = useState(null);
  const [gameCount, setGameCount] = useState(null);
  // server-verified pro status — starts from the client-passed user prop as
  // a best guess for the loading state, then gets overwritten by whatever
  // the API route (re-checking the DB itself) actually says.
  const [isPro, setIsPro] = useState(user?.is_pro_user === true);

  // GA4 — report view + (conditionally) paywall visibility, one effect
  useEffect(() => {
    if (loading || !intel) return;
    window.gtag?.("event", "view_advanced_report_page", {
      user_id: userId,
      game_count: gameCount,
      is_pro_user: isPro,
    });
    if (!isPro) {
      window.gtag?.("event", "advanced_report_paywall_visible", {
        user_id: userId,
      });
    }
  }, [loading, intel, userId, gameCount, isPro]);

  // game count — not sensitive, fine to keep as a direct client query
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { count } = await supabase
        .from("UniversalGameStats")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      if (!cancelled) setGameCount(count ?? 0);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // report data — now fetched through a server route instead of calling
  // calc_message directly from the browser. The server decides what a
  // non-Pro user receives; nothing sensitive is ever sent to the client
  // for a free account, so there's nothing to "cheat" by inspecting the
  // network tab or React state.
  useEffect(() => {
    if (!userId || gameCount === null) return;
    if (gameCount < 10) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/report");
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setIntel(null);
        } else {
          setIntel(json.intel);
          setIsPro(Boolean(json.isPro));
        }
      } catch {
        if (!cancelled) setIntel(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, gameCount]);

  // guards
  if (!userId) return <LoginToViewReport />;
  if (gameCount !== null && gameCount < 10)
    return <MoreDataNeededAlert gameCount={gameCount} />;
  if (loading || !intel) return <PageSkeleton />;

  // Hero score stays free — it's the single hook metric that earns trust
  // and gives a reason to believe the locked, deeper analysis is worth
  // paying for. Everything past this point is where conversion happens.
  const brainScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (intel.percentile ?? 0) * 0.4 +
          (intel.stability_score ?? intel.percentile ?? 0) * 0.3 +
          Math.max(0, 100 - ((intel.avg_reaction_last10 ?? 300) - 150) / 4) *
            0.3,
      ),
    ),
  );
  const changeUp = (intel.avg_change ?? 0) < 0;
  const changePct = intel.avg_prev10
    ? ((Math.abs(intel.avg_change ?? 0) / intel.avg_prev10) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 py-6 space-y-8">
      {/* ── Header ── */}
      <PageHeader isPro={isPro} user={user} userId={userId} />

      {/* ── Hero — brain score (the one free hook metric) ── */}
      <Section label="Your score">
        <BrainScoreCard
          score={brainScore}
          changeText={
            isPro ? `${changePct}% vs last session` : "— vs last session"
          }
          changeUp={changeUp}
          percentile={isPro ? Math.round(intel.percentile ?? 0) : 0}
          isPro={isPro}
        />
      </Section>

      {/* ── Paywall — right after the hook, while intent is highest ── */}

      {/* ── KPI strip ── */}
      <Section label="Key metrics">
        <KpiStrip intel={intel} isPro={isPro} />
      </Section>

      {/* ── Quick overview row ── */}
      <Section label="Overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BrainHealthCard data={intel} isPro={isPro} />
          <PersonalBestCard
            fastestMs={intel.fastest_last10}
            gameDates={intel.game_dates}
            isPro={isPro}
            bestDate={
              intel.game_dates?.[0]
                ? new Date(intel.game_dates[0]).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"
            }
          />
        </div>
      </Section>

      {/* ── Deep analysis ── */}
      <Section label="Deep analysis">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReactionTimeCard intel={intel} isPro={isPro} />
          <ConsistencyCard intel={intel} isPro={isPro} />
          <DriftCard intel={intel} isPro={isPro} />
          <TrendCard intel={intel} isPro={isPro} />
        </div>
      </Section>

      {/* ── Session history ── */}
      <Section label="Session history">
        <GameTable intel={intel} isPro={isPro} />
      </Section>

      {/* ── AI insight ── */}
      <Section label="AI insight">
        <InsightCard insight={intel.insight} isPro={isPro} intel={intel} />
      </Section>
    </div>
  );
}
