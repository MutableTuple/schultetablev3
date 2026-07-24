import { memo } from "react";
import { Trophy, CalendarDays, Info, Check, Lock } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Real weekly activity from intel.game_dates instead of a hardcoded pattern.
// Days with no matching data default to "not played" rather than faking engagement.
function computeWeeklyActivity(gameDates) {
  const dates = gameDates ?? []; // guards against explicit null, not just undefined
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const playedDays = new Set(
    dates.filter(Boolean).map((iso) => new Date(iso).toDateString()),
  );

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return playedDays.has(d.toDateString());
  });
}

function PersonalBestCard({
  fastestMs = 151,
  bestDate = "May 18, 2025",
  gameDates = [],
  isPro = false,
}) {
  const weeklyActivity = isPro ? computeWeeklyActivity(gameDates) : [];
  const completedCount = weeklyActivity.filter(Boolean).length;

  return (
    <div className="w-full bg-card rounded-2xl border border-border overflow-hidden">
      {/* ── Personal Best (Pro-gated — no real numbers shown when locked) ── */}
      <div className="px-5 pt-5 pb-6 relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-foreground" />
          <span className="text-sm font-semibold text-foreground">
            Personal Best
          </span>
          <Info className="w-3.5 h-3.5 text-muted-foreground cursor-pointer" />
        </div>

        {isPro ? (
          <>
            {/* Value row */}
            <div className="flex items-center gap-3 mb-1">
              <span className="text-5xl font-bold text-foreground tracking-tight">
                {fastestMs} ms
              </span>
              <span className="bg-success/15 text-success text-xs font-semibold px-2.5 py-1 rounded-full">
                Your Best
              </span>
            </div>

            {/* Sub-label */}
            <p className="text-sm text-muted-foreground">
              Fastest reaction ever
            </p>
            <p className="text-sm text-muted-foreground">{bestDate}</p>
          </>
        ) : (
          <>
            {/* "-- ms" can't be mistaken for a real time, unlike a blurred number */}
            <div className="flex items-center gap-3 mb-1">
              <span className="text-5xl font-bold text-foreground/25 tracking-tight select-none">
                -- ms
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              Unlock Pro to see your fastest reaction
            </div>
          </>
        )}

        {/* Medal — purely decorative, no real data embedded, stays visible
            either way. Kept literally gold, mimicking a physical trophy
            object, not a semantic status color. Orange accents tie to --primary. */}
        <div className="absolute right-4 top-4 select-none">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <span className="absolute top-0 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="absolute top-1 left-1 w-1 h-1 rounded-full bg-yellow-400" />
            <span className="absolute bottom-2 right-0 w-1 h-1 rounded-full bg-success" />
            <span className="absolute bottom-0 left-2 w-1.5 h-1.5 rounded-full bg-primary/70" />
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 flex items-center justify-center shadow-md">
              <Trophy className="w-6 h-6 text-yellow-800" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
              <div className="w-2.5 h-3 bg-primary rounded-b-sm" />
              <div className="w-2.5 h-3 bg-primary rounded-b-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* ── Weekly Activity (Pro-gated — needs game_dates, which the server
          withholds for free users) ── */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-foreground" />
          <span className="text-sm font-semibold text-foreground">
            Weekly Activity
          </span>
          <Info className="w-3.5 h-3.5 text-muted-foreground cursor-pointer" />
        </div>

        {isPro ? (
          <>
            <div className="grid grid-cols-7 gap-1 mb-3">
              {DAYS.map((day) => (
                <p
                  key={day}
                  className="text-center text-[11px] text-muted-foreground font-medium mb-1"
                >
                  {day}
                </p>
              ))}
              {weeklyActivity.map((done, i) => (
                <div key={i} className="flex justify-center">
                  {done ? (
                    <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                      <Check className="w-4 h-4 text-success-foreground stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-border bg-card" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedCount} of 7 days completed
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-center rounded-xl border border-dashed border-border bg-muted/40">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Unlock Pro to see your weekly activity
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(PersonalBestCard);
