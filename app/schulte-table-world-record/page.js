import Link from "next/link";

export const metadata = {
  title:
    "Schulte Table World Record: Fastest Times, Benchmarks & Elite Performance",
  description:
    "Discover Schulte Table world record discussions, fastest completion times, elite benchmarks, average scores, and how to improve your Schulte Table performance.",
  keywords: [
    "schulte table world record",
    "fastest schulte table time",
    "schulte table record",
    "schulte table average time",
    "schulte table leaderboard",
    "schulte table score",
    "schulte table benchmark",
    "schulte table elite time",
    "schulte table speed",
    "schulte table training",
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-world-record",
  },
  openGraph: {
    title: "Schulte Table World Record & Fastest Times",
    description:
      "See how your Schulte Table time compares against beginner, advanced and elite benchmarks.",
    url: "https://schultetable.com/schulte-table-world-record",
    type: "article",
  },
};

export default function Page() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is there an official Schulte Table world record?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "There is currently no universally recognised official Schulte Table world record authority. Most players compare personal bests and leaderboard rankings.",
        },
      },
      {
        "@type": "Question",
        name: "What is considered a good Schulte Table time?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most players consider under 40 seconds good, under 25 seconds advanced, and under 15 seconds elite on a standard 5x5 grid.",
        },
      },
      {
        "@type": "Question",
        name: "How can I improve my Schulte Table score?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Consistent practice, reduced eye movement, improved peripheral vision, and better visual scanning strategies can help improve performance.",
        },
      },
    ],
  };

  const benchmarks = [
    {
      level: "Beginner",
      time: "60+ sec",
      emoji: "🌱",
      color: "badge-success",
    },
    {
      level: "Average",
      time: "40-60 sec",
      emoji: "📈",
      color: "badge-info",
    },
    {
      level: "Good",
      time: "25-40 sec",
      emoji: "🔥",
      color: "badge-warning",
    },
    {
      level: "Advanced",
      time: "15-25 sec",
      emoji: "⚡",
      color: "badge-secondary",
    },
    {
      level: "Elite",
      time: "<15 sec",
      emoji: "🏆",
      color: "badge-primary",
    },
  ];

  const tips = [
    {
      title: "Keep Your Eyes Near Center",
      desc: "Elite players reduce excessive eye movement and rely more heavily on peripheral vision.",
    },
    {
      title: "Practice Daily",
      desc: "Five minutes every day beats one long session per week.",
    },
    {
      title: "Track Personal Records",
      desc: "Recording best times helps maintain motivation and identify improvement trends.",
    },
    {
      title: "Increase Difficulty",
      desc: "Move from 5×5 grids to 7×7 and beyond to challenge visual processing speed.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <div className="min-h-screen bg-base-100">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-base-300">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 39px,currentColor 39px,currentColor 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,currentColor 39px,currentColor 40px)",
            }}
          />

          <div className="relative max-w-6xl mx-auto px-6 py-28 text-center">
            <div className="flex justify-center mb-6">
              <span className="badge badge-primary badge-lg">
                Competitive Performance
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Schulte Table
              <br />
              <span className="text-primary">World Record</span>
            </h1>

            <p className="max-w-3xl mx-auto text-xl opacity-70 mb-10">
              How fast can a human complete a Schulte Table? Discover elite
              performance benchmarks, personal records, training methods, and
              how your score compares.
            </p>

            <div className="stats shadow border border-base-300">
              <div className="stat">
                <div className="stat-title">Elite Target</div>
                <div className="stat-value text-primary">&lt;15s</div>
              </div>

              <div className="stat">
                <div className="stat-title">Standard Grid</div>
                <div className="stat-value">5×5</div>
              </div>

              <div className="stat">
                <div className="stat-title">Numbers</div>
                <div className="stat-value">25</div>
              </div>
            </div>

            <div className="mt-10">
              <Link href="/" className="btn btn-primary btn-lg px-10">
                Test Your Speed →
              </Link>
            </div>
          </div>
        </section>

        {/* RECORD EXPLANATION */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h2 className="text-4xl font-black mb-4">
                Is There an Official World Record?
              </h2>

              <p className="text-lg opacity-80 leading-relaxed">
                Unlike sports such as sprinting or chess, Schulte Tables do not
                currently have a universally recognised governing body that
                maintains official world records.
              </p>

              <p className="text-lg opacity-80 leading-relaxed">
                Most players compare personal bests, app leaderboards,
                competition results, and community rankings. Because different
                platforms use different grid sizes, rules, and timer systems,
                comparing times directly can be difficult.
              </p>

              <div className="alert alert-info mt-6">
                <span>
                  🏆 Most competitive players instead focus on reaching elite
                  benchmark times and continually improving personal records.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* BENCHMARKS */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4">Performance Benchmarks</h2>

            <p className="text-lg opacity-70">
              Compare your best time against common performance levels.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {benchmarks.map((item) => (
              <div
                key={item.level}
                className="card bg-base-200 border border-base-300 hover:border-primary transition-all"
              >
                <div className="card-body text-center">
                  <div className="text-5xl">{item.emoji}</div>

                  <h3 className="font-black text-xl">{item.level}</h3>

                  <div className={`badge ${item.color} badge-lg`}>
                    {item.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHAT MAKES ELITE PLAYERS */}
        <section className="bg-base-200 border-y border-base-300">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black">
                What Makes Elite Players Fast?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-2xl">Peripheral Vision</h3>

                  <p>
                    Elite players often locate multiple future targets before
                    reaching them, reducing search time dramatically.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-2xl">
                    Visual Processing Speed
                  </h3>

                  <p>
                    Faster recognition means less time spent identifying the
                    next number.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-2xl">Attention Control</h3>

                  <p>
                    Maintaining focus without distraction is essential for top
                    performance.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-2xl">Consistent Practice</h3>

                  <p>
                    The biggest gains come from hundreds or thousands of
                    repetitions over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRAINING */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black">How To Improve Your Score</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tips.map((tip) => (
              <div
                key={tip.title}
                className="card bg-base-200 border border-base-300"
              >
                <div className="card-body">
                  <h3 className="font-black text-xl">{tip.title}</h3>

                  <p className="opacity-80">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <h2 className="text-center text-5xl font-black mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
              <input type="radio" name="faq" defaultChecked />
              <div className="collapse-title font-bold">
                Is there a Guinness World Record?
              </div>
              <div className="collapse-content">
                There is currently no widely recognised Guinness World Record
                category dedicated specifically to Schulte Tables.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
              <input type="radio" name="faq" />
              <div className="collapse-title font-bold">
                What is an elite Schulte Table time?
              </div>
              <div className="collapse-content">
                Many players consider anything under 15 seconds on a standard
                5×5 grid to be elite-level performance.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
              <input type="radio" name="faq" />
              <div className="collapse-title font-bold">
                How often should I train?
              </div>
              <div className="collapse-content">
                Most players see good results with 3–10 minutes of daily
                practice.
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-content">
          <div className="max-w-6xl mx-auto px-6 py-24 text-center">
            <div className="text-7xl mb-6">🏆</div>

            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Think You Can Set A Record?
            </h2>

            <p className="max-w-2xl mx-auto text-xl opacity-80 mb-10">
              Challenge yourself, track your personal best, and see how close
              you can get to elite Schulte Table performance.
            </p>

            <Link
              href="/"
              className="btn btn-lg bg-white text-primary hover:bg-white"
            >
              Play Schulte Table Free →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
