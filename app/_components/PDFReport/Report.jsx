"use client";

import React, { useState, useEffect } from "react";

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
// PAGE WRAPPER
// ============================================

const proUser = false;

proUser ? <yes></yes> : <MonthlyReportCTA />;

function ReportPage({ children }) {
  return (
    <div className="flex justify-center">
      <div
        className="
          pdf-page
          relative
          w-[794px]
          h-[1123px]
          bg-white
          overflow-hidden
          border
          border-zinc-200
          shadow-lg
        "
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
        p-6
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
          p-8
          shadow-2xl
          relative
          rounded-sm
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4
            text-zinc-400 hover:text-zinc-700
            transition-colors
            p-1
          "
        >
          <FiX size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#570df8] text-white flex items-center justify-center text-xl rounded-sm shadow-lg shadow-[#570df8]/30">
            <FiLock />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900">
              Unlock Brain Pro
            </h2>
            <p className="text-zinc-500 text-sm">
              Advanced Cognitive Analytics
            </p>
          </div>
        </div>

        {/* Banner */}
        <div className="mt-6 bg-[#570df8]/5 border border-[#570df8]/20 p-5 rounded-sm">
          <h3 className="text-lg font-black text-zinc-900 leading-snug">
            Your Brain Is Performing Better Than{" "}
            <span className="text-[#570df8]">89%</span> Of Players
          </h3>
          <p className="mt-2 text-zinc-500 text-sm leading-relaxed">
            Unlock the complete report and discover your strengths, weaknesses,
            trends and AI insights.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <Benefit icon={<FiZap />} text="AI Insights" />
          <Benefit icon={<FiTrendingUp />} text="Performance Trends" />
          <Benefit icon={<FiBarChart2 />} text="Heatmaps" />
          <Benefit icon={<FiTarget />} text="Global Rankings" />
        </div>

        {/* Price */}
        <div className="text-center mt-8">
          <div className="text-5xl font-black text-zinc-900">₹399</div>
          <div className="text-zinc-400 text-sm mt-1">
            per month · cancel anytime
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-7">
          <button
            onClick={onClose}
            className="
              h-12
              border border-zinc-200
              text-zinc-600
              font-semibold
              text-sm
              hover:bg-zinc-50
              transition-colors
              rounded-sm
            "
          >
            Maybe Later
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="
              h-12
              bg-[#570df8]
              hover:bg-[#4b0de0]
              text-white
              font-bold
              text-sm
              shadow-lg shadow-[#570df8]/25
              transition-colors
              rounded-sm
            "
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
  const [downloadState, setDownloadState] = useState("idle"); // "idle" | "generating" | "success"
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const analytics = useGameAnalytics(user.user);

  console.log("gdata", analytics.gameData);
  console.log("adata", analytics.stats);
  console.log("aloading", analytics.loading);

  console.log("user por?", user?.is_pro_user);
  // ✅ Set to true when subscription is active
  const isPro = user.user?.is_pro_user;
  useEffect(() => {
    if (analytics.loading) return;

    console.log("╔══════════════════════════════════════════╗");
    console.log("║       useGameAnalytics — full dump       ║");
    console.log("╚══════════════════════════════════════════╝");
    console.group("📊 rawStats");
    console.table(analytics.rawStats);
    console.groupEnd();
    console.group("🧠 brainMetrics");
    console.table(analytics.brainMetrics);
    console.groupEnd();
    console.group("⚡ speedMetrics");
    console.table(analytics.speedMetrics);
    console.groupEnd();
    console.group("🎯 focusMetrics");
    console.log(analytics.focusMetrics);
    console.groupEnd();
    console.group("😴 fatigueMetrics");
    console.table(analytics.fatigueMetrics);
    console.groupEnd();
    console.group("🏆 performanceMetrics");
    console.log(analytics.performanceMetrics);
    console.groupEnd();
    console.group("🎓 masteryMetrics");
    console.log(analytics.masteryMetrics);
    console.groupEnd();
    console.group("📈 trends");
    console.table(analytics.trends);
    console.groupEnd();
    console.group("🏅 rankings");
    console.table(analytics.rankings);
    console.groupEnd();
    console.group("🎖️ achievements");
    console.table(analytics.achievements);
    console.groupEnd();
    console.group("💡 insights");
    analytics.insights.forEach((s, i) => console.log(i + 1, s));
    console.groupEnd();
    console.log("🧬 mentalProfile:", analytics.mentalProfile);
    console.log("🎮 gameData rows:", analytics.gameData.length);
    console.log("Full object:", analytics);
  }, [analytics.loading]);
  // ============================================
  // DOWNLOAD PDF
  // ============================================

  const downloadPDF = async () => {
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      setDownloadState("generating");

      const response = await fetch("/api/generate-report");

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

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
      console.error(error);
      setDownloadState("idle");
      alert("Failed to download PDF");
    }
  };

  // ============================================
  // PRINT
  // ============================================

  const printReport = () => {
    window.print();
  };

  // ============================================
  // PAGES
  // ============================================

  const pages = [
    <CoverPage user={user} analytics={analytics} />,
    <FocusScore user={user} analytics={analytics} />,
    <RankCard user={user} analytics={analytics} />,
    <PerformanceGraph user={user} analytics={analytics} />,
    <Heatmap user={user} analytics={analytics} />,
    // <StreakCard user={user} analytics={analytics} />,
    <StreakInsightsPage user={user} analytics={analytics} />,
    <ComparisonCard user={user} analytics={analytics} />,
  ];
  if (!isPro) {
    return <MonthlyReportCTA />;
  }
  return (
    <div className="min-h-screen bg-zinc-100">
      {/* ===================================== */}
      {/* TOP NAV */}
      {/* ===================================== */}

      <div
        className="
          sticky top-0 z-50
          bg-white
          border-b border-zinc-200
          px-4 md:px-10
          py-4
          print:hidden
        "
      >
        <div
          className="
            max-w-[1600px] mx-auto
            flex flex-col lg:flex-row
            items-start lg:items-center
            justify-between gap-5
          "
        >
          {/* LEFT */}
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">
              SchulteTable Report
            </h1>
            <p className="text-zinc-500 mt-1 text-sm">
              Premium monthly cognitive analytics
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* DOWNLOAD — animated */}
            {/* <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadPDF}
              className="
                h-11 min-w-[200px] px-5
                bg-[#570df8] hover:bg-[#4b0de0]
                text-white font-semibold text-sm
                flex items-center justify-center gap-2
                transition-colors
                shadow-lg shadow-[#570df8]/20
                rounded-sm
              "
            >
              <AnimatePresence mode="wait">
                {downloadState === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2"
                  >
                    {!isPro && <FiLock size={13} className="opacity-70" />}
                    {isPro && <FiDownload size={14} />}
                    Download PDF
                  </motion.div>
                )}

                {downloadState === "generating" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2"
                  >
                    <FiLoader className="animate-spin" size={14} />
                    Generating Report...
                  </motion.div>
                )}

                {downloadState === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2"
                  >
                    <FiCheck size={14} />
                    Report Ready!
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button> */}

            {/* PRINT */}
            <button
              onClick={printReport}
              className="
                h-11 px-5
                border border-zinc-300
                bg-white hover:bg-zinc-50
                text-zinc-700 font-semibold text-sm
                flex items-center gap-2
                transition-colors
                rounded-sm
              "
            >
              <FiPrinter size={14} />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* ===================================== */}
      {/* REPORT PAGES */}
      {/* ===================================== */}

      <div className="max-w-[1600px] mx-auto py-10 px-4 md:px-8">
        <div className="flex flex-col items-center gap-10">
          {pages.map((page, index) => (
            <ReportPage key={index}>{page}</ReportPage>
          ))}
        </div>
      </div>

      {/* ===================================== */}
      {/* UPGRADE MODAL */}
      {/* ===================================== */}

      <AnimatePresence>
        {showUpgradeModal && (
          <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
