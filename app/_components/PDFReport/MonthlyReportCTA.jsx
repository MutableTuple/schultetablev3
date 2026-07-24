"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Brain,
  Target,
  Trophy,
  TrendingUp,
  Lock,
  Zap,
  Shield,
  Crown,
  Check,
  ArrowRight,
  Star,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// ─── Plans (business logic unchanged) ──────────────────────────────────────

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

function isIndianUser(currentUser) {
  return currentUser?.nationality?.toLowerCase() === "india";
}

function buildCheckoutUrl(baseUrl, userId) {
  if (!userId) return baseUrl;
  return baseUrl.includes("?")
    ? `${baseUrl}&checkout[custom][user_id]=${userId}`
    : `${baseUrl}?checkout[custom][user_id]=${userId}`;
}

// ─── Copy ──────────────────────────────────────────────────────────────────

const features = [
  {
    Icon: Brain,
    title: "Deep cognitive insights",
    sub: "Understand your strengths, patterns, and blind spots.",
  },
  {
    Icon: Target,
    title: "Track what matters",
    sub: "Monitor your focus, memory, speed, and consistency.",
  },
  {
    Icon: Trophy,
    title: "Benchmark globally",
    sub: "See how you rank among thousands of people choosing to train, not scroll.",
  },
  {
    Icon: TrendingUp,
    title: "30-day improvement roadmap",
    sub: "A personalized plan to help you get sharper every day.",
  },
];

const unlockChecklist = [
  "Detailed cognitive breakdown",
  "Global ranking & comparison",
  "30-day improvement roadmap",
  "Unlimited history & trends",
  "PDF report download",
];

// sample/illustrative report data for the preview card — a demo of what the
// report looks like, not a claim about the visitor's real data
const breakdownRings = [
  { label: "Great", value: 80, color: "var(--primary)" },
  { label: "Excellent", value: 85, color: "var(--success)" },
  { label: "Good", value: 78, color: "var(--warning)" },
  { label: "Excellent", value: 90, color: "var(--success)" },
];

const trendData = [
  { day: "May 1", v: 58 },
  { day: "May 5", v: 52 },
  { day: "May 8", v: 61 },
  { day: "May 12", v: 55 },
  { day: "May 15", v: 68 },
  { day: "May 18", v: 63 },
  { day: "May 22", v: 74 },
  { day: "May 26", v: 87 },
  { day: "May 29", v: 82 },
];

// ─── Ring gauge — reusable circular progress ───────────────────────────────

