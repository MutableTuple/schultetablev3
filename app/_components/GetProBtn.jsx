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
          <div className="mb-2">
            <h3 className="text-lg font-bold text-base-content leading-tight">
              Your brain gets slower every day & you don&apos;t track it.
            </h3>

            <p className="text-xs text-base-content/70 mt-1">
              See whether your focus & reaction speed are improving or quietly
              declining.
            </p>
          </div>

          <p className="text-[10px] text-center text-base-content/50 mt-2">
            Join 1,200+ players who upgraded their brain performance this week.
          </p>
          <button className="btn btn-primary w-full btn-sm font-bold group-hover:btn-secondary transition-all mt-2">
            See my brain report &rarr;
          </button>
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
