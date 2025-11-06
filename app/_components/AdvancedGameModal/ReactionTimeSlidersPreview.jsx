"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BsTriangleFill } from "react-icons/bs";
export default function ReactionTimeSlidersPreview() {
  // ✅ Only randomize **once** on component load
  const randomData = useMemo(() => {
    const rand = (min, max) => +(Math.random() * (max - min) + min).toFixed(3);

    const fastestMin = rand(0.15, 0.22);
    const fastestMax = rand(0.25, 0.35);
    const fastestVal = rand(fastestMin, fastestMax);
    const fastestPct = Math.floor(Math.random() * 30) - 10; // -10% to +20%

    const avgMin = rand(0.2, 0.35);
    const avgMax = rand(0.35, 0.6);
    const avgVal = rand(avgMin, avgMax);
    const avgPct = Math.floor(Math.random() * 20) - 10; // -10% to +10%

    const slowMin = rand(0.3, 0.55);
    const slowMax = rand(0.55, 0.9);
    const slowVal = rand(slowMin, slowMax);
    const slowPct = Math.floor(Math.random() * 30) - 15; // -15% to +15%

    return {
      fastest: {
        min: fastestMin,
        max: fastestMax,
        val: fastestVal,
        pct: fastestPct,
      },
      avg: { min: avgMin, max: avgMax, val: avgVal, pct: avgPct },
      slowest: { min: slowMin, max: slowMax, val: slowVal, pct: slowPct },
    };
  }, []);

  // Slider pos calculator
  const pos = (val, min, max) => ((val - min) / (max - min)) * 100;

  return (
    <div className="relative select-none">
      {/* ✅ Soft fade shadow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-base-200 via-base-200/70 to-transparent z-10 rounded-b-xl pointer-events-none"></div>

      <div className="space-y-6  bg-base-200 rounded-xl">
        {/* Title */}
        <p className="text-center text-sm font-semibold opacity-80">
          Reaction Time Details (Preview)
        </p>

        {/* -------------------- FASTEST -------------------- */}
        <PreviewCard
          title="Fastest Reaction compared to other players"
          color="success"
          data={randomData.fastest}
          pos={pos}
        />

        {/* -------------------- AVERAGE -------------------- */}
        <PreviewCard
          title="Average Reaction compared to other players"
          color="warning"
          data={randomData.avg}
          pos={pos}
        />

        {/* -------------------- SLOWEST -------------------- */}
        <PreviewCard
          title="Slowest Reaction compared to other players"
          color="error"
          data={randomData.slowest}
          pos={pos}
        />
      </div>

      {/* ✅ Login CTA */}
      <div className="z-20 relative text-center mt-4">
        <div className=" bg-base-100/70 border border-base-300  rounded-box mb-3 alert-primary">
          <div className="text-start p-3">
            <p className="text-sm">
              Your reaction time might be <b>faster or slower than average</b>.{" "}
              <span className="opacity-70">
                Login to see your real numbers.
              </span>
            </p>
          </div>
        </div>

        <Link href={"/login"}>
          <button className="btn sm:text-sm text-xs btn-secondary w-full rounded-box shadow-lg">
            Login to unlock Reaction Time Insights &rarr;
          </button>
        </Link>
      </div>
    </div>
  );
}

// ✅ Small subcomponent for clean code
function PreviewCard({ title, color, data, pos }) {
  return (
    <div className="card bg-base-100 p-4 rounded-xl">
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold sm:text-sm text-xs text-start">
          {title}
        </span>

        {/* ✅ blur the % */}
        <div className={`badge badge-${color} gap-1 blur-[2px]`}>
          {data.pct > 0 ? "+" : ""}
          {data.pct}%
        </div>
      </div>

      <div className="relative">
        {/* ✅ Blur min/max labels */}
        <div className="flex justify-between text-xs opacity-60 mb-2">
          <span className="badge badge-ghost badge-xs blur-[2px]">
            {data.min}s
          </span>
          <span className="badge badge-ghost badge-xs blur-[2px]">
            {data.max}s
          </span>
        </div>

        {/* Slider (not blurred, only dimmed) */}
        <input
          type="range"
          min="0"
          max="100"
          value={pos(data.val, data.min, data.max)}
          className={`range range-${color} pointer-events-none opacity-80`}
          readOnly
        />

        {/* ✅ Blur the actual value */}
        <div className="flex justify-center mt-2">
          <span className={`badge badge-${color} font-mono blur-[3px]`}>
            {data.val}s
          </span>
        </div>
      </div>
      {/* 
      <p className="text-xs mt-3 italic opacity-70">Preview only.</p> */}
    </div>
  );
}
