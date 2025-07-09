"use client";
import { toast } from "react-hot-toast";
import { MdOutlineClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { GiBattleGear } from "react-icons/gi";
import Link from "next/link";

export default function showProgressToast({
  avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80",
  title = "Mission Progress",
  subtitle = "",
  count = 0,
  goal = 100,
}) {
  const progress = Math.min((count / goal) * 100, 100);

  toast.custom((t) => (
    <Link href="/missions">
      <AnimatePresence>
        {t.visible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-[90vw] max-w-xs bg-white shadow-md rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5"
          >
            <div className="p-2 px-3 flex gap-2 items-start">
              {/* Icon */}
              <div className="pt-0.5">
                <GiBattleGear size={18} className="text-gray-700" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-900">{title}</p>
                {subtitle && (
                  <p className="text-[11px] text-gray-600 mt-0.5">{subtitle}</p>
                )}

                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-1.5 bg-indigo-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {count} / {goal} → {Math.floor(progress)}% complete
                  </p>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-gray-400 hover:text-gray-600 mt-0.5"
              >
                <MdOutlineClose className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  ));
}
