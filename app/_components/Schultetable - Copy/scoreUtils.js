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

  const timePenalty = Math.min(durationMs / 1000, 600);
  const mistakePenalty = mistakes * 10;
  const reactionPenalty = avgReactionTimeMs / 10;
  const consistencyPenalty = consistencyScore / 5;

  const base =
    maxScore -
    timePenalty -
    mistakePenalty -
    reactionPenalty -
    consistencyPenalty;

  const rawScore = base * difficultyMultiplier * (gridSize / 3);

  return Math.max(Math.round(rawScore), 0);
}
