import Link from "next/link";
import React from "react";
import {
  FiTrendingUp,
  FiClock,
  FiBarChart2,
  FiLayers,
  FiAward,
  FiTarget,
} from "react-icons/fi";

export default function NotLoggedInRightDrawerNotif() {
  const features = [
    { icon: FiTrendingUp, text: "Track your progress" },
    { icon: FiClock, text: "View past performance" },
    { icon: FiTarget, text: "Unlock insights" },
    { icon: FiBarChart2, text: "Advanced data & analytics" },
    { icon: FiAward, text: "Compete on leaderboard" },
    { icon: FiLayers, text: "Personalized coaching tips" },
  ];

  return (
    <div className="w-full rounded-xl border border-base-200 bg-base-200/80 p-6 backdrop-blur-sm">
      <h2 className="text-lg font-semibold text-base-content mb-4">
        Sign in to unlock your stats
      </h2>

      <ul className="space-y-3 text-sm text-base-content/80">
        {features.map(({ icon: Icon, text }, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-primary" />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <Link href="/auth/login" className="block">
        <button className="btn btn-primary btn-sm w-full mt-5 shadow-sm hover:shadow-md transition-all">
          Sign In
        </button>
      </Link>

      <p className="text-[11px] opacity-60 mt-3 text-center">
        No account? It takes less than 10 seconds.
      </p>
    </div>
  );
}
