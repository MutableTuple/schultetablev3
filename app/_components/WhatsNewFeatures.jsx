import React from "react";
import { MdRocketLaunch, MdCelebration, MdSpeed } from "react-icons/md";

const updates = [
  {
    date: "2025-07-06",
    title: "Confetti for Global Top 3",
    description:
      "Confetti now celebrates you when your time is among the top 3 fastest globally!",
    icon: <MdCelebration className="w-5 h-5" />,
  },
  {
    date: "2025-07-05",
    title: "Global Ranking",
    description:
      "After every game, see where you rank globally for your chosen grid & difficulty.",
    icon: <MdRocketLaunch className="w-5 h-5" />,
  },
  {
    date: "2025-07-04",
    title: "Mobile Optimization",
    description:
      "Confetti effects are now optimized for mobile speed and performance.",
    icon: <MdSpeed className="w-5 h-5" />,
  },
];

export default function WhatsNewFeatures() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="w-2 h-6 sm:h-8 bg-primary rounded-full"></div>
        <h2 className="text-xl sm:text-2xl font-bold">What's New</h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {updates.map((update, index) => (
          <div
            key={index}
            className="card bg-base-100 border border-base-300 hover:shadow-md transition-shadow duration-200"
          >
            <div className="card-body p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {update.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                    <h3 className="font-semibold text-sm sm:text-base text-base-content">
                      {update.title}
                    </h3>
                    <div className="badge badge-ghost badge-sm text-xs self-start sm:self-auto">
                      {update.date}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                    {update.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
