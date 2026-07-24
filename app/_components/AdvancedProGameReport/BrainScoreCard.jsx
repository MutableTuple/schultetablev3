import { memo } from "react";
import { Info, Lock } from "lucide-react";

function CircleGrade({ grade, percent, color = "var(--success)" }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center flex-shrink-0">
      <svg
        className="absolute inset-0 -rotate-90"
        width="100%"
        height="100%"
        viewBox="0 0 96 96"
      >
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="var(--background)"
          strokeOpacity={0.15}
          strokeWidth="7"
        />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center z-10">
        <p className="text-xl sm:text-2xl font-bold text-background leading-none">
          {grade}
        </p>
        <p className="text-[10px] text-background/60 mt-0.5">Grade</p>
      </div>
    </div>
  );
}

// Locked-state ring: dashed track, no arc, lock icon instead of a grade
// letter. Deliberately can't be read as "your grade is X" or "your score is
// 0%" under any circumstance — a solid arc at any percentage, even 0, still
// looks like real (if bad) data.
function LockedRing() {
  const r = 42;
  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center flex-shrink-0">
      <svg width="100%" height="100%" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="var(--background)"
          strokeOpacity={0.2}
          strokeWidth="7"
          strokeDasharray="3 6"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Lock className="w-5 h-5 text-background/40" />
      </div>
    </div>
  );
}

function BrainSVG() {
  return (
    <div className="relative w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0">
      <div className="absolute inset-0 rounded-full bg-primary/15 blur-xl" />
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(249,115,22,0.45)]"
      >
        <defs>
          <radialGradient id="brain-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fdba74" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
          </radialGradient>
        </defs>
        <g
          fill="none"
          stroke="url(#brain-glow)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M50 20 C35 20 24 30 24 42 C24 48 27 53 32 57 C30 60 29 64 31 68 C33 73 38 75 43 74 C45 77 48 79 50 79 C52 79 55 77 57 74 C62 75 67 73 69 68 C71 64 70 60 68 57 C73 53 76 48 76 42 C76 30 65 20 50 20 Z" />
          <path d="M50 20 C50 28 46 34 42 38" />
          <path d="M50 20 C50 28 54 34 58 38" />
          <path d="M32 57 C38 54 44 55 50 53 C56 55 62 54 68 57" />
          <path d="M43 74 C44 68 46 62 50 58 C54 62 56 68 57 74" />
          <path d="M24 42 C28 40 33 41 37 44" />
          <path d="M76 42 C72 40 67 41 63 44" />
          <path d="M37 44 C40 50 42 56 43 62" />
          <path d="M63 44 C60 50 58 56 57 62" />
          <path d="M37 44 C42 46 48 46 50 47 C52 46 58 46 63 44" />
          <circle
            cx="20"
            cy="28"
            r="1"
            fill="var(--primary)"
            stroke="none"
            opacity="0.6"
          />
          <circle
            cx="80"
            cy="32"
            r="0.8"
            fill="var(--primary)"
            stroke="none"
            opacity="0.5"
          />
          <circle
            cx="15"
            cy="55"
            r="1"
            fill="var(--primary)"
            stroke="none"
            opacity="0.4"
          />
          <circle
            cx="85"
            cy="58"
            r="0.8"
            fill="var(--primary)"
            stroke="none"
            opacity="0.5"
          />
          <circle
            cx="50"
            cy="10"
            r="1"
            fill="var(--primary)"
            stroke="none"
            opacity="0.6"
          />
          <circle
            cx="30"
            cy="15"
            r="0.6"
            fill="var(--primary)"
            stroke="none"
            opacity="0.4"
          />
          <circle
            cx="72"
            cy="18"
            r="0.7"
            fill="var(--primary)"
            stroke="none"
            opacity="0.5"
          />
        </g>
      </svg>
    </div>
  );
}

function getGrade(score) {
  if (score >= 95) return { grade: "A+", color: "var(--success)", pct: 98 };
  if (score >= 90) return { grade: "A", color: "var(--success)", pct: 92 };
  if (score >= 85) return { grade: "A−", color: "var(--success)", pct: 87 };
  if (score >= 80) return { grade: "B+", color: "var(--success)", pct: 83 };
  if (score >= 75) return { grade: "B", color: "var(--primary)", pct: 77 };
  if (score >= 70) return { grade: "B−", color: "var(--primary)", pct: 72 };
  if (score >= 65) return { grade: "C+", color: "var(--warning)", pct: 67 };
  if (score >= 55) return { grade: "C", color: "var(--warning)", pct: 58 };
  return { grade: "D", color: "var(--destructive)", pct: 40 };
}

function BrainScoreCard({
  score = 84,
  changeText = "6.2% vs last week",
  changeUp = true,
  percentile = 72,
  isPro = false,
}) {
  const { grade, color, pct } = getGrade(score);
  const changeColors = changeUp
    ? "bg-success/15 border-success/25 text-success"
    : "bg-destructive/15 border-destructive/25 text-destructive";

  return (
    <div className="bg-foreground rounded-2xl px-4 py-4 sm:px-6 sm:py-5 flex items-center gap-3 sm:gap-6 w-full max-w-xl mx-auto shadow-xl border border-background/10">
      <BrainSVG />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs sm:text-sm text-background/80 font-medium">
            Overall Brain Score
          </span>
          <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-background/50 cursor-pointer flex-shrink-0" />
        </div>

        {isPro ? (
          <>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl sm:text-5xl font-bold text-background leading-none">
                {score}
              </span>
              <span className="text-base sm:text-lg text-background/50 font-medium">
                /100
              </span>
            </div>
            <div
              className={`inline-flex items-center gap-1 sm:gap-1.5 border text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full mb-2 sm:mb-3 ${changeColors}`}
            >
              <span>{changeUp ? "↑" : "↓"}</span>
              <span>{changeText}</span>
            </div>
            <p className="text-xs sm:text-sm text-background/65 leading-relaxed">
              Great work! You're performing{" "}
              <span className="font-bold text-background">
                better than {percentile}%
              </span>{" "}
              of players.
            </p>
          </>
        ) : (
          <>
            {/* "--" can never be mistaken for a real score, blurred or not */}
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-4xl sm:text-5xl font-bold text-background/25 leading-none select-none">
                --
              </span>
              <span className="text-base sm:text-lg text-background/25 font-medium">
                /100
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              Unlock Pro to reveal your score
            </div>
            <p className="text-xs sm:text-sm text-background/50 leading-relaxed">
              See your grade, percentile rank, and week-over-week trend.
            </p>
          </>
        )}
      </div>

      {isPro ? (
        <CircleGrade grade={grade} percent={pct} color={color} />
      ) : (
        <LockedRing />
      )}
    </div>
  );
}

export default memo(BrainScoreCard);
