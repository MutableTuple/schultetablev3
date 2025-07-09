"use client";
import React, { useState } from "react";
import { FaFlagCheckered, FaAngleUp, FaAngleDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingMissionPill({ mission }) {
  const [open, setOpen] = useState(true);

  if (!mission) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex flex-col items-center gap-2">
        <AnimatePresence>
          {open && (
            <motion.div
              key="pill"
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-warning text-base-100 px-4 py-2 rounded-full shadow-xl max-w-md w-fit text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer hover:scale-[1.03] transition-all"
            >
              <FaFlagCheckered />
              <span className="line-clamp-1">{mission.mission_title}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Collapse Button */}
        <motion.button
          onClick={() => setOpen(!open)}
          whileTap={{ scale: 0.9 }}
          className="btn btn-xs btn-circle bg-base-300 hover:bg-base-200 border-base-300 shadow-md"
        >
          {open ? <FaAngleUp /> : <FaAngleDown />}
        </motion.button>
      </div>
    </div>
  );
}
