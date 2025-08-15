/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.schultetable.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,

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
      { loc: "/faq", priority: 0.6 },
    ];

    // my-profile section
    const profilePages = [
      "/my-profile",
      "/my-profile/my-games",
      "/my-profile/personalize",
      "/my-profile/security",
    ].map((path) => ({ loc: path, priority: 0.6 }));

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

    return [...staticPages, ...profilePages, ...gameUrls].map((p) => ({
      ...p,
      changefreq: "weekly",
    }));
  },
};
