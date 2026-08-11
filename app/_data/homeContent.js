/**
 * Homepage below-the-fold content.
 *
 * Kept as data rather than inline JSX for one reason: the FAQ block has to be
 * rendered twice — once as visible HTML and once as FAQPage JSON-LD — and
 * Google treats structured data that doesn't match the visible page as a
 * violation. One source guarantees they can never drift apart.
 *
 * Editorial rule for anything added here: no invented statistics, no invented
 * study citations, no invented testimonials. Where the evidence is genuinely
 * thin (transfer of attention training to general intelligence, for example)
 * the copy says so. That honesty is also the correct SEO play — Google's
 * helpful-content systems reward pages that answer the question directly,
 * including when the honest answer is "less than people claim".
 */

export const HOME_STEPS = [
  {
    title: "Fix your eyes on the centre",
    detail:
      "Stare at the middle cell and keep your gaze there. This is the part everyone skips, and it's the part that does the work — the whole exercise is about finding numbers without moving your eyes to hunt for them.",
  },
  {
    title: "Find 1, then 2, then 3 — in order",
    detail:
      "Tap each number in ascending sequence. Order matters. Skipping ahead when you spot a later number defeats the drill, because the difficulty comes from searching for one specific target at a time.",
  },
  {
    title: "Use your peripheral vision, not your eyes",
    detail:
      "Let the numbers come to you from the edges of your visual field. Beginners scan row by row like reading. Faster players hold the centre and let the grid resolve around it.",
  },
  {
    title: "Finish the grid and read your time",
    detail:
      "You get a completion time, an accuracy percentage, and your average reaction time per tap. Those three numbers are what you're trying to move — not any single lucky run.",
  },
  {
    title: "Repeat 5–10 rounds, then stop",
    detail:
      "Short and frequent beats long and occasional. Two minutes a day will move your numbers further than a half-hour session once a week, and it's much easier to actually keep doing.",
  },
];

/**
 * Every row now links to a real route. 4x4/5x5/6x6 previously had no page —
 * the 4x4 folder was named `_4x4` (a Next private directory, unroutable) and
 * imported a component directory that had been deleted — so those rows
 * rendered as plain text to avoid shipping 404s. All six sizes now exist under
 * app/schulte-table/, each with its own copy, FAQ and structured data.
 */
export const GRID_GUIDE = [
  {
    size: "3×3",
    href: "/schulte-table/3x3",
    cells: "9 cells",
    who: "First-timers and kids",
    typical: "3–7 seconds",
    note: "Small enough that peripheral vision alone can cover the whole grid. Good for learning the centre-gaze habit before size makes it hard.",
  },
  {
    size: "4×4",
    href: "/schulte-table/4x4",
    cells: "16 cells",
    who: "Warm-ups and daily reps",
    typical: "8–15 seconds",
    note: "The best size for volume. Quick enough to run ten rounds without fatigue, big enough that technique still matters.",
  },
  {
    size: "5×5",
    href: "/schulte-table/5x5",
    cells: "25 cells",
    who: "The standard benchmark",
    typical: "20–40 seconds",
    note: "The classic Schulte Table. If you see a time quoted anywhere online without a grid size attached, it's almost always a 5×5.",
  },
  {
    size: "6×6",
    href: "/schulte-table/6x6",
    cells: "36 cells",
    who: "Experienced players",
    typical: "45–80 seconds",
    note: "Past this size, holding a single central fixation stops being possible for most people, and the skill shifts toward efficient partial scanning.",
  },
  {
    size: "7×7",
    href: "/schulte-table/7x7",
    cells: "49 cells",
    who: "Endurance training",
    typical: "90 seconds+",
    note: "Tests sustained concentration more than visual span. Useful if you're training to hold attention for longer, not to react faster.",
  },
  {
    size: "9×9",
    href: "/schulte-table/9x9",
    cells: "81 cells",
    who: "The hardest board here",
    typical: "3 minutes+",
    note: "Almost nobody completes this without their attention breaking at least once. That break — and noticing it — is the actual training.",
  },
];

