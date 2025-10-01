import React from "react";
import AccuracyStat from "./AccuracyStat";
import TimeTakenStat from "./TimeTakenStat";
import ReactionTimeStat from "./ReactionTimeStat";
import AccuracySpeedScatter from "./AccuracySpeedScatter";

export default function ProAnalyticsPage({ user }) {
  // Check if user is pro
  const isPro = user?.[0]?.is_pro_user;

  if (!isPro) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-base-200 rounded-xl p-8 gap-4 text-center">
        <div className="text-2xl font-semibold">Unlock Pro Analytics</div>
        <div className="text-gray-600">
          Upgrade to <strong>Pro</strong> to view your detailed stats including
          accuracy, reaction time, and speed.
        </div>
        <a href="/get-pro" className="btn btn-primary mt-4">
          Switch to Pro
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AccuracyStat user={user} />
      <div className="divider"></div>
      <TimeTakenStat user={user} />
      <div className="divider"></div>
      <ReactionTimeStat user={user} />
    </div>
  );
}
