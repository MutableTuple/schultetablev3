"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/app/_lib/supabase";

// ─── Helpers ────────────────────────────────────────────────────────────────

function safeDiv(a, b, fallback = 0) {
  return b > 0 ? a / b : fallback;
}

function clamp(val, min = 0, max = 100) {
  return Math.min(max, Math.max(min, val));
}

function stdDev(arr) {
  if (!arr.length) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance =
    arr.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

function parseSummary(row) {
  if (!row.game_summary) return null;
  try {
    return typeof row.game_summary === "string"
      ? JSON.parse(row.game_summary)
      : row.game_summary;
  } catch {
    return null;
  }
}

// ─── Brain Metrics ───────────────────────────────────────────────────────────

function computeBrainScore({
  avgAccuracy,
  avgReactionTime,
  consistency,
  totalGames,
}) {
  const accuracyComponent = avgAccuracy * 0.35;
  const speedComponent = safeDiv(1000, avgReactionTime) * 20;
  const consistencyComponent = consistency * 0.25;
  const experienceComponent = Math.log10(totalGames + 1) * 15;
  return Math.round(
    clamp(
      accuracyComponent +
        speedComponent +
        consistencyComponent +
        experienceComponent,
      0,
      100,
    ),
  );
}

function computeFocusIQ({ avgAccuracy, consistency, avgReactionTime }) {
  const speedIndex = clamp(safeDiv(1000, avgReactionTime) * 50, 0, 100);
  return Math.round(
    clamp(avgAccuracy * 0.4 + consistency * 0.3 + speedIndex * 0.3, 0, 100) *
      1.5 +
      70,
  );
}

function computeFlowState({ avgAccuracy, consistency, fatigueScore }) {
  return Math.round(
    clamp(avgAccuracy * 0.4 + consistency * 0.35 + (100 - fatigueScore) * 0.25),
  );
}

// ─── Consistency & Stability ─────────────────────────────────────────────────

function computeConsistency(gameData) {
  const accuracies = gameData.map((g) => g.accuracy || 0).filter(Boolean);
  if (!accuracies.length) return 0;
  const sd = stdDev(accuracies);
  return Math.round(clamp(100 - sd));
}

function computeCognitiveStability(gameData) {
  const reactionTimes = gameData.map((g) => g.avg_reaction_ms).filter(Boolean);
  if (!reactionTimes.length) return 0;
  const avg = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
  const sd = stdDev(reactionTimes);
  return Math.round(clamp(100 - safeDiv(sd, avg) * 100));
}

// ─── Speed Metrics ───────────────────────────────────────────────────────────

function getSpeedTier(avgReactionTime) {
  if (avgReactionTime < 300) return "Lightning";
  if (avgReactionTime < 450) return "Elite";
  if (avgReactionTime < 600) return "Advanced";
  if (avgReactionTime < 800) return "Average";
  return "Developing";
}

function computeSpeedImprovement(gameData) {
  if (gameData.length < 6) return null;
  const sorted = [...gameData].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );
  const half = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, half);
  const secondHalf = sorted.slice(half);
  const avgOld =
    firstHalf.reduce((a, g) => a + (g.avg_reaction_ms || 0), 0) /
    firstHalf.length;
  const avgNew =
    secondHalf.reduce((a, g) => a + (g.avg_reaction_ms || 0), 0) /
    secondHalf.length;
  return Math.round(((avgOld - avgNew) / avgOld) * 100);
}

// ─── Fatigue & Endurance ─────────────────────────────────────────────────────

