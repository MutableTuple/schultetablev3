"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import MoreDataNeededAlert from "./MoreDataNeededAlert";
import LoginToViewReport from "./LoginToViewReport";
import Link from "next/link";
import { LuBadgeAlert } from "react-icons/lu";
import PaymentLink from "./PaymentLink";
/*
  DetailedMessage (single-file, full)
  - Adds frontend-only "blur for free users" logic everywhere
  - Controlled by: user?.[0]?.is_pro_user === true -> isPro
  - FREE users see labels, tooltips, arrows, section titles, but numeric values are replaced with a blurred placeholder "••••"
  - PRO users see everything
  - This file intentionally keeps functionality/UI identical to your original, only injecting isPro checks and placeholder rendering
*/

/* =======================================================
   ✅ MAIN COMPONENT
   ======================================================= */
export default function DetailedMessage({ userId, user }) {
  const [loading, setLoading] = useState(true);
  const [intel, setIntel] = useState(null);
  const [gameCount, setGameCount] = useState(null);

  // NOTE: your provided field name
  const isPro = user?.[0]?.is_pro_user === true;
  // GA4 - track when report becomes visible
  // GA4 - track when report becomes visible
  useEffect(() => {
    if (!loading && intel) {
      window.gtag?.("event", "view_report_page", {
        user_id: userId,
        game_count: gameCount,
        is_pro_user: isPro,
      });
    }
  }, [loading, intel, userId, gameCount, isPro]);

  // GA4 - track when paywall is shown (only for free users)
  useEffect(() => {
    if (!loading && intel && !isPro) {
      window.gtag?.("event", "report_paywall_visible", {
        user_id: userId,
      });
    }
  }, [loading, intel, isPro, userId]);

  /* -------------------------------
     1. Get total games played
     ------------------------------- */

  useEffect(() => {
    if (!userId) return;

    (async () => {
      const { data, error } = await supabase
        .from("UniversalGameStats")
        .select("id", { count: "exact" })
        .eq("user_id", userId);

      if (data !== null) {
        setGameCount(data.length); // works fine
      } else {
        setGameCount(0);
      }
    })();
  }, [userId]);

  /* -------------------------------
     2. Call RPC only if enough games
     ------------------------------- */
  useEffect(() => {
    if (!userId) return;
    if (gameCount === null) return; // still loading total games
    if (gameCount < 10) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);

      const { data, error } = await supabase.rpc("calc_message", {
        p_user_id: userId,
      });

      if (!error) setIntel(data);
      else {
        // console.error(error);
        setIntel(null);
      }

      setLoading(false);
    })();
  }, [userId, gameCount]);

  /* =======================================================
     CASES: not logged in, not enough games, loading, final
     ======================================================= */

  /* Not logged in */
  if (!userId) {
    return <LoginToViewReport />;
  }

  /* Not enough games */
  if (gameCount !== null && gameCount < 10) {
    return <MoreDataNeededAlert gameCount={gameCount} />;
  }

  /* Loading RPC */
  if (loading || !intel) {
    return (
      <div className="p-4 bg-base-200 rounded-xl space-y-3 animate-pulse text-center">
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
        <p className="text-sm opacity-70">Analyzing your brain performance…</p>
      </div>
    );
  }

  /* Final report */
  return (
    <div className="p-4 bg-base-200 rounded-xl space-y-6">
      {/* PRO badge / hint */}

      {/* HEADER */}
      <h2 className="text-lg font-bold">Your Cognitive Performance Report</h2>
      <p className="text-xs opacity-70 -mt-1 leading-relaxed">
        Based on your last <strong>10 games</strong>, we analyzed:
        <strong> speed, consistency, fatigue, trends, stability,</strong> and
        <strong> performance evolution</strong>.
      </p>
      {!isPro && (
        <div className="mt-3 space-y-2 text-center text-base-content">
          <div className=" bg-base-100/70 border border-base-300 rounded-lg px-3 py-2 text-xs leading-snug flex flex-col">
            <span className="text-sm font-semibold flex items-center justify-center gap-2 text-error">
              <LuBadgeAlert /> You're seeing a limited view.
            </span>
            <br />
            <p>
              {" "}
              Unlock deeper insights, mental performance trends, and your
              improvement map.
            </p>
          </div>
          <PaymentLink user={user} userId={userId} />

          <p className="text-[10px] opacity-60">
            One-time purchase. No subscription. Your brain deserves this.
          </p>
        </div>
      )}
      {/* SECTIONS (pass isPro down) */}
      <ReactionTimeSection intel={intel} isPro={isPro} />
      <ConsistencySection intel={intel} isPro={isPro} />

      <FatigueSection intel={intel} isPro={isPro} />
      <StabilitySection intel={intel} isPro={isPro} />
      <DriftSection intel={intel} isPro={isPro} />
      <GameTable intel={intel} isPro={isPro} />
      <TrendSection intel={intel} isPro={isPro} />
      <InsightSection insight={intel.insight} isPro={isPro} user={user} />
    </div>
  );
}

