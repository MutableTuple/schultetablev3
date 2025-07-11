"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCrown,
  FaGamepad,
  FaStopwatch,
  FaChartLine,
  FaCog,
  FaAd,
  FaTrophy,
  FaHeadset,
  FaZap,
  FaGem,
  FaRocket,
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";

export default function ShinyGoProButton({ isProUser }) {
  const [isHovered, setIsHovered] = useState(false);

  if (isProUser) return null;

  const features = [
    {
      icon: <FaGamepad className="text-blue-400" />,
      text: "Access to all game modes",
    },
    {
      icon: <FaStopwatch className="text-green-400" />,
      text: "Track response time between each click",
    },
    {
      icon: <FaChartLine className="text-purple-400" />,
      text: "Advanced statistics & performance tracking",
    },
    {
      icon: <FaCog className="text-orange-400" />,
      text: "Customizable difficulty presets",
    },
    {
      icon: <FaAd className="text-red-400" />,
      text: "Ad-free uninterrupted gameplay",
    },
    {
      icon: <FaTrophy className="text-yellow-400" />,
      text: "Exclusive Pro-only leaderboard",
    },
    { icon: <FaHeadset className="text-pink-400" />, text: "Priority support" },
  ];
  const handleClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "click_get_pro_button", {
        event_category: "engagement",
        event_label: "Shiny Get Pro Button",
        value: 1,
      });
    }
  };

  return (
    <div className="fixed top-56 left-4 z-50">
      <div className="relative">
        {/* Main Circular Button */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.3,
          }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="relative"
        >
          <Link href="/get-pro" passHref>
            <motion.button
              onClick={handleClick}
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.9 }}
              className="btn btn-sm btn-circle relative overflow-hidden
                bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500
                hover:from-yellow-300 hover:via-orange-400 hover:to-red-400
                border-2 border-yellow-300 hover:border-yellow-200
                shadow-xl hover:shadow-2xl
                transition-all duration-300 ease-out
                flex items-center justify-center group"
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  repeatDelay: 1,
                }}
              />

              {/* Pulsing glow */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(255, 193, 7, 0.5)",
                    "0 0 25px rgba(255, 193, 7, 0.8)",
                    "0 0 15px rgba(255, 193, 7, 0.5)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              {/* Button content */}
              <div className="relative z-10 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FaCrown className="text-lg text-yellow-100 drop-shadow-lg" />
                </motion.div>
              </div>
            </motion.button>
          </Link>
        </motion.div>

        {/* Premium Gaming Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute left-full top-1/2 mt-8 -translate-y-1/2 ml-6 z-50"
            >
              <div
                className="bg-base-100 border-2 border-warning/30 rounded-xl p-4 shadow-xl min-w-[280px]
                backdrop-blur-sm bg-opacity-95 relative overflow-hidden"
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 opacity-5"
                  animate={{
                    background: [
                      "linear-gradient(45deg, #fbbf24, #f59e0b)",
                      "linear-gradient(45deg, #f59e0b, #d97706)",
                      "linear-gradient(45deg, #fbbf24, #f59e0b)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Header */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-warning/30 relative z-10">
                  <div className="relative">
                    <FaGem className="text-xl text-warning" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-warning">
                      Schultetable PRO
                    </h3>
                    <p className="text-xs text-base-content/70">
                      Unlock features
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 relative z-10">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg 
                        hover:bg-warning/5 transition-all duration-200"
                    >
                      <div className="text-sm">{feature.icon}</div>
                      <span className="text-xs font-medium text-base-content/90 leading-tight">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 pt-3 border-t border-warning/30 text-center relative z-10"
                >
                  {/* Pricing */}
                  <div className="mb-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-base-content/60 line-through text-sm">
                        $12.99
                      </span>
                      <motion.span
                        className="text-warning font-bold text-xl"
                        animate={{
                          scale: [1, 1.1, 1],
                          textShadow: [
                            "0 0 0px rgba(251, 191, 36, 0)",
                            "0 0 8px rgba(251, 191, 36, 0.5)",
                            "0 0 0px rgba(251, 191, 36, 0)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        $3.99
                      </motion.span>
                    </div>
                    <p className="text-xs text-green-500 font-semibold">
                      Save 69%!
                    </p>
                  </div>

                  {/* Limited Time Offer */}
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xs font-bold text-red-500 flex items-center justify-center gap-1"
                  >
                    <IoSparkles className="text-sm" />
                    Offer valid only for a limited time!
                    <IoSparkles className="text-sm" />
                  </motion.div>
                </motion.div>

                {/* Tooltip Arrow */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2">
                  <div
                    className="w-4 h-4 bg-base-100 border-l-2 border-b-2 border-warning/30 
                    rotate-45 transform"
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orbiting particles effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-warning rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transformOrigin: "0 0",
              }}
              animate={{
                rotate: 360,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              transform={`translate(-50%, -50%) translateX(${25 + i * 3}px)`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
