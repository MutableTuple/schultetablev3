/**
 * Long-form content for the five highest-value comparison pages.
 *
 * WHY A SEPARATE FILE
 * The 25 `vs-` pages all render from ALTERNATIVES via one template. That's fine
 * structurally but it produced 25 pages with near-identical shape and ~500
 * words each — the pattern Google's spam systems treat as mass-generated, and
 * the most likely reason an AdSense review would flag the site.
 *
 * Rather than pad all 25, this adds genuine depth to the five worth ranking.
 * VsCompetitorPage renders these sections only when a slug has an entry here,
 * so the other 20 are untouched and nothing can break.
 *
 * SELECTION
 *   sudoku, wordle, chess  — highest search volume in the comparison set
 *   human-benchmark        — closest competitor; same audience, same intent
 *   peak                   — stands in for the paid brain-training app category
 *
 * EDITORIAL RULES (same as the rest of the site)
 *   · No invented statistics and no invented studies. Competitors in this niche
 *     circulate "47% improvement in visual attention" and "28–35% reading speed
 *     increase" verbatim with no traceable source. We do not repeat them.
 *   · Where the honest answer is "the other tool is better for this", say so.
 *     A comparison page that always concludes in our favour is an advert, and
 *     both readers and Google's helpful-content systems can tell.
 *   · Describe competitors factually. No disparagement of real products.
 */