function computeFatigueMetrics(gameData) {
  const fatigueScores = [];
  const recoveryCounts = [];

  for (const row of gameData) {
    const summary = parseSummary(row);
    if (!summary?.clicks?.length) continue;

    const clicks = summary.clicks;
    const third = Math.floor(clicks.length / 3);
    if (third < 1) continue;

    const firstThird = clicks.slice(0, third).map((c) => c.timeTakenMs);
    const lastThird = clicks.slice(-third).map((c) => c.timeTakenMs);

    const avgFirst = firstThird.reduce((a, b) => a + b, 0) / firstThird.length;
    const avgLast = lastThird.reduce((a, b) => a + b, 0) / lastThird.length;

    const fatigue = safeDiv(avgLast - avgFirst, avgFirst) * 100;
    fatigueScores.push(fatigue);

    for (let i = 1; i < clicks.length; i++) {
      if (!clicks[i - 1].correct && clicks[i].correct) {
        recoveryCounts.push(clicks[i].timeTakenMs);
      }
    }
  }

  const avgFatigue = fatigueScores.length
    ? fatigueScores.reduce((a, b) => a + b, 0) / fatigueScores.length
    : 0;

  const avgRecoveryTime = recoveryCounts.length
    ? recoveryCounts.reduce((a, b) => a + b, 0) / recoveryCounts.length
    : null;

  const recoveryScore = avgRecoveryTime
    ? Math.round(clamp(100 - safeDiv(avgRecoveryTime - 500, 1500) * 100))
    : null;

  return {
    fatigueScore: Math.round(clamp(avgFatigue, 0, 100)),
    fatiguePercentage: Math.round(clamp(avgFatigue, 0, 100)),
    recoveryScore,
    focusEndurance:
      avgFatigue < 5
        ? "Elite"
        : avgFatigue < 15
          ? "Strong"
          : avgFatigue < 30
            ? "Average"
            : "Developing",
  };
}

// ─── Hesitation & Attention Drift ────────────────────────────────────────────

function computeFocusMetrics(gameData) {
  const hesitationCounts = [];
  const attentionDrifts = [];
  const momentumScores = [];

  for (const row of gameData) {
    const summary = parseSummary(row);
    if (!summary?.clicks?.length) continue;
    const clicks = summary.clicks;

    const hesitations = clicks.filter((c) => c.timeTakenMs > 1500).length;
    hesitationCounts.push(hesitations);

    const times = clicks.map((c) => c.timeTakenMs);
    const sd = stdDev(times);
    const mean = times.reduce((a, b) => a + b, 0) / times.length;
    attentionDrifts.push(safeDiv(sd, mean) * 100);

    if (clicks.length >= 4) {
      const firstHalf = clicks
        .slice(0, Math.floor(clicks.length / 2))
        .map((c) => c.timeTakenMs);
      const secondHalf = clicks
        .slice(Math.floor(clicks.length / 2))
        .map((c) => c.timeTakenMs);
      const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const avgSecond =
        secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      momentumScores.push(avgFirst > avgSecond ? 1 : 0);
    }
  }

  const avgHesitation = hesitationCounts.length
    ? hesitationCounts.reduce((a, b) => a + b, 0) / hesitationCounts.length
    : 0;
  const avgDrift = attentionDrifts.length
    ? attentionDrifts.reduce((a, b) => a + b, 0) / attentionDrifts.length
    : 0;
  const momentumRate = momentumScores.length
    ? (momentumScores.reduce((a, b) => a + b, 0) / momentumScores.length) * 100
    : 0;

  return {
    hesitationIndex: Math.round(avgHesitation * 10) / 10,
    attentionDrift: Math.round(clamp(100 - avgDrift)),
    momentumScore: Math.round(momentumRate),
    accelerates: momentumRate >= 50,
  };
}

// ─── Peak Performance Window ─────────────────────────────────────────────────

function computePeakWindow(gameData) {
  const hourMap = {};

  for (const row of gameData) {
    const hour = new Date(row.created_at).getHours();
    if (!hourMap[hour]) hourMap[hour] = { total: 0, count: 0 };
    hourMap[hour].total += row.accuracy || 0;
    hourMap[hour].count++;
  }

  let bestHour = null;
  let bestAccuracy = 0;

  for (const [hour, val] of Object.entries(hourMap)) {
    const avg = safeDiv(val.total, val.count);
    if (avg > bestAccuracy) {
      bestAccuracy = avg;
      bestHour = parseInt(hour);
    }
  }

  if (bestHour === null) return null;

  const fmt = (h) => {
    const suffix = h >= 12 ? "PM" : "AM";
    const display = h % 12 === 0 ? 12 : h % 12;
    return `${display}${suffix}`;
  };

  return {
    startHour: bestHour,
    endHour: (bestHour + 2) % 24,
    label: `${fmt(bestHour)} – ${fmt((bestHour + 2) % 24)}`,
    avgAccuracy: Math.round(bestAccuracy * 10) / 10,
  };
}

