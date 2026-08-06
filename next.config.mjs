import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hflzumrbjzkzofgzeyao.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/login",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/auth/register",
        permanent: true,
      },

      /*
       * /faq and /schulte-table-faq were two separate FAQ pages targeting the
       * same intent, each self-canonicalising. That's textbook keyword
       * cannibalisation: Google had to pick one, split the link equity, and
       * both ranked worse than a single consolidated page would.
       *
       * /schulte-table-faq is the survivor — it's ~2.5x the content, it's the
       * one linked from the footer, and its slug carries the head term.
       * 308 permanent so the equity from /faq transfers.
       *
       * NOTE: app/faq/page.js still exists but is now unreachable. Delete it
       * once this redirect is confirmed live in production; leaving it costs
       * nothing but is dead weight.
       */
      {
        source: "/faq",
        destination: "/schulte-table-faq",
        permanent: true,
      },

      /*
       * /blog/... was the old singular path and still receives crawls; the
       * live route is /blogs/....
       */
      {
        source: "/blog/:slug",
        destination: "/blogs/:slug",
        permanent: true,
      },
    ];
  },
};

export default withPWA(nextConfig);
