import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa6";

export default function GameTimer() {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - start);
    }, 100); // updates every 100ms
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(elapsedMs / 60000);
  const secs = Math.floor((elapsedMs % 60000) / 1000);
  const ms = Math.floor((elapsedMs % 1000) / 10); // shows as 2-digit ms

  return (
    <div className="grid grid-flow-col items-center gap-2 auto-cols-max px-4 py-2 border border-base-300 bg-base-100 text-base-content text-xs font-semibold">
      <FaClock className="text-primary" size={20} />
      <div className="flex flex-col items-center">
        <span className="countdown font-mono text-sm">
          <span style={{ "--value": mins }}>{mins}</span>
        </span>
        <span className="text-[10px]">min</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="countdown font-mono text-sm">
          <span style={{ "--value": secs }}>{secs}</span>
        </span>
        <span className="text-[10px]">sec</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="countdown font-mono text-sm">
          <span style={{ "--value": ms }}>
            {ms.toString().padStart(2, "0")}
          </span>
        </span>
        <span className="text-[10px]">ms</span>
      </div>
    </div>
  );
}
