"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { supabase } from "../_lib/supabase";

export default function GetProBtn() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    let timer;

    const fetchCampaign = async () => {
      const { data, error } = await supabase
        .from("ProCampaign")
        .select("ends_in")
        .order("created_at", { ascending: false }) // latest campaign
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching ProCampaign:", error);
        return;
      }

      const endTime = new Date(data.ends_in);

      timer = setInterval(() => {
        const now = new Date();
        const diff = endTime - now;

        if (diff <= 0) {
          clearInterval(timer);
          setTimeLeft("Expired — now $5.99");
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }, 1000);
    };

    fetchCampaign();

    return () => clearInterval(timer);
  }, []);

  return (
    <Link href={"/get-pro"}>
      <button className="btn btn-neutral btn-md rounded-sm px-6 py-7 relative overflow-hidden hover:scale-105 transition-transform font-semibold tracking-wide w-full leading-snug">
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
        <div className="relative z-20 flex flex-col items-center gap-1 text-xs text-center">
          <p className="flex items-center gap-1 text-sm">
            <span>👑 Get Pro at just</span>
            <span className="text-warning font-bold">$3.99/lifetime</span>
          </p>
          <p className="text-[11px] text-gray-400">
            ⏳ {timeLeft} left at this price, then{" "}
            <span className="font-semibold">$5.99</span>
          </p>
        </div>

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
