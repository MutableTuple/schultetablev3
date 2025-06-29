export async function GET() {
  const content = `User-agent: *
Allow: /
Disallow: /my-profile
Disallow: /account

Sitemap: https://schultetable.com/sitemap.xml
Host: https://schultetable.com`;

  return new Response(content.trim(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400", // 1 day cache
    },
  });
}
