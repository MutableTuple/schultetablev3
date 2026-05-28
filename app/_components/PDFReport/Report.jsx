"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiBookOpen,
} from "react-icons/fi";

import CoverPage from "./CoverPage";
import FocusScore from "./FocusScore";
import RankCard from "./RankCard";
import PerformanceGraph from "./PerformanceGraph";
import Heatmap from "./Heatmap";
import StreakCard from "./StreakCard";
import ComparisonCard from "./ComparisonCard";

// ─── page list ───────────────────────────────────────────────────────────────

const PAGE_COMPONENTS = [
  { label: "Cover", Component: CoverPage },
  { label: "Focus Score", Component: FocusScore },
  { label: "Rank", Component: RankCard },
  { label: "Performance", Component: PerformanceGraph },
  { label: "Heatmap", Component: Heatmap },
  { label: "Streak", Component: StreakCard },
  { label: "Comparison", Component: ComparisonCard },
];

// ─── A4 aspect ratio helper ───────────────────────────────────────────────────
// The real page is 794×1123 px. We render it at whatever width fits,
// preserving ratio via a scaled inner div.

function A4Page({ children, style, className = "" }) {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ paddingBottom: "141.6%", ...style }} // 1123/794 ≈ 1.416
    >
      <div className="absolute inset-0 bg-white overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ─── shadow pages (stack depth effect) ───────────────────────────────────────

function ShadowPages({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const depth = count - i;
        return (
          <div
            key={i}
            className="absolute inset-0 bg-white border border-zinc-200"
            style={{
              transform: `translate(${depth * 3}px, ${depth * 3}px)`,
              zIndex: -depth,
              borderRadius: 2,
            }}
          />
        );
      })}
    </>
  );
}

// ─── Book (single-page flip) view ────────────────────────────────────────────

const FLIP_VARIANTS = {
  enter: (dir) => ({
    rotateY: dir > 0 ? 25 : -25,
    x: dir > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    rotateY: 0,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 30 },
  },
  exit: (dir) => ({
    rotateY: dir > 0 ? -25 : 25,
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.22 },
  }),
};

function BookView({ pages, currentPage, direction, onNext, onPrev }) {
  const { Component } = pages[currentPage];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* page stack wrapper */}
      <div
        className="relative w-full max-w-[640px] mx-auto"
        style={{ perspective: 1400 }}
      >
        {/* shadow stack */}
        <ShadowPages count={3} />

        {/* animated page */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={FLIP_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            className="relative w-full border border-zinc-200 shadow-xl"
            style={{
              transformOrigin: direction > 0 ? "left center" : "right center",
              borderRadius: 2,
            }}
          >
            <A4Page>
              <Component />
            </A4Page>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* nav controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={currentPage === 0}
          className="h-10 w-10 flex items-center justify-center border border-zinc-300 bg-white hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded"
        >
          <FiChevronLeft size={18} />
        </button>

        <span className="text-sm text-zinc-500 min-w-[90px] text-center">
          {currentPage + 1} / {pages.length}
        </span>

        <button
          onClick={onNext}
          disabled={currentPage === pages.length - 1}
          className="h-10 w-10 flex items-center justify-center border border-zinc-300 bg-white hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded"
        >
          <FiChevronRight size={18} />
        </button>
      </div>

      {/* dot strip */}
      <div className="flex gap-2">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              /* handled via onNext/onPrev flow */
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentPage
                ? "w-6 bg-[#570df8]"
                : "w-1.5 bg-zinc-300 hover:bg-zinc-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Grid (all pages) view ───────────────────────────────────────────────────

const GRID_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.07,
      type: "spring",
      stiffness: 260,
      damping: 28,
    },
  }),
};

function GridView({ pages, onSelectPage }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pages.map(({ label, Component }, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={GRID_ITEM_VARIANTS}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -4, scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectPage(i)}
          className="cursor-pointer group"
        >
          {/* stacked shadow */}
          <div className="relative">
            <ShadowPages count={2} />
            <div
              className="relative border border-zinc-200 shadow-md overflow-hidden transition-shadow group-hover:shadow-xl"
              style={{ borderRadius: 2 }}
            >
              <A4Page>
                {/* thumbnail – pointer-events off so clicks pass through */}
                <div
                  className="absolute inset-0 pointer-events-none scale-[0.28] origin-top-left"
                  style={{ width: "357%", height: "357%" }}
                >
                  <Component />
                </div>
              </A4Page>
            </div>
          </div>
          <p className="mt-2 text-xs text-zinc-500 font-medium text-center group-hover:text-zinc-800 transition-colors">
            {label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── main Report ─────────────────────────────────────────────────────────────

export default function Report() {
  const [view, setView] = useState("book");
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [downloading, setDownloading] = useState(false);

  const go = (delta) => {
    const next = currentPage + delta;
    if (next < 0 || next >= PAGE_COMPONENTS.length) return;
    setDirection(delta);
    setCurrentPage(next);
  };

  const selectPage = (index) => {
    setDirection(index > currentPage ? 1 : -1);
    setCurrentPage(index);
    setView("book");
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await fetch("/api/generate-report");
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "schultetable-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* ── DaisyUI download spinner modal ──────────────────────────── */}
      <AnimatePresence>
        {downloading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-4 min-w-[220px]"
            >
              {/* DaisyUI spinner */}
              <span className="loading loading-spinner loading-lg text-[#570df8]" />

              <div className="text-center">
                <p className="font-semibold text-zinc-900 text-base">
                  Building your PDF
                </p>
                <p className="text-zinc-400 text-sm mt-0.5">
                  This takes a few seconds…
                </p>
              </div>

              {/* animated progress bar */}
              <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#570df8] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 6, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── top nav ───────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-4 md:px-10 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
              SchulteTable Report
            </h1>
            <p className="text-zinc-500 mt-0.5 text-sm">
              Premium monthly cognitive analytics
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center border border-zinc-300 rounded overflow-hidden bg-white">
              <button
                onClick={() => setView("book")}
                className={`h-9 px-3 flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  view === "book"
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <FiBookOpen size={14} />
                <span className="hidden sm:inline">Book</span>
              </button>
              <button
                onClick={() => setView("grid")}
                className={`h-9 px-3 flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  view === "grid"
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <FiGrid size={14} />
                <span className="hidden sm:inline">All pages</span>
              </button>
            </div>

            <motion.button
              onClick={downloadPDF}
              disabled={downloading}
              whileTap={{ scale: 0.97 }}
              className="h-9 px-4 bg-[#570df8] hover:bg-[#4b0de0] disabled:opacity-60 text-white text-sm font-semibold flex items-center gap-2 transition-colors rounded"
            >
              <FiDownload size={14} />
              Download PDF
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── content (BookView / GridView — unchanged) ─────────────────── */}
      <div className="max-w-[1600px] mx-auto py-10 px-4 md:px-10">
        <AnimatePresence mode="wait">
          {view === "book" ? (
            <motion.div
              key="book"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <BookView
                pages={PAGE_COMPONENTS}
                currentPage={currentPage}
                direction={direction}
                onNext={() => go(1)}
                onPrev={() => go(-1)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <GridView pages={PAGE_COMPONENTS} onSelectPage={selectPage} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
