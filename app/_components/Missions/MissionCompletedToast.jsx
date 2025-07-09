"use client";

import { toast } from "react-hot-toast";
import { MdOutlineClose } from "react-icons/md";
import Confetti from "react-dom-confetti";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";

// Utility to check and save dismissed toasts
function hasDismissedToast(missionId) {
  if (!missionId) return false;
  const dismissed = JSON.parse(
    localStorage.getItem("mission_toasts_dismissed") || "[]"
  );
  return dismissed.includes(missionId);
}

function dismissToastForMission(missionId) {
  if (!missionId) return;
  const dismissed = JSON.parse(
    localStorage.getItem("mission_toasts_dismissed") || "[]"
  );
  if (!dismissed.includes(missionId)) {
    dismissed.push(missionId);
    localStorage.setItem("mission_toasts_dismissed", JSON.stringify(dismissed));
  }
}

export default function showMissionCompletedToast({
  missionId, // REQUIRED for uniqueness
  title = "Global Mission Completed!",
  subtitle = "",
}) {
  if (!missionId || hasDismissedToast(missionId)) return;

  toast.custom((t) => (
    <CompletedToast
      t={t}
      title={title}
      subtitle={subtitle}
      missionId={missionId}
    />
  ));
}

function CompletedToast({ t, title, subtitle, missionId }) {
  const confettiRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (t.visible) {
      setActive(true);
      setTimeout(() => setActive(false), 1000);
    }
  }, [t.visible]);

  const handleClose = () => {
    toast.dismiss(t.id);
    dismissToastForMission(missionId);
  };

  return (
    <AnimatePresence>
      {t.visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-[340px] bg-white shadow-md rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 relative overflow-hidden"
        >
          {/* Confetti */}
          <div
            ref={confettiRef}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50"
          >
            <Confetti
              active={active}
              config={{
                angle: 90,
                spread: 90,
                startVelocity: 45,
                elementCount: 100,
                dragFriction: 0.12,
                duration: 3000,
                stagger: 3,
                width: "8px",
                height: "8px",
                colors: ["#34D399", "#3B82F6", "#F472B6", "#FBBF24"],
              }}
            />
          </div>

          <div className="p-4 pr-3 flex items-start gap-3">
            <div className="text-2xl pt-0.5">🎉</div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
              )}
            </div>

            {/* Close */}
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 mt-0.5"
            >
              <MdOutlineClose className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
