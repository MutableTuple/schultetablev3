import Link from "next/link";

export const metadata = {
  title:
    "What Is a Schulte Table? Benefits, Brain Training, Speed Reading & Focus",
  description:
    "Learn what a Schulte Table is, how it works, its proven benefits for focus, concentration, peripheral vision and speed reading. Play Schulte Table online free.",
  keywords: [
    "what is schulte table",
    "schulte table",
    "schulte table meaning",
    "schulte table exercise",
    "schulte table brain training",
    "schulte table benefits",
    "schulte table online",
    "schulte table speed reading",
    "schulte table concentration",
    "schulte table peripheral vision",
    "brain training exercise",
    "attention training",
    "visual attention exercise",
  ],
  alternates: {
    canonical: "https://schultetable.com/what-is-schulte-table",
  },
  openGraph: {
    title: "What Is a Schulte Table? Benefits, Brain Training & Speed Reading",
    description:
      "Discover how Schulte Tables improve focus, attention, visual perception and reading speed.",
    url: "https://schultetable.com/what-is-schulte-table",
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
        name: "What is a Schulte Table?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Schulte Table is a grid of randomly arranged numbers used to train attention, concentration, peripheral vision, and visual processing speed.",
        },
      },
      {
        "@type": "Question",
        name: "Do Schulte Tables improve reading speed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Many speed-reading programs use Schulte Tables to help expand visual span and reduce unnecessary eye movements during reading.",
        },
      },
      {
        "@type": "Question",
        name: "How often should I practice Schulte Tables?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most people practice for 3–10 minutes daily to improve focus and visual attention over time.",
        },
      },
      {
        "@type": "Question",
        name: "Can children use Schulte Tables?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Schulte Tables are commonly used by children, students, adults, and seniors as a concentration and attention exercise.",
        },
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "What Is a Schulte Table? Benefits, Brain Training, Speed Reading & Focus",
    description:
      "Learn what a Schulte Table is, how it works, its benefits for focus, concentration, peripheral vision and speed reading.",
    url: "https://schultetable.com/what-is-schulte-table",
    publisher: {
      "@type": "Organization",
      name: "SchulteTable.com",
      url: "https://schultetable.com",
    },
  };

  const benefits = [
    {
      icon: "🎯",
      title: "Improves Concentration",
      desc: "Schulte Tables require uninterrupted focus on a single task — a direct antidote to distraction-heavy modern life.",
    },
    {
      icon: "👁️",
      title: "Trains Visual Attention",
      desc: "Every session trains your brain to identify targets faster while filtering out irrelevant information.",
    },
    {
      icon: "🔭",
      title: "Enhances Peripheral Vision",
      desc: "Advanced users keep their gaze at the center while identifying surrounding numbers using peripheral awareness.",
    },
    {
      icon: "📖",
      title: "Supports Speed Reading",
      desc: "Wider visual span lets readers process more text per fixation, reducing unnecessary eye movements.",
    },
    {
      icon: "⚡",
      title: "Increases Processing Speed",
      desc: "Regular practice accelerates identification, location, and response to visual information.",
    },
    {
      icon: "🧠",
      title: "Daily Brain Exercise",
      desc: "Sessions last just minutes — easy to fit into any routine for long-term cognitive maintenance.",
    },
  ];

  const steps = [
    { n: "01", text: "Open a Schulte Table grid" },
    { n: "02", text: "Start the timer" },
    { n: "03", text: "Locate number 1 on the grid" },
    { n: "04", text: "Continue finding numbers in sequence" },
    { n: "05", text: "Finish at the highest number" },
    { n: "06", text: "Record your time and improve" },
  ];

  const faqs = [
    {
      q: "What is a Schulte Table?",
      a: "A Schulte Table is a square grid containing randomly arranged numbers. The most common version is a 5×5 grid with numbers 1–25. The goal: find each number in order as fast as possible, training attention, peripheral vision, and processing speed.",
    },
    {
      q: "Are Schulte Tables scientifically proven?",
      a: "Schulte Tables have been used for decades in attention and visual perception training — originally developed by German psychiatrist Walter Schulte. Results vary by individual but they remain a widely recognised cognitive exercise.",
    },
    {
      q: "Do Schulte Tables improve reading speed?",
      a: "Many speed-reading programs include Schulte Tables to help students develop a broader visual span and reduce excessive fixation on individual words. They're a useful component of a broader reading and attention training routine.",
    },
    {
      q: "How often should I practice?",
      a: "Most users practice 3–10 minutes daily. Consistency matters far more than session length — a few focused minutes each day typically produces better results than occasional long sessions.",
    },
    {
      q: "Can children use Schulte Tables?",
      a: "Yes. Schulte Tables are commonly used by children, students, adults, and seniors. Simplified smaller grids work well for younger users building concentration skills.",
    },
    {
      q: "Do Schulte Tables increase IQ?",
      a: "Schulte Tables are designed to train attention, concentration, and visual processing rather than directly increase IQ. They are a focused cognitive tool, not a general intelligence booster.",
    },
  ];

  const variations = [
    {
      name: "Classic Number Grid",
      desc: "The standard format — numbers arranged randomly in a 5×5 grid.",
      badge: "Most Popular",
    },
    {
      name: "Color Mode",
      desc: "Users alternate between two colors while locating numbers simultaneously.",
      badge: "Intermediate",
    },
    {
      name: "Letter Tables",
      desc: "Letters replace numbers, requiring sequential alphabetical scanning.",
      badge: "Variation",
    },
    {
      name: "Reverse Mode",
      desc: "Find numbers from highest to lowest for a fresh cognitive challenge.",
      badge: "Hard",
    },
    {
      name: "Large Grids",
      desc: "7×7 or 10×10 grids with more targets for advanced practitioners.",
      badge: "Expert",
    },
  ];

  const users = [
    { emoji: "🎓", label: "Students" },
    { emoji: "⚡", label: "Speed Readers" },
    { emoji: "💼", label: "Professionals" },
    { emoji: "🎮", label: "Gamers" },
    { emoji: "🏃", label: "Athletes" },
    { emoji: "👶", label: "Children" },
    { emoji: "👴", label: "Seniors" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-base-100">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-base-100 border-b border-base-300">
          {/* grid background decoration */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 39px,oklch(var(--p)) 39px,oklch(var(--p)) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,oklch(var(--p)) 39px,oklch(var(--p)) 40px)",
            }}
          />

          <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
            {/* breadcrumb — SEO */}
            <nav aria-label="Breadcrumb" className="flex justify-center mb-8">
              <ol className="flex items-center gap-2 text-sm opacity-60">
                <li>
                  <Link
                    href="/"
                    className="hover:text-primary transition-colors"
                  >
                    SchulteTable.com
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="opacity-80">
                  What Is a Schulte Table?
                </li>
              </ol>
            </nav>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="badge badge-primary badge-lg font-semibold">
                Brain Training
              </span>
              <span className="badge badge-warning badge-lg font-semibold">
                Speed Reading
              </span>
              <span className="badge badge-accent badge-lg font-semibold">
                Focus
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6">
              What Is a <span className="text-primary">Schulte Table?</span>
            </h1>

            <p className="text-xl md:text-2xl opacity-70 max-w-3xl mx-auto leading-relaxed mb-10">
              One of the world's most effective exercises for attention,
              peripheral vision, concentration, and mental processing speed —
              used by students, athletes, speed readers, and cognitive trainers
              worldwide.
            </p>

            {/* mini demo grid */}
            <div className="flex justify-center mb-10">
              <div
                className="grid grid-cols-5 gap-1.5 p-4 rounded-2xl bg-base-200 border border-base-300 shadow-xl"
                aria-label="Example 5x5 Schulte Table"
              >
                {[
                  17, 3, 24, 8, 12, 21, 11, 6, 19, 2, 14, 25, 1, 9, 16, 7, 18,
                  13, 4, 22, 10, 5, 20, 15, 23,
                ].map((n, i) => (
                  <div
                    key={i}
                    className={`w-11 h-11 md:w-14 md:h-14 flex items-center justify-center rounded-lg font-black text-base md:text-lg transition-all select-none ${
                      n === 1
                        ? "bg-primary text-primary-content ring-2 ring-primary ring-offset-2 ring-offset-base-200 scale-110"
                        : "bg-base-300 text-base-content hover:bg-primary/20"
                    }`}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="btn btn-primary btn-lg font-bold px-8 shadow-lg shadow-primary/30"
              >
                Play Free Now →
              </Link>
              <a
                href="#what-is"
                className="btn btn-outline btn-lg font-bold px-8"
              >
                Learn More ↓
              </a>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="bg-primary text-primary-content">
          <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-primary-content/20">
            {[
              { val: "5×5", label: "Standard Grid" },
              { val: "3–10 min", label: "Daily Practice" },
              { val: "6+", label: "Cognitive Skills" },
              { val: "Free", label: "Online Game" },
            ].map(({ val, label }) => (
              <div key={label} className="text-center px-4 py-2">
                <div className="text-2xl md:text-3xl font-black">{val}</div>
                <div className="text-sm opacity-80 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">
          {/* ── WHAT IS ── */}
          <section id="what-is" className="scroll-mt-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="badge badge-primary mb-4">Definition</div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  What Is a<br />
                  Schulte Table?
                </h2>
                <div className="space-y-4 text-lg opacity-80 leading-relaxed">
                  <p>
                    A{" "}
                    <strong className="text-base-content opacity-100">
                      Schulte Table
                    </strong>{" "}
                    is a square grid containing numbers in random order. The
                    most common version is a{" "}
                    <strong className="text-base-content opacity-100">
                      5×5 grid
                    </strong>{" "}
                    with numbers 1 through 25.
                  </p>
                  <p>
                    The goal: find every number in ascending order as fast as
                    possible. Simple in concept — demanding in execution. It
                    requires sustained attention, rapid visual scanning, and
                    efficient eye coordination.
                  </p>
                  <p>
                    Originally developed by German psychiatrist{" "}
                    <strong className="text-base-content opacity-100">
                      Walter Schulte
                    </strong>{" "}
                    to study attention-related processes, it evolved into one of
                    the most widely used tools in cognitive training, education,
                    and speed-reading programs.
                  </p>
                </div>
              </div>

              <div className="card bg-base-200 border border-base-300 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-xl mb-4">How It Works</h3>
                  <p className="opacity-70 mb-6">
                    When scanning a scattered number grid, your brain activates
                    several cognitive systems simultaneously:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Selective attention",
                      "Visual scanning efficiency",
                      "Peripheral awareness",
                      "Working concentration",
                      "Eye movement control",
                      "Processing speed",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="alert alert-info mt-6 text-sm">
                    <span>
                      💡 Tip: Keep your gaze near the center and use peripheral
                      vision to spot nearby numbers.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── BENEFITS ── */}
          <section id="benefits">
            <div className="text-center mb-12">
              <div className="badge badge-warning mb-4">Proven Benefits</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Why Train with Schulte Tables?
              </h2>
              <p className="text-lg opacity-70 max-w-2xl mx-auto">
                A few focused minutes each day can produce measurable
                improvements across multiple cognitive and visual dimensions.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="card bg-base-200 border border-base-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
                >
                  <div className="card-body">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                      {icon}
                    </div>
                    <h3 className="card-title text-lg">{title}</h3>
                    <p className="opacity-70 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── WHO USES ── */}
          <section className="text-center">
            <div className="badge badge-accent mb-4">Audience</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Who Uses Schulte Tables?
            </h2>
            <p className="text-lg opacity-70 max-w-xl mx-auto mb-10">
              From students to seniors — Schulte Tables adapt to every level and
              goal.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {users.map(({ emoji, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-base-200 border border-base-300 hover:border-primary/50 hover:bg-base-200 transition-all min-w-[90px]"
                >
                  <span className="text-3xl">{emoji}</span>
                  <span className="font-bold text-sm">{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── HOW TO USE ── */}
          <section id="how-to-use">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="badge badge-primary mb-4">How To Play</div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  How to Use a<br />
                  Schulte Table
                </h2>
                <p className="opacity-70 mb-8 text-lg leading-relaxed">
                  Getting started takes 30 seconds. Improving takes consistent
                  practice. Here's the exact process:
                </p>
                <div className="space-y-4">
                  {steps.map(({ n, text }) => (
                    <div
                      key={n}
                      className="flex items-center gap-4 p-4 rounded-xl bg-base-200 border border-base-300"
                    >
                      <span className="text-2xl font-black text-primary font-mono flex-shrink-0 w-10">
                        {n}
                      </span>
                      <span className="font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="card bg-base-200 border border-base-300">
                  <div className="card-body">
                    <h3 className="card-title">🏁 Beginner Tips</h3>
                    <ul className="space-y-2 mt-2">
                      {[
                        "Prioritise accuracy before chasing speed",
                        "Avoid random, scattered eye movements",
                        "Keep gaze near the grid center when possible",
                        "Track your best times to stay motivated",
                        "Graduate to larger 7×7 grids as you improve",
                      ].map((tip) => (
                        <li
                          key={tip}
                          className="flex items-start gap-2 text-sm opacity-80"
                        >
                          <span className="text-warning mt-0.5">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="card bg-primary text-primary-content">
                  <div className="card-body text-center">
                    <div className="text-4xl mb-2">⏱️</div>
                    <h3 className="font-black text-xl">
                      Recommended Daily Practice
                    </h3>
                    <div className="text-5xl font-black my-3">3–10 min</div>
                    <p className="opacity-80 text-sm">
                      Consistency beats duration. Daily short sessions
                      outperform occasional long ones every time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── VARIATIONS ── */}
          <section id="variations">
            <div className="text-center mb-12">
              <div className="badge badge-secondary mb-4">Variations</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Schulte Table Formats
              </h2>
              <p className="text-lg opacity-70 max-w-2xl mx-auto">
                Once you've mastered the classic grid, explore these variations
                to keep your brain challenged.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {variations.map(({ name, desc, badge }) => (
                <div
                  key={name}
                  className="card bg-base-200 border border-base-300 hover:border-secondary/50 transition-all"
                >
                  <div className="card-body">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-black text-lg leading-tight">
                        {name}
                      </h3>
                      <span className="badge badge-outline flex-shrink-0 text-xs">
                        {badge}
                      </span>
                    </div>
                    <p className="opacity-70 text-sm mt-2 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SPEED READING ── */}
          <section className="card bg-base-200 border border-base-300 overflow-hidden">
            <div className="card-body p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="badge badge-warning mb-4">
                    Speed Reading Connection
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                    Schulte Tables &<br />
                    Speed Reading
                  </h2>
                  <div className="space-y-4 opacity-80 leading-relaxed">
                    <p>
                      Schulte Tables became famous partly through their
                      connection to{" "}
                      <strong className="text-base-content opacity-100">
                        speed-reading programs
                      </strong>
                      . Instructors use the exercise to help students develop a
                      broader visual span and reduce excessive fixation on
                      individual words.
                    </p>
                    <p>
                      The theory: a wider visual field lets your eyes capture
                      more text per fixation, reducing the total number of eye
                      movements required to read a page.
                    </p>
                    <p>
                      While Schulte Tables alone won't double your reading speed
                      overnight, they are a recognised component of effective
                      reading and attention training routines.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Wider visual span", icon: "👁️" },
                    { label: "Fewer eye fixations", icon: "🎯" },
                    { label: "Reduced subvocalisation", icon: "🤫" },
                    { label: "Faster word recognition", icon: "⚡" },
                  ].map(({ label, icon }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-base-100 border border-base-300"
                    >
                      <span className="text-2xl">{icon}</span>
                      <span className="text-sm font-semibold">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section id="faq">
            <div className="text-center mb-12">
              <div className="badge badge-info mb-4">FAQ</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg opacity-70 max-w-xl mx-auto">
                Everything you need to know about Schulte Tables and brain
                training.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map(({ q, a }) => (
                <details
                  key={q}
                  className="group collapse collapse-arrow bg-base-200 border border-base-300 hover:border-primary/40 transition-colors"
                >
                  <summary className="collapse-title font-bold text-base cursor-pointer pr-12 py-5">
                    {q}
                  </summary>
                  <div className="collapse-content">
                    <p className="opacity-75 leading-relaxed pb-2">{a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="relative overflow-hidden rounded-3xl bg-primary text-primary-content p-10 md:p-16 text-center">
            {/* decorative grid inside CTA */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 29px,currentColor 29px,currentColor 30px),repeating-linear-gradient(90deg,transparent,transparent 29px,currentColor 29px,currentColor 30px)",
              }}
            />
            <div className="relative">
              <div className="text-6xl mb-4">🧠</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Ready to Train Your Brain?
              </h2>
              <p className="text-lg opacity-80 max-w-xl mx-auto mb-8">
                Join thousands of players improving focus, attention, and
                processing speed daily — completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="btn bg-white text-primary hover:bg-white/90 btn-lg font-black px-10 shadow-2xl"
                >
                  Start Playing Free →
                </Link>
              </div>
              <p className="text-sm opacity-60 mt-6">
                No signup required. Play instantly.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
