import { memo } from "react";
import { Heart, Info, Smile, Target, Activity, Eye, Lock } from "lucide-react";

function getLevel(value) {
  if (value >= 80)
    return { label: "Excellent", text: "text-success", bar: "bg-success" };
  if (value >= 60)
    return { label: "Good", text: "text-success", bar: "bg-success/70" };
  if (value >= 40)
    return {
      label: "Average",
      text: "text-muted-foreground",
      bar: "bg-muted-foreground",
    };
  if (value >= 20)
    return { label: "Moderate", text: "text-warning", bar: "bg-warning" };
  return { label: "Poor", text: "text-destructive", bar: "bg-destructive" };
}

function clamp(val, min = 0, max = 100) {
  return Math.min(max, Math.max(min, val));
}

const METRIC_META = [
  {
    key: "mentalFatigue",
    label: "Mental Fatigue",
    icon: <Smile className="w-5 h-5" />,
  },
  { key: "focus", label: "Focus", icon: <Target className="w-5 h-5" /> },
  {
    key: "consistency",
    label: "Consistency",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    key: "visual",
    label: "Visual Processing",
    icon: <Eye className="w-5 h-5" />,
  },
];

function BrainHealthCard({ data, isPro = false }) {
  const values = isPro
    ? {
        mentalFatigue: clamp(50 + data.fatigue_score),
        focus: clamp(50 + data.overall_trend_score * 2),
        consistency: clamp(data.stability_score),
        visual: clamp(data.percentile),
      }
    : null;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 w-full">
      <div className="flex items-center gap-2 mb-5">
        <Heart className="w-5 h-5 text-destructive fill-destructive" />
        <h2 className="text-base font-semibold text-foreground">
          Brain Health
        </h2>
        <Info className="w-4 h-4 text-muted-foreground ml-0.5 cursor-pointer hover:text-foreground transition-colors" />
      </div>

      <ul className="space-y-4">
        {METRIC_META.map(({ key, label, icon }) => {
          const value = values?.[key];
          const level = isPro ? getLevel(value) : null;

          return (
            <li key={key} className="flex items-center gap-3">
              <span className="text-muted-foreground flex-shrink-0 w-5">
                {icon}
              </span>

              <div className="flex-1 min-w-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                <div className="mt-1.5 h-2 w-full bg-muted rounded-full overflow-hidden relative">
                  {isPro ? (
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${level.bar}`}
                      style={{ width: `${value}%` }}
                      role="progressbar"
                      aria-valuenow={Math.round(value)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={label}
                    />
                  ) : (
                    // hatched placeholder texture — not a percentage-width
                    // fill, so it can't be misread as "your score is X%"
                    <div
                      className="absolute inset-0 opacity-50"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, var(--muted-foreground) 0, var(--muted-foreground) 2px, transparent 2px, transparent 7px)",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>

              {isPro ? (
                <span
                  className={`text-sm font-medium flex-shrink-0 w-20 text-right ${level.text}`}
                >
                  {level.label}
                </span>
              ) : (
                <span className="text-xs font-semibold flex-shrink-0 w-20 flex items-center justify-end gap-1 text-primary">
                  <Lock className="w-3 h-3" />
                  Locked
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {isPro ? (
        data.insight && (
          <p className="mt-5 pt-4 border-t border-border text-xs text-muted-foreground leading-relaxed">
            {data.insight}
          </p>
        )
      ) : (
        <p className="mt-5 pt-4 border-t border-border text-xs text-muted-foreground leading-relaxed">
          Unlock Pro to see your full mental fatigue, focus, consistency, and
          visual processing breakdown.
        </p>
      )}
    </div>
  );
}

export default memo(BrainHealthCard);