export const ALTERNATIVES_RICH = {
  /* ───────────────────────────────────────────────────────────────────── */
  sudoku: {
    sections: [
      {
        h2: "The real difference: search versus deduction",
        body: [
          "It's tempting to file both of these under \"number games\" and stop there, but they load almost entirely different machinery. A Schulte Table gives you complete information — every number is visible from the first second — and the only difficulty is finding the one you want fast enough. Nothing is hidden. Nothing has to be worked out.",
          "Sudoku is the inverse. The information you need doesn't exist on the board yet; you generate it by elimination. A hard Sudoku can sit unsolved for ten minutes not because you can't see the grid but because you haven't yet derived the constraint that unlocks it. Speed is barely relevant, and rushing actively hurts.",
          "That distinction matters when you're choosing between them, because it determines what improvement even looks like. Getting better at Schulte Tables shows up as a smaller number on a stopwatch. Getting better at Sudoku shows up as recognising a pattern — an X-wing, a hidden pair — that you previously had to brute-force. Neither is a proxy for the other.",
        ],
      },
      {
        h2: "Session length changes what the habit costs you",
        body: [
          "A Schulte round on a 4×4 takes about ten seconds. A 5×5 takes twenty to forty. That means the entire decision to practise costs you almost nothing — there is no version of your day that can't absorb two minutes, which is why a daily Schulte habit tends to survive contact with a busy week.",
          "A Sudoku puzzle is a 10–30 minute commitment, and crucially it's a commitment you can't cleanly abandon halfway. Starting one when you have eight minutes is worse than not starting. That single property is why most people's Sudoku habit is weekend-shaped and their Schulte habit, if they build one, is daily.",
          "If you're choosing based on which you'll actually still be doing in a month, that's the consideration that usually decides it — not which one is more interesting.",
        ],
      },
      {
        h2: "Which one is genuinely better for you",
        body: [
          "Pick Sudoku if you want a mental activity rather than a drill. It's more absorbing, it rewards learning real technique, and a hard puzzle solved is more satisfying than any Schulte time will ever be. It's also the better choice if timed tasks make you anxious — Sudoku has no clock unless you add one.",
          "Pick the Schulte Table if you have a specific, narrow goal: faster visual search, wider useful visual field, or a measurable number to move. It's also the better choice if your obstacle is starting rather than sustaining, because a ten-second task is very hard to talk yourself out of.",
          "The honest answer for most people is that these aren't competing for the same slot. One is a two-minute drill and one is a hobby.",
        ],
      },
    ],
    routine: {
      intro:
        "If you want both, they slot together without competing for the same time. A pattern that works:",
      rows: [
        { when: "Morning, 2 minutes", what: "5 rounds of 4×4 Schulte as a warm-up before work" },
        { when: "Lunch break", what: "One Sudoku, or as much of one as fits" },
        { when: "Evening, optional", what: "One 5×5 Schulte to benchmark — same size, same mode, so it's comparable" },
      ],
      note: "The Schulte rounds are the habit; the Sudoku is the reward. Reversing that tends to mean neither happens on a busy day.",
    },
    extraFaqs: [
      {
        q: "Does Sudoku improve concentration the way a Schulte Table does?",
        a: "It builds sustained concentration — staying with one problem for twenty minutes is real attentional work. What it doesn't train is the specific mechanism a Schulte Table targets: locating a target in your visual field without moving your gaze. Those are different enough that improving at one won't noticeably move the other.",
      },
      {
        q: "I'm bad at Sudoku. Will Schulte Tables help?",
        a: "Almost certainly not. Being slow at Sudoku is usually about not knowing the elimination patterns yet, which is a learning problem, not an attention problem. Working through a Sudoku technique guide will do far more than any amount of visual-search training.",
      },
    ],
  },

  /* ───────────────────────────────────────────────────────────────────── */
  wordle: {
    sections: [
      {
        h2: "One is a ritual, the other is a rep",
        body: [
          "Wordle's design constraint is the whole point of it: one puzzle per day, the same puzzle as everyone else, and then it's gone. That scarcity is what made it spread — there's a shared conversation, a streak worth protecting, and no way to binge it into boredom. It is arguably the best-designed daily habit on the internet.",
          "A Schulte Table has no such ceiling, which is both its advantage and its weakness. You can play forty rounds if you want. Nothing stops you, and nothing makes it an event. There's no shared answer to compare with a friend at lunch.",
          "If your problem is that you never stick with anything, Wordle's structure is doing something a Schulte Table can't. If your problem is that one puzzle a day isn't enough training to move a number, the reverse is true.",
        ],
      },
      {
        h2: "What each one is actually training",
        body: [
          "Wordle is vocabulary retrieval under constraint. You're searching your own memory for five-letter words that fit a known pattern — that's a language task, and the skill that improves is your ability to generate candidate words from partial information. Strong Wordle players tend to have good letter-frequency intuition and a large accessible vocabulary.",
          "A Schulte Table involves no memory and no language. Every symbol is in front of you; the task is purely how fast you can find the one you want without hunting. The skill that improves is visual search speed and peripheral awareness.",
          "There's essentially no overlap. Getting better at Wordle will not make you faster at a Schulte Table, and getting faster at a Schulte Table will not help you guess CRANE.",
        ],
      },
      {
        h2: "The streak question",
        body: [
          "Wordle's streak is its strongest retention mechanic and its most brittle one — miss a day and the number you've been protecting for months is gone. That's motivating right up until it isn't, and plenty of people quit entirely the day their streak breaks.",
          "This site tracks a daily streak too, but the failure mode is gentler: because rounds take seconds rather than requiring you to solve something, keeping a streak alive is a matter of opening the page, not of succeeding at anything. That's a lower bar deliberately — a streak you can protect on a bad day is a streak that survives bad weeks.",
        ],
      },
    ],
    routine: {
      intro:
        "These genuinely complement each other, and the pairing is one of the easier ones to sustain:",
      rows: [
        { when: "Morning", what: "Today's Wordle — it's once a day and it's gone" },
        { when: "Immediately after", what: "3–5 rounds of Schulte while you're already in the habit loop" },
        { when: "Any dead moment", what: "One more Schulte round — no daily limit to run out of" },
      ],
      note: "Attaching the Schulte rounds to an existing daily ritual is the trick. Habits stack far more reliably than they start from nothing.",
    },
    extraFaqs: [
      {
        q: "Is there a Schulte Table equivalent of Wordle's daily puzzle?",
        a: "Not in the same shared-answer sense, because a Schulte board is randomly generated rather than authored — there's no single daily board everyone plays. What is comparable is the daily streak and the session report every five games, which give you the same come-back-tomorrow structure without the once-per-day limit.",
      },
      {
        q: "Which is better for my brain, Wordle or a Schulte Table?",
        a: "Neither has good evidence for broad cognitive benefit — that caveat applies to the entire brain-training category, this site included. What's well supported is that you improve at what you practise. So the honest framing is: Wordle if you want a daily language puzzle you'll enjoy, Schulte if you want a measurable attention drill.",
      },
    ],
  },

  /* ───────────────────────────────────────────────────────────────────── */
  "human-benchmark": {
    sections: [
      {
        h2: "The closest comparison on this list",
        body: [
          "Most of the games we compare against train something unrelated. Human Benchmark is the exception — it's the one tool with genuine overlap, because several of its tests measure exactly the faculties a Schulte Table exercises. If you're deciding between the two, you're making a real choice rather than picking between a drill and a hobby.",
          "The core distinction is testing versus training. Human Benchmark is built to measure: you take a reaction-time test, you get a number and a percentile against a large sample, and that's the product. It's excellent at that, and its sample size makes its percentiles more meaningful than almost anything else available for free.",
          "A Schulte Table is built to be repeated. The same board type, over and over, with a time that should fall over weeks. It's less rigorous as a measurement instrument and more useful as a practice one.",
        ],
      },
      {
        h2: "Reaction time versus visual search",
        body: [
          "Human Benchmark's reaction-time test measures simple response latency — a stimulus appears, you click, it records the milliseconds. That's a clean measure of one thing, and it's largely a property of your nervous system rather than a skill you can train much. Most people's reaction time improves a little with practice and then plateaus quickly.",
          "A Schulte Table measures something composite: how long it takes you to locate a specific target among 25 distractors, one after another, twenty-five times. Your raw reaction speed is a component, but the dominant variable is search efficiency — and that is genuinely trainable, which is why Schulte times keep improving long after reaction time has flattened.",
          "This is the practical reason to use both. Human Benchmark tells you where your hardware sits. A Schulte Table is where you actually get better.",
        ],
      },
      {
        h2: "Where Human Benchmark is the better tool",
        body: [
          "If what you want is a percentile — a defensible answer to \"am I fast?\" — Human Benchmark is more credible than we are. Its sample is enormous and its tests are narrow enough to be comparable across people. Our percentile is computed against players on this site, which is a smaller and self-selected group.",
          "It's also broader. Sequence memory, verbal memory, number memory, chimp test, aim trainer — that's a spread of faculties a Schulte Table doesn't touch. If you're curious about your cognitive profile rather than training one dimension of it, that breadth is the point.",
          "Where we're the better choice is repetition and progress tracking. Human Benchmark isn't designed to be played daily for a month with a trend line at the end; we are. Different jobs.",
        ],
      },
    ],
    routine: {
      intro:
        "These two work well in sequence rather than as alternatives:",
      rows: [
        { when: "Once, at the start", what: "Human Benchmark reaction + aim tests, to establish where you're starting from" },
        { when: "Daily, 2–3 minutes", what: "Schulte rounds — this is where the actual training happens" },
        { when: "Once a month", what: "Re-run the Human Benchmark tests as an independent check" },
      ],
      note: "Using an outside instrument for the before-and-after is more honest than measuring your progress only on the tool you're practising on, where some improvement is always familiarity with the interface.",
    },
    extraFaqs: [
      {
        q: "Will practising Schulte Tables improve my Human Benchmark reaction time?",
        a: "A little, and then not much. Simple reaction time has a hard floor set largely by nerve conduction and processing latency, and most people reach their personal floor quickly. What you should expect to improve substantially is visual search speed — which Human Benchmark's aim trainer captures better than its reaction test.",
      },
      {
        q: "Which gives a more accurate percentile?",
        a: "Human Benchmark, and it isn't close — its sample size is far larger and less self-selected. Our percentile compares you to people who chose to play a Schulte Table on this site, which skews toward people already interested in attention training. Treat ours as a motivating signal, not a population statistic.",
      },
      {
        q: "Is Human Benchmark free like this site?",
        a: "Yes, both are free to use with no account required. Our Pro tier adds long-term history and analysis, but every board and mode is playable without paying.",
      },
    ],
  },

  /* ───────────────────────────────────────────────────────────────────── */
  chess: {
    sections: [
      {
        h2: "Comparing a drill to a discipline",
        body: [
          "This comparison is slightly unfair to both sides, because chess isn't a brain-training exercise — it's a game with a century of theory, a professional circuit, and a skill ceiling nobody has reached. Putting it next to a two-minute attention drill is like comparing a musical instrument to a finger-stretching routine.",
          "That said, people genuinely do ask, usually because they've been told chess is good for the brain and want to know whether something quicker would do. So: chess trains planning, pattern recognition over learned positions, calculation of variations, and emotional regulation under pressure. It's cognitively demanding in a way a Schulte Table never is.",
          "What chess does not train is the specific low-level faculty a Schulte Table targets. Strong players see boards in learned chunks, which is a memory phenomenon, not a peripheral-vision one. There's no reason to expect a grandmaster to be fast at a Schulte Table.",
        ],
      },
      {
        h2: "Time cost and the stakes problem",
        body: [
          "A chess game is 10 minutes at the fastest reasonable time control and often much longer. It also carries stakes: you can lose, the loss is attributable to a specific mistake you made, and if you play rated games there's a number that goes down. For a lot of people that's exactly the appeal. For others it's the reason they stop.",
          "A Schulte round has no opponent and no loss condition. The worst outcome is a slower time than yesterday, which is information rather than defeat. That's a meaningfully lower emotional cost, and it's why a Schulte habit is easier to keep on a day when you have no appetite for being beaten.",
        ],
      },
      {
        h2: "The case for using one to support the other",
        body: [
          "If you play chess seriously, the useful framing is that a Schulte Table isn't a substitute for study — it's a warm-up. A few rounds before a session is a low-cost way to arrive already focused rather than spending your first two games waking up. Plenty of players use something similar; the specific exercise matters less than having one.",
          "What it will not do is improve your rating through some transfer effect. Nothing about visual search speed helps you calculate a variation or recall an opening line. Anyone claiming a brain-training drill will raise your Elo is overselling.",
        ],
      },
    ],
    routine: {
      intro: "For someone who plays chess and wants the drill to earn its place:",
      rows: [
        { when: "Before a session", what: "3–5 Schulte rounds as a focus warm-up" },
        { when: "The session itself", what: "Chess — games, tactics, or opening study" },
        { when: "Between games", what: "One Schulte round to reset after a loss, instead of immediately re-queuing" },
      ],
      note: "That last one is the genuinely useful application: a short neutral task between games breaks tilt better than starting the next game angry.",
    },
    extraFaqs: [
      {
        q: "Do strong chess players have better visual attention?",
        a: "Their advantage is heavily specific to chess positions — they recognise meaningful board configurations as single chunks, which is a memory and pattern-recognition effect built over years of exposure. That advantage largely disappears with randomly arranged pieces, and there's no particular reason it would extend to an unrelated grid of numbers.",
      },
      {
        q: "Should I replace chess with brain training to save time?",
        a: "No. If you enjoy chess, keep playing chess — it's more cognitively rich than any brain-training drill and you'll actually keep doing it. Use a Schulte Table for the thing it's good at: a fast warm-up, or a focus habit on days you don't have an hour.",
      },
    ],
  },

  /* ───────────────────────────────────────────────────────────────────── */
  peak: {
    sections: [
      {
        h2: "A programme versus a single exercise",
        body: [
          "Peak is a curriculum. It gives you a rotating set of games across memory, attention, language and problem-solving, wraps them in a daily workout structure, and charts your progress across categories. That packaging is genuinely valuable — variety and structure are why people stay subscribed, and staying is most of what determines whether any training does anything.",
          "A Schulte Table is one exercise. There's no curriculum, no category breakdown, no daily workout assembled for you. What there is, is depth on a single dimension and a number that's directly comparable to your number from last week.",
          "So the question isn't really which is better. It's whether you want a programme you follow or a drill you own.",
        ],
      },
      {
        h2: "Where the money goes",
        body: [
          "Peak operates on a subscription, and the recurring cost buys you continued access to the full catalogue plus the coaching layer. If you use it daily, that's a defensible price for a well-made product with a lot of content behind it.",
          "Every board and mode here is free, permanently, without an account. Our Pro tier is a single payment that unlocks history, percentile ranking and the long-form Brain Report — it doesn't gate any gameplay. That's a deliberate difference in model, not a claim that we offer more than Peak does; we offer far less, and charge accordingly.",
          "Worth being straight about: if you want dozens of varied exercises, a paid app is the honest recommendation and we are not a substitute for one.",
        ],
      },
      {
        h2: "The evidence caveat applies to both",
        body: [
          "The claim that brain-training apps produce broad cognitive improvement — that practising their games makes you generally sharper — is not well supported. The research on far transfer is mixed at best, and this has been the central criticism of the entire category for over a decade. That criticism applies to Peak, to its competitors, and to us.",
          "What is well supported is near transfer: you get better at the thing you practise, and at closely related tasks. So the reasonable expectation from any of these tools is improvement at their specific exercises, plus whatever benefit comes from having built a daily habit of sitting down and concentrating on purpose.",
          "Choose on whether you'll enjoy using it and keep it up, not on which product makes the largest claim about your brain.",
        ],
      },
    ],
    routine: {
      intro:
        "If you already subscribe to Peak, a Schulte Table isn't a replacement — it's a supplement with a specific job:",
      rows: [
        { when: "Daily, 2 minutes", what: "Schulte rounds — one dimension, tracked precisely over months" },
        { when: "Your usual session", what: "Peak's assembled workout for variety across faculties" },
        { when: "Monthly", what: "Compare your Schulte trend against Peak's attention category" },
      ],
      note: "The value of running one narrow, precisely-measured exercise alongside a broad programme is that when the broad numbers move you have at least one clean signal to check them against.",
    },
    extraFaqs: [
      {
        q: "Is a free Schulte Table as good as a paid brain-training subscription?",
        a: "For breadth, no — a paid app gives you far more variety, structure and polish, and that's most of what keeps people training. For the specific skill of visual search and sustained attention, a dedicated Schulte Table goes deeper than any single exercise inside a broader app. They're not really substitutes.",
      },
      {
        q: "Do brain-training apps actually work?",
        a: "They work for getting better at their own exercises. Whether that generalises to everyday cognition is genuinely unsettled and the evidence for broad transfer is weak — a criticism that applies to this site as much as to any paid app. Anyone in this category telling you otherwise with confidence is ahead of the research.",
      },
    ],
  },
};

export function getRichContent(slug) {
  return ALTERNATIVES_RICH[slug] ?? null;
}