export const MODES = [
  {
    name: "Numbers",
    detail:
      "The original. Find 1 through N in order. The cleanest measure of pure visual search speed because recognising a digit costs almost nothing cognitively.",
  },
  {
    name: "Letters",
    detail:
      "Find A through Z in order. Slightly harder than numbers for most people — alphabetical sequence is less automatic than counting, so a little more of your attention goes to 'what comes next'.",
  },
  {
    name: "Maths",
    detail:
      "Each cell holds a small equation and you find them in order of their answers. This adds a working-memory load on top of the search, which is why times roughly double.",
  },
  {
    name: "Colour (Gorbov–Schulte)",
    detail:
      "Numbers in two colours, found in alternating ascending and descending order. The best-known hard variant — it forces you to switch between two rules mid-task.",
  },
];

export const HOME_FAQS = [
  {
    q: "What is a Schulte Table?",
    a: "A Schulte Table is a square grid filled with numbers in random order. You find them in sequence — 1, 2, 3 and so on — as fast as you can while keeping your eyes fixed on the centre. It was introduced by German psychiatrist Walter Schulte in the 1950s as a clinical tool for assessing attention, and it later became a standard drill in speed-reading courses because it trains you to take in information from a wide visual field instead of scanning point by point.",
  },
  {
    q: "What is a good Schulte Table time?",
    a: "On the standard 5×5 grid, most people start somewhere between 40 and 60 seconds. Regular practice usually brings that to 25–35 seconds within a few weeks. Under 20 seconds is genuinely fast, and the best recorded times sit in the single digits. Times are only comparable within the same grid size and mode — a 15-second 4×4 and a 15-second 6×6 are not the same achievement.",
  },
  {
    q: "How long should I practise each day?",
    a: "Two to five minutes. That's five to ten rounds on a 4×4 or 5×5. The limiting factor is attention, not time — once you notice your times drifting upward within a session, you've stopped training and started grinding, and the extra rounds aren't buying you anything.",
  },
  {
    q: "Does the Schulte Table actually improve reading speed?",
    a: "It reliably improves the specific thing it trains: how quickly you locate a target in a visual field without moving your gaze, which is the same mechanic behind wider eye fixations in speed reading. Whether that carries over into faster reading of ordinary prose depends heavily on the person and on what's actually slowing their reading down — for people whose bottleneck is comprehension or subvocalisation rather than eye movement, it won't do much. Treat it as one useful drill, not a complete reading method.",
  },
  {
    q: "Is there real science behind Schulte Tables?",
    a: "The table has a legitimate clinical history as an attention-assessment instrument and is still used that way in parts of Europe and Asia. The broader claim — that practising it improves general intelligence or produces wide cognitive transfer — is not well supported. The research on brain-training transfer is mixed at best, and honest practice is to expect improvement at visual search and attention-holding specifically. We cover what the evidence does and doesn't show on our science page.",
  },
  {
    q: "Do I need an account to play?",
    a: "No. Every grid size and every mode is playable immediately, with no signup, no download, and no payment. An account only adds cross-device history, the leaderboard, and duels against other players.",
  },
  {
    q: "What is the free Brain Report?",
    a: "After ten completed games we generate a written analysis of your own results: your focus score, how your reaction time changes across a session, which time of day you perform best, and where your accuracy is costing you time. It's free and doesn't require a card. Pro extends it with full game history, percentile ranking against other players, and a long-term Focus IQ trend.",
  },
  {
    q: "Can children use Schulte Tables?",
    a: "Yes, and 3×3 and 4×4 grids work well for that. The letter mode is often more engaging for children still learning the alphabet, since it turns sequencing practice into a timed game. Keep sessions short — a few rounds is plenty at that age.",
  },
];

/** Internal links surfaced under the homepage content. Ordered by usefulness to
 *  a first-time visitor, not by our own page priorities. */
export const HOME_LINKS = [
  { href: "/what-is-schulte-table", label: "What is a Schulte Table?" },
  { href: "/how-to-play-schulte-table", label: "Full how-to-play guide" },
  { href: "/benefits-of-schulte-table", label: "Benefits, honestly assessed" },
  { href: "/schulte-table-science", label: "The science behind it" },
  { href: "/schulte-table-history", label: "History: Walter Schulte, 1950s" },
  { href: "/schulte-table-world-record", label: "World records" },
  { href: "/schulte-table-alternatives", label: "Compared to 27 other brain games" },
  { href: "/schulte-table-for-kids", label: "Schulte Tables for kids" },
  { href: "/schulte-table-for-students", label: "For students" },
  { href: "/schulte-table-for-seniors", label: "For seniors" },
  { href: "/leaderboard", label: "Global leaderboard" },
  { href: "/duels", label: "Duel a friend" },
];
