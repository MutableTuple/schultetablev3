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
        disallow: ["/my-profile", "/api", "/report"],
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
      // /faq removed — it now 308s to /schulte-table-faq (they were duplicate
      // FAQ pages cannibalising each other). Listing a redirecting URL in a
      // sitemap is a Search Console warning and wastes crawl budget.
      { loc: "/schulte-table-for-adhd", priority: 0.8 },
      // Both were missing entirely. /monthly-brain-report is the destination
      // every in-game CTA funnels to (home progress rail, session milestone
      // modal, result sheet) — it had inbound internal links from the highest-
      // traffic surfaces on the site and no sitemap entry. /schulte-table is
      // the hub above the six per-size grid pages.
      { loc: "/monthly-brain-report", priority: 0.8 },
      { loc: "/schulte-table", priority: 0.8 },
      { loc: "/features", priority: 0.7 },
      { loc: "/official-brain-test", priority: 0.7 },
      { loc: "/support", priority: 0.5 },
      { loc: "/cookies", priority: 0.3 },
      { loc: "/privacy", priority: 0.3 },
      { loc: "/what-is-schulte-table", priority: 0.7 },
      { loc: "/shulky-table", priority: 0.6 },
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
      "/schulte-table/4x4",
      "/schulte-table/5x5",
      "/schulte-table/6x6",
      "/schulte-table/7x7",
      "/schulte-table/9x9",
    ].map((path) => ({
      loc: path,
      // 5x5 is the benchmark size and the highest-volume grid query in this
      // niche — competitors rank dedicated 5x5 pages independently of their
      // homepages — so it gets homepage-adjacent priority.
      priority: path.endsWith("/5x5") ? 0.9 : path.includes("/mode") ? 0.6 : 0.7,
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
