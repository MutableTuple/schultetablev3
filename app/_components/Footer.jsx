import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content mt-20 border-t border-base-300">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Main Footer Content */}
        <div className="footer grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left Section */}
          <div>
            <h2 className="text-xl font-semibold">SchulteTable.com</h2>
            <p className="text-sm opacity-70 mt-2 max-w-xs">
              Boost your focus, speed, and visual attention with daily Schulte
              table exercises.
            </p>
          </div>

          {/* Center Links */}
          <div>
            <h3 className="footer-title">Quick Links</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/" className="link link-hover">
                Home
              </Link>
              <Link href="/about" className="link link-hover">
                About
              </Link>
              <Link href="/blogs" className="link link-hover">
                Blogs
              </Link>
              <Link href="/support" className="link link-hover">
                Support
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h3 className="footer-title">Social</h3>
            <nav className="flex flex-col gap-2 text-sm">
              {/* Twitter */}
              <Link
                href="https://x.com/schultetableofc"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover"
              >
                Twitter / X
              </Link>

              {/* YouTube */}
              <Link
                href="https://www.youtube.com/@schultetable"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover"
              >
                YouTube
              </Link>
            </nav>
          </div>
        </div>

        {/* Badge Section (Supports Multiple Badges) */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
          {/* Badge 1 – Dofollow.tools */}
          <Link
            href="https://dofollow.tools"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src="https://dofollow.tools/badge/badge_dark.svg"
              alt="Featured on Dofollow.Tools"
              className="h-12"
            />
          </Link>

          {/* Badge 2 – Product Hunt */}
          <Link
            href="https://www.producthunt.com/products/schulte-table?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-schultetable-com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=949724&theme=dark&t=1764304469948"
              alt="Schultetable.com - Rewire your brain & Mental training! | Product Hunt"
              className="w-[250px] h-[54px]"
              width="250"
              height="54"
            />
          </Link>
          <Link
            href="https://bestsky.tools?utm_source=badge"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://assets.bestsky.tools/badges/featured-light.svg"
              alt="Featured on BestskyTools"
              width="150"
            />
          </Link>

          <Link
            href="https://launchigniter.com/product/schultetable-com?ref=badge-schultetable-com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://launchigniter.com/api/badge/schultetable-com?theme=dark"
              alt="Featured on LaunchIgniter"
              width="212"
              height="55"
            />
          </Link>
          <Link
            href="https://auraplusplus.com/projects/schultetable-com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://auraplusplus.com/images/badges/featured-on-dark.svg"
              alt="Featured on Aura++"
            />
          </Link>
        </div>

        {/* Bottom Line */}
        <div className="text-center text-xs opacity-60 mt-10">
          © {new Date().getFullYear()} SchulteTable.com — All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