/* =======================================================
   REACTION TIME SECTION
   ======================================================= */
function ReactionTimeSection({ intel, isPro }) {
  return (
    <MetricSection title="Reaction Time">
      <MetricRow
        label="Avg Reaction Time"
        value={`${Math.round(intel.avg_reaction_last10)} ms`}
        tip="Lower = better"
        type="rt"
        forceUnblur={true}
      />

      <MetricRow
        label="Fastest (Best)"
        value={`${Math.round(intel.fastest_last10)} ms`}
        tip="Fastest single reaction in the last 10 games."
        type="rt"
        isPro={isPro}
      />

      <MetricRow
        label="Slowest (Worst)"
        value={`${Math.round(intel.slowest_last10)} ms`}
        tip="Worst reaction out of your last 10 games."
        type="rt"
        isPro={isPro}
      />

      {intel.avg_prev10 && (
        <MetricRow
          label="Previous 10 Avg"
          value={`${Math.round(intel.avg_prev10)} ms`}
          tip="Your earlier baseline for comparing growth."
          isPro={isPro}
        />
      )}

      {intel.avg_change !== undefined && intel.avg_change !== null && (
        <MetricRow
          label="Speed Trend"
          value={`${intel.avg_change > 0 ? "+" : ""}${intel.avg_change.toFixed(
            1
          )}%`}
          tip="Speed improvement compared to earlier games."
          positive={intel.avg_change < 0}
          isPro={isPro}
        />
      )}
    </MetricSection>
  );
}

/* =======================================================
   CONSISTENCY SECTION
   ======================================================= */
function ConsistencySection({ intel, isPro }) {
  return (
    <MetricSection title="Consistency">
      <MetricRow
        label="Avg Consistency"
        value={`${Math.round(intel.avg_consistency_last10)}`}
        tip="Higher = more stable reaction timing."
        isPro={isPro}
      />

      <MetricRow
        label="Global Percentile"
        value={`${intel.percentile?.toFixed(1)}%`}
        tip="Where your consistency ranks among all players."
        highlight
        isPro={isPro}
      />

      {intel.consistency_change !== undefined &&
        intel.consistency_change !== null && (
          <MetricRow
            label="Consistency Trend"
            value={`${
              intel.consistency_change > 0 ? "+" : ""
            }${intel.consistency_change.toFixed(1)}%`}
            tip="Higher = more stable than before."
            positive={intel.consistency_change >= 0}
            isPro={isPro}
          />
        )}
    </MetricSection>
  );
}

/* =======================================================
   FATIGUE SECTION
   ======================================================= */
function FatigueSection({ intel, isPro }) {
  return (
    <MetricSection title="Fatigue">
      {intel.fatigue_score !== null && intel.fatigue_score !== undefined ? (
        <MetricRow
          label="Fatigue Score"
          value={`${intel.fatigue_score.toFixed(1)}%`}
          tip="Negative = you're slowing down over a session."
          positive={intel.fatigue_score < 0}
          isPro={isPro}
        />
      ) : (
        <Placeholder text="Not enough data to measure fatigue yet." />
      )}
    </MetricSection>
  );
}

/* =======================================================
   STABILITY SECTION
   ======================================================= */
function StabilitySection({ intel, isPro }) {
  return (
    <MetricSection title="Stability">
      <MetricRow
        label="Stability Score"
        value={`${intel.stability_score?.toFixed(1)} / 100`}
        tip="Higher = steadier mental rhythm."
        isPro={isPro}
      />
    </MetricSection>
  );
}

/* =======================================================
   DRIFT SECTION
   ======================================================= */
