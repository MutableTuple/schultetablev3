// ─────────────────────────────────────────────
// Requirements:
//   npm install daisyui tailwindcss
//   tailwind.config.js → plugins: [require("daisyui")]
//   daisyui: { themes: ["night"] }
// ─────────────────────────────────────────────

import Link from "next/link";

const leftBenefits = [
  {
    icon: "🧠",
    color: "success",
    title: "See if your memory is getting sharper",
    sub: "Track recall patterns across every session — week by week",
  },
  {
    icon: "⚠️",
    color: "warning",
    title: "Discover what's quietly draining your focus",
    sub: "Most users have one hidden pattern — the report pinpoints it",
  },
  {
    icon: "🏆",
    color: "info",
    title: "Find out where you rank globally",
    sub: "Compare your processing speed against thousands of players",
  },
  {
    icon: "📈",
    color: "primary",
    title: "See your 30-day cognitive trajectory",
    sub: "Are you improving, plateauing, or slipping? The data knows.",
  },
];

const lockedItems = [
  {
    icon: "🧩",
    title: "Your cognitive bottleneck is...",
    sub: "This is affecting your daily life more than you think",
  },
  {
    icon: "💡",
    title: "One 5-min drill that would...",
    sub: "Designed specifically for your pattern",
  },
  {
    icon: "🔮",
    title: "In 30 days you could be...",
    sub: "Based on your current trajectory",
  },
];

const reportStats = [
  { label: "Global Score", value: "???" },
  { label: "Current Streak", value: "???" },
  { label: "Reaction", value: "???" },
];

// Tiny SVG line chart for the report card
function LineChart() {
  return (
    <svg
      viewBox="0 0 200 50"
      style={{ width: "100%", height: 44, marginTop: 6 }}
    >
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6c2ef2" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6c2ef2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,42 L28,38 L56,35 L84,28 L112,22 L140,14 L168,10 L200,4 L200,50 L0,50 Z"
        fill="url(#chartGrad)"
      />
      <path
        d="M0,42 L28,38 L56,35 L84,28 L112,22 L140,14 L168,10 L200,4"
        fill="none"
        stroke="#6c2ef2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="200" cy="4" r="3" fill="#6c2ef2" />
    </svg>
  );
}

