"use client";
import React, { useEffect, useRef } from "react";

export default function PlayerOfTheWeekPage() {
  const bgRef = useRef(null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="h-96 w-full flex items-center justify-center relative overflow-hidden">
        {/* Simple grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Avatar */}
        <div className="relative z-10 avatar flex flex-col justify-center gap-6 text-center ">
          <div className="w-36 h-36 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 shadow-2xl">
            <img
              src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"
              alt="Player"
            />
          </div>
          <h3 className="text-2xl font-bold">Alan Walker</h3>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-6 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[
          { title: "Downloads", value: "31K", desc: "Jan 1 - Feb 1" },
          { title: "Users", value: "4,200", desc: "↗︎ 40 (2%)" },
          { title: "New Registers", value: "1,200", desc: "↘︎ 90 (14%)" },
          { title: "Matches Played", value: "542", desc: "🔥 Most active" },
          { title: "Win Rate", value: "78%", desc: "+5% this month" },
          { title: "Total Points", value: "93,450", desc: "🏅 Elite League" },
        ].map((stat) => (
          <div
            key={stat.title}
            className="stats shadow bg-base-100/80 backdrop-blur-lg rounded-2xl hover:scale-105 transition-transform duration-300"
          >
            <div className="stat place-items-center">
              <div className="stat-title">{stat.title}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-desc">{stat.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