function RingGauge({ value, size = 64, stroke = 6, color, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children ?? (
          <span
            className="font-bold text-foreground"
            style={{ fontSize: size * 0.28 }}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Focus trend chart (Recharts) ──────────────────────────────────────────

function TrendDot({ cx, cy, payload }) {
  const isHighlight = payload.day === "May 26";
  if (!isHighlight) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="var(--primary)"
        stroke="var(--card)"
        strokeWidth={1.5}
      />
    );
  }
  return (
    <g>
      <rect
        x={cx - 32}
        y={cy - 44}
        width={64}
        height={32}
        rx={8}
        fill="var(--popover)"
        stroke="var(--border)"
      />
      <text
        x={cx}
        y={cy - 30}
        textAnchor="middle"
        fill="var(--muted-foreground)"
        fontSize={9}
      >
        {payload.day}
      </text>
      <text
        x={cx}
        y={cy - 17}
        textAnchor="middle"
        fill="var(--popover-foreground)"
        fontSize={12}
        fontWeight={700}
      >
        {payload.v}
      </text>
      <circle
        cx={cx}
        cy={cy}
        r={4.5}
        fill="var(--primary)"
        stroke="var(--card)"
        strokeWidth={1.5}
      />
    </g>
  );
}

function FocusTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={trendData}
        margin={{ top: 36, right: 8, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <Line
          type="monotone"
          dataKey="v"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={({ key, ...rest }) => <TrendDot key={key} {...rest} />}
          activeDot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────

export default function MonthlyReportCTA({ user }) {
  const currentUser = user.user;
  const isLoggedIn = Boolean(currentUser?.id);
  const userId = currentUser?.id;

  const [isIndia, setIsIndia] = useState(() => isIndianUser(currentUser));
  const [ready, setReady] = useState(isIndianUser(currentUser));

  useEffect(() => {
    if (isIndianUser(currentUser)) return;
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
  const ctaHref = isLoggedIn
    ? buildCheckoutUrl(plans.lifetimeUrl, userId)
    : "/auth/login";
  const ctaLabel = isLoggedIn
    ? `Unlock for ${plans.lifetimePrice}`
    : "Sign in to unlock";
  const isExternalCta = ctaHref.startsWith("http");

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading your report…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background px-4 py-16 sm:px-6 lg:py-24">
      {/* ambient glows — subtle enough to work in both themes */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[36rem] w-[36rem] rounded-full bg-primary opacity-[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[36rem] w-[36rem] rounded-full bg-success opacity-[0.08] blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-2 lg:items-center lg:gap-10">
        {/* ══ LEFT ══ */}
        <div className="flex flex-col gap-6">
          {/* pill */}
          <div className="flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <Sparkles size={12} />
            New: June 2026 Report
          </div>

          {/* headline */}
          <div>
            <h1
              className="font-black leading-[1.05] tracking-tight text-foreground"
              style={{ fontSize: "clamp(36px, 5.5vw, 58px)" }}
            >
              Your brain.
              <br />
              <span className="gold-text">Measured. Understood.</span>
              <br />
              <span className="gold-text">Improved.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              Get a comprehensive analysis of your memory, focus, reaction time,
              and more. Turn insights into progress — proof you're training your
              mind, not losing it to the scroll.
            </p>
          </div>

          {/* features */}
          <div className="flex flex-col gap-2.5">
            {features.map(({ Icon, title, sub }) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          {isExternalCta ? (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between gap-8 rounded-2xl px-6 py-4 text-base font-bold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:w-fit"
              style={{
                background: "linear-gradient(90deg, var(--primary), #ea580c)",
              }}
            >
              Unlock Your Full Brain Report
              <ArrowRight size={18} />
            </a>
          ) : (
            <Link
              href={ctaHref}
              className="flex w-full items-center justify-between gap-8 rounded-2xl px-6 py-4 text-base font-bold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:w-fit"
              style={{
                background: "linear-gradient(90deg, var(--primary), #ea580c)",
              }}
            >
              {ctaLabel}
              <ArrowRight size={18} />
            </Link>
          )}

          {/* trust row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Lock size={12} /> One-time payment
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={12} /> Instant access
            </span>
            <span className="flex items-center gap-1.5">
              <Shield size={12} /> Cancel anytime
            </span>
          </div>

          {/* social proof — placeholder shell, replace with real numbers before shipping */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex -space-x-2">
              {["A", "B", "C"].map((letter, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-bold text-muted-foreground"
                >
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className="fill-warning text-warning"
                  />
                ))}
              </div>
              {/* TODO: replace with a real, verified figure before shipping */}
              <p className="text-xs text-muted-foreground/70">
                Trusted by players worldwide
              </p>
            </div>
          </div>
        </div>

        {/* ══ RIGHT — report preview ══ */}
        <div className="relative mx-auto w-full max-w-md lg:mx-0">
          {/* main card */}
          <div
            className="relative overflow-hidden rounded-[28px] border border-border bg-card p-5 shadow-xl"
            style={{ transform: "rotate(-2deg)" }}
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <Image
                  src="https://hflzumrbjzkzofgzeyao.supabase.co/storage/v1/object/public/media//Logo.png"
                  alt="SchulteTable"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-lg"
                />
                <div>
                  <p className="text-sm font-bold text-foreground">
                    SchulteTable
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Cognitive Performance Analytics
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  Monthly Report
                </p>
                <p className="text-sm font-bold text-foreground">May 2026</p>
              </div>
            </div>

            {/* focus score */}
            <div className="flex items-center justify-between border-b border-border py-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  Your Overall Focus Score
                </p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-foreground">
                    82
                  </span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
                <p className="mt-1 text-xs font-bold text-success">Excellent</p>
                <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "82%",
                      background:
                        "linear-gradient(90deg, var(--primary), var(--success))",
                    }}
                  />
                </div>
              </div>
              <RingGauge value={82} size={76} stroke={7} color="var(--primary)">
                <Brain size={24} className="text-primary" />
              </RingGauge>
            </div>

            {/* breakdown */}
            <div className="border-b border-border py-4">
              <p className="mb-3 text-sm font-bold text-foreground">
                Cognitive Breakdown
              </p>
              <div className="flex justify-between">
                {breakdownRings.map((r, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <RingGauge
                      value={r.value}
                      size={52}
                      stroke={5}
                      color={r.color}
                    />
                    <span className="text-[9px] text-muted-foreground">
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* trend */}
            <div className="border-b border-border py-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-bold text-foreground">Focus Trend</p>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                  30 Days
                </span>
              </div>
              <div style={{ height: 140 }}>
                <FocusTrendChart />
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-between pt-4">
              <div>
                <p className="text-xs font-bold text-foreground">
                  Want the full story?
                </p>
                <p className="mt-0.5 max-w-[150px] text-[10px] leading-snug text-muted-foreground">
                  Get detailed analysis, rankings, and your 30-day plan.
                </p>
              </div>
              {isExternalCta ? (
                <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                  <span className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground">
                    <Lock size={11} /> Unlock Full Report
                  </span>
                </a>
              ) : (
                <Link href={ctaHref}>
                  <span className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground">
                    <Lock size={11} /> Unlock Full Report
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* floating pricing card */}
          <div
            className="relative mx-auto -mt-10 w-[88%] rounded-[24px] border border-border bg-card/95 p-6 text-center shadow-xl backdrop-blur-md lg:absolute lg:-bottom-10 lg:-right-8 lg:mx-0 lg:mt-0 lg:w-64"
            style={{ transform: "rotate(2deg)" }}
          >
            <div
              className="mx-auto flex h-11 w-11 items-center justify-center rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--warning))",
              }}
            >
              <Crown size={20} className="text-primary-foreground" />
            </div>
            <p className="mt-3 text-base font-black leading-snug text-foreground">
              Unlock Your Full Brain Report
            </p>
            <ul className="mt-4 space-y-2 text-left">
              {unlockChecklist.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <Check size={13} className="shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-3xl font-black text-foreground">
              {plans.lifetimePrice}
            </p>
            <p className="text-xs text-muted-foreground">One-time payment</p>
            {isExternalCta ? (
              <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                <span
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-primary-foreground"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--primary), #ea580c)",
                  }}
                >
                  Get Instant Access <ArrowRight size={14} />
                </span>
              </a>
            ) : (
              <Link href={ctaHref}>
                <span
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-primary-foreground"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--primary), #ea580c)",
                  }}
                >
                  {ctaLabel} <ArrowRight size={14} />
                </span>
              </Link>
            )}
            <p className="mt-2 text-[10px] text-muted-foreground">
              No subscription. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
