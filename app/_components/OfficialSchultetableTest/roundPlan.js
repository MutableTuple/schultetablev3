import { clampGrid } from "../Schultetable/SchulteTable";

// The 10-round curriculum — escalates in grid size, difficulty, and mode
// variety, then settles back on a familiar mode (numbers) for the finale so
// the finish feels earned rather than punishing.
export const ROUND_PLAN = [
  {
    grid: 3,
    difficulty: "Easy",
    mode: "number",
    title: "Warm-Up",
    subtitle: "Ease in — get a feel for the board.",
  },
  {
    grid: 3,
    difficulty: "Medium",
    mode: "number",
    title: "Finding Your Rhythm",
    subtitle: "Same size, a little sharper.",
  },
  {
    grid: 4,
    difficulty: "Easy",
    mode: "alphabet",
    title: "Switch It Up",
    subtitle: "New symbols, bigger board.",
  },
  {
    grid: 4,
    difficulty: "Medium",
    mode: "word",
    title: "Word Power",
    subtitle: "Read, don't just recognize.",
  },
  {
    grid: 4,
    difficulty: "Hard",
    mode: "number",
    title: "Halfway Gauntlet",
    subtitle: "You're already halfway there.",
  },
  {
    grid: 5,
    difficulty: "Medium",
    mode: "emoji",
    title: "Visual Scan",
    subtitle: "Let your eyes do the work.",
  },
  {
    grid: 5,
    difficulty: "Hard",
    mode: "number",
    title: "Under Pressure",
    subtitle: "Bigger board, less room for error.",
  },
  {
    grid: 5,
    difficulty: "Extreme",
    mode: "maths",
    title: "Mental Math Blitz",
    subtitle: "The toughest round — solve, then tap.",
  },
  {
    grid: 6,
    difficulty: "Medium",
    mode: "number",
    title: "Big Board",
    subtitle: "The largest grid of the test.",
  },
  {
    grid: 6,
    difficulty: "Hard",
    mode: "number",
    title: "The Final Round",
    subtitle: "Finish strong.",
  },
];

export const BRAIN_TEST_TOTAL_ROUNDS = ROUND_PLAN.length;

// Resolve a round's planned grid size down to whatever's actually safe for
// this mode/viewport (alphabet caps at 5, mobile caps at 4) — same rule the
// main game applies via SchulteTable's clampGrid.
export function getEffectiveRound(index, isMobile) {
  const plan = ROUND_PLAN[index];
  if (!plan) return null;
  return {
    ...plan,
    grid: clampGrid(plan.grid, plan.mode, isMobile),
  };
}
