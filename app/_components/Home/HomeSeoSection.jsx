import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  HOME_STEPS,
  GRID_GUIDE,
  MODES,
  HOME_FAQS,
  HOME_LINKS,
} from "@/app/_data/homeContent";

/**
 * The homepage's actual body copy.
 *
 * Before this existed, `/` carried roughly two sentences of text — one <h1> at
 * `text-xs` and a short paragraph — while taking 71% of all pageviews and
 * ranking for the site's head term. That's a thin page holding the most
 * valuable position on the domain, and it forced every informational query
 * ("what is a schulte table", "good schulte table time", "how long should I
 * practise") onto satellite pages that get one or two visits a week.
 *
 * Everything here sits *below* the game, so the first viewport is unchanged —
 * a visitor who came to play still lands on the board and nothing else.
 *
 * Server component: pure content, no interactivity, no reason to ship JS.
 */
export default function HomeSeoSection() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16">
      {/* ── What it is ──────────────────────────────────────────────────── */}
      <section className="border-t border-border pt-12">
        <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
          What is a Schulte Table?
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <p>
            A Schulte Table is a square grid filled with numbers arranged in
            random order. The task is simple to describe and surprisingly hard to
            do well: keep your eyes fixed on the centre cell and find the numbers
            in sequence — 1, then 2, then 3 — as quickly as you can, without
            letting your gaze wander around the grid to hunt for them.
          </p>
          <p>
            It was introduced by the German psychiatrist{" "}
            <strong className="text-foreground">Walter Schulte</strong> in the
            1950s as a clinical instrument for assessing attention and
            concentration. It spread well beyond the clinic because it turned out
            to be an unusually clean drill for one specific skill: taking in
            information from a wide visual field at once, rather than scanning it
            point by point the way most people read. That is why it became a
            fixture of speed-reading training, and why it is still used in pilot,
            athlete, and student training programmes today.
          </p>
          <p>
            The reason it works as a training tool rather than just a test is
            that it gives you a number every single round. You are not guessing
            whether you are improving — you can see your completion time,
            accuracy, and average reaction time per tap move over weeks.
          </p>
        </div>
      </section>

      {/* ── How to play ─────────────────────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
          How to play — and the mistake almost everyone makes
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          The rules take ten seconds to learn. Doing it correctly takes a bit
          longer, because the natural instinct — scanning row by row like you're
          reading — is precisely the habit the exercise is designed to break.
        </p>

        <ol className="mt-6 space-y-4">
          {HOME_STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-black tabular-nums text-primary">
                {i + 1}
              </span>
              <div className="pt-0.5">
                <p className="text-sm font-bold text-foreground sm:text-base">
                  {step.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <Link
          href="/how-to-play-schulte-table"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-foreground underline underline-offset-4"
        >
          Read the full technique guide <ArrowRight size={14} />
        </Link>
      </section>

      {/* ── Grid sizes ──────────────────────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
          Which grid size should you use?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Grid size changes what you're actually training. Small grids train
          visual span; large grids train sustained concentration. The times below
          are typical ranges for the number mode on this site, not records — use
          them to sanity-check where you're starting from.
        </p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 font-bold text-foreground">Grid</th>
                <th className="px-4 py-3 font-bold text-foreground">Cells</th>
                <th className="px-4 py-3 font-bold text-foreground">Best for</th>
                <th className="px-4 py-3 font-bold text-foreground">
                  Typical time
                </th>
                <th className="px-4 py-3 font-bold text-foreground">
                  Why it&apos;s different
                </th>
              </tr>
            </thead>
            <tbody>
              {GRID_GUIDE.map((row, i) => (
                <tr
                  key={row.size}
                  className={i % 2 === 1 ? "bg-muted/40" : undefined}
                >
                  <td className="border-t border-border px-4 py-3 font-bold text-foreground">
                    {row.href ? (
                      <Link
                        href={row.href}
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        {row.size}
                      </Link>
                    ) : (
                      row.size
                    )}
                  </td>
                  <td className="border-t border-border px-4 py-3 text-muted-foreground">
                    {row.cells}
                  </td>
                  <td className="border-t border-border px-4 py-3 text-muted-foreground">
                    {row.who}
                  </td>
                  <td className="border-t border-border px-4 py-3 font-medium tabular-nums text-foreground">
                    {row.typical}
                  </td>
                  <td className="border-t border-border px-4 py-3 text-muted-foreground">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Modes ───────────────────────────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
          Four modes, four different demands
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Switch modes from the panel beside the board. They are not cosmetic
          variations — each one loads a different part of your attention, and
          your times will not be comparable between them.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {MODES.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <p className="text-sm font-bold text-foreground">{m.name}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {m.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What you get back ───────────────────────────────────────────── */}
      <section className="mt-14 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
          Every game is measured. After ten, you get a report.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Most brain-training sites give you a score and nothing else. Each round
          here records your completion time, per-tap reaction times, accuracy,
          and where on the grid you hesitated. Once you&apos;ve completed ten
          games we turn that into a written{" "}
          <strong className="text-foreground">Brain Report</strong> — your focus
          score, how your reaction time decays across a session, which time of
          day you actually perform best, and what specifically is costing you
          seconds.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          It is free, and it does not need a card. Pro extends it with your full
          game history, a percentile rank against every other player, a long-term
          Focus IQ trend, and removes the sponsored blocks from this page.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/monthly-brain-report"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background transition-opacity hover:opacity-90"
          >
            See what the report covers
          </Link>
          <Link
            href="/get-pro"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-foreground/40"
          >
            Compare free vs Pro
          </Link>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
          Frequently asked questions
        </h2>
        <div className="mt-6 space-y-3">
          {HOME_FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-border bg-card p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-bold text-foreground sm:text-base">
                {faq.q}
                <span className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
        <Link
          href="/schulte-table-faq"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-foreground underline underline-offset-4"
        >
          More questions answered <ArrowRight size={14} />
        </Link>
      </section>

      {/* ── Internal links ──────────────────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Keep reading
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {HOME_LINKS.map((l) => (
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
  );
}
