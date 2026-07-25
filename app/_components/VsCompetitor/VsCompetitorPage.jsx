import React from "react";
import Link from "next/link";
import { Check, X, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALTERNATIVES } from "@/app/_data/alternatives";

function verdictIcon(text) {
  if (text.startsWith("✅")) return <Check size={14} className="text-success shrink-0" />;
  if (text.startsWith("❌")) return <X size={14} className="text-destructive shrink-0" />;
  return null;
}

// Every "vs" page pulls a handful of the other 24 for internal linking —
// helps both crawlability and users browsing the comparison hub.
function RelatedAlternatives({ currentSlug }) {
  const others = ALTERNATIVES.filter((a) => a.slug !== currentSlug).slice(0, 6);
  return (
    <section className="mt-16">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 text-center">
        More Comparisons
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {others.map((a) => (
          <Link
            key={a.slug}
            href={`/schulte-table-vs-${a.slug}`}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            vs {a.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function VsCompetitorPage({ data }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/15 text-primary mb-5">
            {data.category} Comparison
          </span>
          <div className="text-5xl mb-4">{data.emoji}</div>
          <h1 className="text-3xl sm:text-5xl font-black text-foreground leading-tight">
            Schulte Table <span className="text-primary">vs</span> {data.name}
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground mt-4">
            {data.heroSubtitle}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-16">
        {/* QUICK ANSWER */}
        <section className="bg-primary/10 border border-primary/20 rounded-2xl p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
            Quick Answer
          </p>
          <p className="text-sm sm:text-base text-foreground leading-relaxed">{data.quickAnswer}</p>
        </section>

        {/* COMPARISON TABLE */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="px-4 py-3 font-bold text-foreground">Feature</th>
                  <th className="px-4 py-3 font-bold text-foreground">Schulte Table</th>
                  <th className="px-4 py-3 font-bold text-foreground">{data.name}</th>
                </tr>
              </thead>
              <tbody>
                {data.comparisons.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 1 ? "bg-muted/40" : ""}>
                    <td className="px-4 py-3 text-muted-foreground border-t border-border">{row.feature}</td>
                    <td className="px-4 py-3 text-foreground font-medium border-t border-border">
                      <span className="inline-flex items-center gap-1.5">
                        {verdictIcon(row.schulte)}
                        {row.schulte.replace(/^[✅❌⚠️]\s*/, "")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium border-t border-border">
                      <span className="inline-flex items-center gap-1.5">
                        {verdictIcon(row.competitor)}
                        {row.competitor.replace(/^[✅❌⚠️]\s*/, "")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* WHAT IS COMPETITOR */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">What Is {data.name}?</h2>
          <p className="text-muted-foreground leading-relaxed">{data.whatIsCompetitor}</p>
        </section>

        {/* DIFFERENCES */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            Biggest Differences
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.differences.map((item) => (
              <div key={item.title} className="bg-card border border-border rounded-2xl p-5">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-bold text-foreground mb-1">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHO SHOULD USE WHAT */}
        <section className="grid sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground mb-3">Choose Schulte Table If...</h3>
            <ul className="space-y-2.5">
              {data.chooseSchulteIf.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check size={15} className="text-success shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground mb-3">Choose {data.name} If...</h3>
            <ul className="space-y-2.5">
              {data.chooseCompetitorIf.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check size={15} className="text-success shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CAN YOU USE BOTH */}
        <section className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Can You Use Both?</h2>
          <p className="text-muted-foreground leading-relaxed">{data.canUseBoth}</p>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {data.faqs.map((faq) => (
              <div key={faq.q} className="bg-card border border-border rounded-2xl p-5">
                <p className="font-bold text-foreground mb-1.5">{faq.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* VERDICT */}
        <section className="bg-foreground text-background rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-primary" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-background/60">
              Final Verdict
            </p>
          </div>
          <p className="text-base sm:text-lg leading-relaxed">{data.verdict}</p>
        </section>

        {/* CTA */}
        <section className="text-center py-6">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-3">
            Train Your Focus — Free, Right Now
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            No sign-up, no ads blocking the exercise. Play a Schulte Table round in the next 30
            seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button render={<Link href="/" />} nativeButton={false} className="gap-1.5">
              Play Free →
            </Button>
            <Button variant="outline" render={<Link href="/duels" />} nativeButton={false} className="gap-1.5">
              Or Challenge a Friend
            </Button>
          </div>
        </section>

        <RelatedAlternatives currentSlug={data.slug} />

        <div className="text-center">
          <Button variant="outline" size="sm" render={<Link href="/about" />} nativeButton={false} className="gap-1.5">
            <ArrowLeft size={14} /> Learn More About Schulte Table
          </Button>
        </div>
      </div>
    </div>
  );
}
