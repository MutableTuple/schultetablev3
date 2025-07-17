export async function GET() {
  const baseUrl = "https://schultetable.com";

  const pages = [
    { path: "", priority: "1.0" },
    { path: "/about", priority: "0.8" },
    { path: "/blogs", priority: "0.8" },
    { path: "/auth/login", priority: "0.6" },
    { path: "/auth/register", priority: "0.6" },
    { path: "/leaderboard", priority: "0.6" },
    { path: "/how-to-play-schulte-table", priority: "0.6" },
    { path: "/benefits-of-schulte-table", priority: "0.6" },
    { path: "/get-pro", priority: "0.6" },
    { path: "/missions", priority: "0.6" },

    // ✅ 3x3 routes
    { path: "/schulte-table/3x3", priority: "0.7" },
    { path: "/schulte-table/3x3/extreme", priority: "0.7" },
    { path: "/schulte-table/3x3/hard", priority: "0.7" },
    { path: "/schulte-table/3x3/impossible", priority: "0.7" },
    { path: "/schulte-table/3x3/medium", priority: "0.7" },
    { path: "/schulte-table/3x3/mode", priority: "0.6" },
    { path: "/schulte-table/3x3/mode/alphabet/easy", priority: "0.6" },
    { path: "/schulte-table/3x3/mode/alphabet/hard", priority: "0.6" },
    { path: "/schulte-table/3x3/mode/alphabet/medium", priority: "0.6" },
  ];

  const lastmod = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      ({ path, priority }) => `
    <url>
      <loc>${baseUrl}${path}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${priority}</priority>
    </url>`
    )
    .join("")}
</urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
