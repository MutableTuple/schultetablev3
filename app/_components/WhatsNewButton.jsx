"use client";
import React, { useState } from "react";
import { MdNewReleases } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsNewButton() {
  const [open, setOpen] = useState(false);

  const updates = [
    "🎉 Confetti now appears for global Top 3 times!",
    "📊 Your global rank is shown after each game!",
    "🧠 Improved speed tracking & accuracy calculation!",
    "⚡ Mobile confetti is now optimized for performance!",
  ];

  return (
    <div className="fixed bottom-24 left-4 z-40">
      {/* Tooltip */}
      <div className="tooltip tooltip-right" data-tip="What's New">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="btn btn-error btn-circle btn-sm shadow-md hover:scale-105 transition-all"
        >
          <MdNewReleases size={20} />
        </button>
      </div>

      {/* Slide-in panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 bg-base-100 shadow-xl rounded-xl p-3 w-72 text-sm border border-primary"
          >
            <div className="font-bold mb-2 text-primary">What's New</div>
            <ul className="list-disc list-inside space-y-1">
              {updates.map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
