/**
 * First-run difficulty ramp.
 *
 * WHY THIS EXISTS
 * The adaptive engine steps difficulty up after a clean round and down after a
 * rough one. That's the right behaviour for someone invested — but it means a
 * brand-new player who happens to do well on their first 3×3 can be looking at
 * a 6×6 Impossible maths board by game four. Almost nobody pushes through that;
 * they close the tab. That matches the drop-off pattern in the games table.
 *
 * So for the first N games the engine is held on rails: Easy difficulty, the
 * three modes whose rules need no explanation, and a small grid. After that the
 * normal adaptive logic takes over unchanged.
 *
 * The point isn't to make the game easy — it's to delay every decision that
 * could make someone quit until after they've felt themselves improve. Ten
 * games is also exactly the Brain Report unlock threshold, so the ramp ends at
 * the moment the first real reward lands.
 *
 * NOTE ON DIFFICULTY: the brief said "easy medium ones" and, more specifically,
 * "first 10 games on any device should be easy". This implements the stricter
 * reading — Easy only — because it's the safer default for the retention
 * problem this is meant to solve. Widening to include Medium is a one-line
 * change to ONBOARDING_DIFFICULTIES below if the data says otherwise.
 */

export const ONBOARDING_GAMES = 10;

/**
 * Difficulty tiers permitted during the ramp.
 *
 * This was ["Easy"] and that was a mistake. A single-entry pool makes the
 * difficulty pill a dead control: pickRandom() filters out the current value,
 * finds nothing left, and falls back to the same value — so tapping "Easy"
 * for the first ten games did literally nothing, with no explanation. That
 * reads as broken, not as gentle.
 *
 * Two entries is the minimum for a shuffle control to visibly respond, and
 * Easy+Medium is what the original brief actually asked for.
 */
export const ONBOARDING_DIFFICULTIES = ["Easy", "Medium"];

/**
 * Modes permitted during the ramp.
 *
 * number/alphabet/word all use a sequence the player already knows, so the
 * rules need no explanation. Excluded: `maths` (adds a working-memory load on
 * top of visual search — roughly doubles completion time) and `emoji` (no
 * inherent ordering, so the player has to learn an arbitrary sequence first).
 * Both are fine once someone is invested; neither is a good first impression.
 */
export const ONBOARDING_MODES = ["number", "alphabet", "word"];

/** Largest grid offered during the ramp. Mobile is capped harder because a
 *  5×5+ board genuinely doesn't fit a phone viewport at legible tile sizes. */
export function onboardingGridCap(isMobile) {
  return isMobile ? 4 : 5;
}

export function isOnboarding(lifetimeGames) {
  return (Number(lifetimeGames) || 0) < ONBOARDING_GAMES;
}

export function onboardingGamesLeft(lifetimeGames) {
  return Math.max(0, ONBOARDING_GAMES - (Number(lifetimeGames) || 0));
}

/**
 * Clamp a proposed next board into the ramp's bounds.
 *
 * Takes whatever the adaptive engine wanted and returns the nearest board that
 * is still allowed. Returns the input untouched once the ramp is over, so
 * there's exactly one place this logic can be switched off.
 */
export function applyOnboardingLimits(
  { grid, difficulty, mode },
  { lifetimeGames, isMobile },
) {
  if (!isOnboarding(lifetimeGames)) return { grid, difficulty, mode };

  return {
    grid: Math.min(Math.max(3, grid), onboardingGridCap(isMobile)),
    difficulty: ONBOARDING_DIFFICULTIES.includes(difficulty)
      ? difficulty
      : ONBOARDING_DIFFICULTIES[0],
    mode: ONBOARDING_MODES.includes(mode) ? mode : ONBOARDING_MODES[0],
  };
}
