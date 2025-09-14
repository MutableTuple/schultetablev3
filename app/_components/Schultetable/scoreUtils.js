export function calculateScore({
  durationMs,
  mistakes,
  difficulty,
  gridSize,
  avgReactionTimeMs,
  consistencyScore,
}) {
  const maxScore = 1000;

  const difficultyMultiplier =
    {
      Easy: 1,
      Medium: 1.3,
      Hard: 1.6,
      Extreme: 2,
      Impossible: 2.5,
    }[difficulty] || 1;

  // Cap time penalty at 120 seconds (2 minutes) for robustness
  const timePenalty = Math.min(durationMs / 1000, 120);

  const mistakePenalty = mistakes * 10;
  const reactionPenalty = avgReactionTimeMs / 10;
  const consistencyPenalty = consistencyScore / 5;

  const base =
    maxScore -
    timePenalty -
    mistakePenalty -
    reactionPenalty -
    consistencyPenalty;

  // Grid size multiplier logic: normalize around 3x3
  const gridMultiplier = Math.min(gridSize / 3, 3); // Cap multiplier at x3

  const rawScore = base * difficultyMultiplier * gridMultiplier;

  return Math.max(Math.round(rawScore), 1); // Ensure minimum score is 1
}
