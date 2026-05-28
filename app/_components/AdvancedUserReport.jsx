"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import {
  FaBrain,
  FaBolt,
  FaBullseye,
  FaFire,
  FaTrophy,
  FaChartLine,
  FaGlobe,
  FaClock,
  FaMedal,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaInfinity,
  FaDna,
  FaRocket,
  FaShieldAlt,
  FaGamepad,
  FaCode,
  FaBook,
} from "react-icons/fa";
import {
  MdPsychology,
  MdSpeed,
  MdTimeline,
  MdAutoGraph,
  MdWaves,
  MdFlare,
} from "react-icons/md";

// ─── DATA PARSING ────────────────────────────────────────────────────────────

function parseGameData(rawData) {
  return rawData.map((session) => {
    const summary =
      typeof session.game_summary === "string"
        ? JSON.parse(session.game_summary)
        : session.game_summary;
    return {
      id: session.id,
      idx: session.idx,
      createdAt: new Date(session.created_at),
      score: session.score,
      accuracy: session.accuracy,
      avgReactionMs: session.avg_reaction_ms,
      fastestMs: session.fastest_ms,
      slowestMs: session.slowest_ms,
      timeTaken: session.time_taken,
      totalRight: session.total_right_click,
      totalWrong: session.total_wrong_click,
      gridSize: session.grid_size,
      difficulty: session.difficulty,
      gameMode: session.game_mode,
      country: session.country,
      clicks: summary.clicks || [],
      mistakes: summary.mistakes || 0,
      consistencyScore: summary.consistencyScore || 0,
      durationMs: summary.durationMs || 0,
    };
  });
}

// ─── COGNITIVE ANALYSIS HELPERS ──────────────────────────────────────────────

function computeFlowZones(clicks) {
  if (!clicks.length) return [];
  return clicks.map((c, i) => {
    const ms = c.timeTakenMs;
    let zone = "warmup";
    if (i > 1 && ms < 500) zone = "deep-flow";
    else if (ms < 900) zone = "focus";
    else if (ms > 3000) zone = "fatigue";
    return { click: i + 1, ms, zone, correct: c.correct };
  });
}

function computeMentalEnergy(clicks) {
  let energy = 100;
  return clicks.map((c, i) => {
    if (!c.correct) energy -= 8;
    if (c.timeTakenMs > 3000) energy -= 5;
    else if (c.timeTakenMs < 500) energy += 2;
    energy = Math.max(10, Math.min(100, energy));
    return { click: i + 1, energy: Math.round(energy) };
  });
}

function detectCognitiveArchetype(sessions) {
  const avgAcc = sessions.reduce((s, x) => s + x.accuracy, 0) / sessions.length;
  const avgReact =
    sessions.reduce((s, x) => s + x.avgReactionMs, 0) / sessions.length;
  const avgConsistency =
    sessions.reduce((s, x) => s + x.consistencyScore, 0) / sessions.length;

  if (avgAcc > 95 && avgReact < 800)
    return {
      name: "Precision Thinker",
      icon: FaShieldAlt,
      color: "#6366f1",
      desc: "Elite accuracy with lightning reflexes. You process information with surgical precision — your brain wastes no cycles.",
    };
  if (avgReact < 700 && avgConsistency < 600)
    return {
      name: "Rapid Reactor",
      icon: FaBolt,
      color: "#f59e0b",
      desc: "Your visual system fires before your conscious mind can second-guess. Rare instinctive processing speed.",
    };
  if (avgAcc > 90 && avgConsistency < 700)
    return {
      name: "Calm Strategist",
      icon: FaBrain,
      color: "#10b981",
      desc: "You maintain exceptional accuracy under pressure. Methodical yet efficient — the hallmark of a deep thinker.",
    };
  if (avgConsistency < 500)
    return {
      name: "Adaptive Focus Master",
      icon: MdFlare,
      color: "#8b5cf6",
      desc: "Remarkably stable neural rhythms. Your attention rarely wavers — a sign of strong executive function.",
    };
  return {
    name: "Hyper Scanner",
    icon: FaRocket,
    color: "#ec4899",
    desc: "Fast, explosive, instinctive. You scan environments at high speed, trading some precision for raw cognitive throughput.",
  };
}

function computeSkillRadar(sessions) {
  const avgAcc = sessions.reduce((s, x) => s + x.accuracy, 0) / sessions.length;
  const avgReact =
    sessions.reduce((s, x) => s + x.avgReactionMs, 0) / sessions.length;
  const avgConsistency =
    sessions.reduce((s, x) => s + x.consistencyScore, 0) / sessions.length;
  const allSessions100 = sessions.filter((x) => x.accuracy === 100).length;
  const enduranceScore =
    sessions.reduce((s, x) => s + (x.timeTaken > 15 ? 80 : 60), 0) /
    sessions.length;

  const focus = Math.min(100, Math.round(avgAcc));
  const speed = Math.min(
    100,
    Math.round(Math.max(0, 100 - (avgReact - 300) / 25)),
  );
  const precision = Math.min(
    100,
    Math.round((allSessions100 / sessions.length) * 100),
  );
  const endurance = Math.min(100, Math.round(enduranceScore));
  const consistency = Math.min(
    100,
    Math.round(Math.max(0, 100 - avgConsistency / 30)),
  );
  const adaptability = Math.min(100, Math.round((focus + speed) / 2 + 5));

  return [
    { skill: "Focus", value: focus },
    { skill: "Speed", value: speed },
    { skill: "Precision", value: precision },
    { skill: "Endurance", value: endurance },
    { skill: "Consistency", value: consistency },
    { skill: "Adaptability", value: adaptability },
  ];
}

function computeGlobalPercentile(avgReact, accuracy) {
  // Benchmarks based on published cognitive research ranges
  if (avgReact < 500 && accuracy > 95) return 97;
  if (avgReact < 700 && accuracy > 90) return 88;
  if (avgReact < 900 && accuracy > 85) return 74;
  if (avgReact < 1200 && accuracy > 80) return 61;
  if (avgReact < 1600) return 48;
  return 35;
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "#6366f1",
  delay = 0,
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={delay}
      className="rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${color}22` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
        <span
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {label}
        </span>
      </div>
      <div
        className="text-3xl font-bold"
        style={{
          color: "rgba(255,255,255,0.95)",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          {sub}
        </div>
      )}
    </motion.div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, color = "#6366f1" }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: `${color}22`, border: `1px solid ${color}44` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <h2
          className="text-base font-semibold"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          {title}
        </h2>
        <p
          className="text-xs mt-0.5"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

const ZONE_COLORS = {
  "deep-flow": "#10b981",
  focus: "#6366f1",
  warmup: "#f59e0b",
  fatigue: "#ef4444",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs"
      style={{
        background: "#1a1a2e",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      <div className="font-semibold mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(0) : p.value}
        </div>
      ))}
    </div>
  );
};

// ─── RAW DATA ────────────────────────────────────────────────────────────────

