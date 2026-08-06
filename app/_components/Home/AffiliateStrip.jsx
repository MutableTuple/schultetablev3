import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  AFFILIATE_DISCLOSURE,
  getActiveAffiliateOffers,
} from "@/app/_data/affiliates";

/**
 * Sponsored boxes shown below the game on the homepage.
 *
 * Placement is deliberate: below the fold, under the game and under the free
 * Brain Report rail. Nothing here competes with the exercise itself, which is
 * the site's whole value proposition and its best retention lever.
 *
 * Server component — the offers are static data, so there's no reason to ship
 * this to the client. `isPro` is resolved on the server too, which means a Pro
 * user's HTML never contains the block at all (rather than hiding it with CSS).
 */
export default function AffiliateStrip({ isPro }) {
  if (isPro) return null;

  const offers = getActiveAffiliateOffers();
  if (!offers.length) return null;

  return (
    <section
      aria-labelledby="sponsored-heading"
      className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="sponsored-heading"
          className="text-sm font-bold uppercase tracking-widest text-muted-foreground"
        >
          Tools people here actually use
        </h2>
        <Link
          href="/get-pro"
          className="text-xs font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Hide these — go Pro
        </Link>
      </div>

      {/* FTC disclosure. Must stay above the links and stay legible. */}
      <p className="mb-5 text-[11px] leading-relaxed text-muted-foreground/80">
        {AFFILIATE_DISCLOSURE}
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {offers.map((offer) => (
          <a
            key={offer.id}
            href={offer.url}
            target="_blank"
            // sponsored + nofollow keeps Google's link-spam systems off the
            // domain; noopener/noreferrer is the standard target=_blank guard.
            rel="sponsored nofollow noopener noreferrer"
            className="group relative flex flex-col rounded-2xl border border-border bg-card p-4 transition-colors hover:border-foreground/25"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Ad
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {offer.category}
              </span>
              {offer.badge && (
                <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {offer.badge}
                </span>
              )}
            </div>

            <p className="mb-1.5 text-sm font-bold leading-snug text-foreground">
              {offer.title}
            </p>
            <p className="mb-4 flex-1 text-xs leading-relaxed text-muted-foreground">
              {offer.blurb}
            </p>

            <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground">
              {offer.cta}
              <ArrowUpRight
                size={13}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
