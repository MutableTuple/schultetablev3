"use client";
import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa6";

export default function GameTimer() {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - start);
    }, 50); // fast + smooth ms updates
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(elapsedMs / 60000);
  const secs = Math.floor((elapsedMs % 60000) / 1000);
  const ms = Math.floor((elapsedMs % 1000) / 10); // 2-digit ms

  return (
    <div
      className="
        flex items-center gap-2 
        px-4 py-2 
        bg-base-200 border border-base-300 
        rounded-md 
        text-base-content font-mono font-semibold
      "
    >
      <FaClock className="text-primary" size={16} />

      <div className="flex items-end gap-[2px]">
        <span className="text-sm">{String(mins).padStart(2, "0")}:</span>
        <span className="text-sm">{String(secs).padStart(2, "0")}:</span>
        <span className="text-xs opacity-80">
          {String(ms).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
