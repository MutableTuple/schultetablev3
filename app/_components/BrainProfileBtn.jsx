import React from "react";
import { FaChartBar } from "react-icons/fa";
import Link from "next/link";

export default function BrainProfileBtn({
  isLoadingLastGame,
  lastGameId,
  user,
}) {
  const handleClick = () => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "brain_profile_click", {
        event_category: "engagement",
        event_label: "See how your brain reacted",
      });
    }
  };

  // Decide where to go on click
  const href = user?.[0]
    ? user[0].is_pro_user
      ? `/game-analytics/${lastGameId}`
      : `https://schultetable.lemonsqueezy.com/buy/a7ae0450-6c1d-4aa1-92c0-dfce4e3edf6e?checkout[custom][user_id]=${user[0].id}`
    : "/auth/login";

  return (
    <Link
      href={href}
      target="_blank"
      onClick={handleClick}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white
        bg-gradient-to-r from-blue-600 to-purple-600
        hover:from-blue-700 hover:to-purple-700
        rounded-lg shadow-md hover:shadow-lg
        transition-all duration-200
        overflow-hidden
        relative
      `}
    >
      <FaChartBar className="mr-2" />
      See how your brain reacted!
      {user?.[0] && !user[0].is_pro_user && (
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-amber-500 rounded">
          PRO
        </span>
      )}
    </Link>
  );
}