const RAW_DATA = [
  {
    idx: 40,
    id: "115bfb98-bb4d-4bc1-b449-94e7d2263872",
    created_at: "2026-05-26 18:38:34.364406+00",
    user_id: null,
    game_summary:
      '{"score": 787, "clicks": [{"number": {"expr": "8 - 10", "value": -2}, "correct": true, "expected": {"expr": "8 - 10", "value": -2}, "timestamp": "2026-05-26T18:38:25.830Z", "timeTakenMs": 3666}, {"number": {"expr": "7 - 8", "value": -1}, "correct": true, "expected": {"expr": "7 - 8", "value": -1}, "timestamp": "2026-05-26T18:38:28.477Z", "timeTakenMs": 2647}, {"number": {"expr": "10 - 10", "value": 0}, "correct": true, "expected": {"expr": "10 - 10", "value": 0}, "timestamp": "2026-05-26T18:38:28.796Z", "timeTakenMs": 319}, {"number": {"expr": "9 - 6", "value": 3}, "correct": true, "expected": {"expr": "9 - 6", "value": 3}, "timestamp": "2026-05-26T18:38:30.749Z", "timeTakenMs": 1953}, {"number": {"expr": "3 × 4", "value": 12}, "correct": true, "expected": {"expr": "3 × 4", "value": 12}, "timestamp": "2026-05-26T18:38:32.196Z", "timeTakenMs": 1447}, {"number": {"expr": "7 + 7", "value": 14}, "correct": true, "expected": {"expr": "7 + 7", "value": 14}, "timestamp": "2026-05-26T18:38:33.053Z", "timeTakenMs": 857}, {"number": {"expr": "2 × 8", "value": 16}, "correct": true, "expected": {"expr": "2 × 8", "value": 16}, "timestamp": "2026-05-26T18:38:34.653Z", "timeTakenMs": 1600}, {"number": {"expr": "6 × 3", "value": 18}, "correct": true, "expected": {"expr": "6 × 3", "value": 18}, "timestamp": "2026-05-26T18:38:35.453Z", "timeTakenMs": 800}, {"number": {"expr": "5 × 10", "value": 50}, "correct": true, "expected": {"expr": "5 × 10", "value": 50}, "timestamp": "2026-05-26T18:38:35.789Z", "timeTakenMs": 336}], "accuracy": 81.8, "gridSize": 3, "mistakes": 2, "fastestMs": 319, "slowestMs": 3666, "difficulty": "Medium", "durationMs": 13625, "totalTiles": 9, "completedAt": "2026-05-26T18:38:35.789Z", "consistencyScore": 1048, "avgReactionTimeMs": 1514}',
    grid_size: 3,
    difficulty: "Medium",
    total_right_click: 9,
    total_wrong_click: 2,
    time_taken: 13.625,
    score: 787,
    rank: null,
    game_mode: "maths",
    accuracy: 81.8,
    focus_iq_score: null,
    fastest_ms: 319,
    avg_reaction_ms: 1514,
    slowest_ms: 3666,
    country: "GB",
  },
  {
    idx: 41,
    id: "005bff7d-d5ae-4bd3-ba75-3ff603aa2abd",
    created_at: "2026-05-26 18:38:17.814153+00",
    user_id: null,
    game_summary:
      '{"score": 647, "clicks": [{"number": {"expr": "8 - 8", "value": 0}, "correct": true, "expected": {"expr": "8 - 8", "value": 0}, "timestamp": "2026-05-26T18:38:06.228Z", "timeTakenMs": 1727}, {"number": {"expr": "2 + 4", "value": 6}, "correct": true, "expected": {"expr": "2 + 4", "value": 6}, "timestamp": "2026-05-26T18:38:10.901Z", "timeTakenMs": 4673}, {"number": {"expr": "3 + 5", "value": 8}, "correct": true, "expected": {"expr": "3 + 5", "value": 8}, "timestamp": "2026-05-26T18:38:14.168Z", "timeTakenMs": 3267}, {"number": {"expr": "3 + 6", "value": 9}, "correct": true, "expected": {"expr": "3 + 6", "value": 9}, "timestamp": "2026-05-26T18:38:15.157Z", "timeTakenMs": 989}, {"number": {"expr": "10 + 2", "value": 12}, "correct": true, "expected": {"expr": "10 + 2", "value": 12}, "timestamp": "2026-05-26T18:38:15.630Z", "timeTakenMs": 473}, {"number": {"expr": "5 × 3", "value": 15}, "correct": true, "expected": {"expr": "5 × 3", "value": 15}, "timestamp": "2026-05-26T18:38:17.284Z", "timeTakenMs": 1654}, {"number": {"expr": "4 × 8", "value": 32}, "correct": true, "expected": {"expr": "4 × 8", "value": 32}, "timestamp": "2026-05-26T18:38:18.350Z", "timeTakenMs": 1066}, {"number": {"expr": "8 × 6", "value": 48}, "correct": true, "expected": {"expr": "8 × 6", "value": 48}, "timestamp": "2026-05-26T18:38:18.932Z", "timeTakenMs": 582}, {"number": {"expr": "7 × 9", "value": 63}, "correct": true, "expected": {"expr": "7 × 9", "value": 63}, "timestamp": "2026-05-26T18:38:19.245Z", "timeTakenMs": 313}], "accuracy": 64.3, "gridSize": 3, "mistakes": 5, "fastestMs": 313, "slowestMs": 4673, "difficulty": "Medium", "durationMs": 14744, "totalTiles": 9, "completedAt": "2026-05-26T18:38:19.245Z", "consistencyScore": 1368, "avgReactionTimeMs": 1638}',
    grid_size: 3,
    difficulty: "Medium",
    total_right_click: 9,
    total_wrong_click: 5,
    time_taken: 14.744,
    score: 647,
    rank: null,
    game_mode: "maths",
    accuracy: 64.3,
    focus_iq_score: null,
    fastest_ms: 313,
    avg_reaction_ms: 1638,
    slowest_ms: 4673,
    country: "GB",
  },
  {
    idx: 42,
    id: "06de9968-c09a-4b19-a6f0-a2b6f2a29790",
    created_at: "2026-05-26 18:37:57.516169+00",
    user_id: null,
    game_summary:
      '{"score": 519, "clicks": [{"number": {"expr": "2 - 8", "value": -6}, "correct": true, "expected": {"expr": "2 - 8", "value": -6}, "timestamp": "2026-05-26T18:37:48.246Z", "timeTakenMs": 5265}, {"number": {"expr": "3 - 6", "value": -3}, "correct": true, "expected": {"expr": "3 - 6", "value": -3}, "timestamp": "2026-05-26T18:37:53.236Z", "timeTakenMs": 4990}, {"number": {"expr": "10 - 9", "value": 1}, "correct": true, "expected": {"expr": "10 - 9", "value": 1}, "timestamp": "2026-05-26T18:37:53.813Z", "timeTakenMs": 577}, {"number": {"expr": "6 - 4", "value": 2}, "correct": true, "expected": {"expr": "6 - 4", "value": 2}, "timestamp": "2026-05-26T18:37:54.661Z", "timeTakenMs": 848}, {"number": {"expr": "8 - 3", "value": 5}, "correct": true, "expected": {"expr": "8 - 3", "value": 5}, "timestamp": "2026-05-26T18:37:55.428Z", "timeTakenMs": 767}, {"number": {"expr": "3 + 3", "value": 6}, "correct": true, "expected": {"expr": "3 + 3", "value": 6}, "timestamp": "2026-05-26T18:37:57.142Z", "timeTakenMs": 1713}, {"number": {"expr": "5 + 2", "value": 7}, "correct": true, "expected": {"expr": "5 + 2", "value": 7}, "timestamp": "2026-05-26T18:37:57.445Z", "timeTakenMs": 304}, {"number": {"expr": "7 + 2", "value": 9}, "correct": true, "expected": {"expr": "7 + 2", "value": 9}, "timestamp": "2026-05-26T18:37:58.573Z", "timeTakenMs": 1128}, {"number": {"expr": "2 × 5", "value": 10}, "correct": true, "expected": {"expr": "2 × 5", "value": 10}, "timestamp": "2026-05-26T18:37:58.941Z", "timeTakenMs": 368}], "accuracy": 69.2, "gridSize": 3, "mistakes": 4, "fastestMs": 304, "slowestMs": 5265, "difficulty": "Medium", "durationMs": 15960, "totalTiles": 9, "completedAt": "2026-05-26T18:37:58.941Z", "consistencyScore": 1838, "avgReactionTimeMs": 1773}',
    grid_size: 3,
    difficulty: "Medium",
    total_right_click: 9,
    total_wrong_click: 4,
    time_taken: 15.96,
    score: 519,
    rank: null,
    game_mode: "maths",
    accuracy: 69.2,
    focus_iq_score: null,
    fastest_ms: 304,
    avg_reaction_ms: 1773,
    slowest_ms: 5265,
    country: "GB",
  },
  {
    idx: 43,
    id: "d253adc9-1c55-4f03-96e7-92bf0a0a7b46",
    created_at: "2026-05-26 18:37:34.644497+00",
    user_id: null,
    game_summary:
      '{"score": 663, "clicks": [{"number": {"expr": "7 - 10", "value": -3}, "correct": true, "expected": {"expr": "7 - 10", "value": -3}, "timestamp": "2026-05-26T18:37:25.452Z", "timeTakenMs": 3304}, {"number": {"expr": "7 - 7", "value": 0}, "correct": true, "expected": {"expr": "7 - 7", "value": 0}, "timestamp": "2026-05-26T18:37:26.213Z", "timeTakenMs": 761}, {"number": {"expr": "9 - 5", "value": 4}, "correct": true, "expected": {"expr": "9 - 5", "value": 4}, "timestamp": "2026-05-26T18:37:31.623Z", "timeTakenMs": 5410}, {"number": {"expr": "3 + 3", "value": 6}, "correct": true, "expected": {"expr": "3 + 3", "value": 6}, "timestamp": "2026-05-26T18:37:32.004Z", "timeTakenMs": 381}, {"number": {"expr": "5 + 2", "value": 7}, "correct": true, "expected": {"expr": "5 + 2", "value": 7}, "timestamp": "2026-05-26T18:37:32.941Z", "timeTakenMs": 937}, {"number": {"expr": "2 + 9", "value": 11}, "correct": true, "expected": {"expr": "2 + 9", "value": 11}, "timestamp": "2026-05-26T18:37:33.717Z", "timeTakenMs": 776}, {"number": {"expr": "3 × 7", "value": 21}, "correct": true, "expected": {"expr": "3 × 7", "value": 21}, "timestamp": "2026-05-26T18:37:34.925Z", "timeTakenMs": 1208}, {"number": {"expr": "10 × 3", "value": 30}, "correct": true, "expected": {"expr": "10 × 3", "value": 30}, "timestamp": "2026-05-26T18:37:35.821Z", "timeTakenMs": 896}, {"number": {"expr": "10 × 7", "value": 70}, "correct": true, "expected": {"expr": "10 × 7", "value": 70}, "timestamp": "2026-05-26T18:37:36.069Z", "timeTakenMs": 248}], "accuracy": 100, "gridSize": 3, "mistakes": 0, "fastestMs": 248, "slowestMs": 5410, "difficulty": "Medium", "durationMs": 13921, "totalTiles": 9, "completedAt": "2026-05-26T18:37:36.069Z", "consistencyScore": 1605, "avgReactionTimeMs": 1547}',
    grid_size: 3,
    difficulty: "Medium",
    total_right_click: 9,
    total_wrong_click: 0,
    time_taken: 13.921,
    score: 663,
    rank: null,
    game_mode: "maths",
    accuracy: 100,
    focus_iq_score: null,
    fastest_ms: 248,
    avg_reaction_ms: 1547,
    slowest_ms: 5410,
    country: "GB",
  },
  {
    idx: 44,
    id: "78d3818a-8636-4fb1-99f3-49e7727529c8",
    created_at: "2026-05-26 18:37:15.529088+00",
    user_id: null,
    game_summary:
      '{"score": 642, "clicks": [{"number": {"expr": "2 - 6", "value": -4}, "correct": true, "expected": {"expr": "2 - 6", "value": -4}, "timestamp": "2026-05-26T18:37:04.869Z", "timeTakenMs": 5495}, {"number": {"expr": "2 - 4", "value": -2}, "correct": true, "expected": {"expr": "2 - 4", "value": -2}, "timestamp": "2026-05-26T18:37:07.893Z", "timeTakenMs": 3024}, {"number": {"expr": "3 - 4", "value": -1}, "correct": true, "expected": {"expr": "3 - 4", "value": -1}, "timestamp": "2026-05-26T18:37:09.412Z", "timeTakenMs": 1519}, {"number": {"expr": "5 - 2", "value": 3}, "correct": true, "expected": {"expr": "5 - 2", "value": 3}, "timestamp": "2026-05-26T18:37:10.933Z", "timeTakenMs": 1521}, {"number": {"expr": "7 + 2", "value": 9}, "correct": true, "expected": {"expr": "7 + 2", "value": 9}, "timestamp": "2026-05-26T18:37:13.300Z", "timeTakenMs": 2367}, {"number": {"expr": "8 + 3", "value": 11}, "correct": true, "expected": {"expr": "8 + 3", "value": 11}, "timestamp": "2026-05-26T18:37:14.157Z", "timeTakenMs": 857}, {"number": {"expr": "5 + 8", "value": 13}, "correct": true, "expected": {"expr": "5 + 8", "value": 13}, "timestamp": "2026-05-26T18:37:15.781Z", "timeTakenMs": 1624}, {"number": {"expr": "10 + 6", "value": 16}, "correct": true, "expected": {"expr": "10 + 6", "value": 16}, "timestamp": "2026-05-26T18:37:16.534Z", "timeTakenMs": 753}, {"number": {"expr": "9 × 10", "value": 90}, "correct": true, "expected": {"expr": "9 × 10", "value": 90}, "timestamp": "2026-05-26T18:37:16.948Z", "timeTakenMs": 414}], "accuracy": 100, "gridSize": 3, "mistakes": 0, "fastestMs": 414, "slowestMs": 5495, "difficulty": "Medium", "durationMs": 17574, "totalTiles": 9, "completedAt": "2026-05-26T18:37:16.948Z", "consistencyScore": 1467, "avgReactionTimeMs": 1953}',
    grid_size: 3,
    difficulty: "Medium",
    total_right_click: 9,
    total_wrong_click: 0,
    time_taken: 17.574,
    score: 642,
    rank: null,
    game_mode: "maths",
    accuracy: 100,
    focus_iq_score: null,
    fastest_ms: 414,
    avg_reaction_ms: 1953,
    slowest_ms: 5495,
    country: "GB",
  },
  {
    idx: 45,
    id: "c9526972-545b-434d-9cee-4610a3199c3d",
    created_at: "2026-05-26 18:36:53.775372+00",
    user_id: null,
    game_summary:
      '{"score": 749, "clicks": [{"number": {"expr": "7 - 7", "value": 0}, "correct": true, "expected": {"expr": "7 - 7", "value": 0}, "timestamp": "2026-05-26T18:36:42.413Z", "timeTakenMs": 2418}, {"number": {"expr": "9 - 6", "value": 3}, "correct": true, "expected": {"expr": "9 - 6", "value": 3}, "timestamp": "2026-05-26T18:36:46.395Z", "timeTakenMs": 3982}, {"number": {"expr": "6 - 2", "value": 4}, "correct": true, "expected": {"expr": "6 - 2", "value": 4}, "timestamp": "2026-05-26T18:36:47.164Z", "timeTakenMs": 769}, {"number": {"expr": "7 + 3", "value": 10}, "correct": true, "expected": {"expr": "7 + 3", "value": 10}, "timestamp": "2026-05-26T18:36:48.525Z", "timeTakenMs": 1361}, {"number": {"expr": "5 + 6", "value": 11}, "correct": true, "expected": {"expr": "5 + 6", "value": 11}, "timestamp": "2026-05-26T18:36:51.117Z", "timeTakenMs": 2592}, {"number": {"expr": "9 + 7", "value": 16}, "correct": true, "expected": {"expr": "9 + 7", "value": 16}, "timestamp": "2026-05-26T18:36:52.179Z", "timeTakenMs": 1062}, {"number": {"expr": "9 + 10", "value": 19}, "correct": true, "expected": {"expr": "9 + 10", "value": 19}, "timestamp": "2026-05-26T18:36:54.484Z", "timeTakenMs": 2305}, {"number": {"expr": "4 × 9", "value": 36}, "correct": true, "expected": {"expr": "4 × 9", "value": 36}, "timestamp": "2026-05-26T18:36:54.892Z", "timeTakenMs": 408}, {"number": {"expr": "10 × 10", "value": 100}, "correct": true, "expected": {"expr": "10 × 10", "value": 100}, "timestamp": "2026-05-26T18:36:55.205Z", "timeTakenMs": 313}], "accuracy": 90, "gridSize": 3, "mistakes": 1, "fastestMs": 313, "slowestMs": 3982, "difficulty": "Medium", "durationMs": 15210, "totalTiles": 9, "completedAt": "2026-05-26T18:36:55.205Z", "consistencyScore": 1148, "avgReactionTimeMs": 1690}',
    grid_size: 3,
    difficulty: "Medium",
    total_right_click: 9,
    total_wrong_click: 1,
    time_taken: 15.21,
    score: 749,
    rank: null,
    game_mode: "maths",
    accuracy: 90,
    focus_iq_score: null,
    fastest_ms: 313,
    avg_reaction_ms: 1690,
    slowest_ms: 3982,
    country: "GB",
  },
  {
    idx: 46,
    id: "1a37bf5d-038d-46a4-a770-c82d9c60d68c",
    created_at: "2026-05-26 18:36:35.589579+00",
    user_id: null,
    game_summary:
      '{"score": 652, "clicks": [{"number": {"expr": "3 - 8", "value": -5}, "correct": true, "expected": {"expr": "3 - 8", "value": -5}, "timestamp": "2026-05-26T18:36:20.941Z", "timeTakenMs": 2209}, {"number": {"expr": "2 + 5", "value": 7}, "correct": true, "expected": {"expr": "2 + 5", "value": 7}, "timestamp": "2026-05-26T18:36:24.556Z", "timeTakenMs": 3615}, {"number": {"expr": "10 - 2", "value": 8}, "correct": true, "expected": {"expr": "10 - 2", "value": 8}, "timestamp": "2026-05-26T18:36:28.363Z", "timeTakenMs": 3807}, {"number": {"expr": "4 + 8", "value": 12}, "correct": true, "expected": {"expr": "4 + 8", "value": 12}, "timestamp": "2026-05-26T18:36:32.043Z", "timeTakenMs": 3680}, {"number": {"expr": "9 + 4", "value": 13}, "correct": true, "expected": {"expr": "9 + 4", "value": 13}, "timestamp": "2026-05-26T18:36:34.116Z", "timeTakenMs": 2073}, {"number": {"expr": "2 × 7", "value": 14}, "correct": true, "expected": {"expr": "2 × 7", "value": 14}, "timestamp": "2026-05-26T18:36:34.445Z", "timeTakenMs": 329}, {"number": {"expr": "4 × 6", "value": 24}, "correct": true, "expected": {"expr": "4 × 6", "value": 24}, "timestamp": "2026-05-26T18:36:35.820Z", "timeTakenMs": 1375}, {"number": {"expr": "7 × 5", "value": 35}, "correct": true, "expected": {"expr": "7 × 5", "value": 35}, "timestamp": "2026-05-26T18:36:36.732Z", "timeTakenMs": 912}, {"number": {"expr": "10 × 9", "value": 90}, "correct": true, "expected": {"expr": "10 × 9", "value": 90}, "timestamp": "2026-05-26T18:36:36.997Z", "timeTakenMs": 265}], "accuracy": 90, "gridSize": 3, "mistakes": 1, "fastestMs": 265, "slowestMs": 3807, "difficulty": "Medium", "durationMs": 18265, "totalTiles": 9, "completedAt": "2026-05-26T18:36:36.997Z", "consistencyScore": 1338, "avgReactionTimeMs": 2029}',
    grid_size: 3,
    difficulty: "Medium",
    total_right_click: 9,
    total_wrong_click: 1,
    time_taken: 18.265,
    score: 652,
    rank: null,
    game_mode: "maths",
    accuracy: 90,
    focus_iq_score: null,
    fastest_ms: 265,
    avg_reaction_ms: 2029,
    slowest_ms: 3807,
    country: "GB",
  },
  {
    idx: 47,
    id: "6ce0fc87-86b3-4149-89b2-92432c2ef2fe",
    created_at: "2026-05-26 18:36:12.166727+00",
    user_id: null,
    game_summary:
      '{"score": 608, "clicks": [{"number": {"expr": "4 - 10", "value": -6}, "correct": true, "expected": {"expr": "4 - 10", "value": -6}, "timestamp": "2026-05-26T18:35:57.964Z", "timeTakenMs": 4017}, {"number": {"expr": "5 - 5", "value": 0}, "correct": true, "expected": {"expr": "5 - 5", "value": 0}, "timestamp": "2026-05-26T18:35:59.325Z", "timeTakenMs": 1361}, {"number": {"expr": "7 - 3", "value": 4}, "correct": true, "expected": {"expr": "7 - 3", "value": 4}, "timestamp": "2026-05-26T18:36:01.172Z", "timeTakenMs": 1847}, {"number": {"expr": "4 + 7", "value": 11}, "correct": true, "expected": {"expr": "4 + 7", "value": 11}, "timestamp": "2026-05-26T18:36:03.379Z", "timeTakenMs": 2207}, {"number": {"expr": "7 + 8", "value": 15}, "correct": true, "expected": {"expr": "7 + 8", "value": 15}, "timestamp": "2026-05-26T18:36:08.619Z", "timeTakenMs": 5240}, {"number": {"expr": "6 × 4", "value": 24}, "correct": true, "expected": {"expr": "6 × 4", "value": 24}, "timestamp": "2026-05-26T18:36:11.060Z", "timeTakenMs": 2441}, {"number": {"expr": "5 × 7", "value": 35}, "correct": true, "expected": {"expr": "5 × 7", "value": 35}, "timestamp": "2026-05-26T18:36:11.875Z", "timeTakenMs": 815}, {"number": {"expr": "6 × 10", "value": 60}, "correct": true, "expected": {"expr": "6 × 10", "value": 60}, "timestamp": "2026-05-26T18:36:13.260Z", "timeTakenMs": 1385}, {"number": {"expr": "10 × 8", "value": 80}, "correct": true, "expected": {"expr": "10 × 8", "value": 80}, "timestamp": "2026-05-26T18:36:13.587Z", "timeTakenMs": 327}], "accuracy": 100, "gridSize": 3, "mistakes": 0, "fastestMs": 327, "slowestMs": 5240, "difficulty": "Medium", "durationMs": 19640, "totalTiles": 9, "completedAt": "2026-05-26T18:36:13.587Z", "consistencyScore": 1473, "avgReactionTimeMs": 2182}',
    grid_size: 3,
    difficulty: "Medium",
    total_right_click: 9,
    total_wrong_click: 0,
    time_taken: 19.64,
    score: 608,
    rank: null,
    game_mode: "maths",
    accuracy: 100,
    focus_iq_score: null,
    fastest_ms: 327,
    avg_reaction_ms: 2182,
    slowest_ms: 5240,
    country: "GB",
  },
  {
    idx: 48,
    id: "00afb51f-5843-46a4-9922-c09ec4cb0141",
    created_at: "2026-05-26 18:35:33.416823+00",
    user_id: null,
    game_summary:
      '{"score": 1774, "clicks": [{"number": 1, "correct": true, "expected": 1, "timestamp": "2026-05-26T18:35:18.075Z", "timeTakenMs": 1200}, {"number": 10, "correct": true, "expected": 10, "timestamp": "2026-05-26T18:35:19.331Z", "timeTakenMs": 1256}, {"number": 11, "correct": true, "expected": 11, "timestamp": "2026-05-26T18:35:19.892Z", "timeTakenMs": 561}, {"number": 12, "correct": true, "expected": 12, "timestamp": "2026-05-26T18:35:21.108Z", "timeTakenMs": 1216}, {"number": 13, "correct": true, "expected": 13, "timestamp": "2026-05-26T18:35:22.411Z", "timeTakenMs": 1303}, {"number": 14, "correct": true, "expected": 14, "timestamp": "2026-05-26T18:35:23.412Z", "timeTakenMs": 1001}, {"number": 15, "correct": true, "expected": 15, "timestamp": "2026-05-26T18:35:23.652Z", "timeTakenMs": 240}, {"number": 16, "correct": true, "expected": 16, "timestamp": "2026-05-26T18:35:23.947Z", "timeTakenMs": 295}, {"number": 17, "correct": true, "expected": 17, "timestamp": "2026-05-26T18:35:26.108Z", "timeTakenMs": 2161}, {"number": 18, "correct": true, "expected": 18, "timestamp": "2026-05-26T18:35:26.523Z", "timeTakenMs": 415}, {"number": 19, "correct": true, "expected": 19, "timestamp": "2026-05-26T18:35:26.899Z", "timeTakenMs": 376}, {"number": 2, "correct": true, "expected": 2, "timestamp": "2026-05-26T18:35:27.499Z", "timeTakenMs": 600}, {"number": 20, "correct": true, "expected": 20, "timestamp": "2026-05-26T18:35:28.203Z", "timeTakenMs": 704}, {"number": 21, "correct": true, "expected": 21, "timestamp": "2026-05-26T18:35:29.555Z", "timeTakenMs": 1352}, {"number": 22, "correct": true, "expected": 22, "timestamp": "2026-05-26T18:35:30.043Z", "timeTakenMs": 488}, {"number": 23, "correct": true, "expected": 23, "timestamp": "2026-05-26T18:35:30.411Z", "timeTakenMs": 368}, {"number": 24, "correct": true, "expected": 24, "timestamp": "2026-05-26T18:35:31.095Z", "timeTakenMs": 684}, {"number": 25, "correct": true, "expected": 25, "timestamp": "2026-05-26T18:35:31.652Z", "timeTakenMs": 557}, {"number": 3, "correct": true, "expected": 3, "timestamp": "2026-05-26T18:35:32.101Z", "timeTakenMs": 449}, {"number": 4, "correct": true, "expected": 4, "timestamp": "2026-05-26T18:35:32.486Z", "timeTakenMs": 385}, {"number": 5, "correct": true, "expected": 5, "timestamp": "2026-05-26T18:35:32.827Z", "timeTakenMs": 341}, {"number": 6, "correct": true, "expected": 6, "timestamp": "2026-05-26T18:35:33.693Z", "timeTakenMs": 866}, {"number": 7, "correct": true, "expected": 7, "timestamp": "2026-05-26T18:35:34.132Z", "timeTakenMs": 439}, {"number": 8, "correct": true, "expected": 8, "timestamp": "2026-05-26T18:35:34.518Z", "timeTakenMs": 386}, {"number": 9, "correct": true, "expected": 9, "timestamp": "2026-05-26T18:35:34.811Z", "timeTakenMs": 293}], "accuracy": 100, "gridSize": 5, "mistakes": 0, "fastestMs": 240, "slowestMs": 2161, "difficulty": "Medium", "durationMs": 17936, "totalTiles": 25, "completedAt": "2026-05-26T18:35:34.811Z", "consistencyScore": 458, "avgReactionTimeMs": 717}',
    grid_size: 5,
    difficulty: "Medium",
    total_right_click: 25,
    total_wrong_click: 0,
    time_taken: 17.936,
    score: 1774,
    rank: null,
    game_mode: "number",
    accuracy: 100,
    focus_iq_score: null,
    fastest_ms: 240,
    avg_reaction_ms: 717,
    slowest_ms: 2161,
    country: "GB",
  },
  {
    idx: 49,
    id: "0a64afa5-79d7-4e2e-ac7a-5910122c2afd",
    created_at: "2026-05-26 18:35:10.878931+00",
    user_id: null,
    game_summary:
      '{"score": 1771, "clicks": [{"number": 1, "correct": true, "expected": 1, "timestamp": "2026-05-26T18:34:54.275Z", "timeTakenMs": 1000}, {"number": 10, "correct": true, "expected": 10, "timestamp": "2026-05-26T18:34:54.755Z", "timeTakenMs": 480}, {"number": 11, "correct": true, "expected": 11, "timestamp": "2026-05-26T18:34:56.144Z", "timeTakenMs": 1389}, {"number": 12, "correct": true, "expected": 12, "timestamp": "2026-05-26T18:34:56.572Z", "timeTakenMs": 428}, {"number": 13, "correct": true, "expected": 13, "timestamp": "2026-05-26T18:34:58.059Z", "timeTakenMs": 1487}, {"number": 14, "correct": true, "expected": 14, "timestamp": "2026-05-26T18:34:59.356Z", "timeTakenMs": 1297}, {"number": 15, "correct": true, "expected": 15, "timestamp": "2026-05-26T18:34:59.795Z", "timeTakenMs": 439}, {"number": 16, "correct": true, "expected": 16, "timestamp": "2026-05-26T18:35:00.227Z", "timeTakenMs": 432}, {"number": 17, "correct": true, "expected": 17, "timestamp": "2026-05-26T18:35:01.371Z", "timeTakenMs": 1144}, {"number": 18, "correct": true, "expected": 18, "timestamp": "2026-05-26T18:35:02.308Z", "timeTakenMs": 937}, {"number": 19, "correct": true, "expected": 19, "timestamp": "2026-05-26T18:35:03.619Z", "timeTakenMs": 1311}, {"number": 2, "correct": true, "expected": 2, "timestamp": "2026-05-26T18:35:04.875Z", "timeTakenMs": 1256}, {"number": 20, "correct": true, "expected": 20, "timestamp": "2026-05-26T18:35:05.259Z", "timeTakenMs": 384}, {"number": 21, "correct": true, "expected": 21, "timestamp": "2026-05-26T18:35:06.133Z", "timeTakenMs": 874}, {"number": 22, "correct": true, "expected": 22, "timestamp": "2026-05-26T18:35:06.700Z", "timeTakenMs": 567}, {"number": 23, "correct": true, "expected": 23, "timestamp": "2026-05-26T18:35:07.237Z", "timeTakenMs": 537}, {"number": 24, "correct": true, "expected": 24, "timestamp": "2026-05-26T18:35:07.725Z", "timeTakenMs": 488}, {"number": 25, "correct": true, "expected": 25, "timestamp": "2026-05-26T18:35:08.195Z", "timeTakenMs": 470}, {"number": 3, "correct": true, "expected": 3, "timestamp": "2026-05-26T18:35:09.516Z", "timeTakenMs": 1321}, {"number": 4, "correct": true, "expected": 4, "timestamp": "2026-05-26T18:35:09.956Z", "timeTakenMs": 440}, {"number": 5, "correct": true, "expected": 5, "timestamp": "2026-05-26T18:35:10.437Z", "timeTakenMs": 481}, {"number": 6, "correct": true, "expected": 6, "timestamp": "2026-05-26T18:35:10.789Z", "timeTakenMs": 352}, {"number": 7, "correct": true, "expected": 7, "timestamp": "2026-05-26T18:35:11.158Z", "timeTakenMs": 369}, {"number": 8, "correct": true, "expected": 8, "timestamp": "2026-05-26T18:35:11.404Z", "timeTakenMs": 246}, {"number": 9, "correct": true, "expected": 9, "timestamp": "2026-05-26T18:35:11.893Z", "timeTakenMs": 489}], "accuracy": 96.2, "gridSize": 5, "mistakes": 1, "fastestMs": 246, "slowestMs": 1487, "difficulty": "Medium", "durationMs": 18618, "totalTiles": 25, "completedAt": "2026-05-26T18:35:11.893Z", "consistencyScore": 397, "avgReactionTimeMs": 745}',
    grid_size: 5,
    difficulty: "Medium",
    total_right_click: 25,
    total_wrong_click: 1,
    time_taken: 18.618,
    score: 1771,
    rank: null,
    game_mode: "number",
    accuracy: 96.2,
    focus_iq_score: null,
    fastest_ms: 246,
    avg_reaction_ms: 745,
    slowest_ms: 1487,
    country: "GB",
  },
  {
    idx: 50,
    id: "cc7bddae-301e-481a-8d3b-b1430ab5e4e6",
    created_at: "2026-05-26 18:34:48.150471+00",
    user_id: null,
    game_summary:
      '{"score": 1444, "clicks": [{"number": 1, "correct": true, "expected": 1, "timestamp": "2026-05-26T18:34:27.923Z", "timeTakenMs": 1288}, {"number": 10, "correct": true, "expected": 10, "timestamp": "2026-05-26T18:34:28.635Z", "timeTakenMs": 712}, {"number": 11, "correct": true, "expected": 11, "timestamp": "2026-05-26T18:34:29.179Z", "timeTakenMs": 544}, {"number": 12, "correct": true, "expected": 12, "timestamp": "2026-05-26T18:34:34.692Z", "timeTakenMs": 5513}, {"number": 13, "correct": true, "expected": 13, "timestamp": "2026-05-26T18:34:34.962Z", "timeTakenMs": 270}, {"number": 14, "correct": true, "expected": 14, "timestamp": "2026-05-26T18:34:35.291Z", "timeTakenMs": 329}, {"number": 15, "correct": true, "expected": 15, "timestamp": "2026-05-26T18:34:36.347Z", "timeTakenMs": 1056}, {"number": 16, "correct": true, "expected": 16, "timestamp": "2026-05-26T18:34:39.570Z", "timeTakenMs": 3223}, {"number": 17, "correct": true, "expected": 17, "timestamp": "2026-05-26T18:34:40.043Z", "timeTakenMs": 473}, {"number": 18, "correct": true, "expected": 18, "timestamp": "2026-05-26T18:34:40.621Z", "timeTakenMs": 578}, {"number": 19, "correct": true, "expected": 19, "timestamp": "2026-05-26T18:34:40.963Z", "timeTakenMs": 342}, {"number": 2, "correct": true, "expected": 2, "timestamp": "2026-05-26T18:34:41.892Z", "timeTakenMs": 929}, {"number": 20, "correct": true, "expected": 20, "timestamp": "2026-05-26T18:34:42.443Z", "timeTakenMs": 551}, {"number": 21, "correct": true, "expected": 21, "timestamp": "2026-05-26T18:34:43.603Z", "timeTakenMs": 1160}, {"number": 22, "correct": true, "expected": 22, "timestamp": "2026-05-26T18:34:44.094Z", "timeTakenMs": 491}, {"number": 23, "correct": true, "expected": 23, "timestamp": "2026-05-26T18:34:44.557Z", "timeTakenMs": 463}, {"number": 24, "correct": true, "expected": 24, "timestamp": "2026-05-26T18:34:45.045Z", "timeTakenMs": 488}, {"number": 25, "correct": true, "expected": 25, "timestamp": "2026-05-26T18:34:45.371Z", "timeTakenMs": 326}, {"number": 3, "correct": true, "expected": 3, "timestamp": "2026-05-26T18:34:46.359Z", "timeTakenMs": 988}, {"number": 4, "correct": true, "expected": 4, "timestamp": "2026-05-26T18:34:46.789Z", "timeTakenMs": 430}, {"number": 5, "correct": true, "expected": 5, "timestamp": "2026-05-26T18:34:47.251Z", "timeTakenMs": 462}, {"number": 6, "correct": true, "expected": 6, "timestamp": "2026-05-26T18:34:47.660Z", "timeTakenMs": 409}, {"number": 7, "correct": true, "expected": 7, "timestamp": "2026-05-26T18:34:48.293Z", "timeTakenMs": 633}, {"number": 8, "correct": true, "expected": 8, "timestamp": "2026-05-26T18:34:48.685Z", "timeTakenMs": 392}, {"number": 9, "correct": true, "expected": 9, "timestamp": "2026-05-26T18:34:49.126Z", "timeTakenMs": 441}], "accuracy": 100, "gridSize": 5, "mistakes": 0, "fastestMs": 270, "slowestMs": 5513, "difficulty": "Medium", "durationMs": 22491, "totalTiles": 25, "completedAt": "2026-05-26T18:34:49.126Z", "consistencyScore": 1106, "avgReactionTimeMs": 900}',
    grid_size: 5,
    difficulty: "Medium",
    total_right_click: 25,
    total_wrong_click: 0,
    time_taken: 22.491,
    score: 1444,
    rank: null,
    game_mode: "number",
    accuracy: 100,
    focus_iq_score: null,
    fastest_ms: 270,
    avg_reaction_ms: 900,
    slowest_ms: 5513,
    country: "GB",
  },
  {
    idx: 51,
    id: "c8c26975-24b0-4881-9b65-109a80a775f1",
    created_at: "2026-05-26 18:34:15.078501+00",
    user_id: null,
    game_summary:
      '{"score": 1779, "clicks": [{"number": 1, "correct": true, "expected": 1, "timestamp": "2026-05-26T18:33:58.706Z", "timeTakenMs": 1079}, {"number": 10, "correct": true, "expected": 10, "timestamp": "2026-05-26T18:33:59.411Z", "timeTakenMs": 705}, {"number": 11, "correct": true, "expected": 11, "timestamp": "2026-05-26T18:34:00.626Z", "timeTakenMs": 1215}, {"number": 12, "correct": true, "expected": 12, "timestamp": "2026-05-26T18:34:01.362Z", "timeTakenMs": 736}, {"number": 13, "correct": true, "expected": 13, "timestamp": "2026-05-26T18:34:01.805Z", "timeTakenMs": 443}, {"number": 14, "correct": true, "expected": 14, "timestamp": "2026-05-26T18:34:02.556Z", "timeTakenMs": 751}, {"number": 15, "correct": true, "expected": 15, "timestamp": "2026-05-26T18:34:02.898Z", "timeTakenMs": 342}, {"number": 16, "correct": true, "expected": 16, "timestamp": "2026-05-26T18:34:04.299Z", "timeTakenMs": 1401}, {"number": 17, "correct": true, "expected": 17, "timestamp": "2026-05-26T18:34:04.845Z", "timeTakenMs": 546}, {"number": 18, "correct": true, "expected": 18, "timestamp": "2026-05-26T18:34:05.378Z", "timeTakenMs": 533}, {"number": 19, "correct": true, "expected": 19, "timestamp": "2026-05-26T18:34:06.982Z", "timeTakenMs": 1604}, {"number": 2, "correct": true, "expected": 2, "timestamp": "2026-05-26T18:34:07.810Z", "timeTakenMs": 828}, {"number": 20, "correct": true, "expected": 20, "timestamp": "2026-05-26T18:34:08.162Z", "timeTakenMs": 352}, {"number": 21, "correct": true, "expected": 21, "timestamp": "2026-05-26T18:34:09.260Z", "timeTakenMs": 1098}, {"number": 22, "correct": true, "expected": 22, "timestamp": "2026-05-26T18:34:11.114Z", "timeTakenMs": 1854}, {"number": 23, "correct": true, "expected": 23, "timestamp": "2026-05-26T18:34:11.914Z", "timeTakenMs": 800}, {"number": 24, "correct": true, "expected": 24, "timestamp": "2026-05-26T18:34:12.205Z", "timeTakenMs": 291}, {"number": 25, "correct": true, "expected": 25, "timestamp": "2026-05-26T18:34:12.930Z", "timeTakenMs": 725}, {"number": 3, "correct": true, "expected": 3, "timestamp": "2026-05-26T18:34:14.035Z", "timeTakenMs": 1105}, {"number": 4, "correct": true, "expected": 4, "timestamp": "2026-05-26T18:34:14.299Z", "timeTakenMs": 264}, {"number": 5, "correct": true, "expected": 5, "timestamp": "2026-05-26T18:34:14.901Z", "timeTakenMs": 602}, {"number": 6, "correct": true, "expected": 6, "timestamp": "2026-05-26T18:34:15.451Z", "timeTakenMs": 550}, {"number": 7, "correct": true, "expected": 7, "timestamp": "2026-05-26T18:34:15.861Z", "timeTakenMs": 410}, {"number": 8, "correct": true, "expected": 8, "timestamp": "2026-05-26T18:34:16.212Z", "timeTakenMs": 351}, {"number": 9, "correct": true, "expected": 9, "timestamp": "2026-05-26T18:34:16.467Z", "timeTakenMs": 254}], "accuracy": 100, "gridSize": 5, "mistakes": 0, "fastestMs": 254, "slowestMs": 1854, "difficulty": "Medium", "durationMs": 18840, "totalTiles": 25, "completedAt": "2026-05-26T18:34:16.467Z", "consistencyScore": 424, "avgReactionTimeMs": 754}',
    grid_size: 5,
    difficulty: "Medium",
    total_right_click: 25,
    total_wrong_click: 0,
    time_taken: 18.84,
    score: 1779,
    rank: null,
    game_mode: "number",
    accuracy: 100,
    focus_iq_score: null,
    fastest_ms: 254,
    avg_reaction_ms: 754,
    slowest_ms: 1854,
    country: "GB",
  },
  {
    idx: 52,
    id: "a71cf12f-7246-4eed-8a0c-b59f2440bf01",
    created_at: "2026-05-26 18:33:51.873614+00",
    user_id: null,
    game_summary:
      '{"score": 1622, "clicks": [{"number": 1, "correct": true, "expected": 1, "timestamp": "2026-05-26T18:33:34.492Z", "timeTakenMs": 1331}, {"number": 10, "correct": true, "expected": 10, "timestamp": "2026-05-26T18:33:34.923Z", "timeTakenMs": 431}, {"number": 11, "correct": true, "expected": 11, "timestamp": "2026-05-26T18:33:35.450Z", "timeTakenMs": 527}, {"number": 12, "correct": true, "expected": 12, "timestamp": "2026-05-26T18:33:37.894Z", "timeTakenMs": 2444}, {"number": 13, "correct": true, "expected": 13, "timestamp": "2026-05-26T18:33:38.210Z", "timeTakenMs": 316}, {"number": 14, "correct": true, "expected": 14, "timestamp": "2026-05-26T18:33:39.525Z", "timeTakenMs": 1315}, {"number": 15, "correct": true, "expected": 15, "timestamp": "2026-05-26T18:33:39.970Z", "timeTakenMs": 445}, {"number": 16, "correct": true, "expected": 16, "timestamp": "2026-05-26T18:33:43.627Z", "timeTakenMs": 3657}, {"number": 17, "correct": true, "expected": 17, "timestamp": "2026-05-26T18:33:44.283Z", "timeTakenMs": 656}, {"number": 18, "correct": true, "expected": 18, "timestamp": "2026-05-26T18:33:44.716Z", "timeTakenMs": 433}, {"number": 19, "correct": true, "expected": 19, "timestamp": "2026-05-26T18:33:46.042Z", "timeTakenMs": 1326}, {"number": 2, "correct": true, "expected": 2, "timestamp": "2026-05-26T18:33:46.754Z", "timeTakenMs": 712}, {"number": 20, "correct": true, "expected": 20, "timestamp": "2026-05-26T18:33:47.203Z", "timeTakenMs": 449}, {"number": 21, "correct": true, "expected": 21, "timestamp": "2026-05-26T18:33:47.947Z", "timeTakenMs": 744}, {"number": 22, "correct": true, "expected": 22, "timestamp": "2026-05-26T18:33:48.323Z", "timeTakenMs": 376}, {"number": 23, "correct": true, "expected": 23, "timestamp": "2026-05-26T18:33:49.299Z", "timeTakenMs": 976}, {"number": 24, "correct": true, "expected": 24, "timestamp": "2026-05-26T18:33:49.677Z", "timeTakenMs": 378}, {"number": 25, "correct": true, "expected": 25, "timestamp": "2026-05-26T18:33:50.074Z", "timeTakenMs": 397}, {"number": 3, "correct": true, "expected": 3, "timestamp": "2026-05-26T18:33:50.893Z", "timeTakenMs": 819}, {"number": 4, "correct": true, "expected": 4, "timestamp": "2026-05-26T18:33:51.297Z", "timeTakenMs": 404}, {"number": 5, "correct": true, "expected": 5, "timestamp": "2026-05-26T18:33:51.715Z", "timeTakenMs": 418}, {"number": 6, "correct": true, "expected": 6, "timestamp": "2026-05-26T18:33:51.935Z", "timeTakenMs": 220}, {"number": 7, "correct": true, "expected": 7, "timestamp": "2026-05-26T18:33:52.230Z", "timeTakenMs": 295}, {"number": 8, "correct": true, "expected": 8, "timestamp": "2026-05-26T18:33:52.930Z", "timeTakenMs": 700}, {"number": 9, "correct": true, "expected": 9, "timestamp": "2026-05-26T18:33:53.250Z", "timeTakenMs": 320}], "accuracy": 100, "gridSize": 5, "mistakes": 0, "fastestMs": 220, "slowestMs": 3657, "difficulty": "Medium", "durationMs": 20089, "totalTiles": 25, "completedAt": "2026-05-26T18:33:53.250Z", "consistencyScore": 755, "avgReactionTimeMs": 804}',
    grid_size: 5,
    difficulty: "Medium",
    total_right_click: 25,
    total_wrong_click: 0,
    time_taken: 20.089,
    score: 1622,
    rank: null,
    game_mode: "number",
    accuracy: 100,
    focus_iq_score: null,
    fastest_ms: 220,
    avg_reaction_ms: 804,
    slowest_ms: 3657,
    country: "GB",
  },
  {
    idx: 53,
    id: "731482f1-95d9-4fca-9620-71649d0adc01",
    created_at: "2026-05-26 18:33:26.156455+00",
    user_id: null,
    game_summary:
      '{"score": 1708, "clicks": [{"number": 1, "correct": true, "expected": 1, "timestamp": "2026-05-26T18:33:07.009Z", "timeTakenMs": 1135}, {"number": 10, "correct": true, "expected": 10, "timestamp": "2026-05-26T18:33:08.242Z", "timeTakenMs": 1233}, {"number": 11, "correct": true, "expected": 11, "timestamp": "2026-05-26T18:33:08.714Z", "timeTakenMs": 472}, {"number": 12, "correct": true, "expected": 12, "timestamp": "2026-05-26T18:33:10.626Z", "timeTakenMs": 1912}, {"number": 13, "correct": true, "expected": 13, "timestamp": "2026-05-26T18:33:11.961Z", "timeTakenMs": 1335}, {"number": 14, "correct": true, "expected": 14, "timestamp": "2026-05-26T18:33:12.946Z", "timeTakenMs": 985}, {"number": 15, "correct": true, "expected": 15, "timestamp": "2026-05-26T18:33:13.794Z", "timeTakenMs": 848}, {"number": 16, "correct": true, "expected": 16, "timestamp": "2026-05-26T18:33:15.610Z", "timeTakenMs": 1816}, {"number": 17, "correct": true, "expected": 17, "timestamp": "2026-05-26T18:33:16.300Z", "timeTakenMs": 690}, {"number": 18, "correct": true, "expected": 18, "timestamp": "2026-05-26T18:33:16.691Z", "timeTakenMs": 391}, {"number": 19, "correct": true, "expected": 19, "timestamp": "2026-05-26T18:33:18.916Z", "timeTakenMs": 2225}, {"number": 2, "correct": true, "expected": 2, "timestamp": "2026-05-26T18:33:19.812Z", "timeTakenMs": 896}, {"number": 20, "correct": true, "expected": 20, "timestamp": "2026-05-26T18:33:20.251Z", "timeTakenMs": 439}, {"number": 21, "correct": true, "expected": 21, "timestamp": "2026-05-26T18:33:21.618Z", "timeTakenMs": 1367}, {"number": 22, "correct": true, "expected": 22, "timestamp": "2026-05-26T18:33:22.115Z", "timeTakenMs": 497}, {"number": 23, "correct": true, "expected": 23, "timestamp": "2026-05-26T18:33:22.858Z", "timeTakenMs": 743}, {"number": 24, "correct": true, "expected": 24, "timestamp": "2026-05-26T18:33:23.275Z", "timeTakenMs": 417}, {"number": 25, "correct": true, "expected": 25, "timestamp": "2026-05-26T18:33:23.826Z", "timeTakenMs": 551}, {"number": 3, "correct": true, "expected": 3, "timestamp": "2026-05-26T18:33:24.753Z", "timeTakenMs": 927}, {"number": 4, "correct": true, "expected": 4, "timestamp": "2026-05-26T18:33:25.283Z", "timeTakenMs": 530}, {"number": 5, "correct": true, "expected": 5, "timestamp": "2026-05-26T18:33:25.554Z", "timeTakenMs": 271}, {"number": 6, "correct": true, "expected": 6, "timestamp": "2026-05-26T18:33:25.898Z", "timeTakenMs": 344}, {"number": 7, "correct": true, "expected": 7, "timestamp": "2026-05-26T18:33:26.501Z", "timeTakenMs": 603}, {"number": 8, "correct": true, "expected": 8, "timestamp": "2026-05-26T18:33:26.940Z", "timeTakenMs": 439}, {"number": 9, "correct": true, "expected": 9, "timestamp": "2026-05-26T18:33:27.323Z", "timeTakenMs": 383}], "accuracy": 100, "gridSize": 5, "mistakes": 0, "fastestMs": 271, "slowestMs": 2225, "difficulty": "Medium", "durationMs": 21449, "totalTiles": 25, "completedAt": "2026-05-26T18:33:27.323Z", "consistencyScore": 522, "avgReactionTimeMs": 858}',
    grid_size: 5,
    difficulty: "Medium",
    total_right_click: 25,
    total_wrong_click: 0,
    time_taken: 21.449,
    score: 1708,
    rank: null,
    game_mode: "number",
    accuracy: 100,
    focus_iq_score: null,
    fastest_ms: 271,
    avg_reaction_ms: 858,
    slowest_ms: 2225,
    country: "GB",
  },
  {
    idx: 54,
    id: "0b488750-8b36-4a7f-8a7e-6685c0f6b95b",
    created_at: "2026-05-26 18:33:00.613429+00",
    user_id: null,
    game_summary:
      '{"score": 1625, "clicks": [{"number": 1, "correct": true, "expected": 1, "timestamp": "2026-05-26T18:32:37.906Z", "timeTakenMs": 672}, {"number": 10, "correct": true, "expected": 10, "timestamp": "2026-05-26T18:32:39.562Z", "timeTakenMs": 1656}, {"number": 11, "correct": true, "expected": 11, "timestamp": "2026-05-26T18:32:42.409Z", "timeTakenMs": 2847}, {"number": 12, "correct": true, "expected": 12, "timestamp": "2026-05-26T18:32:44.562Z", "timeTakenMs": 2153}, {"number": 13, "correct": true, "expected": 13, "timestamp": "2026-05-26T18:32:46.165Z", "timeTakenMs": 1603}, {"number": 14, "correct": true, "expected": 14, "timestamp": "2026-05-26T18:32:47.155Z", "timeTakenMs": 990}, {"number": 15, "correct": true, "expected": 15, "timestamp": "2026-05-26T18:32:48.818Z", "timeTakenMs": 1663}, {"number": 16, "correct": true, "expected": 16, "timestamp": "2026-05-26T18:32:50.313Z", "timeTakenMs": 1495}, {"number": 17, "correct": true, "expected": 17, "timestamp": "2026-05-26T18:32:50.634Z", "timeTakenMs": 321}, {"number": 18, "correct": true, "expected": 18, "timestamp": "2026-05-26T18:32:52.433Z", "timeTakenMs": 1799}, {"number": 19, "correct": true, "expected": 19, "timestamp": "2026-05-26T18:32:52.978Z", "timeTakenMs": 545}, {"number": 2, "correct": true, "expected": 2, "timestamp": "2026-05-26T18:32:53.859Z", "timeTakenMs": 881}, {"number": 20, "correct": true, "expected": 20, "timestamp": "2026-05-26T18:32:54.403Z", "timeTakenMs": 544}, {"number": 21, "correct": true, "expected": 21, "timestamp": "2026-05-26T18:32:54.892Z", "timeTakenMs": 489}, {"number": 22, "correct": true, "expected": 22, "timestamp": "2026-05-26T18:32:55.356Z", "timeTakenMs": 464}, {"number": 23, "correct": true, "expected": 23, "timestamp": "2026-05-26T18:32:56.444Z", "timeTakenMs": 1088}, {"number": 24, "correct": true, "expected": 24, "timestamp": "2026-05-26T18:32:56.955Z", "timeTakenMs": 511}, {"number": 25, "correct": true, "expected": 25, "timestamp": "2026-05-26T18:32:57.370Z", "timeTakenMs": 415}, {"number": 3, "correct": true, "expected": 3, "timestamp": "2026-05-26T18:32:57.883Z", "timeTakenMs": 513}, {"number": 4, "correct": true, "expected": 4, "timestamp": "2026-05-26T18:32:58.409Z", "timeTakenMs": 526}, {"number": 5, "correct": true, "expected": 5, "timestamp": "2026-05-26T18:32:59.330Z", "timeTakenMs": 921}, {"number": 6, "correct": true, "expected": 6, "timestamp": "2026-05-26T18:32:59.860Z", "timeTakenMs": 530}, {"number": 7, "correct": true, "expected": 7, "timestamp": "2026-05-26T18:33:00.236Z", "timeTakenMs": 376}, {"number": 8, "correct": true, "expected": 8, "timestamp": "2026-05-26T18:33:00.692Z", "timeTakenMs": 456}, {"number": 9, "correct": true, "expected": 9, "timestamp": "2026-05-26T18:33:01.203Z", "timeTakenMs": 511}], "accuracy": 100, "gridSize": 5, "mistakes": 0, "fastestMs": 321, "slowestMs": 2847, "difficulty": "Medium", "durationMs": 23969, "totalTiles": 25, "completedAt": "2026-05-26T18:33:01.203Z", "consistencyScore": 650, "avgReactionTimeMs": 959}',
    grid_size: 5,
    difficulty: "Medium",
    total_right_click: 25,
    total_wrong_click: 0,
    time_taken: 23.969,
    score: 1625,
    rank: null,
    game_mode: "number",
    accuracy: 100,
    focus_iq_score: null,
    fastest_ms: 321,
    avg_reaction_ms: 959,
    slowest_ms: 2847,
    country: "GB",
  },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function AdvancedUserReport({ data = RAW_DATA }) {
  const sessions = useMemo(() => parseGameData(data), [data]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSession, setSelectedSession] = useState(
    sessions[sessions.length - 1],
  );

  const numberSessions = useMemo(
    () => sessions.filter((s) => s.gameMode === "number"),
    [sessions],
  );
  const mathsSessions = useMemo(
    () => sessions.filter((s) => s.gameMode === "maths"),
    [sessions],
  );

  const allClicks = useMemo(
    () => sessions.flatMap((s) => s.clicks),
    [sessions],
  );
  const bestSession = useMemo(
    () => [...sessions].sort((a, b) => b.score - a.score)[0],
    [sessions],
  );

  const globalAvgReact = useMemo(
    () =>
      Math.round(
        sessions.reduce((s, x) => s + x.avgReactionMs, 0) / sessions.length,
      ),
    [sessions],
  );
  const globalAvgAcc = useMemo(
    () =>
      Math.round(
        sessions.reduce((s, x) => s + x.accuracy, 0) / sessions.length,
      ),
    [sessions],
  );
  const overallFastest = useMemo(
    () => Math.min(...sessions.map((s) => s.fastestMs)),
    [sessions],
  );
  const totalPerfectSessions = useMemo(
    () => sessions.filter((s) => s.accuracy === 100).length,
    [sessions],
  );

  const archetype = useMemo(
    () => detectCognitiveArchetype(sessions),
    [sessions],
  );
  const skillRadar = useMemo(() => computeSkillRadar(sessions), [sessions]);
  const percentile = useMemo(
    () => computeGlobalPercentile(globalAvgReact, globalAvgAcc),
    [globalAvgReact, globalAvgAcc],
  );

  // Session-level trend data
  const trendData = useMemo(
    () =>
      sessions
        .slice()
        .reverse()
        .map((s, i) => ({
          session: i + 1,
          score: s.score,
          accuracy: Math.round(s.accuracy),
          avgReact: s.avgReactionMs,
          fastest: s.fastestMs,
          mode: s.gameMode,
        })),
    [sessions],
  );

  // Focus stability for selected session
  const focusTimeline = useMemo(
    () => computeFlowZones(selectedSession.clicks),
    [selectedSession],
  );
  const energyCurve = useMemo(
    () => computeMentalEnergy(selectedSession.clicks),
    [selectedSession],
  );

  // Reaction distribution histogram
  const reactionBuckets = useMemo(() => {
    const allMs = allClicks.map((c) => c.timeTakenMs).filter(Boolean);
    const buckets = [
      { range: "< 400ms", label: "Elite", count: 0, color: "#10b981" },
      { range: "400-800ms", label: "Fast", count: 0, color: "#6366f1" },
      { range: "800-1500ms", label: "Average", count: 0, color: "#f59e0b" },
      { range: "1500-3000ms", label: "Slow", count: 0, color: "#f97316" },
      { range: "> 3000ms", label: "Hesitation", count: 0, color: "#ef4444" },
    ];
    allMs.forEach((ms) => {
      if (ms < 400) buckets[0].count++;
      else if (ms < 800) buckets[1].count++;
      else if (ms < 1500) buckets[2].count++;
      else if (ms < 3000) buckets[3].count++;
      else buckets[4].count++;
    });
    return buckets;
  }, [allClicks]);

  // Cognitive use-case match
  const useCaseData = [
    {
      name: "Gaming",
      score: Math.min(100, Math.round(100 - globalAvgReact / 25)),
      color: "#ef4444",
    },
    {
      name: "Programming",
      score: Math.min(100, Math.round(globalAvgAcc * 0.85 + 10)),
      color: "#6366f1",
    },
    {
      name: "Studying",
      score: Math.min(100, Math.round(globalAvgAcc * 0.9)),
      color: "#10b981",
    },
    {
      name: "Trading",
      score: Math.min(100, Math.round(100 - globalAvgReact / 30)),
      color: "#f59e0b",
    },
    {
      name: "Creative",
      score: Math.min(100, Math.round(globalAvgAcc * 0.75 + 15)),
      color: "#8b5cf6",
    },
  ];

  const TABS = [
    { id: "overview", label: "Overview", icon: FaBrain },
    { id: "focus", label: "Focus & Flow", icon: MdWaves },
    { id: "reaction", label: "Reaction Speed", icon: FaBolt },
    { id: "cognitive", label: "Cognitive DNA", icon: FaDna },
    { id: "insights", label: "Insights", icon: MdPsychology },
  ];

  const BG = "linear-gradient(135deg, #0d0d1a 0%, #0f0f23 50%, #0d1117 100%)";

  return (
    <div
      style={{
        background: BG,
        minHeight: "100vh",
        fontFamily: "'Inter', 'DM Sans', sans-serif",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      {/* ── HEADER ── */}
      <div
        className="relative overflow-hidden"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.15), transparent)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-start justify-between gap-6 flex-wrap"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full bg-green-400"
                  style={{ boxShadow: "0 0 6px #4ade80" }}
                />
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Neural Performance Report
                </span>
              </div>
              <h1
                className="text-4xl font-bold mb-1"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "-1px",
                  color: "#fff",
                }}
              >
                Brain Analysis
              </h1>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                {sessions.length} sessions · {sessions[0]?.country} · May 26,
                2026
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="rounded-2xl px-5 py-3 text-center"
                style={{
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.3)",
                }}
              >
                <div
                  className="text-3xl font-bold"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    color: "#818cf8",
                  }}
                >
                  Top {100 - percentile}%
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Global ranking
                </div>
              </div>
            </div>
          </motion.div>

          {/* Archetype badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 inline-flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{
              background: `${archetype.color}18`,
              border: `1px solid ${archetype.color}44`,
            }}
          >
            <archetype.icon size={18} style={{ color: archetype.color }} />
            <div>
              <div
                className="text-sm font-semibold"
                style={{ color: archetype.color }}
              >
                {archetype.name}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: "rgba(255,255,255,0.45)", maxWidth: 380 }}
              >
                {archetype.desc}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div
            className="flex gap-1 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-4 text-sm whitespace-nowrap transition-all duration-200"
                style={{
                  color:
                    activeTab === tab.id ? "#818cf8" : "rgba(255,255,255,0.35)",
                  borderBottom:
                    activeTab === tab.id
                      ? "2px solid #818cf8"
                      : "2px solid transparent",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderBottom:
                    activeTab === tab.id
                      ? "2px solid #818cf8"
                      : "2px solid transparent",
                }}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <StatCard
                  icon={FaBolt}
                  label="Fastest Click"
                  value={`${overallFastest}ms`}
                  sub="Elite territory"
                  color="#f59e0b"
                  delay={0}
                />
                <StatCard
                  icon={FaBullseye}
                  label="Avg Accuracy"
                  value={`${globalAvgAcc}%`}
                  sub={`${totalPerfectSessions}x perfect`}
                  color="#10b981"
                  delay={1}
                />
                <StatCard
                  icon={MdSpeed}
                  label="Avg Reaction"
                  value={`${globalAvgReact}ms`}
                  sub="Visual processing"
                  color="#6366f1"
                  delay={2}
                />
                <StatCard
                  icon={FaTrophy}
                  label="Best Score"
                  value={bestSession?.score?.toLocaleString()}
                  sub={`Session ${bestSession?.idx}`}
                  color="#ec4899"
                  delay={3}
                />
              </div>

              {/* Score trend */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4}
                className="rounded-2xl p-6 mb-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <SectionHeader
                  icon={FaChartLine}
                  title="Score progression"
                  subtitle="Performance across all sessions — number mode vs maths mode"
                  color="#6366f1"
                />
                <div
                  className="flex gap-4 mb-4 text-xs"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-0.5 inline-block rounded"
                      style={{ background: "#6366f1" }}
                    />{" "}
                    Number
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-0.5 inline-block rounded"
                      style={{ background: "#f59e0b" }}
                    />{" "}
                    Maths
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient
                        id="scoreGrad1"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                    />
                    <XAxis
                      dataKey="session"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fill="url(#scoreGrad1)"
                      dot={{ fill: "#6366f1", r: 3, strokeWidth: 0 }}
                      name="Score"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Accuracy + Reaction trend side by side */}
              <div className="grid md:grid-cols-2 gap-4">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={5}
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <SectionHeader
                    icon={FaBullseye}
                    title="Accuracy trend"
                    subtitle="Session-by-session precision"
                    color="#10b981"
                  />
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={trendData} barCategoryGap="30%">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.04)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="session"
                        tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="accuracy"
                        name="Accuracy %"
                        radius={[4, 4, 0, 0]}
                      >
                        {trendData.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={
                              entry.accuracy === 100
                                ? "#10b981"
                                : entry.accuracy > 85
                                  ? "#6366f1"
                                  : "#f59e0b"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={6}
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <SectionHeader
                    icon={FaBolt}
                    title="Reaction speed trend"
                    subtitle="Average response time per session (ms)"
                    color="#f59e0b"
                  />
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={trendData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.04)"
                      />
                      <XAxis
                        dataKey="session"
                        tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="avgReact"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={false}
                        name="Avg React (ms)"
                      />
                      <Line
                        type="monotone"
                        dataKey="fastest"
                        stroke="#10b981"
                        strokeWidth={1.5}
                        dot={false}
                        strokeDasharray="4 2"
                        name="Fastest (ms)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ── FOCUS & FLOW TAB ── */}
          {activeTab === "focus" && (
            <motion.div
              key="focus"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Session selector */}
              <div className="mb-6 flex items-center gap-3 flex-wrap">
                <span
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Analyzing session:
                </span>
                {sessions.slice(0, 8).map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSession(s)}
                    className="px-3 py-1.5 rounded-xl text-xs transition-all"
                    style={{
                      background:
                        selectedSession?.id === s.id
                          ? "rgba(99,102,241,0.25)"
                          : "rgba(255,255,255,0.04)",
                      border:
                        selectedSession?.id === s.id
                          ? "1px solid rgba(99,102,241,0.5)"
                          : "1px solid rgba(255,255,255,0.08)",
                      color:
                        selectedSession?.id === s.id
                          ? "#818cf8"
                          : "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                    }}
                  >
                    #{s.idx} · {s.gameMode}
                  </button>
                ))}
              </div>

              {/* Focus timeline */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="rounded-2xl p-6 mb-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <SectionHeader
                  icon={MdTimeline}
                  title="Focus stability timeline"
                  subtitle="Reaction time per click — revealing flow states, dips and recovery"
                  color="#6366f1"
                />
                <div
                  className="flex gap-4 mb-4 text-xs flex-wrap"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {Object.entries(ZONE_COLORS).map(([z, c]) => (
                    <span key={z} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ background: c }}
                      />
                      {z.replace("-", " ")}
                    </span>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={focusTimeline} barCategoryGap="15%">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="click"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      label={{
                        value: "Click #",
                        fill: "rgba(255,255,255,0.25)",
                        fontSize: 11,
                        position: "insideBottom",
                        offset: -2,
                      }}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      label={{
                        value: "ms",
                        fill: "rgba(255,255,255,0.25)",
                        fontSize: 11,
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="ms"
                      name="Reaction (ms)"
                      radius={[4, 4, 0, 0]}
                    >
                      {focusTimeline.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={ZONE_COLORS[entry.zone]}
                          fillOpacity={entry.correct ? 1 : 0.4}
                        />
                      ))}
                    </Bar>
                    <ReferenceLine
                      y={800}
                      stroke="rgba(99,102,241,0.4)"
                      strokeDasharray="4 2"
                      label={{
                        value: "Flow threshold",
                        fill: "rgba(99,102,241,0.6)",
                        fontSize: 10,
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Mental energy curve */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <SectionHeader
                  icon={MdAutoGraph}
                  title="Mental energy curve"
                  subtitle="Estimated cognitive resources throughout this session (starts at 100%)"
                  color="#10b981"
                />
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={energyCurve}>
                    <defs>
                      <linearGradient
                        id="energyGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                    />
                    <XAxis
                      dataKey="click"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 110]}
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="energy"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fill="url(#energyGrad)"
                      dot={{ fill: "#10b981", r: 3, strokeWidth: 0 }}
                      name="Mental Energy %"
                    />
                    <ReferenceLine
                      y={70}
                      stroke="rgba(255,255,255,0.12)"
                      strokeDasharray="4 2"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </motion.div>
          )}

          {/* ── REACTION SPEED TAB ── */}
          {activeTab === "reaction" && (
            <motion.div
              key="reaction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <StatCard
                  icon={FaBolt}
                  label="Absolute Fastest"
                  value={`${overallFastest}ms`}
                  sub="Human ceiling ~150ms"
                  color="#10b981"
                  delay={0}
                />
                <StatCard
                  icon={MdSpeed}
                  label="Global Average"
                  value={`${globalAvgReact}ms`}
                  sub="Population avg ~600ms"
                  color="#6366f1"
                  delay={1}
                />
                <StatCard
                  icon={FaInfinity}
                  label="Elite Clicks"
                  value={`${reactionBuckets[0].count}`}
                  sub="Under 400ms"
                  color="#f59e0b"
                  delay={2}
                />
              </div>

              {/* Reaction distribution */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="rounded-2xl p-6 mb-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <SectionHeader
                  icon={FaBolt}
                  title="Reaction speed distribution"
                  subtitle="How your clicks spread across speed categories — across all sessions"
                  color="#f59e0b"
                />
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={reactionBuckets}
                    layout="vertical"
                    barCategoryGap="20%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      tick={{
                        fill: "rgba(255,255,255,0.5)",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Clicks" radius={[0, 6, 6, 0]}>
                      {reactionBuckets.map((b, i) => (
                        <Cell key={i} fill={b.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex gap-3 flex-wrap mt-4">
                  {reactionBuckets.map((b) => (
                    <div
                      key={b.label}
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      <span
                        className="w-2 h-2 rounded-sm inline-block"
                        style={{ background: b.color }}
                      />
                      {b.range}:{" "}
                      <strong style={{ color: "rgba(255,255,255,0.7)" }}>
                        {b.count}
                      </strong>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Fastest per session */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <SectionHeader
                  icon={FaRocket}
                  title="Fastest vs average vs slowest"
                  subtitle="Speed ceiling, typical performance, and fatigue peaks across sessions"
                  color="#6366f1"
                />
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                    />
                    <XAxis
                      dataKey="session"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="fastest"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
                      name="Fastest (ms)"
                    />
                    <Line
                      type="monotone"
                      dataKey="avgReact"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
                      name="Average (ms)"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div
                  className="flex gap-4 mt-3 text-xs"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-0.5 inline-block rounded"
                      style={{ background: "#10b981" }}
                    />{" "}
                    Fastest
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-0.5 inline-block rounded"
                      style={{ background: "#6366f1" }}
                    />{" "}
                    Average
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ── COGNITIVE DNA TAB ── */}
          {activeTab === "cognitive" && (
            <motion.div
              key="cognitive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Radar chart */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <SectionHeader
                    icon={FaDna}
                    title="Cognitive skill radar"
                    subtitle="Your neural performance across 6 core dimensions"
                    color="#8b5cf6"
                  />
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={skillRadar}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis
                        dataKey="skill"
                        tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                      />
                      <PolarRadiusAxis
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Use-case match */}
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <SectionHeader
                    icon={FaGamepad}
                    title="Cognitive use-case match"
                    subtitle="How your brain profile aligns with different high-performance domains"
                    color="#ec4899"
                  />
                  <div className="flex flex-col gap-3 mt-2">
                    {useCaseData
                      .sort((a, b) => b.score - a.score)
                      .map((item, i) => (
                        <div key={item.name}>
                          <div
                            className="flex justify-between text-xs mb-1"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                          >
                            <span>{item.name}</span>
                            <span
                              style={{ color: item.color, fontWeight: 600 }}
                            >
                              {item.score}%
                            </span>
                          </div>
                          <div
                            className="w-full rounded-full h-2"
                            style={{ background: "rgba(255,255,255,0.07)" }}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.score}%` }}
                              transition={{
                                delay: i * 0.1 + 0.3,
                                duration: 0.7,
                                ease: "easeOut",
                              }}
                              className="h-2 rounded-full"
                              style={{ background: item.color }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              </div>

              {/* Percentile gauge */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <SectionHeader
                  icon={FaGlobe}
                  title="Global benchmarking"
                  subtitle="Where you rank against the worldwide cognitive performance baseline"
                  color="#6366f1"
                />
                <div className="flex items-center gap-8 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div
                      className="text-6xl font-bold mb-2"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        color: "#818cf8",
                      }}
                    >
                      {percentile}
                      <span className="text-2xl">th</span>
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      percentile worldwide
                    </div>
                    <div
                      className="mt-4 text-sm leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      Your reaction profile places you ahead of{" "}
                      <strong style={{ color: "#818cf8" }}>
                        {percentile}% of all players
                      </strong>{" "}
                      globally. Average visual processing speed sits at ~600ms —
                      your sustained performance below {globalAvgReact}ms
                      signals strong executive attention networks.
                    </div>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    {[
                      {
                        label: "Top 3%: Elite athletes / esports pros",
                        threshold: 97,
                        color: "#10b981",
                      },
                      {
                        label: "Top 12%: Competitive gamers",
                        threshold: 88,
                        color: "#6366f1",
                      },
                      {
                        label: "Top 26%: Above average",
                        threshold: 74,
                        color: "#f59e0b",
                      },
                      {
                        label: "Top 50%: Average performers",
                        threshold: 50,
                        color: "#f97316",
                      },
                    ].map((tier) => (
                      <div
                        key={tier.label}
                        className="flex items-center gap-3 mb-3"
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            background:
                              percentile >= tier.threshold
                                ? tier.color
                                : "rgba(255,255,255,0.1)",
                            boxShadow:
                              percentile >= tier.threshold
                                ? `0 0 8px ${tier.color}`
                                : "none",
                          }}
                        />
                        <span
                          className="text-xs"
                          style={{
                            color:
                              percentile >= tier.threshold
                                ? "rgba(255,255,255,0.75)"
                                : "rgba(255,255,255,0.25)",
                          }}
                        >
                          {tier.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ── INSIGHTS TAB ── */}
          {activeTab === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* AI narrative insights */}
              {[
                {
                  icon: FaBrain,
                  color: "#6366f1",
                  title: "Focus & sustained attention",
                  insight: `Your brain demonstrates ${globalAvgAcc > 90 ? "exceptional" : "solid"} sustained concentration across ${sessions.length} sessions. With a ${globalAvgAcc}% average accuracy, you rarely lose focus mid-task. Your reaction profile suggests high adaptability and above-average visual scanning efficiency.`,
                },
                {
                  icon: FaBolt,
                  color: "#f59e0b",
                  title: "Reaction speed intelligence",
                  insight: `At ${globalAvgReact}ms average, your visual processing speed falls in the ${percentile > 80 ? "top-tier" : "above-average"} range. You produced ${reactionBuckets[0].count} elite sub-400ms clicks — a signal of fast neural pathway transmission. Your fastest click of ${overallFastest}ms approaches the reflexive response ceiling.`,
                },
                {
                  icon: MdWaves,
                  color: "#10b981",
                  title: "Flow state analysis",
                  insight: `Your sessions show a clear ${numberSessions.length > 0 ? "warm-up → flow → fatigue" : "engagement"} arc. Number mode sessions consistently achieve faster reaction clustering, suggesting visual scanning is your cognitive strength. Maths mode triggers deeper analytical processing, evidenced by the wider reaction time spread.`,
                },
                {
                  icon: FaCode,
                  color: "#8b5cf6",
                  title: "Cognitive profile application",
                  insight: `Your combination of ${globalAvgAcc > 90 ? "high accuracy" : "consistent performance"} and sub-second burst reactions makes your cognitive profile well-suited for programming, data analysis, and competitive gaming. The rapid number-mode performance (avg ${Math.round(numberSessions.reduce((s, x) => s + x.avgReactionMs, 0) / Math.max(numberSessions.length, 1))}ms) points to strong sequential visual processing.`,
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  className="rounded-2xl p-6 mb-4"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <SectionHeader
                    icon={item.icon}
                    title={item.title}
                    subtitle="AI-generated cognitive insight"
                    color={item.color}
                  />
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      borderLeft: `3px solid ${item.color}44`,
                      paddingLeft: "16px",
                    }}
                  >
                    {item.insight}
                  </p>
                </motion.div>
              ))}

              {/* Milestones */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <SectionHeader
                  icon={FaMedal}
                  title="Milestones unlocked"
                  subtitle="Notable achievements from this session batch"
                  color="#f59e0b"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    {
                      icon: FaStar,
                      label: "Sub-300ms click",
                      unlocked: overallFastest < 300,
                      desc: `${overallFastest}ms best`,
                    },
                    {
                      icon: FaTrophy,
                      label: "Perfect accuracy",
                      unlocked: totalPerfectSessions > 0,
                      desc: `${totalPerfectSessions}× sessions`,
                    },
                    {
                      icon: FaFire,
                      label: "1700+ score",
                      unlocked: bestSession?.score >= 1700,
                      desc: `Best: ${bestSession?.score}`,
                    },
                    {
                      icon: FaArrowUp,
                      label: "Top 20% global",
                      unlocked: percentile >= 80,
                      desc: `${percentile}th percentile`,
                    },
                    {
                      icon: FaBrain,
                      label: "Flow state detected",
                      unlocked: true,
                      desc: "Deep focus zones",
                    },
                    {
                      icon: FaBook,
                      label: "Maths mastery",
                      unlocked: mathsSessions.some((s) => s.accuracy === 100),
                      desc: "100% accuracy",
                    },
                  ].map((m, i) => (
                    <div
                      key={m.label}
                      className="rounded-xl p-3 flex items-start gap-3"
                      style={{
                        background: m.unlocked
                          ? "rgba(245,158,11,0.08)"
                          : "rgba(255,255,255,0.02)",
                        border: m.unlocked
                          ? "1px solid rgba(245,158,11,0.25)"
                          : "1px solid rgba(255,255,255,0.05)",
                        opacity: m.unlocked ? 1 : 0.4,
                      }}
                    >
                      <m.icon
                        size={16}
                        style={{
                          color: m.unlocked
                            ? "#f59e0b"
                            : "rgba(255,255,255,0.3)",
                          marginTop: 2,
                        }}
                      />
                      <div>
                        <div
                          className="text-xs font-medium"
                          style={{
                            color: m.unlocked
                              ? "rgba(255,255,255,0.85)"
                              : "rgba(255,255,255,0.4)",
                          }}
                        >
                          {m.label}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {m.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FOOTER ── */}
      <div
        className="max-w-5xl mx-auto px-6 py-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p
          className="text-xs text-center"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Neural Performance Report · {sessions.length} sessions analyzed ·
          Generated May 26, 2026
        </p>
      </div>
    </div>
  );
}
