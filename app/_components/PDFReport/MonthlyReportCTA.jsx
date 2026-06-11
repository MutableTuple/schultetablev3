// ─────────────────────────────────────────────
// Requirements:
//   npm install daisyui tailwindcss
//   tailwind.config.js → plugins: [require("daisyui")]
//   daisyui: { themes: ["night"] }
// ─────────────────────────────────────────────

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const leftBenefits = [
  {
    icon: "🧠",
    title: "See if your memory is getting sharper",
    sub: "Track recall patterns across every session — week by week",
  },
  {
    icon: "⚠️",
    title: "Discover what's quietly draining your focus",
    sub: "Most users have one hidden pattern — the report pinpoints it",
  },
  {
    icon: "🏆",
    title: "Find out where you rank globally",
    sub: "Compare your processing speed against thousands of players",
  },
  {
    icon: "📈",
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

// ─── Plans config ─────────────────────────────────────────────────────────────

const INDIA_PLANS = {
  lifetimePrice: "₹249",
  strikePrice: "₹999",
  lifetimeUrl:
    "https://schultetable.lemonsqueezy.com/buy/1d34e5e2-5140-4a77-b8ce-72f5615aea97",
};

const GLOBAL_PLANS = {
  lifetimePrice: "$4.99",
  strikePrice: "$19.99",
  lifetimeUrl:
    "https://schultetable.lemonsqueezy.com/buy/a7ae0450-6c1d-4aa1-92c0-dfce4e3edf6e",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isIndianUser(currentUser) {
  return currentUser?.nationality?.toLowerCase() === "india";
}

function buildCheckoutUrl(baseUrl, userId) {
  if (!userId) return baseUrl;
  return baseUrl.includes("?")
    ? `${baseUrl}&checkout[custom][user_id]=${userId}`
    : `${baseUrl}?checkout[custom][user_id]=${userId}`;
}

// ─── SVG chart ───────────────────────────────────────────────────────────────

function LineChart() {
  return (
    <svg
      viewBox="0 0 200 50"
      className="w-full"
      style={{ height: 44, marginTop: 6 }}
    >
      <defs>
        <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6c2ef2" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6c2ef2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,42 L28,38 L56,35 L84,28 L112,22 L140,14 L168,10 L200,4 L200,50 L0,50 Z"
        fill="url(#chartGrad2)"
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

// ─── Paper card inner ─────────────────────────────────────────────────────────

function ReportCardInner({ ctaHref, ctaLabel, plans }) {
  return (
    <>
      {/* purple left stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: "linear-gradient(180deg,#6c2ef2,#a855f7)" }}
      />

      {/* header */}
      <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <img
            src="https://hflzumrbjzkzofgzeyao.supabase.co/storage/v1/object/public/media//Logo.png"
            className="w-7 h-7 object-contain"
            alt="SchulteTable"
          />
          <div>
            <div className="font-black text-xs text-gray-900">SchulteTable</div>
            <div className="text-gray-400" style={{ fontSize: 9 }}>
              Cognitive Performance Analytics
            </div>
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-gray-400 font-bold uppercase tracking-widest"
            style={{ fontSize: 9 }}
          >
            Monthly Report
          </div>
          <div className="font-black text-gray-900 text-sm">May 2026</div>
        </div>
      </div>

      {/* hero */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-100">
        <div
          className="font-black uppercase tracking-widest mb-3"
          style={{ fontSize: 9, color: "#6c2ef2" }}
        >
          Personalized Analytics
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2
              className="font-black text-gray-900 leading-none tracking-tight"
              style={{ fontSize: 28, letterSpacing: "-0.03em" }}
            >
              Brain
              <br />
              Report
            </h2>
            <p
              className="text-gray-500 leading-relaxed mt-2"
              style={{ fontSize: 10 }}
            >
              A detailed overview of your cognitive performance, focus
              consistency, reaction speed, and visual scanning ability.
            </p>
          </div>

          {/* focus score blurred */}
          <div
            className="rounded-2xl p-3 text-right relative overflow-hidden flex-shrink-0"
            style={{
              background: "#f8f6ff",
              border: "1px solid #ede8ff",
              minWidth: 88,
            }}
          >
            <div
              className="font-bold uppercase tracking-wider"
              style={{ fontSize: 9, color: "#6c2ef2" }}
            >
              Focus Score
            </div>
            <div
              className="font-black text-gray-900 leading-none mt-1 select-none"
              style={{
                fontSize: 40,
                letterSpacing: "-0.04em",
                filter: "blur(7px)",
              }}
            >
              91
            </div>
            <div className="mt-2" style={{ filter: "blur(3px)" }}>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "75%",
                    background: "linear-gradient(90deg,#6c2ef2,#a855f7)",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-400" style={{ fontSize: 8 }}>
                  Avg
                </span>
                <span className="text-gray-400" style={{ fontSize: 8 }}>
                  Elite
                </span>
              </div>
            </div>
            <div
              className="rounded-full mt-2 flex items-center justify-center"
              style={{ background: "#e0d4ff", padding: "3px 8px" }}
            >
              <span
                className="font-bold"
                style={{ fontSize: 9, color: "#6c2ef2" }}
              >
                🔒 Locked
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* user row */}
      <div
        className="px-5 py-3 flex items-center gap-3 border-b border-gray-100"
        style={{ background: "#fafafa" }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#aaa,#ccc)" }}
        >
          ?
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-gray-900 text-sm">Your Report</div>
          <div className="text-gray-400" style={{ fontSize: 10 }}>
            Unlock to claim it
          </div>
        </div>
        <div
          className="flex-shrink-0 font-extrabold rounded-full border border-gray-200"
          style={{
            fontSize: 9,
            color: "#aaa",
            background: "#f5f5f5",
            padding: "3px 8px",
            whiteSpace: "nowrap",
          }}
        >
          🔒 Rank hidden
        </div>
      </div>

      {/* trend teaser */}
      <div className="px-5 py-3 border-b border-gray-100">
        <div className="font-black text-gray-900 leading-snug text-sm">
          Players who track progress{" "}
          <span style={{ color: "#6c2ef2" }}>
            improve 2× faster on average.
          </span>
        </div>
        <p
          className="text-gray-500 mt-1 leading-relaxed"
          style={{ fontSize: 10 }}
        >
          Your report shows visual scanning speed, focus trends, and your
          cognitive trajectory.
        </p>
        <div style={{ filter: "blur(2px)", opacity: 0.5 }}>
          <LineChart />
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b border-gray-100">
        {reportStats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-2.5"
            style={{ background: "#f8f8f8", border: "1px solid #efefef" }}
          >
            <div
              className="font-bold text-gray-400 uppercase tracking-wider"
              style={{ fontSize: 8 }}
            >
              {s.label}
            </div>
            <div
              className="font-black text-gray-300 leading-none mt-1 select-none"
              style={{
                fontSize: 16,
                letterSpacing: "-0.03em",
                filter: "blur(4px)",
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* locked section */}
      <div className="relative">
        <div
          className="px-5 py-4 select-none pointer-events-none"
          style={{ filter: "blur(4px)" }}
        >
          <div
            className="font-black uppercase tracking-widest mb-2"
            style={{ fontSize: 9, color: "#6c2ef2" }}
          >
            What's Holding You Back
          </div>
          <div className="flex flex-col gap-2">
            {lockedItems.map((item) => (
              <div
                key={item.title}
                className="flex gap-2 items-start rounded-xl p-2.5"
                style={{ background: "#f8f8f8", border: "1px solid #efefef" }}
              >
                <span style={{ fontSize: 13 }}>{item.icon}</span>
                <div>
                  <div className="font-extrabold text-gray-900 text-xs">
                    {item.title}
                  </div>
                  <div
                    className="text-gray-500 mt-0.5"
                    style={{ fontSize: 10 }}
                  >
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* lock overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-b-2xl"
          style={{
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <div
            className="text-center px-6 py-5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.97)",
              border: "1px solid #e8e0ff",
              boxShadow: "0 8px 32px rgba(108,46,242,0.18)",
            }}
          >
            <div style={{ fontSize: 26 }}>🔒</div>
            <div className="font-black text-gray-900 text-sm mt-1">
              This report is about you
            </div>
            <p
              className="text-gray-500 mt-1 mx-auto"
              style={{ fontSize: 10, maxWidth: 160, lineHeight: 1.5 }}
            >
              Unlock your personalized cognitive report for a one-time payment
            </p>
            <div
              className="mt-2 font-black text-gray-900"
              style={{ fontSize: 18 }}
            >
              {plans.lifetimePrice}
            </div>
            <a
              href={ctaHref}
              target={ctaHref.startsWith("http") ? "_blank" : undefined}
            >
              <button className="btn btn-primary btn-sm mt-2 w-full font-black">
                {ctaLabel} →
              </button>
            </a>
            <div className="text-gray-400 mt-2" style={{ fontSize: 10 }}>
              One-time · no subscription
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Desktop tilted card wrapper ──────────────────────────────────────────────

function ReportCard({ ctaHref, ctaLabel, plans }) {
  return (
    <div className="w-full" style={{ perspective: 1400 }}>
      <div
        className="relative transition-all duration-300 cursor-pointer w-full"
        style={{ transform: "rotate(3deg) rotateX(4deg)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform =
            "rotate(1deg) rotateX(2deg) translateY(-8px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "rotate(3deg) rotateX(4deg)")
        }
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{ background: "#1a1a2e", transform: "translate(8px,10px)" }}
        />
        <div
          className="absolute inset-0 rounded-2xl"
          style={{ background: "#2d1b69", transform: "translate(4px,5px)" }}
        />
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: "#ffffff",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          }}
        >
          <ReportCardInner
            ctaHref={ctaHref}
            ctaLabel={ctaLabel}
            plans={plans}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function MonthlyReportCTA({ user }) {
  const currentUser = user.user;
  // user is the inner user object (user.user from the session shape)
  const isLoggedIn = Boolean(currentUser?.id);
  const userId = currentUser?.id;

  // India detection: nationality field first, then /api/region fallback for guests
  const [isIndia, setIsIndia] = useState(() => isIndianUser(currentUser));
  const [ready, setReady] = useState(isIndianUser(currentUser));

  useEffect(() => {
    if (isIndianUser(currentUser)) return; // already know
    let canceled = false;
    fetch("/api/region")
      .then((r) => r.json())
      .then((data) => {
        if (!canceled) {
          setIsIndia(Boolean(data.isIndia));
          setReady(true);
        }
      })
      .catch(() => {
        if (!canceled) setReady(true);
      });
    return () => (canceled = true);
  }, [currentUser]);

  const plans = isIndia ? INDIA_PLANS : GLOBAL_PLANS;

  // CTA destination
  const ctaHref = isLoggedIn
    ? buildCheckoutUrl(plans.lifetimeUrl, userId)
    : "/login";
  const ctaLabel = isLoggedIn
    ? `Unlock for ${plans.lifetimePrice}`
    : "Sign in to unlock";

  if (!ready) {
    return (
      <div
        className="min-h-screen bg-base-100 flex items-center justify-center"
        data-theme="night"
      >
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-base-content/40 text-sm">Loading your report…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-theme="night"
      className="min-h-screen bg-base-100 relative overflow-x-hidden flex items-center justify-center py-16 px-4 sm:px-6"
    >
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-60 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row gap-10 lg:gap-14 items-center lg:items-start">
        {/* ══ LEFT COPY ══ */}
        <div className="flex-1 flex flex-col gap-5 w-full lg:max-w-[440px]">
          {/* pill */}
          <div className="badge badge-outline badge-primary gap-2 py-3 px-4 text-xs font-bold uppercase tracking-widest w-fit">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
            May 2026 Report · Now Available
          </div>

          {/* headline */}
          <div>
            <h1
              className="font-black leading-[1.02] tracking-tight text-base-content"
              style={{ fontSize: "clamp(34px, 6vw, 58px)" }}
            >
              Is your brain
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                actually getting
                <br />
                better?
              </span>
            </h1>
            <p className="text-base-content/50 text-sm sm:text-base leading-relaxed mt-3 max-w-sm">
              Get a full monthly breakdown of your memory, focus, and reaction
              speed — personalized to your sessions.
            </p>
          </div>

          {/* benefits */}
          <div className="flex flex-col gap-3">
            {leftBenefits.map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-base-200 border border-base-300 flex items-center justify-center flex-shrink-0 text-base">
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

          {/* nudge alert — different copy for logged-in vs guest */}
          <div className="alert bg-primary/10 border border-primary/20 rounded-xl p-4">
            <span className="text-xl">{isLoggedIn ? "🎯" : "✨"}</span>
            <div>
              <div className="font-black text-sm text-base-content">
                {isLoggedIn
                  ? "Your report is ready — unlock it now"
                  : "Sign in to unlock your personal report"}
              </div>
              <div className="text-xs text-base-content/40 mt-0.5">
                {isLoggedIn
                  ? "One-time payment. Instant access. No subscription."
                  : "Create an account, play a few rounds, and see exactly how your brain performs."}
              </div>
            </div>
          </div>

          {/* price */}
          <div className="flex items-end gap-3">
            <span className="text-lg text-base-content/25 line-through font-bold leading-none pb-1">
              {plans.strikePrice}
            </span>
            <span
              className="font-black text-base-content leading-none"
              style={{
                fontSize: "clamp(40px, 8vw, 54px)",
                letterSpacing: "-0.05em",
              }}
            >
              {plans.lifetimePrice}
            </span>
            <div className="pb-1 flex flex-col gap-1">
              <span className="badge badge-primary badge-sm font-bold uppercase tracking-wide">
                Lifetime
              </span>
              <span className="text-xs text-base-content/30">
                one-time · no sub
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            <a
              href={ctaHref}
              target={ctaHref.startsWith("http") ? "_blank" : undefined}
              className="btn btn-primary btn-lg font-black shadow-lg hover:-translate-y-1 transition-transform"
              style={{ boxShadow: "0 8px 32px oklch(var(--p)/0.3)" }}
            >
              {ctaLabel} →
            </a>
          </div>

          <p className="text-xs text-base-content/25">
            {isLoggedIn
              ? `🔒 One-time · ${plans.lifetimePrice} · Instant access`
              : "🔒 Free to start · Full report for " +
                plans.lifetimePrice +
                " · One-time payment"}
          </p>
        </div>

        {/* ══ RIGHT PAPER CARD ══ */}
        <div className="w-full lg:w-auto lg:flex-shrink-0 lg:max-w-[380px]">
          {/* mobile: flat */}
          <div className="block lg:hidden w-full">
            <div
              className="relative overflow-hidden rounded-2xl w-full"
              style={{
                background: "#ffffff",
                boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
              }}
            >
              <ReportCardInner
                ctaHref={ctaHref}
                ctaLabel={ctaLabel}
                plans={plans}
              />
            </div>
          </div>

          {/* desktop: tilted */}
          <div className="hidden lg:block">
            <ReportCard ctaHref={ctaHref} ctaLabel={ctaLabel} plans={plans} />
          </div>
        </div>
      </div>
    </div>
  );
}