// ─── Mastery Breakdown ───────────────────────────────────────────────────────

function computeMasteryMetrics(gameData) {
  const difficultyMap = {};
  const gridMap = {};

  for (const row of gameData) {
    const diff = row.difficulty || "Unknown";
    const grid = `${row.grid_size}x${row.grid_size}`;

    if (!difficultyMap[diff]) difficultyMap[diff] = { total: 0, count: 0 };
    difficultyMap[diff].total += row.accuracy || 0;
    difficultyMap[diff].count++;

    if (!gridMap[grid]) gridMap[grid] = { total: 0, count: 0 };
    gridMap[grid].total += row.accuracy || 0;
    gridMap[grid].count++;
  }

  const difficultyMastery = Object.entries(difficultyMap).reduce(
    (acc, [key, val]) => {
      acc[key] = Math.round(safeDiv(val.total, val.count) * 10) / 10;
      return acc;
    },
    {},
  );

  const gridSizeMastery = Object.entries(gridMap).reduce((acc, [key, val]) => {
    acc[key] = Math.round(safeDiv(val.total, val.count) * 10) / 10;
    return acc;
  }, {});

  return { difficultyMastery, gridSizeMastery };
}

// ─── Improvement Trends ──────────────────────────────────────────────────────

function computeTrends(gameData) {
  if (gameData.length < 6)
    return { accuracyTrend: null, reactionTrend: null, scoreTrend: null };

  const sorted = [...gameData].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );
  const half = Math.floor(sorted.length / 2);
  const old = sorted.slice(0, half);
  const recent = sorted.slice(half);

  const avg = (arr, key) =>
    arr.reduce((a, g) => a + (g[key] || 0), 0) / arr.length;

  const oldAcc = avg(old, "accuracy");
  const newAcc = avg(recent, "accuracy");
  const oldRT = avg(old, "avg_reaction_ms");
  const newRT = avg(recent, "avg_reaction_ms");
  const oldScore = avg(old, "score");
  const newScore = avg(recent, "score");

  return {
    accuracyTrend: Math.round((newAcc - oldAcc) * 10) / 10,
    reactionTrend: Math.round(oldRT - newRT), // positive = improved (faster)
    scoreTrend: Math.round(((newScore - oldScore) / oldScore) * 100),
  };
}

// ─── Mental Profile ──────────────────────────────────────────────────────────

function getMentalProfile({ avgAccuracy, avgReactionTime, consistency }) {
  const isAccurate = avgAccuracy >= 93;
  const isFast = avgReactionTime < 500;
  const isConsistent = consistency >= 85;

  if (isAccurate && isFast && isConsistent) return "Elite Competitor";
  if (isAccurate && isFast) return "Speed Demon";
  if (isAccurate && isConsistent) return "Precision Specialist";
  if (isFast && !isAccurate) return "Aggressive Thinker";
  if (isConsistent) return "Strategic Thinker";
  return "Balanced Performer";
}

// ─── Achievements ────────────────────────────────────────────────────────────

