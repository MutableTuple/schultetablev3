import { supabase } from "../_lib/supabase";

/* ---------------- FETCH GLOBAL STATS ---------------- */

export async function getGlobalReactionStats({
  gridSize,
  difficulty,
  gameMode,
}) {
  const { data, error } = await supabase
    .from("GlobalReactionStats")
    .select("*")
    .eq("grid_size", gridSize)
    .eq("difficulty", difficulty)
    .eq("game_mode", gameMode)
    .single();

  if (error || !data) return null;
  return data;
}

/* ---------------- PERCENTILE CALCULATION ---------------- */

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Returns accurate percentile based on population min/avg/max ranges
 */
export function calculatePercentile(user, global) {
  if (!user || !global) return null;

  const u = user.avgReactionMs;

  const min = global.avg_min;
  const avg = global.avg_avg;
  const max = global.avg_max;

  if (!min || !avg || !max) return null;

  let percentile;

  if (u <= avg) {
    // better than average: map [min -> avg] to [99 -> 50]
    percentile = 99 - ((u - min) / (avg - min)) * 49;
  } else {
    // worse than average: map [avg -> max] to [50 -> 1]
    percentile = 50 - ((u - avg) / (max - avg)) * 49;
  }

  percentile = clamp(Math.round(percentile), 1, 99);

  return {
    percentile,
    label:
      percentile >= 99
        ? "Top 1%"
        : percentile >= 95
          ? "Top 5%"
          : percentile >= 90
            ? "Top 10%"
            : percentile >= 75
              ? "Top 25%"
              : percentile >= 50
                ? "Above Average"
                : percentile >= 25
                  ? "Below Average"
                  : "Bottom 10%",
  };
}
