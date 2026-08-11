import Link from "next/link";
import { ALL_GRID_LINKS } from "@/app/_data/gridPages";

/**
 * Below-the-board content for a per-size grid page.
 *
 * Server component — pure content, zero client JS. Everything unique to the
 * size comes from GRID_PAGES; this file only decides layout, so adding a size
 * means writing content, not markup.
 */
export default function GridSeoContent({ data }) {
  const others = ALL_GRID_LINKS.filter((g) => g.slug !== data.slug);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16">
      {/* WHY THIS SIZE */}
      <section className="border-t border-border pt-12">
        <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
          Why play the {data.label}?
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {data.whyThisSize}
        </p>
      </section>

      {/* TECHNIQUE */}
      <section className="mt-12">
        <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
          How to play the {data.label} well
        </h2>
        <ul className="mt-5 space-y-3">
          {data.technique.map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="text-sm leading-relaxed text-muted-foreground">
                {t}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* TIMES */}
      <section className="mt-12">
        <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
          What&apos;s a good {data.label} time?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Observed ranges from ordinary play on this site, in number mode — not
          records, and not a scoring scale. Your own first session is the only
          baseline that matters.
        </p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[380px] text-left text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 font-bold text-foreground">Level</th>
                <th className="px-4 py-3 font-bold text-foreground">
                  Typical time
                </th>
              </tr>
            </thead>
            <tbody>
              {data.typicalTimes.map((row, i) => (
                <tr key={row.level} className={i % 2 ? "bg-muted/40" : undefined}>
                  <td className="border-t border-border px-4 py-3 text-muted-foreground">
                    {row.level}
                  </td>
                  <td className="border-t border-border px-4 py-3 font-bold tabular-nums text-foreground">
                    {row.range}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* GOOD FOR */}
      <section className="mt-12">
        <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
          Best used for
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {data.goodFor.map((g) => (
            <div
              key={g}
              className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground"
            >
              {g}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
          {data.label} Schulte Table — FAQ
        </h2>
        <div className="mt-5 space-y-3">
          {data.faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-border bg-card p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-bold text-foreground sm:text-base">
                {f.q}
                <span className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* OTHER SIZES — the internal-link mesh that makes these pages a set
          rather than orphans. Every target is a real route. */}
      <section className="mt-12">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Other grid sizes
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {others.map((g) => (
            <Link
              key={g.slug}
              href={`/schulte-table/${g.slug}`}
              className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              {g.label} · {g.cells} cells
            </Link>
          ))}
          <Link
            href="/how-to-play-schulte-table"
            className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            Full technique guide
          </Link>
          <Link
            href="/schulte-table-world-record"
            className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            World records
          </Link>
        </div>
      </section>
    </div>
  );
}

/**
 * JSON-LD for a grid page: FAQPage (rich-result eligible) + a Game entity that
 * names the specific variant, plus a breadcrumb so the size pages read as a
 * hierarchy under /schulte-table rather than 6 unrelated URLs.
 *
 * Exported as a plain function returning objects so the page can serialise it
 * once — keeps the structured data derived from the same `data` the page
 * renders, which is what stops the two drifting apart.
 */
export function buildGridJsonLd(data) {
  const url = `https://www.schultetable.com/schulte-table/${data.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Game",
      name: `${data.label} Schulte Table`,
      url,
      description: data.metaDescription,
      numberOfPlayers: { "@type": "QuantitativeValue", value: 1 },
      gamePlatform: "Web browser",
      applicationCategory: "GameApplication",
      isAccessibleForFree: true,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Schulte Table",
          item: "https://www.schultetable.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `${data.label} Schulte Table`,
          item: url,
        },
      ],
    },
  ];
}