export default function MonthlyReportCTAGuest() {
  return (
    <div
      data-theme="night"
      className="min-h-screen bg-base-100 relative overflow-hidden flex items-center justify-center py-16 px-4"
    >
      {/* bg glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row gap-14 items-center">
        {/* ══ LEFT ══ */}
        <div className="flex-1 flex flex-col gap-5 lg:max-w-[420px]">
          <div className="badge badge-outline badge-primary gap-2 py-3 px-4 text-xs font-bold uppercase tracking-widest w-fit">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
            May 2026 Report · Now Available
          </div>

          <div>
            <h1
              className="font-black leading-[1.02] tracking-tight text-base-content"
              style={{ fontSize: "clamp(36px, 5vw, 58px)" }}
            >
              Is your brain
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                actually getting
                <br />
                better?
              </span>
            </h1>
            <p className="text-base-content/50 text-sm leading-relaxed mt-3 max-w-sm">
              Play SchulteTable and get a full monthly breakdown of your memory,
              focus, and reaction speed — personalized to your sessions.
            </p>
          </div>

          {/* benefit list */}
          <div className="flex flex-col gap-3">
            {leftBenefits.map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl bg-${b.color}/10 border border-${b.color}/20 flex items-center justify-center flex-shrink-0`}
                >
                  {b.icon}
                </div>
                <div>
                  <div className="font-black text-sm text-base-content">
                    {b.title}
                  </div>
                  <div className="text-xs text-base-content/40 mt-0.5">
                    {b.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* signup nudge */}
          <div className="alert bg-primary/10 border border-primary/20">
            <span className="text-primary text-xl">✨</span>
            <div>
              <div className="font-black text-sm text-base-content">
                Sign up free to unlock your personal report
              </div>
              <div className="text-xs text-base-content/40">
                Create an account, play a few rounds, and see exactly how your
                brain performs.
              </div>
            </div>
          </div>

          {/* price */}
          <div className="flex items-end gap-3">
            <span className="text-lg text-base-content/30 line-through font-bold leading-none">
              $19.99
            </span>
            <span
              className="font-black text-base-content leading-none"
              style={{ fontSize: 52, letterSpacing: "-0.05em" }}
            >
              $4.99
            </span>
            <div className="mb-1 flex flex-col gap-1">
              <span className="badge badge-primary badge-sm font-bold uppercase tracking-wide">
                Lifetime
              </span>
              <span className="text-xs text-base-content/30">
                one-time · no sub
              </span>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link href={"/register"}>
              <button
                className="btn btn-primary btn-lg font-black shadow-lg hover:-translate-y-1 transition-transform"
                style={{ boxShadow: "0 8px 32px oklch(var(--p)/0.3)" }}
              >
                Get My Brain Report →
              </button>
            </Link>
            <button className="btn btn-ghost btn-lg text-base-content/40">
              See a Sample
            </button>
          </div>

          <p className="text-xs text-base-content/25">
            🔒 Free to start · Full report for $4.99 · One-time payment
          </p>
        </div>

        {/* ══ RIGHT: WHITE PAPER REPORT ══ */}
        <div
          className="w-full flex-shrink-0"
          style={{ perspective: 1400, maxWidth: 380 }}
        >
          <div
            className="relative transition-transform duration-300 cursor-pointer"
            style={{ transform: "rotate(4deg) rotateX(5deg)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform =
                "rotate(1.5deg) rotateX(2deg) translateY(-10px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "rotate(4deg) rotateX(5deg)")
            }
          >
            {/* stacked paper shadows */}
            <div
              className="absolute inset-0"
              style={{
                background: "#c0c0c0",
                transform: "translate(7px,9px)",
                borderRadius: 16,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "#d8d8d8",
                transform: "translate(3px,4px)",
                borderRadius: 16,
              }}
            />

            {/* WHITE PAPER */}
            <div
              className="relative overflow-hidden"
              style={{
                background: "#ffffff",
                borderRadius: 16,
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* purple left stripe */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{
                  background: "linear-gradient(180deg,#6c2ef2,#a855f7)",
                }}
              />

              {/* ── header ── */}
              <div
                className="flex items-start justify-between px-5 pt-4 pb-3"
                style={{ borderBottom: "1px solid #f0f0f0" }}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={
                      "https://hflzumrbjzkzofgzeyao.supabase.co/storage/v1/object/public/media//Logo.png"
                    }
                    className="w-8"
                    alt="SchulteTable Logo"
                  />
                  <div>
                    <div
                      className="font-black text-xs"
                      style={{ color: "#111" }}
                    >
                      SchulteTable
                    </div>
                    <div style={{ fontSize: 9, color: "#999" }}>
                      Cognitive Performance Analytics
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    style={{
                      fontSize: 9,
                      color: "#bbb",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontWeight: 700,
                    }}
                  >
                    Monthly Report
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#111" }}>
                    May 2026
                  </div>
                </div>
              </div>

              {/* ── headline + focus score ── */}
              <div
                className="px-5 pt-4 pb-3"
                style={{ borderBottom: "1px solid #f0f0f0" }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: "#6c2ef2",
                    fontWeight: 900,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Personalized Analytics
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2
                      style={{
                        fontSize: 26,
                        fontWeight: 900,
                        color: "#111",
                        lineHeight: 1.05,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      Brain
                      <br />
                      Report
                    </h2>
                    <p
                      style={{
                        fontSize: 10,
                        color: "#888",
                        lineHeight: 1.5,
                        marginTop: 6,
                        maxWidth: 160,
                      }}
                    >
                      A detailed overview of your cognitive performance, focus
                      consistency, reaction speed, and visual scanning ability.
                    </p>
                  </div>
                  {/* focus score card — blurred for guest */}
                  <div
                    className="rounded-2xl p-3 text-right relative overflow-hidden"
                    style={{
                      background: "#f8f6ff",
                      border: "1px solid #ede8ff",
                      minWidth: 90,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        color: "#6c2ef2",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      Focus Score
                    </div>
                    {/* blurred placeholder score */}
                    <div
                      style={{
                        fontSize: 42,
                        fontWeight: 900,
                        color: "#111",
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                        marginTop: 2,
                        filter: "blur(6px)",
                        userSelect: "none",
                      }}
                    >
                      91
                    </div>
                    <div style={{ marginTop: 6, filter: "blur(3px)" }}>
                      <div
                        style={{
                          height: 4,
                          background: "#e5e5e5",
                          borderRadius: 99,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: "75%",
                            background:
                              "linear-gradient(90deg,#6c2ef2,#a855f7)",
                            borderRadius: 99,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 3,
                        }}
                      >
                        <span style={{ fontSize: 8, color: "#bbb" }}>Avg</span>
                        <span style={{ fontSize: 8, color: "#bbb" }}>
                          Elite
                        </span>
                      </div>
                    </div>
                    {/* lock badge overlay */}
                    <div
                      className="rounded-full mt-2 flex items-center justify-center"
                      style={{ background: "#e0d4ff", padding: "3px 8px" }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          color: "#6c2ef2",
                          fontWeight: 700,
                        }}
                      >
                        🔒 Sign in
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── anonymous user row ── */}
              <div
                className="px-5 py-3 flex items-center gap-3"
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  background: "#fafafa",
                }}
              >
                {/* generic avatar */}
                <div
                  className="rounded-full w-9 h-9 flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#aaa,#ccc)",
                  }}
                >
                  ?
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#111" }}>
                    Your Report
                  </div>
                  <div style={{ fontSize: 10, color: "#bbb" }}>
                    Sign up to claim it
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#aaa",
                    fontWeight: 800,
                    background: "#f5f5f5",
                    padding: "3px 8px",
                    borderRadius: 999,
                    border: "1px solid #e5e5e5",
                    whiteSpace: "nowrap",
                  }}
                >
                  🔒 Rank hidden
                </div>
              </div>

              {/* ── teaser verdict + blurred line chart ── */}
              <div
                className="px-5 py-3"
                style={{ borderBottom: "1px solid #f0f0f0" }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    color: "#111",
                    lineHeight: 1.3,
                  }}
                >
                  Players who track their progress
                  <br />
                  <span style={{ color: "#6c2ef2" }}>
                    improve 2× faster on average.
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 10,
                    color: "#888",
                    marginTop: 4,
                    lineHeight: 1.5,
                  }}
                >
                  Your report would show visual scanning speed, focus
                  consistency trends, and your cognitive trajectory over time.
                </p>
                {/* blurred chart as teaser */}
                <div style={{ filter: "blur(2px)", opacity: 0.5 }}>
                  <LineChart />
                </div>
              </div>

              {/* ── stats row — blurred ── */}
              <div
                className="grid grid-cols-3 gap-2 px-5 py-3"
                style={{ borderBottom: "1px solid #f0f0f0" }}
              >
                {reportStats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl p-2.5"
                    style={{
                      background: "#f8f8f8",
                      border: "1px solid #efefef",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 8,
                        color: "#bbb",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 900,
                        color: "#ccc",
                        letterSpacing: "-0.03em",
                        marginTop: 2,
                        filter: "blur(4px)",
                        userSelect: "none",
                      }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── LOCKED section ── */}
              <div className="relative">
                <div
                  className="px-5 py-4 select-none pointer-events-none"
                  style={{ filter: "blur(4px)" }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: "#6c2ef2",
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    What's Holding You Back
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 7 }}
                  >
                    {lockedItems.map((item) => (
                      <div
                        key={item.title}
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                          background: "#f8f8f8",
                          borderRadius: 10,
                          padding: "9px 11px",
                          border: "1px solid #efefef",
                        }}
                      >
                        <span style={{ fontSize: 13 }}>{item.icon}</span>
                        <div>
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 800,
                              color: "#111",
                            }}
                          >
                            {item.title}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: "#999",
                              marginTop: 2,
                            }}
                          >
                            {item.sub}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* lock overlay — signup focused */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    backdropFilter: "blur(5px)",
                    WebkitBackdropFilter: "blur(5px)",
                  }}
                >
                  <div
                    className="rounded-2xl text-center px-6 py-5"
                    style={{
                      background: "rgba(255,255,255,0.95)",
                      border: "1px solid #e8e0ff",
                      boxShadow: "0 8px 32px rgba(108,46,242,0.15)",
                    }}
                  >
                    <div style={{ fontSize: 26, marginBottom: 6 }}>🔒</div>
                    <div
                      style={{ fontSize: 13, fontWeight: 900, color: "#111" }}
                    >
                      This report is about you
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#999",
                        marginTop: 3,
                        maxWidth: 160,
                        margin: "4px auto 0",
                      }}
                    >
                      Sign up free, play a few rounds, and unlock your
                      personalized cognitive report
                    </div>
                    <Link href="/register">
                      <button className="btn btn-primary btn-sm mt-3 w-full font-black">
                        Sign Up Free →
                      </button>
                    </Link>
                    <div style={{ fontSize: 10, color: "#bbb", marginTop: 6 }}>
                      Report · $4.99 one-time after signup
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
