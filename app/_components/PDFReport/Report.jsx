"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { FiDownload, FiPrinter, FiLoader, FiCheck } from "react-icons/fi";

import { useGameAnalytics } from "@/app/_hooks/useGameAnalytics";
import CoverPage from "./CoverPage";
import FocusScore from "./FocusScore";
import RankCard from "./RankCard";
import PerformanceGraph from "./PerformanceGraph";
import Heatmap from "./Heatmap";
import StreakCard from "./StreakCard";
import ComparisonCard from "./ComparisonCard";
import MonthlyReportCTA from "./MonthlyReportCTA";
import StreakInsightsPage from "./StreakInsightsPage";

// ============================================
// PAGE WRAPPER — scales A4 to fit any screen
// ============================================

const PAGE_W = 794;
const PAGE_H = 1123;

function ReportPage({ children }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const availableW = entry.contentRect.width;
      const ratio = availableW / PAGE_W;
      setScale(ratio < 1 ? ratio : 1);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    // Outer: full width, height collapses to scaled page height
    <div
      ref={containerRef}
      style={{ width: "100%", height: PAGE_H * scale, position: "relative" }}
    >
      {/* Inner: A4 size, scaled from top-center */}
      <div
        className="pdf-page bg-white overflow-hidden border border-zinc-200 shadow-lg"
        style={{
          width: PAGE_W,
          height: PAGE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          position: "absolute",
          left: "50%",
          marginLeft: -(PAGE_W / 2),
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================
// MAIN REPORT
// ============================================

export default function Report({ user }) {
  const [downloadState, setDownloadState] = useState("idle");
  const analytics = useGameAnalytics(user.user);
  const searchParams = useSearchParams();

  const isPro = user.user?.is_pro_user;

  // ── URL-driven date range ───────────────────────────────────────────────
  // ?days=90        → last 90 days (rolling)
  // ?monthly        → calendar month-to-date
  // ?yearly         → calendar year-to-date
  // `days` wins if present; otherwise monthly; otherwise yearly.
  // Falls back to the hook's default ("28d") if none are set.
  useEffect(() => {
    const daysParam = searchParams.get("days");
    const days = daysParam ? Number(daysParam) : null;

    if (days && !Number.isNaN(days) && days > 0) {
      analytics.setDaysRange(days);
    } else if (searchParams.has("monthly")) {
      analytics.setMonthly();
    } else if (searchParams.has("yearly")) {
      analytics.setYearly();
    }
    // analytics.setDaysRange/setMonthly/setYearly are stable (useCallback),
    // safe to key this effect off searchParams alone.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Reachable only for Pro users — the component returns <MonthlyReportCTA />
  // for everyone else before this ever renders (see below).
  const downloadPDF = async () => {
    try {
      setDownloadState("generating");
      const response = await fetch("/api/generate-report");
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "schultetable-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloadState("success");
      setTimeout(() => setDownloadState("idle"), 2500);
    } catch (error) {
      console.error("PDF download failed:", error);
      setDownloadState("idle");
      toast.error("Failed to download PDF. Please try again.");
    }
  };

  const printReport = () => window.print();

  const pages = [
    <CoverPage user={user} analytics={analytics} />,
    <FocusScore user={user} analytics={analytics} />,
    <RankCard user={user} analytics={analytics} />,
    <PerformanceGraph user={user} analytics={analytics} />,
    <Heatmap user={user} analytics={analytics} />,
    <StreakInsightsPage user={user} analytics={analytics} />,
    <ComparisonCard user={user} analytics={analytics} />,
  ];

  if (!isPro) {
    return <MonthlyReportCTA user={user} />;
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* TOP NAV */}
      <div className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-4 md:px-10 py-3 sm:py-4 print:hidden">
        <div className="max-w-[1600px] mx-auto flex flex-row items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-zinc-900 truncate">
              SchulteTable Report
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm hidden sm:block">
              Premium monthly cognitive analytics
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={printReport}
              className="h-9 sm:h-11 px-3 sm:px-5 border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-colors rounded-sm"
            >
              <FiPrinter size={13} />
              <span>Print</span>
            </button>

            <button
              onClick={downloadPDF}
              disabled={downloadState === "generating"}
              className="h-9 sm:h-11 px-3 sm:px-5 bg-[#570df8] hover:bg-[#4b0de0] text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-colors rounded-sm disabled:opacity-70"
            >
              {downloadState === "generating" ? (
                <FiLoader size={13} className="animate-spin" />
              ) : downloadState === "success" ? (
                <FiCheck size={13} />
              ) : (
                <FiDownload size={13} />
              )}
              <span>
                {downloadState === "generating"
                  ? "Preparing…"
                  : downloadState === "success"
                    ? "Downloaded"
                    : "Download"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* REPORT PAGES */}
      <div className="max-w-[1600px] mx-auto py-6 sm:py-10 px-2 sm:px-4 md:px-8">
        <div className="flex flex-col gap-6 sm:gap-10">
          {pages.map((page, index) => (
            <ReportPage key={index}>{page}</ReportPage>
          ))}
        </div>
      </div>
    </div>
  );
}
