"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function GetProBtn() {
  const [timeLeft, setTimeLeft] = useState("");
  const [isIndia, setIsIndia] = useState(null);

  // Detect Region
  useEffect(() => {
    let canceled = false;
    const detect = async () => {
      try {
        const res = await fetch("/api/region");
        const data = await res.json();
        if (!canceled) setIsIndia(Boolean(data.isIndia));
      } catch {
        if (!canceled) setIsIndia(false);
      }
    };
    detect();
    return () => (canceled = true);
  }, []);

  // Fetch campaign countdown
  useEffect(() => {
    let timer;

    const fetchCampaign = async () => {
      try {
        // Simulating supabase call for demo
        // const { data, error } = await supabase
        //   .from("ProCampaign")
        //   .select("ends_in")
        //   .order("created_at", { ascending: false })
        //   .limit(1)
        //   .single();

        // Demo: Set end time to 3 days from now
        const endTime = new Date();
        endTime.setDate(endTime.getDate() + 3);

        timer = setInterval(() => {
          const now = new Date();
          const diff = endTime - now;

          if (diff <= 0) {
            clearInterval(timer);
            setTimeLeft("Expired");
            return;
          }

          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);

          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      }
    };

    fetchCampaign();

    return () => clearInterval(timer);
  }, []);

  // Regional pricing
  const pricing = isIndia
    ? {
        price: "₹249",
        currency: "₹",
        flag: "🇮🇳",
      }
    : {
        price: "$4.99",
        currency: "$",
        flag: "🌍",
      };

  // Loading state
  if (isIndia === null) {
    return (
      <div className="btn btn-neutral btn-md rounded-lg px-6 py-7 w-full opacity-50">
        <span className="loading loading-spinner loading-sm"></span>
        Loading...
      </div>
    );
  }

  return (
    <Link href="/get-pro" className="block">
      <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-secondary to-accent p-[2px] hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl">
        {/* Animated gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-75 blur-sm group-hover:opacity-100 transition-opacity"></div>

        {/* Main content */}
        <div className="relative bg-base-100 rounded-xl p-4 h-full">
          {/* Top row: Badge + Timer */}
          <div className="flex items-center justify-between mb-3">
            <div className="badge badge-primary badge-sm gap-1 font-semibold">
              <span>{pricing.flag}</span>
              <span>LIMITED OFFER</span>
            </div>
            {timeLeft && (
              <div className="text-xs font-mono text-error font-bold">
                ⏱️ {timeLeft}
              </div>
            )}
          </div>

          {/* Main heading */}
          <div className="mb-2">
            <h3 className="text-lg font-bold text-base-content leading-tight">
              Get Pro Analytics
            </h3>
            <p className="text-xs text-base-content/60 mt-1">
              Unlock monthly brain reports & detailed insights
            </p>
          </div>

          {/* Price with shine effect */}
          <div className="relative inline-flex items-baseline gap-2 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine"></div>
              <span className="text-3xl font-black text-primary relative z-10">
                {pricing.price}
              </span>
            </div>
            <span className="text-sm text-base-content/70 font-medium">
              lifetime
            </span>
          </div>

          {/* CTA Button */}
          <button className="btn btn-primary w-full btn-sm font-bold group-hover:btn-secondary transition-all">
            Upgrade Now →
          </button>

          {/* Guarantee badge */}
          <div className="flex items-center justify-center gap-1 mt-3 text-xs text-base-content/50">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>One-time payment</span>
          </div>
        </div>

        <style jsx>{`
          @keyframes shine {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(200%);
            }
          }
          .animate-shine {
            animation: shine 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </Link>
  );
}
