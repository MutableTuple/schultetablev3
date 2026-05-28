"use client";

import { useState, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import { useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

/* ─────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────── */
const FOCUS_HISTORY = [
  { day: "1", score: 72 },
  { day: "5", score: 76 },
  { day: "8", score: 74 },
  { day: "10", score: 81 },
  { day: "13", score: 83 },
  { day: "15", score: 87 },
  { day: "18", score: 85 },
  { day: "20", score: 89 },
  { day: "23", score: 90 },
  { day: "26", score: 93 },
  { day: "28", score: 91 },
  { day: "31", score: 91.4 },
];

const RADAR_DATA = [
  { subject: "Sustained", A: 88 },
  { subject: "Selective", A: 91 },
  { subject: "Divided", A: 78 },
  { subject: "Alternating", A: 85 },
  { subject: "Executive", A: 83 },
  { subject: "Vigilance", A: 90 },
];

const BREAKDOWN = [
  {
    label: "Sustained Focus",
    val: 88,
    desc: "Long-session depth",
    color: "#FACC15",
  },
  {
    label: "Selective Attention",
    val: 91,
    desc: "Noise filtering",
    color: "#34D399",
  },
  {
    label: "Divided Attention",
    val: 78,
    desc: "Multi-task load",
    color: "#60A5FA",
  },
  {
    label: "Alternating Focus",
    val: 85,
    desc: "Task switching",
    color: "#F472B6",
  },
  {
    label: "Executive Control",
    val: 83,
    desc: "Goal-directed",
    color: "#A78BFA",
  },
  {
    label: "Vigilance",
    val: 90,
    desc: "Sustained alertness",
    color: "#FB923C",
  },
];

const WEEKLY = [
  { day: "Mon", score: 88 },
  { day: "Tue", score: 85 },
  { day: "Wed", score: 92 },
  { day: "Thu", score: 89 },
  { day: "Fri", score: 91 },
  { day: "Sat", score: 94 },
  { day: "Sun", score: 91.4 },
];

const TABS = ["week", "month", "all time"];

/* ─────────────────────────────────────────────────────
   UTILS
───────────────────────────────────────────────────── */
const fadeUpView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ─────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────── */
function Counter({ to, decimals = 0, duration = 1.8, delay = 0 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      const c = animate(0, to, {
        duration,
        ease: "easeOut",
        onUpdate: (v) => setVal(parseFloat(v.toFixed(decimals))),
      });
      return () => c.stop();
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [inView]);
  return <span ref={ref}>{val}</span>;
}

/* ─────────────────────────────────────────────────────
   RING GAUGE
───────────────────────────────────────────────────── */
function GaugeRing({ score = 91.4, size = 240, strokeW = 16 }) {
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const grade = score >= 90 ? "S" : score >= 80 ? "A" : score >= 70 ? "B" : "C";
  const gradeColor =
    score >= 90 ? "#FACC15" : score >= 80 ? "#34D399" : "#60A5FA";

  return (
    <div
      ref={ref}
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      {/* spin orbit */}
      <div
        style={{
          position: "absolute",
          inset: -16,
          borderRadius: "50%",
          border: "1px dashed rgba(250,204,21,0.15)",
          animation: "fs-spin 14s linear infinite",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -5,
            left: "50%",
            marginLeft: -5,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#FACC15",
            boxShadow: "0 0 10px #FACC15",
          }}
        />
      </div>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)", display: "block" }}
      >
        <defs>
          <linearGradient id="fsGaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#FACC15" />
          </linearGradient>
        </defs>
        {/* tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = ((i / 60) * 360 * Math.PI) / 180;
          const cx = size / 2,
            cy = size / 2;
          const ri = r - strokeW / 2 - 3,
            ro = r + strokeW / 2 + 3;
          return (
            <line
              key={i}
              x1={cx + ri * Math.cos(angle)}
              y1={cy + ri * Math.sin(angle)}
              x2={cx + ro * Math.cos(angle)}
              y2={cy + ro * Math.sin(angle)}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          );
        })}
        {/* bg track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeW}
        />
        {/* glow trail */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(250,204,21,0.1)"
          strokeWidth={strokeW}
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ - circ * 0.95 }}
          animate={inView ? { strokeDashoffset: 0 } : {}}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
        {/* main arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#fsGaugeGrad)"
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={
            inView ? { strokeDashoffset: circ - circ * (score / 100) } : {}
          }
          transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" }}
        />
      </svg>

      {/* center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 52,
            color: "#fff",
            lineHeight: 1,
            fontFamily: "'Syne',sans-serif",
          }}
        >
          <Counter to={score} decimals={1} duration={2} delay={0.3} />
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#71717A",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          Focus Score
        </div>
        <div
          style={{
            marginTop: 8,
            borderRadius: 99,
            padding: "3px 12px",
            fontWeight: 700,
            fontSize: 12,
            color: gradeColor,
            background: `${gradeColor}18`,
            border: `1px solid ${gradeColor}40`,
          }}
        >
          Grade {grade}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   MINI BAR CARD
───────────────────────────────────────────────────── */
function MiniBar({ label, val, desc, color, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      {...fadeUpView(delay)}
      whileHover={{
        y: -3,
        borderColor: `${color}40`,
        boxShadow: `0 12px 32px ${color}12`,
      }}
      style={{
        padding: "16px 18px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "all 0.25s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              marginBottom: 2,
            }}
          >
            {label}
          </div>
          <div style={{ fontSize: 11, color: "#71717A" }}>{desc}</div>
        </div>
        <div style={{ fontWeight: 800, fontSize: 20, color, lineHeight: 1 }}>
          {val}
        </div>
      </div>
      <div
        style={{
          height: 4,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${val}%` } : {}}
          transition={{ duration: 1.1, delay: delay + 0.1, ease: "easeOut" }}
          style={{
            height: "100%",
            borderRadius: 99,
            background: `linear-gradient(90deg,${color}66,${color})`,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   STAT PILL
───────────────────────────────────────────────────── */
function StatPill({ label, value, sub, accent = "#FACC15", delay = 0 }) {
  return (
    <motion.div
      {...fadeUpView(delay)}
      whileHover={{ y: -4, boxShadow: `0 16px 40px ${accent}14` }}
      style={{
        padding: "20px 22px",
        borderRadius: 20,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "all 0.25s",
      }}
    >
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "#71717A",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontWeight: 800,
          fontSize: 32,
          color: accent,
          lineHeight: 1,
          fontFamily: "'Syne',sans-serif",
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: "#71717A", marginTop: 6 }}>
          {sub}
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   SCORE BADGE
───────────────────────────────────────────────────── */
function ScoreBadge({ label, value, icon, color = "#FACC15" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 14px",
        borderRadius: 12,
        background: `${color}10`,
        border: `1px solid ${color}22`,
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div>
        <div
          style={{
            fontSize: 9,
            color: "#71717A",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          {label}
        </div>
        <div style={{ fontWeight: 800, fontSize: 14, color, lineHeight: 1.3 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   WEEKLY BARS (custom SVG)
───────────────────────────────────────────────────── */
function WeekBars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div
      ref={ref}
      style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 128 }}
    >
      {WEEKLY.map(({ day, score }, i) => {
        const barH = (score / 100) * 100;
        const isToday = i === WEEKLY.length - 1;
        return (
          <div
            key={day}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              gap: 6,
            }}
          >
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={inView ? { height: barH, opacity: 1 } : {}}
              transition={{ duration: 0.75, delay: i * 0.07, ease: "easeOut" }}
              style={{
                width: "100%",
                borderRadius: "5px 5px 2px 2px",
                position: "relative",
                background: isToday
                  ? "linear-gradient(180deg,#FDE68A,#FACC15)"
                  : "rgba(255,255,255,0.08)",
                boxShadow: isToday ? "0 0 16px rgba(250,204,21,0.3)" : "none",
              }}
            >
              {isToday && (
                <div
                  style={{
                    position: "absolute",
                    top: -5,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#FACC15",
                    boxShadow: "0 0 8px #FACC15",
                  }}
                />
              )}
            </motion.div>
            <span
              style={{
                fontSize: 10,
                color: isToday ? "#FACC15" : "#71717A",
                fontWeight: isToday ? 700 : 400,
              }}
            >
              {day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   TOOLTIPS
───────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#141414",
        border: "1px solid rgba(250,204,21,0.25)",
        borderRadius: 12,
        padding: "9px 14px",
        fontSize: 12,
      }}
    >
      <div style={{ color: "#71717A", marginBottom: 3 }}>Day {label}</div>
      <div
        style={{
          fontWeight: 800,
          fontSize: 22,
          color: "#FACC15",
          fontFamily: "'Syne',sans-serif",
        }}
      >
        {payload[0].value}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   FOCUS SCORE COMPONENT
───────────────────────────────────────────────────── */
export default function FocusScore({ data = {} }) {
  const [activeTab, setActiveTab] = useState("month");

  const {
    score = 91.4,
    rank = "Top 12%",
    streak = 18,
    percentile = 89.2,
    bestScore = 95.0,
    consistency = 94,
    sessions = 247,
    avgSession = "7:32",
    reaction = 427,
    delta = 8.2,
  } = data;

  return (
    <div
      style={{
        background: "#0A0A0A",
        padding: "64px 40px",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      {/* inject keyframes once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fs-spin { to { transform: rotate(360deg); } }
        @keyframes fs-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
      `}</style>

      {/* ── SECTION LABEL ─────────────────────────── */}
      <motion.div
        {...fadeUpView(0)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 36,
            height: 3,
            background: "#FACC15",
            borderRadius: 99,
          }}
        />
        <span
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            color: "#71717A",
            fontWeight: 600,
          }}
        >
          Focus Score · May 2026
        </span>
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }}
        />

        {/* Tab filter */}
        <div
          style={{
            display: "flex",
            gap: 3,
            padding: 3,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
          }}
        >
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: "6px 14px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "'Syne',sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                background: activeTab === t ? "#FACC15" : "transparent",
                color: activeTab === t ? "#0A0A0A" : "#71717A",
                transition: "all 0.2s",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── HERO ROW: gauge + stats ───────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 48,
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        {/* Gauge + badges */}
        <motion.div
          {...fadeUpView(0.05)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <GaugeRing score={score} size={240} strokeW={15} />
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <ScoreBadge
              label="Global Rank"
              value={rank}
              icon="🌍"
              color="#FACC15"
            />
            <ScoreBadge
              label="Streak"
              value={`${streak}d`}
              icon="🔥"
              color="#FB923C"
            />
            <ScoreBadge
              label="Percentile"
              value={`${percentile}%`}
              icon="📊"
              color="#34D399"
            />
          </div>
        </motion.div>

        {/* Stats + headline */}
        <div>
          <motion.div {...fadeUpView(0.1)}>
            <h2
              style={{
                fontWeight: 800,
                fontSize: "clamp(32px,4vw,60px)",
                lineHeight: 0.92,
                color: "#fff",
                marginBottom: 16,
                letterSpacing: "-0.03em",
              }}
            >
              Your Focus
              <br />
              <span style={{ color: "#FACC15" }}>Score Report</span>
            </h2>
            <p
              style={{
                color: "#71717A",
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 480,
                marginBottom: 28,
              }}
            >
              Attentional systems tracked across {sessions} sessions —
              sustained, selective, divided & executive focus — benchmarked
              against 1.2M global players.
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
            }}
          >
            <StatPill
              label="This Month"
              value={score}
              sub={`↑ ${delta} vs April`}
              accent="#FACC15"
              delay={0.15}
            />
            <StatPill
              label="Best Score"
              value={bestScore}
              sub="Day 26, May"
              accent="#FDE68A"
              delay={0.2}
            />
            <StatPill
              label="Consistency"
              value={`${consistency}%`}
              sub="Highly stable"
              accent="#34D399"
              delay={0.25}
            />
            <StatPill
              label="Sessions"
              value={sessions}
              sub="This month"
              accent="#60A5FA"
              delay={0.3}
            />
            <StatPill
              label="Avg Session"
              value={avgSession}
              sub="Per day avg"
              accent="#F472B6"
              delay={0.35}
            />
            <StatPill
              label="Reaction"
              value={`${reaction}ms`}
              sub="↓ 31ms faster"
              accent="#A78BFA"
              delay={0.4}
            />
          </div>
        </div>
      </div>

      {/* ── CHARTS ROW ───────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Area chart */}
        <motion.div
          {...fadeUpView(0.1)}
          style={{
            padding: "24px 22px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: "#fff" }}>
                Monthly Trend
              </div>
              <div style={{ fontSize: 12, color: "#71717A", marginTop: 2 }}>
                Focus score over 31 days
              </div>
            </div>
            <div
              style={{
                background: "rgba(250,204,21,0.1)",
                border: "1px solid rgba(250,204,21,0.2)",
                borderRadius: 99,
                padding: "4px 12px",
                fontSize: 12,
                color: "#FDE68A",
                fontWeight: 600,
              }}
            >
              +{delta} pts
            </div>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={FOCUS_HISTORY}
                margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FACC15" stopOpacity={0.32} />
                    <stop
                      offset="100%"
                      stopColor="#FACC15"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="2 4"
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="day"
                  stroke="#3F3F46"
                  tick={{ fill: "#71717A", fontSize: 10 }}
                />
                <YAxis
                  stroke="#3F3F46"
                  tick={{ fill: "#71717A", fontSize: 10 }}
                  domain={[55, 100]}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#FACC15"
                  strokeWidth={2.5}
                  fill="url(#fsAreaGrad)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#FACC15",
                    stroke: "#0A0A0A",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly bars */}
        <motion.div
          {...fadeUpView(0.2)}
          style={{
            padding: "24px 22px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: "#fff",
              marginBottom: 3,
            }}
          >
            This Week
          </div>
          <div style={{ fontSize: 12, color: "#71717A", marginBottom: 20 }}>
            Daily scores
          </div>
          <WeekBars />
          <div
            style={{
              marginTop: 16,
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(250,204,21,0.06)",
              border: "1px solid rgba(250,204,21,0.12)",
            }}
          >
            <div style={{ fontSize: 10, color: "#71717A", marginBottom: 2 }}>
              Week Average
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 24,
                color: "#FACC15",
                fontFamily: "'Syne',sans-serif",
              }}
            >
              <Counter to={90.1} decimals={1} duration={1.5} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── BREAKDOWN + RADAR ROW ─────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Breakdown bars */}
        <motion.div
          {...fadeUpView(0.1)}
          style={{
            padding: "24px 22px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: "#fff",
              marginBottom: 3,
            }}
          >
            Focus Type Breakdown
          </div>
          <div style={{ fontSize: 12, color: "#71717A", marginBottom: 20 }}>
            6 cognitive attention systems
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {BREAKDOWN.map(({ label, val, desc, color }, i) => (
              <MiniBar
                key={label}
                label={label}
                val={val}
                desc={desc}
                color={color}
                delay={i * 0.06}
              />
            ))}
          </div>
        </motion.div>

        {/* Radar */}
        <motion.div
          {...fadeUpView(0.2)}
          style={{
            padding: "24px 22px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: "#fff",
              marginBottom: 3,
            }}
          >
            Attention Profile
          </div>
          <div style={{ fontSize: 12, color: "#71717A", marginBottom: 8 }}>
            Radar across 6 systems
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={RADAR_DATA}
                margin={{ top: 8, right: 28, left: 28, bottom: 8 }}
              >
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#71717A", fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#FACC15"
                  strokeWidth={2}
                  fill="#FACC15"
                  fillOpacity={0.1}
                  dot={{ r: 3, fill: "#FACC15" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── INSIGHT BANNER ───────────────────────── */}
      <motion.div
        {...fadeUpView(0.1)}
        style={{
          background:
            "linear-gradient(135deg,rgba(250,204,21,0.06),rgba(250,204,21,0.02))",
          border: "1px solid rgba(250,204,21,0.14)",
          borderRadius: 24,
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: "#FACC15",
              opacity: 0.7,
              marginBottom: 10,
            }}
          >
            AI Insight · May 2026
          </div>
          <p
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "#D4D4D8",
              lineHeight: 1.65,
              maxWidth: 580,
            }}
          >
            Your <span style={{ color: "#FACC15" }}>Selective Attention</span>{" "}
            score of <span style={{ color: "#FACC15" }}>91</span> places you in
            the top <span style={{ color: "#FACC15" }}>9.8%</span> globally.
            Focus consistency improved{" "}
            <span style={{ color: "#34D399" }}>+18.4%</span> vs April. Continue
            your streak to break the{" "}
            <span style={{ color: "#FACC15" }}>95</span> barrier.
          </p>
        </div>
        <div
          style={{
            background: "rgba(250,204,21,0.08)",
            border: "1px solid rgba(250,204,21,0.2)",
            borderRadius: 18,
            padding: "18px 24px",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#71717A",
              marginBottom: 6,
            }}
          >
            Next Goal
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 44,
              color: "#FACC15",
              lineHeight: 1,
              fontFamily: "'Syne',sans-serif",
            }}
          >
            95.0
          </div>
          <div style={{ fontSize: 11, color: "#71717A", marginTop: 4 }}>
            +3.6 pts needed
          </div>
        </div>
      </motion.div>
    </div>
  );
}
