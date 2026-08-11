import Link from "next/link";
import { getCurrentUser } from "@/app/_utils/getCurrentUser";
import GridBoard from "@/app/_components/GridPage/GridBoard";

/**
 * ADHD is the clearest content gap in this niche.
 *
 * Schulte tables have a genuine documented history as an attention-assessment
 * instrument, and search results across the category repeatedly reference their
 * use in ADHD assessment — but almost nobody has built a serious page for that
 * intent. The one real entrant (adhdfocuspro.com) is a newcomer.
 *
 * EDITORIAL POSITION — this page is deliberately conservative, and that is a
 * strategic choice as much as an ethical one:
 *
 *   1. ADHD is a medical condition. Pages that imply a browser game diagnoses
 *      or treats it are both wrong and, under Google's YMYL (Your Money or Your
 *      Life) quality standards, actively penalised. Overclaiming here would
 *      rank worse, not better.
 *   2. Competitors in this niche circulate unsourced figures — "47% improvement
 *      in visual attention", "28–35% reading speed increase" — appearing
 *      verbatim across unrelated sites with no traceable study. We do not
 *      repeat them.
 *
 * What's left is what's defensible: it's a focus exercise some people with
 * ADHD find useful, it is not a diagnostic tool, and we say so plainly.
 */

const url = "https://www.schultetable.com/schulte-table-for-adhd";
const title = "Schulte Table for ADHD — A Short, Honest Focus Exercise";
const description =
  "Can a Schulte Table help with ADHD? What the exercise does, what it doesn't, and how to use it in short sessions. Free to play, no sign-up — not a diagnostic tool.";

export const metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "schulte table adhd",
    "schulte table for adhd",
    "adhd focus exercise",
    "adhd attention training",
    "schulte grid adhd",
    "focus games for adhd",
    "adhd concentration exercise",
    "attention training adhd adults",
  ],
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    siteName: "Schulte Table",
    type: "article",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Schulte Table" },
    ],
  },
  twitter: { card: "summary_large_image", title, description },
};

