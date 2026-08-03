import Link from "next/link";
import {
  FaCheckCircle,
  FaVolumeUp,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa";

export const metadata = {
  title: {
    absolute: "Shulky Table? Shalty Table? It's Actually a Schulte Table",
  },
  description:
    "Searching for a shulky table or shalty table? You're looking for the Schulte Table — a free online focus and speed-reading exercise. Play it now.",
  keywords: [
    "shulky table",
    "shalty table",
    "schutle table",
    "schule table",
    "shult table",
    "shuttle table brain game",
    "schulte table spelling",
    "how do you spell schulte table",
    "schulte table meaning",
  ],
  alternates: {
    canonical: "https://www.schultetable.com/shulky-table",
  },
  openGraph: {
    title: "Shulky Table? Shalty Table? It's Actually a Schulte Table",
    description:
      "Searching for a shulky table or shalty table? You're looking for the Schulte Table — a free online focus and speed-reading exercise.",
    url: "https://www.schultetable.com/shulky-table",
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

const MISSPELLINGS = [
  "Shulky table",
  "Shalty table",
  "Schutle table",
  "Schule table",
  "Shult table",
  "Shuttle table",
  "Schultze table",
  "Shulte table",
];

const faqs = [
  {
    question: "Is it spelled \"Shulky table\" or \"Schulte table\"?",
    answer:
      "It's Schulte table. \"Shulky table\" is a common mishearing or misspelling — there's no game or exercise actually called that. The name comes from Walter Schulte, the German psychiatrist who created the exercise.",
  },
  {
    question: "Is it \"Shalty table\" or \"Schulte table\"?",
    answer:
      "Schulte table. \"Shalty\" is another frequent misspelling of \"Schulte,\" likely from typing it phonetically without knowing the German spelling.",
  },
  {
    question: "How do you pronounce \"Schulte\"?",
    answer:
      "Roughly \"SHOOL-tuh.\" The unusual pronunciation for English speakers is exactly why so many people search for it as \"shulky,\" \"shalty,\" \"schutle,\" or \"shuttle\" table instead.",
  },
  {
    question: "What is a Schulte table used for?",
    answer:
      "It's a grid of randomly arranged numbers (or letters) that you scan and click in order as fast as possible. It's used to train focus, peripheral vision, and reading speed — you can read the full explanation on our What Is a Schulte Table page.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

export default function Page() {
  return (
    <div className="min-h-screen bg-base-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* HERO */}
      <section className="hero py-16 sm:py-20 bg-gradient-to-b from-warning/10 to-transparent">
        <div className="hero-content text-center max-w-3xl">
          <div>
            <div className="badge badge-warning badge-lg gap-1.5 mb-5">
              <FaVolumeUp size={12} />
              You searched for a common misspelling
            </div>

            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-5">
              Shulky Table? Shalty Table? <br className="hidden sm:block" />
              You're looking for a{" "}
              <span className="text-primary">Schulte Table</span>.
            </h1>

            <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto">
              "Schulte" isn't an easy word to spell from memory — it's German,
              and it's pronounced nothing like it looks. If you typed{" "}
              <em>shulky</em>, <em>shalty</em>, <em>schutle</em>, or{" "}
              <em>shuttle table</em>, you're in the right place.
            </p>

            <div className="mt-8">
              <Link href="/" className="btn btn-primary btn-lg rounded-full">
                Play the Schulte Table Free
                <FaArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY THE CONFUSION */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold mb-5">
          Why does everyone spell it differently?
        </h2>
        <p className="text-base sm:text-lg leading-relaxed opacity-90 mb-4">
          The exercise is named after{" "}
          <strong>Walter Schulte</strong>, a German psychiatrist, and the
          German spelling doesn't map cleanly onto how English speakers hear
          or type it. That's why the same search shows up written a dozen
          different ways:
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {MISSPELLINGS.map((m) => (
            <span
              key={m}
              className="badge badge-outline badge-lg px-4 py-3 text-sm"
            >
              {m}
            </span>
          ))}
        </div>

        <p className="text-base sm:text-lg leading-relaxed opacity-90">
          Every one of those is the same thing: a grid of numbers you scan
          and click in order, as fast as you can, to train focus and reading
          speed. There's only one correct spelling —{" "}
          <strong>Schulte table</strong> — and one place to actually play it
          for free, no matter how you typed it to get here.
        </p>
      </section>

      {/* WHAT IT IS, BRIEF */}
      <section className="bg-base-200 py-14">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-5">
            So what is it, exactly?
          </h2>
          <div className="grid sm:grid-cols-3 gap-5 mb-6">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-success mt-1 shrink-0" />
              <p className="text-sm opacity-90">
                A grid of scrambled numbers (or letters) — usually 3×3 up to
                6×6.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-success mt-1 shrink-0" />
              <p className="text-sm opacity-90">
                You find and click them in order, 1 to N, as fast as
                possible.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-success mt-1 shrink-0" />
              <p className="text-sm opacity-90">
                Used to train focus, peripheral vision, and reading speed.
              </p>
            </div>
          </div>
          <p className="text-base leading-relaxed opacity-90">
            Want the full breakdown — the science, the benefits, how to
            practice properly?{" "}
            <Link
              href="/what-is-schulte-table"
              className="link link-primary font-semibold"
            >
              Read the complete guide
            </Link>
            , or just jump straight in below.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">
          Common questions
        </h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div
              key={f.question}
              className="collapse collapse-plus bg-base-200 rounded-2xl"
            >
              <input type="checkbox" />
              <div className="collapse-title text-base sm:text-lg font-semibold">
                {f.question}
              </div>
              <div className="collapse-content">
                <p className="text-sm sm:text-base opacity-80">{f.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="hero rounded-3xl bg-primary text-primary-content">
          <div className="hero-content text-center py-14">
            <div>
              <FaGlobe className="text-4xl mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                However you spell it, here's the real thing
              </h2>
              <p className="opacity-90 max-w-xl mx-auto mb-6">
                Free, no download, no sign-up. Pick a grid size and start
                training your focus in the next 30 seconds.
              </p>
              <Link href="/" className="btn btn-lg bg-white text-primary hover:bg-white/90 border-none rounded-full">
                Play Schulte Table Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
