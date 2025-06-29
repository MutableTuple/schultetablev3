export async function GET() {
  const baseUrl = "https://schultetable.com";

  // Public pages with optional last modified timestamps
  const pages = [
    { path: "", priority: "1.0" },
    { path: "/about", priority: "0.8" },
    { path: "/blogs", priority: "0.8" },
    { path: "/login", priority: "0.6" },
    { path: "/register", priority: "0.6" },
    { path: "/leaderboard", priority: "0.6" },
    { path: "/how-to-play-schulte-table", priority: "0.6" },
    { path: "/get-pro", priority: "0.6" },
  ];

  const lastmod = new Date().toISOString(); // Use actual update time in real apps

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
