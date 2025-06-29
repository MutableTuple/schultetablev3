import React from "react";
import { motion } from "framer-motion";

export default function KeystrokeAnim({ clicks }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const keyVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      className="card bg-base-100  "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="card-body">
        <motion.div
          className="flex flex-wrap justify-center items-center gap-6 text-sm"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {clicks.map((click, index) => {
            const nextClick = clicks[index + 1];
            const timeDiff =
              nextClick?.timestamp && click?.timestamp
                ? new Date(nextClick.timestamp) - new Date(click.timestamp)
                : null;

            return (
              <React.Fragment key={index}>
                <motion.div
                  className="flex flex-col items-center"
                  variants={keyVariants}
                >
                  <motion.kbd
                    className={`kbd kbd-lg bg-primary text-primary-content shadow-lg hover:shadow-xl transition-shadow duration-200 ${
                      typeof click.expected === "string" &&
                      click.expected === "Space"
                        ? "px-8"
                        : ""
                    }`}
                    whileHover={{
                      scale: 1.05,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {typeof click.expected === "object"
                      ? click.expected.expr
                      : click.expected === "Space"
                        ? "Space"
                        : click.expected}
                  </motion.kbd>

                  {/* 
                  <span className="mt-2 text-xs text-base-content/60 font-medium">
                    Key {index + 1}
                  </span> */}
                </motion.div>

                {nextClick && (
                  <motion.div
                    className="flex items-center relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {/* Connection line */}
                    <motion.div
                      className="h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full relative"
                      style={{ width: "80px" }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        delay: 0.6 + index * 0.1,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                    >
                      {/* Timing badge on the line */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <motion.div
                          className="badge badge-secondary badge-sm font-bold px-2 py-1 shadow-sm"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.8 + index * 0.1,
                            type: "spring",
                            stiffness: 400,
                          }}
                        >
                          {timeDiff}ms
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </motion.div>

        {/* Stats section */}
        <motion.div
          className="divider mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        ></motion.div>

        <motion.div
          className="stats stats-horizontal shadow bg-base-200 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="stat">
            <div className="stat-title">Total Clicks</div>
            <div className="stat-value text-primary">{clicks.length}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Avg Time</div>
            <div className="stat-value text-secondary">
              {clicks.length > 1
                ? Math.round(
                    clicks.slice(1).reduce((acc, click, index) => {
                      const prevClick = clicks[index];
                      return (
                        acc +
                        (new Date(click.timestamp) -
                          new Date(prevClick.timestamp))
                      );
                    }, 0) /
                      (clicks.length - 1)
                  )
                : 0}
              <span className="text-sm">ms</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
