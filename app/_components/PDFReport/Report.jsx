"use client";

import React, { useState, useEffect, useRef } from "react";

import {
  FiDownload,
  FiPrinter,
  FiLoader,
  FiCheck,
  FiLock,
  FiZap,
  FiTrendingUp,
  FiBarChart2,
  FiTarget,
  FiX,
} from "react-icons/fi";

import { AnimatePresence, motion } from "framer-motion";
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
// UPGRADE MODAL
// ============================================

function Benefit({ icon, text }) {
  return (
    <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 p-3 rounded-sm">
      <div className="text-[#570df8]">{icon}</div>
      <span className="font-semibold text-sm text-zinc-700">{text}</span>
    </div>
  );
}

function UpgradeModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed inset-0
        bg-black/70
        backdrop-blur-sm
        z-[9999]
        flex items-center justify-center
        p-4
      "
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="
          bg-white
          max-w-lg
          w-full
          p-6 sm:p-8
          shadow-2xl
          relative
          rounded-sm
          max-h-[90dvh]
          overflow-y-auto
        "
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 transition-colors p-1"
        >
          <FiX size={18} />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 shrink-0 bg-[#570df8] text-white flex items-center justify-center text-xl rounded-sm shadow-lg shadow-[#570df8]/30">
            <FiLock />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">
              Unlock Brain Pro
            </h2>
            <p className="text-zinc-500 text-sm">
              Advanced Cognitive Analytics
            </p>
          </div>
        </div>

        <div className="mt-6 bg-[#570df8]/5 border border-[#570df8]/20 p-4 sm:p-5 rounded-sm">
          <h3 className="text-base sm:text-lg font-black text-zinc-900 leading-snug">
            Your Brain Is Performing Better Than{" "}
            <span className="text-[#570df8]">89%</span> Of Players
          </h3>
          <p className="mt-2 text-zinc-500 text-sm leading-relaxed">
            Unlock the complete report and discover your strengths, weaknesses,
            trends and AI insights.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <Benefit icon={<FiZap />} text="AI Insights" />
          <Benefit icon={<FiTrendingUp />} text="Performance Trends" />
          <Benefit icon={<FiBarChart2 />} text="Heatmaps" />
          <Benefit icon={<FiTarget />} text="Global Rankings" />
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <div className="text-4xl sm:text-5xl font-black text-zinc-900">
            ₹399
          </div>
          <div className="text-zinc-400 text-sm mt-1">
            per month · cancel anytime
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6 sm:mt-7">
          <button
            onClick={onClose}
            className="h-12 border border-zinc-200 text-zinc-600 font-semibold text-sm hover:bg-zinc-50 transition-colors rounded-sm"
          >
            Maybe Later
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="h-12 bg-[#570df8] hover:bg-[#4b0de0] text-white font-bold text-sm shadow-lg shadow-[#570df8]/25 transition-colors rounded-sm"
          >
            Unlock Brain Pro
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MAIN REPORT
// ============================================

export default function Report({ user }) {
  const [downloadState, setDownloadState] = useState("idle");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const analytics = useGameAnalytics(user.user);

  const isPro = user.user?.is_pro_user;

  useEffect(() => {
    if (analytics.loading) return;
  }, [analytics.loading]);

  const downloadPDF = async () => {
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }
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
      // console.error(error);
      setDownloadState("idle");
      alert("Failed to download PDF");
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

      {/* UPGRADE MODAL */}
      <AnimatePresence>
        {showUpgradeModal && (
          <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
