/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.schultetable.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/my-profile", "/api"],
      },
    ],
  },

  additionalPaths: async () => {
    const staticPages = [
      { loc: "/", priority: 1.0 },
      { loc: "/about", priority: 0.8 },
      { loc: "/blogs", priority: 0.8 },
      { loc: "/auth/login", priority: 0.6 },
      { loc: "/auth/register", priority: 0.6 },
      { loc: "/leaderboard", priority: 0.6 },
      { loc: "/how-to-play-schulte-table", priority: 0.6 },
      { loc: "/benefits-of-schulte-table", priority: 0.6 },
      { loc: "/get-pro", priority: 0.6 },
      { loc: "/missions", priority: 0.6 },
      { loc: "/duels", priority: 0.6 },
      { loc: "/faq", priority: 0.6 },
      { loc: "/features", priority: 0.7 },
      { loc: "/official-brain-test", priority: 0.7 },
      { loc: "/support", priority: 0.5 },
      { loc: "/cookies", priority: 0.3 },
      { loc: "/privacy", priority: 0.3 },
      { loc: "/what-is-schulte-table", priority: 0.7 },
      { loc: "/schulte-table-faq", priority: 0.6 },
      { loc: "/schulte-table-history", priority: 0.5 },
      { loc: "/schulte-table-research", priority: 0.5 },
      { loc: "/schulte-table-science", priority: 0.5 },
      { loc: "/schulte-table-world-record", priority: 0.6 },
      { loc: "/schulte-table-vs-elevate", priority: 0.6 },
      { loc: "/schulte-table-vs-lumosity", priority: 0.6 },
      { loc: "/schulte-table-alternatives", priority: 0.7 },
    ];

    // "Schulte Table vs [competitor]" comparison pages
    const competitorSlugs = [
      "sudoku",
      "wordle",
      "chess",
      "crossword",
      "tetris",
      "2048",
      "candy-crush",
      "rubiks-cube",
      "jigsaw-puzzles",
      "solitaire",
      "sporcle",
      "word-search",
      "trivia-crack",
      "memory-match",
      "peak",
      "cognifit",
      "brainhq",
      "happify",
      "duolingo",
      "headspace",
      "calm",
      "forest-app",
      "cambridge-brain-sciences",
      "iq-test",
      "human-benchmark",
    ];
    const competitorPages = competitorSlugs.map((slug) => ({
      loc: `/schulte-table-vs-${slug}`,
      priority: 0.6,
    }));

    // Audience-targeted landing pages
    const audiences = [
      "adults",
      "athletes",
      "chess-players",
      "designers",
      "entrepreneurs",
      "gamers",
      "kids",
      "pilots",
      "programmers",
      "readers",
      "remote-workers",
      "seniors",
      "students",
      "teachers",
      "teens",
    ];
    const audiencePages = audiences.map((a) => ({
      loc: `/schulte-table-for-${a}`,
      priority: 0.6,
    }));

    // Game routes
    const difficulties = ["extreme", "hard", "impossible", "medium"];
    const modes = ["alphabet/easy", "alphabet/medium", "alphabet/hard"];

    const gameUrls = [
      "/schulte-table/3x3",
      ...difficulties.map((diff) => `/schulte-table/3x3/${diff}`),
      "/schulte-table/3x3/mode",
      ...modes.map((mode) => `/schulte-table/3x3/mode/${mode}`),
    ].map((path) => ({
      loc: path,
      priority: path.includes("/mode") ? 0.6 : 0.7,
    }));

    // NOTE: /my-profile/* deliberately removed — private, per-user content,
    // has no business being in a public sitemap. Disallowed via
    // robotsTxtOptions above instead.

    return [
      ...staticPages,
      ...competitorPages,
      ...audiencePages,
      ...gameUrls,
    ].map((p) => ({
      ...p,
      changefreq: "weekly",
    }));
  },
};