const FAQS = [
  {
    q: "Can a Schulte Table diagnose ADHD?",
    a: "No. Schulte tables have a history as a clinical attention-assessment instrument, used by a trained professional alongside other measures — that is not the same as a diagnosis, and it is certainly not something a website can do. A slow or inconsistent time here tells you nothing about whether you have ADHD. Many people without ADHD have slow times, and many people with ADHD have fast ones. If you're seeking a diagnosis, that requires a qualified clinician.",
  },
  {
    q: "Does a Schulte Table help with ADHD symptoms?",
    a: "Honestly: the evidence for broad transfer is weak, and that applies to the whole brain-training category rather than this exercise specifically. What is well supported is that you get better at what you practise — so you should expect to improve at fast visual search and at holding attention on a short, structured task. Some people find that a two-minute drill with a clear start, end, and score is a useful way to begin a work session. That's a real benefit, but it's a behavioural one, not a treatment effect.",
  },
  {
    q: "Why might this exercise suit an ADHD brain?",
    a: "A few properties line up well: rounds are very short, so the task ends before attention has to be sustained through boredom; there's immediate feedback on every tap; the score is unambiguous; and the difficulty adapts, so it rarely sits in the demotivating zone of far-too-easy or far-too-hard. None of that is ADHD-specific — those are just properties of a well-designed short task — but they're the properties people commonly report struggling to find in longer focus exercises.",
  },
  {
    q: "How long should an ADHD-friendly session be?",
    a: "Shorter than you'd think. Two to three minutes, or roughly five rounds on a 4×4. The point is to finish while it still feels easy to continue. Long sessions turn a task you'll come back to into one you'll avoid, which is the failure mode that matters most for building any daily habit.",
  },
  {
    q: "Which grid size should I start with?",
    a: "The 4×4. It's about 8–15 seconds a round, which is short enough to complete before frustration sets in, and it lets you get several rounds into a couple of minutes. Move to the 5×5 when the 4×4 stops feeling demanding — not before.",
  },
  {
    q: "Is this suitable for children with ADHD?",
    a: "It's a free, ad-light game with no chat, no social features, and no purchase required to play, so there's little to object to. Start on the 3×3 or 4×4, keep sessions to a few minutes, and treat it as a game rather than therapy. Anything concerning a child's ADHD care should go through their clinician.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default async function Page() {
  const { user } = await getCurrentUser();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="mx-auto max-w-3xl px-4 pt-6 text-center">
        <h1 className="text-xl font-black leading-tight text-foreground sm:text-2xl">
          Schulte Table for ADHD
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
          A two-minute focus drill with a clear start, a clear end, and a score.
          Free to play below — no sign-up. It is not a diagnostic tool and not a
          treatment.
        </p>
      </header>

      <GridBoard user={user} initialSize={4} />

      <div className="mx-auto w-full max-w-3xl px-4 pb-16">
        {/* UP FRONT — the disclaimer leads rather than hides in a footer.
            Burying it would be both dishonest and, for a YMYL-adjacent query,
            worse for rankings. */}
        <section className="mt-12 rounded-2xl border border-warning/40 bg-warning/10 p-5">
          <h2 className="text-base font-black text-foreground">
            Read this first
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This is a focus exercise, not a medical device. It cannot diagnose
            ADHD, it is not a treatment, and your time on it says nothing about
            whether you have the condition. If you&apos;re looking for a
            diagnosis or considering changes to how you manage ADHD, that
            conversation belongs with a qualified clinician.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
            What this exercise actually does
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              A Schulte Table asks you to find numbers in order while keeping
              your eyes fixed on the centre of the grid. It trains one narrow,
              measurable thing: how quickly you can locate a target in your
              visual field without hunting for it. That skill is real and it is
              trainable.
            </p>
            <p>
              What it does not do is generalise. The research on brain-training
              transfer — the idea that practising one narrow task improves
              cognition broadly — is mixed at best, across the entire category.
              Anyone selling you a focus game as an ADHD intervention is ahead of
              the evidence.
            </p>
            <p>
              The reason it still shows up in ADHD discussions is more practical
              than clinical. A round takes seconds. It has a defined beginning
              and end. Every tap gives feedback. The score is unambiguous, so
              there&apos;s no ambiguity about whether you did the thing. Those
              are properties that make a task easy to start — and starting is
              usually the hard part.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
            A realistic way to use it
          </h2>
          <ol className="mt-5 space-y-4">
            {[
              {
                t: "Keep it to two or three minutes",
                d: "About five rounds on a 4×4. Stop while it still feels easy to continue — that's what makes you willing to come back tomorrow.",
              },
              {
                t: "Use it as a starting ritual, not a workout",
                d: "The most common report is that it's useful immediately before something you're avoiding. A short task with a guaranteed finish is an easier on-ramp than the thing itself.",
              },
              {
                t: "Start on the 4×4, not the 5×5",
                d: "Short rounds beat impressive ones. Move up only when the smaller grid stops feeling demanding.",
              },
              {
                t: "Watch accuracy, not just time",
                d: "Rushing to a fast time with several misclicks is the opposite of what you're training. A clean slow round is worth more than a messy fast one.",
              },
              {
                t: "Expect bad days, and don't read into them",
                d: "Times swing with sleep, stress, caffeine and time of day far more than most people expect. One slow session is noise, not a signal.",
              },
            ].map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-black tabular-nums text-primary">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <p className="text-sm font-bold text-foreground sm:text-base">
                    {s.t}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {s.d}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
            Questions people actually ask
          </h2>
          <div className="mt-5 space-y-3">
            {FAQS.map((f) => (
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

        <section className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Related
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { href: "/schulte-table/4x4", label: "Play the 4×4 (recommended start)" },
              { href: "/schulte-table/5x5", label: "Play the standard 5×5" },
              { href: "/schulte-table-science", label: "What the science does and doesn't show" },
              { href: "/how-to-play-schulte-table", label: "Full technique guide" },
              { href: "/schulte-table-for-kids", label: "For kids" },
              { href: "/schulte-table-for-students", label: "For students" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
