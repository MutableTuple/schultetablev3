/**
 * Client-side progression state: daily streak, lifetime game count, and the
 * rank ladder derived from it.
 *
 * Deliberately localStorage-only. 79% of homepage traffic is logged-out
 * (821 active users on `/` vs 82 on `/auth/login`), so anything gated behind an
 * account would be invisible to almost everyone who plays. This gives a guest a
 * streak and a rank on their very first session, which is the whole point —
 * you can't feel like you're losing progress you were never shown.
 *
 * The trade-off is honest and worth stating in the UI: clearing site data or
 * switching devices resets it. That's exactly the pain that makes an account
 * (and then Pro) worth having, so the rail links to signup rather than
 * pretending the data is durable.
 *
 * All reads are defensive — every function is safe to call during SSR (returns
 * a neutral zero-state) and safe against a corrupted/partial localStorage.
 */

const STREAK_KEY = "schulte_streak";
const LIFETIME_GAMES_KEY = "schulte_lifetime_games";
const DAILY_GAMES_KEY = "schulte_daily_games";
const DAILY_GAMES_DATE_KEY = "schulte_daily_games_date";

/** Local calendar day (not UTC) — a streak should break at the player's midnight. */
export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(aKey, bKey) {
  const a = new Date(`${aKey}T00:00:00`);
  const b = new Date(`${bKey}T00:00:00`);
  return Math.round((b - a) / 86400000);
}

function safeParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   Rank ladder — thresholds are spaced so the first three ranks arrive inside a
   single sitting (avg engagement on `/` is ~2 min), then stretch out. Early
   wins create the "I got somewhere" feeling; later gaps create the reason to
   come back tomorrow.
───────────────────────────────────────────────────────────────────────────── */
export const RANKS = [
  { at: 0, name: "Rookie" },
  { at: 3, name: "Scanner" },
  { at: 8, name: "Sharp Eye" },
  { at: 20, name: "Focused" },
  { at: 40, name: "Quick Mind" },
  { at: 75, name: "Sharpshooter" },
  { at: 130, name: "Elite Focus" },
  { at: 220, name: "Grandmaster" },
];

export function getRank(totalGames = 0) {
  let index = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (totalGames >= RANKS[i].at) index = i;
  }
  const current = RANKS[index];
  const next = RANKS[index + 1] ?? null;
  const span = next ? next.at - current.at : 1;
  const done = totalGames - current.at;
  return {
    index,
    name: current.name,
    next: next?.name ?? null,
    gamesToNext: next ? Math.max(0, next.at - totalGames) : 0,
    // 0–100, capped. At max rank the bar reads full rather than empty.
    progressPct: next ? Math.min(100, Math.round((done / span) * 100)) : 100,
    isMax: !next,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Reads — never mutate. Safe on the server.
───────────────────────────────────────────────────────────────────────────── */
export function readProgress() {
  const empty = { streak: 0, longestStreak: 0, lifetimeGames: 0, gamesToday: 0 };
  if (typeof window === "undefined") return empty;

  try {
    const streakRec = safeParse(localStorage.getItem(STREAK_KEY), null);
    const today = todayKey();

    let streak = 0;
    if (streakRec?.lastDay) {
      const gap = daysBetween(streakRec.lastDay, today);
      // Played today or yesterday → streak is still alive. Two or more days of
      // silence and it's gone, which is what makes it worth protecting.
      streak = gap <= 1 ? Number(streakRec.count) || 0 : 0;
    }

    const lifetimeGames = Number(localStorage.getItem(LIFETIME_GAMES_KEY)) || 0;
    const storedDate = localStorage.getItem(DAILY_GAMES_DATE_KEY);
    const gamesToday =
      storedDate === today ? Number(localStorage.getItem(DAILY_GAMES_KEY)) || 0 : 0;

    return {
      streak,
      longestStreak: Number(streakRec?.longest) || streak,
      lifetimeGames,
      gamesToday,
    };
  } catch {
    return empty;
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   Write — call exactly once per completed game.
   Returns the post-increment state plus what changed, so the caller can
   celebrate the specific thing that just happened rather than re-deriving it.
───────────────────────────────────────────────────────────────────────────── */
export function recordGameCompleted() {
  if (typeof window === "undefined") {
    return {
      streak: 0,
      longestStreak: 0,
      lifetimeGames: 0,
      gamesToday: 0,
      streakExtended: false,
      rankedUp: false,
      rank: getRank(0),
    };
  }

  try {
    const today = todayKey();
    const prev = safeParse(localStorage.getItem(STREAK_KEY), null);

    let count = 1;
    let streakExtended = true;
    if (prev?.lastDay === today) {
      // Already counted today — streak length is unchanged by a second game.
      count = Number(prev.count) || 1;
      streakExtended = false;
    } else if (prev?.lastDay && daysBetween(prev.lastDay, today) === 1) {
      count = (Number(prev.count) || 0) + 1;
    }

    const longest = Math.max(Number(prev?.longest) || 0, count);
    localStorage.setItem(
      STREAK_KEY,
      JSON.stringify({ count, lastDay: today, longest }),
    );

    const before = Number(localStorage.getItem(LIFETIME_GAMES_KEY)) || 0;
    const lifetimeGames = before + 1;
    localStorage.setItem(LIFETIME_GAMES_KEY, String(lifetimeGames));

    const storedDate = localStorage.getItem(DAILY_GAMES_DATE_KEY);
    const gamesToday =
      storedDate === today
        ? (Number(localStorage.getItem(DAILY_GAMES_KEY)) || 0) + 1
        : 1;
    localStorage.setItem(DAILY_GAMES_DATE_KEY, today);
    localStorage.setItem(DAILY_GAMES_KEY, String(gamesToday));

    const rank = getRank(lifetimeGames);
    return {
      streak: count,
      longestStreak: longest,
      lifetimeGames,
      gamesToday,
      streakExtended,
      rankedUp: getRank(before).index !== rank.index,
      rank,
    };
  } catch {
    return {
      streak: 0,
      longestStreak: 0,
      lifetimeGames: 0,
      gamesToday: 0,
      streakExtended: false,
      rankedUp: false,
      rank: getRank(0),
    };
  }
}
