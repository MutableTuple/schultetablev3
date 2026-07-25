import React from "react";
import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blogs", label: "Blogs" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/get-pro", label: "Get Pro" },
  { href: "/support", label: "Support" },
  { href: "/schulte-table-faq", label: "FAQ" },
];

const learnLinks = [
  { href: "/what-is-schulte-table", label: "What Is a Schulte Table?" },
  { href: "/how-to-play-schulte-table", label: "How to Play" },
  { href: "/benefits-of-schulte-table", label: "Benefits" },
  { href: "/schulte-table-science", label: "The Science" },
  { href: "/schulte-table-research", label: "Research" },
  { href: "/schulte-table-history", label: "History" },
  { href: "/schulte-table-world-record", label: "World Records" },
  { href: "/schulte-table-alternatives", label: "Alternatives Compared" },
];

const badges = [
  {
    href: "https://dofollow.tools",
    img: "https://dofollow.tools/badge/badge_dark.svg",
    alt: "Featured on Dofollow.Tools",
    className: "h-12",
  },
  {
    href: "https://www.producthunt.com/products/schulte-table?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-schultetable-com",
    img: "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=949724&theme=dark&t=1764304469948",
    alt: "Schultetable.com - Rewire your brain & Mental training! | Product Hunt",
    width: "250",
    height: "54",
    className: "w-[250px] h-[54px]",
  },
  {
    href: "https://bestsky.tools?utm_source=badge",
    img: "https://assets.bestsky.tools/badges/featured-light.svg",
    alt: "Featured on BestskyTools",
    width: "150",
  },
  {
    href: "https://launchigniter.com/product/schultetable-com?ref=badge-schultetable-com",
    img: "https://launchigniter.com/api/badge/schultetable-com?theme=dark",
    alt: "Featured on LaunchIgniter",
    width: "212",
    height: "55",
  },
  {
    href: "https://auraplusplus.com/projects/schultetable-com",
    img: "https://auraplusplus.com/images/badges/featured-on-dark.svg",
    alt: "Featured on Aura++",
  },
];

export default function Footer() {
  return (
    <footer className="bg-muted text-foreground border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <p className="text-xl font-bold text-foreground">
              SchulteTable.com
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Boost your focus, speed, and visual attention with daily Schulte
              table exercises.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">
              Quick Links
            </p>
            <nav
              aria-label="Quick links"
              className="flex flex-col gap-2 text-sm"
            >
              {quickLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Learn */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">
              Learn
            </p>
            <nav
              aria-label="Learn more"
              className="flex flex-col gap-2 text-sm"
            >
              {learnLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">
              Social
            </p>
            <nav
              aria-label="Social links"
              className="flex flex-col gap-2 text-sm"
            >
              <Link
                href="https://x.com/schultetableofc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter / X
              </Link>
              <Link
                href="https://www.youtube.com/@schultetable"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                YouTube
              </Link>
            </nav>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
          {badges.map(({ href, img, alt, width, height, className }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-block"
            >
              <img
                src={img}
                alt={alt}
                width={width}
                height={height}
                className={className}
              />
            </Link>
          ))}
        </div>

        {/* Bottom Line */}
        <div className="text-center text-xs text-muted-foreground mt-10">
          © {new Date().getFullYear()} SchulteTable.com — All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
