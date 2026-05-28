"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const Y = "#FACC15"; // yellow-400
const YL = "#FDE68A"; // yellow-200
const YD = "#B45309"; // yellow-800

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function cn(...args) {
  return args.filter(Boolean).join(" ");
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ─────────────────────────────────────────
   SPARKLINE mini-chart (pure SVG)
───────────────────────────────────────── */
function Sparkline({ data, color = Y, height = 36, width = 100 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{ overflow: "visible" }}
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={pts.split(" ").at(-1).split(",")[0]}
        cy={pts.split(" ").at(-1).split(",")[1]}
        r="3"
        fill={color}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────
   ANIMATED RING (donut)
───────────────────────────────────────── */
function Ring({ pct = 72, size = 110, stroke = 9, color = Y }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
        transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────
   METRIC CARD
───────────────────────────────────────── */
function MetricCard({ title, value, sub, spark, ring, ringPct, delay = 0 }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ y: -6, boxShadow: `0 24px 60px rgba(250,204,21,0.12)` }}
      className="relative bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 flex flex-col gap-4 overflow-hidden group"
    >
      {/* corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-bl-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="text-zinc-400 text-xs uppercase tracking-widest font-semibold">
        {title}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-white text-4xl font-black leading-none tracking-tight">
            {value}
          </div>
          {sub && <div className="text-zinc-500 text-xs mt-2">{sub}</div>}
        </div>
        {spark && <Sparkline data={spark} />}
        {ring && (
          <div className="relative flex items-center justify-center shrink-0">
            <Ring pct={ringPct} />
            <span className="absolute text-yellow-300 text-sm font-black">
              {ringPct}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   HORIZONTAL BAR
───────────────────────────────────────── */
function HBar({ label, value, max = 100, color = Y, delay = 0 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span className="text-white font-semibold">{value}</span>
      </div>
      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   WEEKLY CALENDAR HEATMAP
───────────────────────────────────────── */
const HEAT = [
  [0, 1, 2, 3, 2, 1, 0],
  [1, 2, 3, 3, 3, 2, 1],
  [2, 3, 3, 2, 3, 3, 2],
  [0, 1, 2, 3, 3, 2, 1],
];
function Heatmap() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const alpha = [0.08, 0.3, 0.6, 1];
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-7 gap-1.5 mb-1">
        {days.map((d, i) => (
          <div key={i} className="text-center text-[10px] text-zinc-500">
            {d}
          </div>
        ))}
      </div>
      {HEAT.map((row, r) => (
        <div key={r} className="grid grid-cols-7 gap-1.5">
          {row.map((v, c) => (
            <motion.div
              key={c}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05 * (r * 7 + c), duration: 0.3 }}
              className="aspect-square rounded-md"
              style={{ background: `rgba(250,204,21,${alpha[v]})` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   COVER PAGE (inline, no external import)
───────────────────────────────────────── */
function CoverPage() {
  const skills = [
    { label: "Peripheral Vision", val: 88 },
    { label: "Saccade Accuracy", val: 91 },
    { label: "Inhibitory Control", val: 76 },
    { label: "Working Memory", val: 84 },
    { label: "Reaction Speed", val: 93 },
  ];

  return (
    <div className="bg-[#0e0e0e] min-h-screen font-sans text-white p-8 md:p-14 flex flex-col gap-14">
      {/* COVER HEADER */}
      <div className="flex flex-col md:flex-row gap-10 md:items-end justify-between">
        <div>
          <div className="text-yellow-400 uppercase text-xs tracking-[0.4em] font-bold mb-4">
            Monthly Report · May 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">
            Cognitive
            <br />
            <span className="text-yellow-400">Performance</span>
            <br />
            Report
          </h1>
          <p className="text-zinc-500 mt-6 max-w-md text-base leading-relaxed">
            A deep analysis of your neural-reaction patterns, focus consistency,
            and processing speed over the last 30 days.
          </p>
        </div>
        <div className="flex flex-col gap-3 min-w-[160px]">
          {[
            ["Sessions", "142"],
            ["Avg Time", "7m 32s"],
            ["Top Speed", "381ms"],
          ].map(([k, v]) => (
            <div key={k} className="border-l-2 border-yellow-400/50 pl-4">
              <div className="text-zinc-500 text-xs uppercase tracking-wider">
                {k}
              </div>
              <div className="text-white text-2xl font-black">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skills */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8 flex flex-col gap-6">
          <div className="text-zinc-400 text-xs uppercase tracking-widest">
            Cognitive Skills Breakdown
          </div>
          <div className="flex flex-col gap-4">
            {skills.map(({ label, val }, i) => (
              <HBar key={label} label={label} value={val} delay={i * 0.1} />
            ))}
          </div>
        </div>
        {/* Heatmap */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8 flex flex-col gap-6">
          <div className="text-zinc-400 text-xs uppercase tracking-widest">
            4-Week Activity Heatmap
          </div>
          <Heatmap />
          <div className="flex gap-3 text-xs text-zinc-500 items-center mt-2">
            {["None", "Low", "Medium", "High"].map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{
                    background: `rgba(250,204,21,${[0.08, 0.3, 0.6, 1][i]})`,
                  }}
                />
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SUMMARY QUOTE */}
      <div className="border border-yellow-400/20 bg-yellow-400/[0.04] rounded-3xl p-8 md:p-10">
        <div className="text-yellow-400/60 text-5xl font-black leading-none mb-4">
          "
        </div>
        <p className="text-zinc-300 text-lg md:text-xl font-medium leading-relaxed max-w-3xl">
          Your visual scanning efficiency improved by{" "}
          <span className="text-yellow-300 font-bold">18.4%</span> this month.
          Reaction speed is in the{" "}
          <span className="text-yellow-300 font-bold">top 8%</span> globally.
          Continue your daily training streak to maintain peak cognitive
          performance.
        </p>
        <div className="text-zinc-600 text-sm mt-6 uppercase tracking-widest">
          — AI Cognitive Coach · May 2026
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   TOP BUTTON
───────────────────────────────────────── */
function TopButton({ icon, text, yellow, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all duration-200",
        yellow
          ? "bg-yellow-400 text-black border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.3)]"
          : "bg-white/5 text-white border-white/10 hover:bg-white/10",
      )}
    >
      <span className="text-base">{icon}</span>
      {text}
    </motion.button>
  );
}

/* ─────────────────────────────────────────
   ICON STUBS (no react-icons dependency)
───────────────────────────────────────── */
const IconDownload = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconShare = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const IconPrint = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);
const IconLayers = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

/* ─────────────────────────────────────────
   BOTTOM CARD
───────────────────────────────────────── */
function BottomCard({ title, description, icon, delay = 0 }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ y: -6 }}
      className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] rounded-3xl p-8 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="text-3xl mb-5">{icon}</div>
      <div className="text-white text-xl font-black mb-3">{title}</div>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   TICKER (live metrics banner)
───────────────────────────────────────── */
const TICKER_ITEMS = [
  "🧠 Focus Score · 91.4",
  "⚡ Reaction · 427ms",
  "🔥 Streak · 18 Days",
  "🌍 Global Rank · Top 12%",
  "📈 +18.4% vs Last Month",
  "✅ 142 Sessions Complete",
];
function Ticker() {
  return (
    <div className="overflow-hidden border-y border-white/[0.06] py-3 bg-white/[0.02] relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0d0d0d] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0d0d0d] to-transparent z-10" />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex gap-10 whitespace-nowrap w-max"
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
          <span key={i} className="text-zinc-400 text-sm font-medium">
            {t}
            <span className="mx-10 text-yellow-400/30">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN REPORT PAGE
───────────────────────────────────────── */
export default function Report() {
  const [activeTab, setActiveTab] = useState("overview");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div
      className="min-h-screen w-full bg-[#0a0a0a] text-white overflow-x-hidden"
      style={{ fontFamily: "'Syne', 'Clash Display', system-ui, sans-serif" }}
    >
      {/* FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #facc15; border-radius: 2px; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ── BACKGROUND ────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(250,204,21,0.09),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(250,204,21,0.06),transparent)]" />
        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* noise */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />
      </div>

      {/* ── HEADER ────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/[0.07] bg-black/50"
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-11 h-11 rounded-xl bg-yellow-400 text-black flex items-center justify-center text-xl font-black shadow-[0_0_30px_rgba(250,204,21,0.4)]"
            >
              S
            </motion.div>
            <div>
              <div className="text-white font-black text-lg leading-tight tracking-tight">
                SchulteTable
              </div>
              <div className="text-zinc-500 text-xs">Analytics Platform</div>
            </div>
          </div>

          {/* Nav tabs — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-1">
            {["overview", "sessions", "insights", "trends"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200",
                  activeTab === tab
                    ? "bg-yellow-400 text-black"
                    : "text-zinc-400 hover:text-white",
                )}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <TopButton icon={<IconLayers />} text="Overview" />
            <TopButton icon={<IconDownload />} text="PDF" />
            <TopButton icon={<IconPrint />} text="Print" />
            <TopButton icon={<IconShare />} text="Share" yellow />
          </div>
        </div>
      </motion.header>

      {/* ── TICKER ─────────────────────────────── */}
      <div className="relative z-10">
        <Ticker />
      </div>

      {/* ── HERO ──────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative z-10 min-h-[90vh] flex items-center"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-[1600px] mx-auto px-4 md:px-8 py-20 w-full"
        >
          <div className="flex flex-col xl:flex-row gap-16 items-center">
            {/* LEFT */}
            <div className="flex-1">
              <motion.div
                {...fadeUp(0.1)}
                className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                AI Cognitive Analytics · Live
              </motion.div>

              <motion.h2
                {...fadeUp(0.2)}
                className="text-6xl sm:text-7xl md:text-8xl xl:text-9xl font-black leading-[0.88] tracking-tighter"
              >
                Your
                <br />
                <span className="relative inline-block">
                  <span className="text-yellow-400">Brain</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="absolute bottom-1 left-0 right-0 h-1 bg-yellow-400/40 origin-left"
                  />
                </span>
                <br />
                Report
              </motion.h2>

              <motion.p
                {...fadeUp(0.35)}
                className="text-zinc-400 text-lg mt-8 max-w-xl leading-relaxed"
              >
                Advanced neural-performance insights powered by visual-scanning
                analysis, cognitive reaction tracking, focus stability metrics,
                and monthly behavioral intelligence.
              </motion.p>

              <motion.div
                {...fadeUp(0.45)}
                className="flex flex-wrap gap-4 mt-10"
              >
                <motion.button
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 0 50px rgba(250,204,21,0.4)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-yellow-400 text-black px-8 py-4 rounded-2xl text-sm font-black tracking-wide uppercase"
                >
                  View Full Report →
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="border border-white/10 text-white px-8 py-4 rounded-2xl text-sm font-semibold tracking-wide uppercase hover:bg-white/5 transition-colors"
                >
                  Download PDF
                </motion.button>
              </motion.div>
            </div>

            {/* RIGHT — stat grid */}
            <motion.div
              {...fadeUp(0.3)}
              className="grid grid-cols-2 gap-4 w-full xl:w-auto xl:min-w-[440px]"
            >
              {[
                {
                  title: "Global Rank",
                  value: "Top 12%",
                  sub: "↑ 3 pts from April",
                  spark: [55, 60, 58, 70, 72, 75, 80, 78, 85, 91],
                },
                {
                  title: "Focus Score",
                  value: "91.4",
                  sub: "↑ 8.2 vs last month",
                  ring: true,
                  ringPct: 91,
                },
                {
                  title: "Avg Reaction",
                  value: "427ms",
                  sub: "↓ 31ms faster",
                  spark: [510, 490, 480, 460, 455, 440, 430, 427, 427, 427],
                },
                {
                  title: "Daily Streak",
                  value: "18 Days",
                  sub: "Personal best!",
                  ring: true,
                  ringPct: 72,
                },
              ].map((m, i) => (
                <MetricCard key={m.title} {...m} delay={0.1 * i} />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── REPORT PREVIEW ────────────────────── */}
      <section className="relative z-10 px-3 md:px-6 pb-20">
        <div className="max-w-[1600px] mx-auto">
          <motion.div
            {...fadeUp(0.1)}
            className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="text-yellow-400 text-xs uppercase tracking-[0.3em] font-semibold mb-2">
                Report Preview
              </div>
              <h3 className="text-white text-3xl md:text-4xl font-black">
                Monthly Brain Report — May 2026
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="relative">
            {/* glow */}
            <div className="absolute -inset-6 bg-yellow-400/[0.06] blur-[80px] rounded-full pointer-events-none" />

            {/* PDF frame */}
            <div className="relative bg-[#0e0e0e] rounded-3xl md:rounded-[40px] overflow-hidden border border-white/[0.07] shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
              {/* top chrome bar */}
              <div className="bg-[#141414] border-b border-white/[0.06] px-6 py-3 flex items-center gap-2">
                <div className="flex gap-1.5 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 bg-white/[0.04] rounded-lg px-4 py-1.5 text-zinc-600 text-xs text-center font-mono">
                  schultetable.app/report/may-2026
                </div>
              </div>
              <CoverPage />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BOTTOM CARDS ─────────────────────── */}
      <section className="relative z-10 px-4 md:px-8 pb-24">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <BottomCard
            icon="⚙️"
            title="Fully Automated"
            description="Reports generated dynamically using player analytics and behavioral performance data in real-time."
            delay={0.1}
          />
          <BottomCard
            icon="📄"
            title="PDF Ready"
            description="Optimized for Puppeteer export with pixel-perfect layout rendering and fully responsive sections."
            delay={0.2}
          />
          <BottomCard
            icon="🤖"
            title="AI Insights"
            description="Personalized monthly summaries generated using cognitive trend analysis and session history."
            delay={0.3}
          />
        </div>

        {/* Footer line */}
        <motion.div
          {...fadeUp(0.4)}
          className="mt-16 border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600"
        >
          <span className="font-semibold tracking-widest uppercase">
            SchulteTable Analytics · 2026
          </span>
          <span>Built with precision · Powered by AI</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            All systems operational
          </span>
        </motion.div>
      </section>
    </div>
  );
}
