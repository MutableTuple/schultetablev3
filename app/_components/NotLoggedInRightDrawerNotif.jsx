import Link from "next/link";
import React from "react";
import {
  TrendingUp,
  Clock,
  BarChart2,
  Layers,
  Award,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotLoggedInRightDrawerNotif() {
  const features = [
    { icon: TrendingUp, text: "Track your progress" },
    { icon: Clock, text: "View past performance" },
    { icon: Target, text: "Unlock insights" },
    { icon: BarChart2, text: "Advanced data & analytics" },
    { icon: Award, text: "Compete on leaderboard" },
    { icon: Layers, text: "Personalized coaching tips" },
  ];

  return (
    <div className="w-full rounded-2xl border border-border bg-muted/60 p-6 backdrop-blur-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Sign in to unlock your stats
      </h2>

      <ul className="space-y-3 text-sm text-muted-foreground">
        {features.map(({ icon: Icon, text }, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-primary shrink-0" />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <Button
        render={<Link href="/auth/login" />}
        className="w-full h-auto mt-5 py-2 rounded-xl shadow-sm hover:shadow-md transition-all"
      >
        Sign In
      </Button>

      <p className="text-[11px] text-muted-foreground/70 mt-3 text-center">
        No account? It takes less than 10 seconds.
      </p>
    </div>
  );
}
