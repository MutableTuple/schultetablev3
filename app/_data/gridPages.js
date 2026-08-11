/**
 * Per-grid-size landing page content.
 *
 * These exist because competitors rank on size-specific queries we had no page
 * for — schulte-table.org/schulte-table-5x5 ranks independently for
 * "schulte table test online 5x5", and 5×5 is the canonical benchmark size and
 * the highest-volume grid query in the niche. We had /3x3, /7x7 and /9x9 only;
 * the 4x4 folder was named `_4x4` (a Next private directory, so unroutable)
 * and imported a component directory that no longer exists.
 *
 * EDITORIAL RULE — the reason this file is verbose instead of templated:
 * 25 near-identical pages differing only by a number is a doorway-page pattern,
 * and Google's spam systems demote exactly that. Every field below is written
 * per size and says something that is only true of that size. If you add 8×8,
 * write it properly or don't ship it.
 *
 * No invented statistics. The time ranges are honest observed bands, labelled
 * as such — not precision claims. Several competitors quote "47% improvement in
 * visual attention" and "28–35% reading speed increase" verbatim with no
 * traceable source; we deliberately do not repeat those.
 */

export const GRID_PAGES = {
  "4x4": {
    size: 4,
    slug: "4x4",
    label: "4×4",
    cells: 16,
    metaTitle: "4x4 Schulte Table — 16 Cells, Play Free Online",
    metaDescription:
      "Play the 4×4 Schulte Table free — 16 cells, about 8–15 seconds a round. The best grid size for high-volume daily practice. No sign-up.",
    keywords: [
      "4x4 schulte table",
      "schulte table 4x4",
      "16 cell schulte table",
      "small schulte table",
      "schulte table for beginners",
      "quick attention drill",
    ],
    h1: "4×4 Schulte Table — 16 Cells",
    intro:
      "Sixteen cells, roughly 8 to 15 seconds a round. The 4×4 is the size to use when you want volume: it's short enough to run ten rounds without your attention degrading, but large enough that technique still decides your time.",
    whyThisSize:
      "Most people should do the bulk of their practice here rather than on the 5×5. A 4×4 round costs you a fraction of the time, so you get several times the repetitions per session — and repetitions are what move the number. The 5×5 is the size you benchmark on; the 4×4 is the size you train on.",
    technique: [
      "Hold your gaze on the seam between the four centre cells — a 4×4 has no true centre cell, which is the one awkward thing about this size.",
      "The whole grid fits comfortably inside most people's useful visual field, so you should be able to complete a round without a single eye movement. If you're still scanning, you're going too fast.",
      "Because rounds are short, the temptation is to rush and accept mistakes. Don't. At this size a single misclick costs a meaningful share of your total time.",
    ],
    typicalTimes: [
      { level: "First few attempts", range: "15–25 seconds" },
      { level: "After a week of daily practice", range: "10–15 seconds" },
      { level: "Comfortable regular", range: "8–11 seconds" },
      { level: "Fast", range: "under 7 seconds" },
    ],
    goodFor: [
      "Daily high-repetition practice",
      "Warming up before a larger grid",
      "Children who find 5×5 discouraging",
      "Squeezing a session into a two-minute break",
    ],
    faqs: [
      {
        q: "Is the 4×4 Schulte Table too easy to be useful?",
        a: "No, but it trains something slightly different. Because 16 cells fit inside most people's usable visual field, the 4×4 isolates pure recognition and reaction speed rather than search strategy. That's a real skill and it's the one that transfers to reading. If you want the search-strategy component, go to 6×6 or larger.",
      },
      {
        q: "What is a good 4×4 Schulte Table time?",
        a: "Most people start around 15–25 seconds and reach 10–15 seconds within a week of daily practice. Under 7 seconds is genuinely fast. These are observed bands from ordinary play, not records — treat your own first session as your real baseline.",
      },
      {
        q: "Should I practise on 4×4 or 5×5?",
        a: "Both, for different reasons. Do your volume on the 4×4 because you can fit far more rounds into the same time. Use the 5×5 as your benchmark, since it's the size everyone else quotes times for and the only one that makes your results comparable.",
      },
      {
        q: "How many 4×4 rounds should I do per session?",
        a: "Eight to twelve. Stop when your times start drifting upward within the session — that's your attention giving out, and rounds after that point aren't training anything.",
      },
    ],
  },

  "5x5": {
    size: 5,
    slug: "5x5",
    label: "5×5",
    cells: 25,
    metaTitle: "5x5 Schulte Table — The Standard 25-Cell Test, Free Online",
    metaDescription:
      "Play the standard 5×5 Schulte Table free — 25 cells, the benchmark size every published time refers to. Track your seconds, accuracy and reaction time.",
    keywords: [
      "5x5 schulte table",
      "schulte table 5x5",
      "25 cell schulte table",
      "schulte table test",
      "standard schulte table",
      "schulte table test online 5x5",
      "good schulte table time",
    ],
    h1: "5×5 Schulte Table — The Standard 25-Cell Test",
    intro:
      "Twenty-five cells, numbers 1 to 25. This is the Schulte Table. When someone quotes a time without saying which grid they used, they mean this one — it's the size Walter Schulte's original clinical instrument used, and the size every comparison since has been built on.",
    whyThisSize:
      "The 5×5 matters because it's the only size where your number means something to anyone else. It also sits at a genuine cognitive boundary: 25 cells is roughly the largest grid most people can cover while holding a single central fixation. Below this you're testing recognition speed; above it you're testing search strategy. The 5×5 is the last size that measures the thing the exercise was designed to measure.",
    technique: [
      "Fix your eyes on the centre cell — the one holding position 13 of the grid — and do not move them. Unlike the 4×4, this grid has a true centre, which is part of why it became the standard.",
      "Expect the corners to be the hardest. They sit at the edge of usable peripheral acuity, and most people's times are dominated by the four corner numbers.",
      "If you catch yourself sweeping row by row, you've reverted to reading. Reset, re-fix on the centre, and accept a slower round — the habit matters more than the time.",
      "Track accuracy alongside time. A 22-second round with three misclicks is worse training than a 28-second clean one.",
    ],
    typicalTimes: [
      { level: "First few attempts", range: "40–60 seconds" },
      { level: "After a few weeks of practice", range: "25–35 seconds" },
      { level: "Strong", range: "under 20 seconds" },
      { level: "Exceptional", range: "under 12 seconds" },
    ],
    goodFor: [
      "Benchmarking against other players",
      "Tracking long-term improvement on one fixed measure",
      "Speed-reading training, where 5×5 is the conventional drill",
      "Anyone who wants a single number to care about",
    ],
    faqs: [
      {
        q: "What is a good time on a 5×5 Schulte Table?",
        a: "Most people begin somewhere between 40 and 60 seconds. Regular practice usually brings that to 25–35 seconds within a few weeks. Under 20 seconds is genuinely fast, and the best recorded times are in the single digits. Only compare against the same grid size and mode — a 15-second 4×4 and a 15-second 5×5 are not the same achievement.",
      },
      {
        q: "Why is 5×5 the standard Schulte Table size?",
        a: "It's the size used in the original clinical instrument, and it happens to sit at a useful boundary: 25 cells is about the largest grid most people can cover without moving their eyes. That makes it the biggest grid that still measures peripheral visual span rather than search strategy, which is what the test was designed to assess.",
      },
      {
        q: "How long does it take to get faster at the 5×5?",
        a: "Most people see their times drop noticeably within one to two weeks of short daily practice, with the steepest gains in the first few sessions — much of that early improvement is learning the technique rather than improving the underlying attention. Progress after that is slower and more genuine.",
      },
      {
        q: "Should I move to a bigger grid once I'm fast at 5×5?",
        a: "Only if you want to train something different. Larger grids test sustained concentration and search efficiency, not visual span, because you can no longer hold one fixation. Plenty of people stay on the 5×5 permanently and just keep lowering the number — that's a perfectly good practice.",
      },
      {
        q: "Is the 5×5 Schulte Table an IQ test?",
        a: "No. It measures visual attention and search speed, which are narrow, trainable skills. It was designed as an attention-assessment tool, not an intelligence measure, and a fast time says nothing about general intelligence.",
      },
    ],
  },

  "6x6": {
    size: 6,
    slug: "6x6",
    label: "6×6",
    cells: 36,
    metaTitle: "6x6 Schulte Table — 36 Cells for Advanced Focus Training",
    metaDescription:
      "Play the 6×6 Schulte Table free — 36 cells, typically 45–80 seconds. The size where holding one fixation stops working and search strategy takes over.",
    keywords: [
      "6x6 schulte table",
      "schulte table 6x6",
      "36 cell schulte table",
      "advanced schulte table",
      "large schulte grid",
      "sustained attention training",
    ],
    h1: "6×6 Schulte Table — 36 Cells",
    intro:
      "Thirty-six cells, typically 45 to 80 seconds. The 6×6 is where the exercise changes character: for most people this is the first grid too large to cover from a single central fixation, so the skill shifts from peripheral span to efficient, deliberate search.",
    whyThisSize:
      "Everything up to 5×5 rewards seeing more at once. From 6×6 onward that stops being possible, and what's actually being trained is your ability to hold concentration across a longer task without your attention fragmenting. That's a different and arguably more useful skill — it's the one that matters for sustained reading or extended work — but it means your 6×6 times aren't comparable to your 5×5 times in any meaningful way.",
    technique: [
      "Stop trying to hold one fixation. At this size that's counterproductive; instead use a small number of deliberate fixations — think in quadrants rather than sweeping.",
      "Fatigue becomes the real opponent. Most people's reaction times are visibly slower in the last third of a 6×6 round than the first.",
      "Two or three rounds is a full session here. The 6×6 costs several times the attention of a 4×4 per round.",
      "Watch where you stall. On this grid the interesting data isn't your total time, it's which region of the board you keep losing seconds in.",
    ],
    typicalTimes: [
      { level: "First few attempts", range: "80–120 seconds" },
      { level: "With practice", range: "45–80 seconds" },
      { level: "Strong", range: "under 45 seconds" },
      { level: "Exceptional", range: "under 30 seconds" },
    ],
    goodFor: [
      "Training sustained attention rather than visual span",
      "Players who find the 5×5 no longer demanding",
      "Seeing how your reaction time decays across a long task",
      "Building tolerance for longer focused work",
    ],
    faqs: [
      {
        q: "Why is the 6×6 Schulte Table so much harder than the 5×5?",
        a: "It isn't just 11 more cells — it crosses a threshold. At 36 cells most people can no longer cover the grid from one central fixation, so instead of reading the board peripherally you have to search it. That's a slower, more effortful process, which is why times often more than double rather than rising proportionally.",
      },
      {
        q: "What is a good 6×6 Schulte Table time?",
        a: "Beginners typically land between 80 and 120 seconds. With practice, 45–80 seconds is a normal working range, and under 45 seconds is strong. These are observed bands from ordinary play rather than records.",
      },
      {
        q: "Is a bigger Schulte Table better training?",
        a: "Not better — different. Larger grids train sustained concentration and search efficiency; smaller ones train peripheral visual span and reaction speed. If your goal is speed reading, the 5×5 and below are more directly relevant. If your goal is holding focus for longer, the 6×6 and up are.",
      },
      {
        q: "How many 6×6 rounds should I play?",
        a: "Two or three. Attention, not time, is the limiting factor, and a fourth round at this size is usually just a slower version of the third.",
      },
    ],
  },
};

export const GRID_PAGE_SLUGS = Object.keys(GRID_PAGES);

/** Routable grid pages, for cross-linking. Kept explicit so a link can never
 *  point at a size that has no page. */
export const ALL_GRID_LINKS = [
  { slug: "3x3", label: "3×3", cells: 9 },
  { slug: "4x4", label: "4×4", cells: 16 },
  { slug: "5x5", label: "5×5", cells: 25 },
  { slug: "6x6", label: "6×6", cells: 36 },
  { slug: "7x7", label: "7×7", cells: 49 },
  { slug: "9x9", label: "9×9", cells: 81 },
];