function DriftSection({ intel, isPro }) {
  return (
    <MetricSection title="Drift Analysis">
      <MetricRow
        label="Avg Drift Rate"
        value={`${intel.drift_rate?.toFixed(2)}`}
        tip="Positive = you get slightly faster during the session."
        isPro={isPro}
      />
    </MetricSection>
  );
}

/* =======================================================
   SHARED COMPONENTS — Metric Section
   ======================================================= */
function MetricSection({ title, children }) {
  return (
    <div className="bg-base-300 p-4 rounded-xl border border-base-200 space-y-2">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

/* =======================================================
   METRIC ROW (with isPro-based blur)
   - Shows arrows / tooltips for everyone, but numeric values are blurred/replaced for free users
   ======================================================= */
function MetricRow({
  label,
  value,
  tip,
  highlight,
  positive,
  subtle,
  type,
  isPro,
  forceUnblur,
}) {
  // parse numeric for decisions (value may be "123 ms" or "12.3%")
  const parseNum = (v) => {
    if (v === undefined || v === null) return null;
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const cleaned = parseFloat(v.replace(/[^0-9.-]/g, ""));
      return isNaN(cleaned) ? null : cleaned;
    }
    return null;
  };

  const numeric = parseNum(value);

  const getArrow = () => {
    if (numeric === null) return "";
    if (type === "trend") {
      if (value === "improving") return "▲";
      if (value === "declining") return "▼";
      return "•";
    }
    if (type === "rt") {
      if (numeric <= 250) return "▲";
      if (numeric <= 350) return "•";
      return "▼";
    }
    if (numeric > 0) return "▲";
    if (numeric < 0) return "▼";
    return "•";
  };

  const getBadgeColor = () => {
    if (highlight) return "badge-info";
    if (type === "trend") {
      if (value === "improving") return "badge-success";
      if (value === "declining") return "badge-error";
      return "badge-neutral";
    }
    if (type === "rt") {
      if (numeric !== null) {
        if (numeric <= 250) return "badge-success";
        if (numeric <= 350) return "badge-warning";
        return "badge-error";
      }
    }
    if (positive === true) return "badge-success";
    if (positive === false) return "badge-error";
    if (numeric > 0) return "badge-success";
    if (numeric < 0) return "badge-error";
    return "badge-neutral";
  };

  const getMeaningText = () => {
    if (type === "trend") {
      if (value === "improving") return "Your reaction time is improving.";
      if (value === "declining") return "Your reaction time is slowing.";
      return "Your reaction time is stable.";
    }
    if (type === "rt") {
      if (numeric !== null) {
        if (numeric <= 250) return "Excellent reaction speed.";
        if (numeric <= 350) return "Good reaction control.";
        return "Slow — try focusing more.";
      }
    }
    if (numeric > 0) return "This indicates improvement.";
    if (numeric < 0) return "This shows a decline.";
    return "Stable performance.";
  };

  // What to show for free users: blurred placeholder
  const renderValue = () => {
    if (isPro || forceUnblur) return <span>{value}</span>;

    return (
      <span className="flex items-center gap-2">
        <span className="blur-[4px] opacity-70 select-none">••••</span>
      </span>
    );
  };

  return (
    <div
      className={`flex items-center justify-between text-sm ${
        subtle ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {label}

        <div className="tooltip tooltip-top max-w-xs" data-tip={tip}>
          <span className="badge badge-xs bg-base-200 cursor-pointer">?</span>
        </div>
      </div>

      <span
        className={`badge ${getBadgeColor()} px-3 py-2 font-semibold flex items-center gap-2`}
      >
        {/* arrow always visible for both user types (per your request) */}
        {numeric !== null && <span>{getArrow()}</span>}

        {/* value: blurred for free users */}
        {renderValue()}

        <div
          className="tooltip tooltip-left max-w-xs"
          data-tip={getMeaningText()}
        >
          <span className="badge badge-xs bg-base-100 cursor-pointer">i</span>
        </div>
      </span>
    </div>
  );
}

/* =======================================================
   PLACEHOLDER
   ======================================================= */
function Placeholder({ text }) {
  return <p className="text-xs opacity-60">{text}</p>;
}

/* =======================================================
   INSIGHT SECTION
   - Insight text is blurred for free users
   ======================================================= */
function InsightSection({ insight, isPro, user }) {
  console.log(user);
  return (
    <div className="bg-base-300 p-4 rounded-xl border border-base-200">
      <h3 className="font-semibold mb-2">Overall Insight</h3>
      <p className="text-sm">
        {isPro ? (
          insight
        ) : (
          <span className="blur-[4px] select-none opacity-80">
            Unlock to view insights…
          </span>
        )}
      </p>
    </div>
  );
}

/* =======================================================
   GAME TABLE (with blurred numbers for free users)
   ======================================================= */
function GameTable({ intel, isPro }) {
  const first = intel.game_by_game_avg?.[0];
  const last = intel.game_by_game_avg?.[intel.game_by_game_avg.length - 1];

  let overallTrend = "same";
  if (first && last) {
    const diff = (last - first) / first;
    if (diff < -0.03) overallTrend = "improving";
    else if (diff > 0.03) overallTrend = "declining";
  }

  const games = intel.game_by_game_avg?.map((avg, index) => {
    const prev = intel.game_by_game_avg[index - 1];
    let trend = "same";
    if (prev !== undefined) {
      if (avg < prev) trend = "improving";
      else if (avg > prev) trend = "declining";
    }

    return {
      index: index + 1,
      avg,
      fastest: intel.game_by_game_fastest[index],
      consistency: intel.game_by_game_consistency[index],
      date: intel.game_dates[index],
      trend,
    };
  });

  return (
    <div className="bg-base-300 p-4 rounded-xl border border-base-200">
      <h3 className="font-semibold mb-3">Game-by-Game Breakdown</h3>

      {/* OVERALL TRENDS */}
      <div className="flex flex-wrap gap-3 mb-3">
        <span
          className={`badge px-3 py-2 text-sm ${
            overallTrend === "improving"
              ? "badge-success"
              : overallTrend === "declining"
                ? "badge-error"
                : "badge-neutral"
          }`}
        >
          {overallTrend === "improving" && "▲ Short-term Improving"}
          {overallTrend === "declining" && "▼ Short-term Declining"}
          {overallTrend === "same" && "• Short-term Stable"}
        </span>

        <span
          className={`badge px-3 py-2 text-sm ${
            intel.reaction_trend === "improving"
              ? "badge-success"
              : intel.reaction_trend === "declining"
                ? "badge-error"
                : "badge-neutral"
          }`}
        >
          {intel.reaction_trend === "improving" && "▲ Long-term Improving"}
          {intel.reaction_trend === "declining" && "▼ Long-term Declining"}
          {intel.reaction_trend === "stable" && "• Long-term Stable"}
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Avg RT</th>
              <th>Fastest</th>
              <th>Consistency</th>
            </tr>
          </thead>
          <tbody>
            {games?.map((g, i) => (
              <tr
                key={i}
                className={
                  intel.best_game_index === i + 1
                    ? "bg-green-100/20"
                    : intel.worst_game_index === i + 1
                      ? "bg-red-100/20"
                      : ""
                }
              >
                <td>{g.index}</td>
                <td>{new Date(g.date).toLocaleDateString()}</td>

                <td>
                  {isPro ? (
                    `${Math.round(g.avg)} ms`
                  ) : (
                    <span className="blur-[4px] select-none">•••</span>
                  )}
                </td>

                <td>
                  {isPro ? (
                    `${Math.round(g.fastest)} ms`
                  ) : (
                    <span className="blur-[4px] select-none">•••</span>
                  )}
                </td>

                <td>
                  {isPro ? (
                    `${Math.round(g.consistency)}`
                  ) : (
                    <span className="blur-[4px] select-none">•••</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =======================================================
   PERFORMANCE TRENDS
   ======================================================= */
function TrendSection({ intel, isPro }) {
  return (
    <div className="bg-base-300 p-4 rounded-xl border border-base-200 flex flex-col gap-2">
      <h3 className="font-semibold mb-2">Your Performance Trends</h3>

      <MetricRow
        label="Reaction Trend"
        value={intel.reaction_trend}
        tip="Whether your speed is improving or dropping."
        positive={intel.reaction_trend === "improving"}
        type="trend"
        isPro={isPro}
      />

      <MetricRow
        label="Consistency Trend"
        value={intel.consistency_trend}
        tip="Your stability over games."
        positive={intel.consistency_trend === "improving"}
        isPro={isPro}
      />

      <MetricRow
        label="Overall Trend Score"
        value={`${intel.overall_trend_score?.toFixed(1)}`}
        tip="Combined improvement score."
        isPro={isPro}
      />
    </div>
  );
}
