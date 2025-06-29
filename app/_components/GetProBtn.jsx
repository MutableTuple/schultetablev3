import Link from "next/link";
import React from "react";

export default function GetProBtn() {
  return (
    <Link href={"/get-pro"}>
      <button className="btn btn-neutral btn-md rounded-sm px-6 relative overflow-hidden hover:scale-105 transition-transform font-semibold tracking-wide w-full">
        {/* Coin Shine Effect */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(255, 255, 255, 0.5) 50%, rgba(255,255,255,0) 60%, rgba(255,255,255,0) 100%)",
            backgroundSize: "200% 200%",
            animation: "coinShine 3s ease-in-out infinite",
          }}
        />

        {/* Button content */}
        <span className="relative z-20 flex items-center gap-2">
          👑 Get Pro at<span className="text-warning">$12.99/lifetime</span>
        </span>

        <style jsx>{`
          @keyframes coinShine {
            0% {
              background-position: 200% 0;
            }
            50% {
              background-position: 0 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
      </button>
    </Link>
  );
}