function computeAchievements({ stats, derivedStats, masteryMetrics }) {
  const achievements = [];

  if (stats.avgAccuracy >= 99)
    achievements.push({
      id: "perfect_mind",
      label: "Perfect Mind",
      desc: "99%+ average accuracy",
    });
  if (stats.avgAccuracy >= 95)
    achievements.push({
      id: "precision_master",
      label: "Precision Master",
      desc: "95%+ average accuracy",
    });
  if (stats.totalGames >= 100)
    achievements.push({
      id: "century",
      label: "Century Player",
      desc: "100+ games played",
    });
  if (stats.totalGames >= 50)
    achievements.push({
      id: "dedicated",
      label: "Dedicated Trainer",
      desc: "50+ games played",
    });
  if (derivedStats.consistency >= 90)
    achievements.push({
      id: "consistency_king",
      label: "Consistency King",
      desc: "90%+ consistency score",
    });
  if (stats.avgReactionTime < 400)
    achievements.push({
      id: "lightning",
      label: "Lightning Reflexes",
      desc: "Sub-400ms average reaction",
    });
  if (stats.avgReactionTime < 600)
    achievements.push({
      id: "fast_thinker",
      label: "Fast Thinker",
      desc: "Sub-600ms average reaction",
    });
  if (derivedStats.brainScore >= 90)
    achievements.push({
      id: "brain_elite",
      label: "Brain Elite",
      desc: "90+ Brain Score",
    });
  if (masteryMetrics.difficultyMastery?.Hard >= 90)
    achievements.push({
      id: "hard_master",
      label: "Hard Mode Master",
      desc: "90%+ accuracy on Hard",
    });

  return achievements;
}

// ─── AI Insights ─────────────────────────────────────────────────────────────

function generateInsights({
  stats,
  derivedStats,
  trends,
  focusMetrics,
  fatigueMetrics,
}) {
  const insights = [];

  if (stats.avgAccuracy > 95) {
    insights.push(
      "Your accuracy is exceptional — you prioritize precision over speed.",
    );
  } else if (stats.avgAccuracy < 80) {
    insights.push(
      "Improving accuracy is your highest leverage opportunity right now.",
    );
  }

  if (stats.avgReactionTime < 450) {
    insights.push("Your reaction speed places you in the top tier of players.");
  } else if (stats.avgReactionTime > 700) {
    insights.push(
      "Focusing on reaction speed would significantly improve your Brain Score.",
    );
  }

  if (derivedStats.consistency >= 90) {
    insights.push(
      "Your performance is remarkably stable — you don't choke under pressure.",
    );
  } else if (derivedStats.consistency < 70) {
    insights.push(
      "Your results vary significantly between sessions — consistency training would help.",
    );
  }

  if (trends.accuracyTrend > 3) {
    insights.push(
      `Your accuracy has improved +${trends.accuracyTrend}% over this period.`,
    );
  } else if (trends.accuracyTrend < -3) {
    insights.push(
      "Your accuracy has slightly declined — consider shorter, more focused sessions.",
    );
  }

  if (trends.reactionTrend > 50) {
    insights.push(
      `You're ${trends.reactionTrend}ms faster than when you started this period.`,
    );
  }

  if (fatigueMetrics.fatigueScore < 10) {
    insights.push(
      "You show almost no cognitive fatigue — your focus endurance is elite.",
    );
  } else if (fatigueMetrics.fatigueScore > 30) {
    insights.push(
      "Your reaction time increases toward the end of sessions — rest between games may help.",
    );
  }

  if (focusMetrics.accelerates) {
    insights.push(
      "You warm up well — your speed increases as you get into the session.",
    );
  }

  if (focusMetrics.hesitationIndex > 1) {
    insights.push(
      "You occasionally hesitate mid-game — this is a key area to sharpen.",
    );
  }

  return insights;
}

// ─── Main Hook ───────────────────────────────────────────────────────────────

