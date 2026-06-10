import Link from "next/link";

export const metadata = {
  title: "Schulte Table vs Elevate: Which Brain Training App Is Better?",
  description:
    "Compare Schulte Table and Elevate for focus, concentration, attention, speed reading, communication skills, math training and cognitive development.",
  keywords: [
    "schulte table vs elevate",
    "elevate vs schulte table",
    "brain training comparison",
    "best brain training app",
    "schulte table focus",
    "elevate review",
    "schulte table review",
    "attention training",
    "focus training",
    "speed reading training",
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-elevate",
  },
  openGraph: {
    title: "Schulte Table vs Elevate: Which Brain Training App Is Better?",
    description:
      "Compare Schulte Table and Elevate for focus, concentration, reading, attention and cognitive training.",
    url: "https://schultetable.com/schulte-table-vs-elevate",
    type: "article",
  },
};

export default function Page() {
  const comparisons = [
    {
      feature: "Free Access",
      schulte: "✅ Completely Free",
      elevate: "⚠️ Limited Free Plan",
    },
    {
      feature: "Focus Training",
      schulte: "✅ Excellent",
      elevate: "⚠️ Moderate",
    },
    {
      feature: "Attention Training",
      schulte: "✅ Excellent",
      elevate: "⚠️ Moderate",
    },
    {
      feature: "Speed Reading",
      schulte: "✅ Useful",
      elevate: "⚠️ Reading Exercises",
    },
    {
      feature: "Peripheral Vision",
      schulte: "✅ Strong",
      elevate: "❌ Not Focused",
    },
    {
      feature: "Math Skills",
      schulte: "❌",
      elevate: "✅ Strong",
    },
    {
      feature: "Writing Skills",
      schulte: "❌",
      elevate: "✅ Strong",
    },
    {
      feature: "Communication Skills",
      schulte: "❌",
      elevate: "✅ Strong",
    },
    {
      feature: "Session Length",
      schulte: "1-5 Minutes",
      elevate: "5-15 Minutes",
    },
    {
      feature: "Learning Curve",
      schulte: "Very Easy",
      elevate: "Moderate",
    },
  ];

  const schulteUsers = [
    "Students improving focus",
    "Speed readers",
    "People training concentration",
    "Attention improvement",
    "Visual search training",
    "Quick daily brain workouts",
  ];

  const elevateUsers = [
    "Reading improvement",
    "Vocabulary building",
    "Writing skills",
    "Math practice",
    "Communication skills",
    "Structured learning plans",
  ];

  const differences = [
    {
      icon: "🎯",
      title: "Focus",
      desc: "Schulte Table is designed around attention, concentration and visual search training.",
    },
    {
      icon: "📚",
      title: "Learning",
      desc: "Elevate focuses on reading, writing, vocabulary and communication development.",
    },
    {
      icon: "⚡",
      title: "Speed",
      desc: "Schulte Table sessions are extremely quick and easy to fit into a busy schedule.",
    },
    {
      icon: "🧩",
      title: "Variety",
      desc: "Elevate offers many different games and learning activities.",
    },
  ];

  return (
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
          <div className="badge badge-primary badge-lg mb-6">
            Brain Training Comparison
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Schulte Table
            <br />
            vs
            <br />
            Elevate
          </h1>

          <p className="max-w-3xl mx-auto text-xl opacity-70 mb-10">
            Which brain training approach is better for focus, concentration,
            attention, reading skills, communication and cognitive development?
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <span className="badge badge-primary badge-lg">Focus Training</span>

            <span className="badge badge-secondary badge-lg">Brain Games</span>

            <span className="badge badge-accent badge-lg">
              Cognitive Skills
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* QUICK ANSWER */}
        <section className="mb-20">
          <div className="alert alert-info">
            <span>
              There is no universal winner. Schulte Table is stronger for focus,
              attention, visual search and concentration. Elevate offers broader
              training across reading, writing, vocabulary, math and
              communication skills.
            </span>
          </div>
        </section>

        {/* TABLE */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center mb-10">
            Feature Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Schulte Table</th>
                  <th>Elevate</th>
                </tr>
              </thead>

              <tbody>
                {comparisons.map((item) => (
                  <tr key={item.feature}>
                    <td>{item.feature}</td>
                    <td>{item.schulte}</td>
                    <td>{item.elevate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* WHAT IS SCHULTE */}
        <section className="mb-20">
          <h2 className="text-4xl font-black mb-6">What Is Schulte Table?</h2>

          <div className="prose prose-lg max-w-none">
            <p>
              A Schulte Table is a visual attention exercise where users locate
              numbers arranged randomly inside a grid. The activity was
              originally developed for psychological attention testing and later
              became popular for concentration training, speed reading and
              cognitive exercises.
            </p>

            <p>
              Today, Schulte Tables are used by students, professionals,
              athletes, gamers and anyone interested in improving focus and
              mental performance.
            </p>
          </div>
        </section>

        {/* WHAT IS ELEVATE */}
        <section className="mb-20">
          <h2 className="text-4xl font-black mb-6">What Is Elevate?</h2>

          <div className="prose prose-lg max-w-none">
            <p>
              Elevate is a brain training platform offering multiple exercises
              focused on reading, vocabulary, writing, communication and math.
            </p>

            <p>
              Rather than concentrating on one cognitive exercise, Elevate
              provides a structured program featuring many different games and
              learning activities.
            </p>
          </div>
        </section>

        {/* DIFFERENCES */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center mb-10">
            Biggest Differences
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differences.map((item) => (
              <div
                key={item.title}
                className="card bg-base-200 border border-base-300"
              >
                <div className="card-body">
                  <div className="text-5xl">{item.icon}</div>

                  <h3 className="card-title">{item.title}</h3>

                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHO SHOULD USE */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card bg-base-200 border border-base-300">
              <div className="card-body">
                <h2 className="text-3xl font-black">
                  Choose Schulte Table If...
                </h2>

                <ul className="space-y-3 mt-4">
                  {schulteUsers.map((item) => (
                    <li key={item}>✅ {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card bg-base-200 border border-base-300">
              <div className="card-body">
                <h2 className="text-3xl font-black">Choose Elevate If...</h2>

                <ul className="space-y-3 mt-4">
                  {elevateUsers.map((item) => (
                    <li key={item}>✅ {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* BOTH */}
        <section className="mb-20">
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h2 className="text-4xl font-black mb-4">Can You Use Both?</h2>

              <p className="text-lg">
                Absolutely. Many users combine Schulte Table sessions with
                Elevate training. For example, someone might spend 3–5 minutes
                training attention using Schulte Tables before moving to
                reading, vocabulary or math exercises in Elevate.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
              <input type="radio" name="faq" defaultChecked />
              <div className="collapse-title font-bold">
                Is Schulte Table better than Elevate?
              </div>
              <div className="collapse-content">
                Neither is universally better. Schulte Table excels at focus and
                attention training while Elevate offers broader educational and
                cognitive exercises.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
              <input type="radio" name="faq" />
              <div className="collapse-title font-bold">
                Which is better for focus?
              </div>
              <div className="collapse-content">
                Schulte Table is generally more focused on attention and
                concentration training.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
              <input type="radio" name="faq" />
              <div className="collapse-title font-bold">
                Which is better for reading?
              </div>
              <div className="collapse-content">
                Elevate offers dedicated reading exercises, while Schulte Tables
                are commonly used as supplementary speed-reading tools.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
              <input type="radio" name="faq" />
              <div className="collapse-title font-bold">
                Is Schulte Table free?
              </div>
              <div className="collapse-content">
                Yes. SchulteTable.com allows users to practice Schulte Tables
                for free.
              </div>
            </div>
          </div>
        </section>

        {/* FINAL VERDICT */}
        <section className="mb-20">
          <div className="card bg-primary text-primary-content">
            <div className="card-body">
              <h2 className="text-4xl font-black">Final Verdict</h2>

              <p className="text-lg">
                If your primary goal is improving attention, concentration,
                visual search and focus, Schulte Table is an excellent choice.
                If you want broader cognitive training involving reading,
                vocabulary, writing and math, Elevate may be a better fit.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-content rounded-3xl p-16 text-center">
          <div className="text-7xl mb-4">🧠</div>

          <h2 className="text-5xl font-black mb-4">Train Your Focus Today</h2>

          <p className="text-xl opacity-80 mb-8">
            Improve attention, concentration and visual search skills with free
            Schulte Table exercises.
          </p>

          <Link
            href="/"
            className="btn btn-lg bg-white text-primary hover:bg-white"
          >
            Play Free →
          </Link>
        </section>
      </div>
    </div>
  );
}
