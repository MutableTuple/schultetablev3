import Link from "next/link";
import { Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALTERNATIVES } from "@/app/_data/alternatives";

export const metadata = {
  // absolute — bypasses the root layout's "%s | Schulte Table" template,
  // which would otherwise push this title past ~60 chars.
  title: { absolute: "Schulte Table Alternatives: 27 Brain Games & Apps Compared" },
  description:
    "Comparing Schulte Table against Sudoku, Wordle, Chess, Lumosity, Elevate, and 22 more brain games and focus apps. Find the right one for your goals.",
  keywords: [
    "schulte table alternatives",
    "brain training alternatives",
    "focus apps compared",
    "brain games comparison",
    "schulte table vs",
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-alternatives",
  },
  openGraph: {
    title: "Schulte Table Alternatives: 27 Brain Games & Apps Compared",
    description:
      "Comparing Schulte Table against Sudoku, Wordle, Chess, Lumosity, Elevate, and more brain games and focus apps.",
    url: "https://www.schultetable.com/schulte-table-alternatives",
    siteName: "Schulte Table",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Schulte Table Training Interface",
      },
    ],
  },
};

// The two pre-existing comparisons aren't in the ALTERNATIVES data set
// (different page implementation), so they're listed alongside it here.
const EXTRA_COMPARISONS = [
  { slug: "elevate", name: "Elevate", category: "Brain Training App" },
  { slug: "lumosity", name: "Lumosity", category: "Brain Training App" },
];

function groupByCategory(items) {
  const groups = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return groups;
}

// First sentence of each comparison's quickAnswer, reused as the at-a-glance
// verdict. Derived rather than rewritten so the hub can never contradict the
// page it links to.
function firstSentence(text = "") {
  const m = text.match(/^[^.]+\./);
  return m ? m[0] : text;
}

const HUB_FAQS = [
  {
    q: "What is the closest alternative to a Schulte Table?",
    a: "For the specific skill a Schulte Table trains — locating a target in a visual field without moving your gaze — the closest things are visual-search and reaction-time drills such as those in Human Benchmark. Most popular brain-training apps (Lumosity, Elevate, Peak) are broader: they cover memory, vocabulary and arithmetic alongside attention, so no single exercise in them maps directly onto a Schulte Table.",
  },
  {
    q: "Are paid brain-training apps better than a free Schulte Table?",
    a: "They are better at variety, structure, and keeping you engaged over months. They are not better at the one thing a Schulte Table does, and the evidence that any of them produce broad cognitive improvement is weak across the board — that limitation applies to the paid apps as much as it does here. If you want a single daily attention drill, free is enough. If you want a guided programme across many skills, a paid app is the honest recommendation.",
  },
  {
    q: "Can I use a Schulte Table alongside another brain game?",
    a: "Yes, and it fits particularly well as a warm-up because a round takes under a minute. A common pattern is a few Schulte rounds first, then a longer session of whatever you actually enjoy — Sudoku, chess, a crossword. They train different things and don't interfere with each other.",
  },
  {
    q: "How were these comparisons made?",
    a: "Each page compares session length, the core skill trained, cost, whether the activity is timed, how repeatable it is, and how measurable progress is. Where a competitor is genuinely better for a given goal, the page says so — every comparison includes a 'choose the other one if' section for exactly that reason.",
  },
];

export default function Page() {
  const all = [...ALTERNATIVES, ...EXTRA_COMPARISONS].sort((a, b) => a.name.localeCompare(b.name));
  const grouped = groupByCategory(all);

  // ItemList tells Google this is a curated hub over 27 comparison pages
  // rather than an unstructured link dump, and FAQPage is eligible for rich
  // results. Both mirror content that's actually rendered below.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Schulte Table alternatives compared",
    numberOfItems: all.length,
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Schulte Table vs ${item.name}`,
      url: `https://www.schultetable.com/schulte-table-vs-${item.slug}`,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HUB_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/15 text-primary mb-5">
            Comparisons
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-foreground leading-tight">
            Schulte Table Alternatives
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground mt-4">
            Honest, feature-by-feature comparisons against {all.length} popular brain games,
            puzzles, and focus apps — so you can pick the right tool, or use a few together.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-12">
        {/* ── Editorial intro. Without this the page is a bare link directory,
            which is exactly the pattern Google's helpful-content systems
            demote — a hub needs to be worth reading on its own, not just
            worth crawling. ── */}
        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
          <p>
            &ldquo;What should I use instead of a Schulte Table?&rdquo; is
            usually the wrong question. A Schulte Table trains one narrow thing
            — how fast you can find a specific target in a visual field while
            holding your gaze still. Almost nothing else on this list trains
            that. Sudoku trains deduction, Wordle trains vocabulary retrieval,
            chess trains planning, meditation apps train something else
            entirely. They aren&apos;t worse alternatives; they&apos;re
            different tools.
          </p>
          <p>
            So each comparison below is built to answer a narrower and more
            useful question: given what you&apos;re actually trying to improve,
            which of these two is the better use of your time? Every page
            compares session length, the core skill trained, cost, whether the
            activity is timed, how repeatable it is, and how measurable your
            progress is — and each one ends with an explicit &ldquo;choose the
            other one if…&rdquo; list, because for a lot of goals the other one
            genuinely is the better pick.
          </p>
          <p>
            One caveat that applies to this entire category, including us: the
            evidence that any brain-training activity produces broad transfer to
            general intelligence is weak. What&apos;s well supported is that you
            get better at the thing you practise. Choose based on which specific
            skill you want, not on which product makes the biggest claim.
          </p>
        </section>

        {/* ── At-a-glance verdicts ── */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            At a glance
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            The short verdict from each comparison. Follow a row for the full
            breakdown.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[560px] text-sm text-left">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-3 font-bold text-foreground">
                    Compared with
                  </th>
                  <th className="px-4 py-3 font-bold text-foreground">Type</th>
                  <th className="px-4 py-3 font-bold text-foreground">
                    Short verdict
                  </th>
                </tr>
              </thead>
              <tbody>
                {ALTERNATIVES.map((item, i) => (
                  <tr
                    key={item.slug}
                    className={i % 2 === 1 ? "bg-muted/40" : undefined}
                  >
                    <td className="px-4 py-3 border-t border-border font-bold whitespace-nowrap">
                      <Link
                        href={`/schulte-table-vs-${item.slug}`}
                        className="text-foreground underline underline-offset-4 hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 border-t border-border text-muted-foreground whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 border-t border-border text-muted-foreground">
                      {firstSentence(item.quickAnswer)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              {category}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/schulte-table-vs-${item.slug}`}
                  className="flex items-center justify-between gap-3 bg-card border border-border rounded-2xl px-5 py-4 hover:border-primary/40 transition-colors"
                >
                  <span className="font-bold text-foreground text-sm">
                    Schulte Table vs {item.name}
                  </span>
                  <span className="text-primary text-sm shrink-0">→</span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* ── FAQ — mirrors the FAQPage JSON-LD emitted at the top. ── */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {HUB_FAQS.map((faq) => (
              <div
                key={faq.q}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <p className="font-bold text-foreground mb-1.5">{faq.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center pt-6">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-3">
            Or Skip the Comparisons — Just Play
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Free, no sign-up required, and ready in the next 30 seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button render={<Link href="/" />} nativeButton={false} className="gap-1.5">
              Play Free →
            </Button>
            <Button variant="outline" render={<Link href="/duels" />} nativeButton={false} className="gap-1.5">
              <Swords size={15} /> Challenge a Friend
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