export function useGameAnalytics(user) {
  const [gameData, setGameData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [rankData, setRankData] = useState(null); // ← dedicated rank state
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("28d");
  const [customRange, setCustomRange] = useState({ from: null, to: null });

  const getDateFilters = () => {
    const now = new Date();
    let from = null;
    let to = null;

    switch (dateRange) {
      case "28d":
        from = new Date();
        from.setDate(now.getDate() - 28);
        break;
      case "3m":
        from = new Date();
        from.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        from = new Date();
        from.setMonth(now.getMonth() - 6);
        break;
      case "custom":
        from = customRange.from;
        to = customRange.to;
        break;
      default:
        break;
    }

    return { from, to };
  };

  const fetchGameData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { from, to } = getDateFilters();

    // ── 1. Analytics RPC ──────────────────────────────────────────────────
    const { data: analyticsData } = await supabase.rpc("get_user_analytics", {
      p_user_id: user.id,
      p_from: from ? from.toISOString() : null,
      p_to: to ? to.toISOString() : null,
    });

    if (analyticsData?.length) {
      setAnalytics(analyticsData[0]);
    }

    // ── 2. Rank RPC ───────────────────────────────────────────────────────
    const { data: rankResult, error: rankError } = await supabase.rpc(
      "get_user_rank",
      { uid: user.id },
    );

    if (!rankError && rankResult?.[0]) {
      setRankData(rankResult[0]); // { rank, percentile? }
    }

    // ── 3. Game rows ──────────────────────────────────────────────────────
    let query = supabase
      .from("UniversalGameStats")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(0, 200);

    if (from) query = query.gte("created_at", from.toISOString());
    if (to) query = query.lte("created_at", to.toISOString());
    if (!user.is_pro_user) query = query.limit(5);

    const { data } = await query;
    setGameData(data || []);
    setLoading(false);
  }, [user, dateRange, customRange]);

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  // ── Raw Stats ──────────────────────────────────────────────────────────────
  const totalGames = analytics?.total_games || 0;
  const totalScore = analytics?.total_score || 0;
  const totalRightClicks = analytics?.total_right_clicks || 0;
  const totalWrongClicks = analytics?.total_wrong_clicks || 0;
  const avgAccuracy = analytics?.avg_accuracy || 0;
  const avgReactionTime = analytics?.avg_reaction_time || 0;
  const avgDuration = analytics?.avg_duration || 0;

  // ── Rank — dedicated state, never stale ───────────────────────────────────
  const globalRank =
    rankData?.rank ?? analytics?.global_rank ?? analytics?.rank ?? null;
  const percentile = rankData?.percentile ?? analytics?.percentile ?? null;

  const rawStats = {
    totalGames,
    totalScore,
    totalRightClicks,
    totalWrongClicks,
    avgAccuracy,
    avgReactionTime,
    avgDuration,
  };

  // ── Derived Base ──────────────────────────────────────────────────────────
  const totalClicks = totalRightClicks + totalWrongClicks;
  const errorRate =
    Math.round(safeDiv(totalWrongClicks, totalClicks) * 100 * 10) / 10;
  const scorePerGame = Math.round(safeDiv(totalScore, totalGames));
  const clicksPerGame =
    Math.round(safeDiv(totalRightClicks, totalGames) * 10) / 10;

  const consistency = computeConsistency(gameData);
  const cognitiveStability = computeCognitiveStability(gameData);

  const brainScore = computeBrainScore({
    avgAccuracy,
    avgReactionTime,
    consistency,
    totalGames,
  });
  const focusIQ = computeFocusIQ({ avgAccuracy, consistency, avgReactionTime });

  // ── Fatigue & Focus ───────────────────────────────────────────────────────
  const fatigueMetrics = computeFatigueMetrics(gameData);
  const { fatigueScore, fatiguePercentage, recoveryScore, focusEndurance } =
    fatigueMetrics;

  const flowStateScore = computeFlowState({
    avgAccuracy,
    consistency,
    fatigueScore,
  });
  const focusMetrics = computeFocusMetrics(gameData);

  // ── Performance ───────────────────────────────────────────────────────────
  const sortedByScore = [...gameData].sort(
    (a, b) => (b.score || 0) - (a.score || 0),
  );
  const bestGame = sortedByScore[0] || null;
  const bestAccuracy = gameData.reduce(
    (max, g) => Math.max(max, g.accuracy || 0),
    0,
  );
  const bestReactionTime = gameData.reduce(
    (min, g) => (g.avg_reaction_ms ? Math.min(min, g.avg_reaction_ms) : min),
    Infinity,
  );
  const fastestEver = gameData.reduce(
    (min, g) => (g.fastest_ms ? Math.min(min, g.fastest_ms) : min),
    Infinity,
  );

  // ── Trends ────────────────────────────────────────────────────────────────
  const trends = computeTrends(gameData);
  const speedImprovement = computeSpeedImprovement(gameData);

  // ── Mastery ───────────────────────────────────────────────────────────────
  const masteryMetrics = computeMasteryMetrics(gameData);

  // ── Peak Window ───────────────────────────────────────────────────────────
  const peakFocusWindow = computePeakWindow(gameData);

  // ── Profile ───────────────────────────────────────────────────────────────
  const mentalProfile = getMentalProfile({
    avgAccuracy,
    avgReactionTime,
    consistency,
  });
  const speedTier = getSpeedTier(avgReactionTime);
  const accuracyTier =
    avgAccuracy > 97
      ? "Master"
      : avgAccuracy > 93
        ? "Excellent"
        : avgAccuracy > 88
          ? "Good"
          : "Developing";

  const derivedStats = {
    brainScore,
    focusIQ,
    flowStateScore,
    consistency,
    cognitiveStability,
    errorRate,
    scorePerGame,
    clicksPerGame,
    focusEndurance,
    speedTier,
    accuracyTier,
    mentalProfile,
  };

  // ── Achievements & Insights ───────────────────────────────────────────────
  const achievements = computeAchievements({
    stats: rawStats,
    derivedStats,
    masteryMetrics,
  });
  const insights = generateInsights({
    stats: rawStats,
    derivedStats,
    trends,
    focusMetrics,
    fatigueMetrics,
  });

  // ── Return ────────────────────────────────────────────────────────────────
  return {
    loading,
    gameData,
    analytics,

    dateRange,
    setDateRange,
    customRange,
    setCustomRange,
    refresh: fetchGameData,

    // Raw aggregated stats (from RPC)
    rawStats,

    // Derived cognition metrics
    brainMetrics: {
      brainScore, // 0–100 composite
      focusIQ, // 70–160 style IQ number
      flowStateScore, // 0–100
      consistency, // 0–100
      cognitiveStability, // 0–100 (reaction time variance)
    },

    // Speed-related
    speedMetrics: {
      fastestEver: fastestEver === Infinity ? null : fastestEver,
      bestReactionTime: bestReactionTime === Infinity ? null : bestReactionTime,
      avgReactionTime,
      speedTier,
      speedImprovement, // % improvement vs earlier period
    },

    // Focus & attention
    focusMetrics: {
      focusEndurance, // "Elite" | "Strong" | "Average" | "Developing"
      attentionDrift: focusMetrics.attentionDrift, // 0–100 (100 = laser focused)
      hesitationIndex: focusMetrics.hesitationIndex, // avg hesitations per game
      momentumScore: focusMetrics.momentumScore, // % of games where user speeds up
      accelerates: focusMetrics.accelerates,
      peakFocusWindow, // { label, avgAccuracy, startHour, endHour }
    },

    // Fatigue
    fatigueMetrics: {
      fatigueScore, // 0–100 (0 = no fatigue)
      fatiguePercentage, // same, for display
      recoveryScore, // 0–100 (how fast after a mistake)
    },

    // Session performance
    performanceMetrics: {
      bestGame, // full row of best scoring game
      bestAccuracy, // highest accuracy in a single game
      errorRate, // % wrong clicks
      scorePerGame, // avg score per game
      clicksPerGame, // avg correct clicks per game
    },

    // Difficulty & grid mastery
    masteryMetrics, // { difficultyMastery: { Easy, Medium, Hard }, gridSizeMastery: { "3x3", "4x4" } }

    // Improvement over time
    trends: {
      ...trends,
      speedImprovement,
    },

    // Ranking — populated from get_user_rank RPC
    rankings: {
      globalRank, // e.g. 2841  — from rankData.rank
      percentile, // e.g. 87   — from rankData.percentile (if your RPC returns it)
    },

    // Gamification
    achievements, // [{ id, label, desc }]

    // AI-generated text insights
    insights, // string[]

    // Single mental archetype
    mentalProfile, // "Elite Competitor" | "Precision Specialist" | etc.

    // Legacy compat
    stats: rawStats,
  };
}
