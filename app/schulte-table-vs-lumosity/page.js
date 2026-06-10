import Link from "next/link";

export const metadata = {
  title: "Schulte Table vs Lumosity: Which Brain Training Tool Is Better?",
  description:
    "Compare Schulte Table and Lumosity for focus, attention, concentration, speed reading, cognitive training and brain exercises.",
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-lumosity",
  },
};

export default function Page() {
  const comparisons = [
    {
      feature: "Free Access",
      schulte: "✅ Free",
      lumosity: "⚠️ Limited Free Plan",
    },
    {
      feature: "Focus Training",
      schulte: "✅ Strong",
      lumosity: "✅ Strong",
    },
    {
      feature: "Attention Training",
      schulte: "✅ Strong",
      lumosity: "✅ Strong",
    },
    {
      feature: "Speed Reading",
      schulte: "✅ Useful",
      lumosity: "❌ Not Primary Focus",
    },
    {
      feature: "Peripheral Vision",
      schulte: "✅ Strong",
      lumosity: "⚠️ Limited",
    },
    {
      feature: "Game Variety",
      schulte: "❌ Single Exercise",
      lumosity: "✅ Many Games",
    },
    {
      feature: "Learning Curve",
      schulte: "✅ Very Easy",
      lumosity: "⚠️ Moderate",
    },
    {
      feature: "Time Per Session",
      schulte: "1–5 Minutes",
      lumosity: "5–15 Minutes",
    },
  ];

  const schulteUsers = [
    "Students",
    "Speed Readers",
    "Focus Training",
    "Attention Practice",
    "Visual Search Training",
    "Daily Brain Exercise",
  ];

  const lumosityUsers = [
    "People wanting many games",
    "General cognitive training",
    "Memory practice",
    "Problem-solving exercises",
    "Broad brain training",
    "Structured programs",
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* HERO */}
      <section className="hero bg-base-200 py-24">
        <div className="hero-content text-center max-w-5xl">
          <div>
            <div className="badge badge-primary badge-lg mb-6">
              Brain Training Comparison
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Schulte Table
              <br />
              vs
              <br />
              Lumosity
            </h1>

            <p className="text-xl opacity-70 max-w-3xl mx-auto">
              Which brain training approach is better for focus, concentration,
              attention, speed reading and cognitive performance?
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* QUICK ANSWER */}
        <section className="mb-20">
          <div className="alert alert-info">
            <span>
              There is no universal winner. The best choice depends on your
              goals. Schulte Tables excel at attention, visual search and focus
              training, while Lumosity offers a wider variety of cognitive
              games.
            </span>
          </div>
        </section>

        {/* COMPARISON TABLE */}
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
                  <th>Lumosity</th>
                </tr>
              </thead>

              <tbody>
                {comparisons.map((item) => (
                  <tr key={item.feature}>
                    <td>{item.feature}</td>
                    <td>{item.schulte}</td>
                    <td>{item.lumosity}</td>
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
              A Schulte Table is a visual attention exercise consisting of
              numbers arranged randomly in a grid. The objective is to locate
              each number in sequence as quickly as possible.
            </p>

            <p>
              Originally developed as a psychological attention assessment tool,
              Schulte Tables later became popular in speed-reading programs,
              concentration training, and modern brain-training platforms.
            </p>
          </div>
        </section>

        {/* WHAT IS LUMOSITY */}
        <section className="mb-20">
          <h2 className="text-4xl font-black mb-6">What Is Lumosity?</h2>

          <div className="prose prose-lg max-w-none">
            <p>
              Lumosity is a commercial brain-training platform featuring
              multiple cognitive games designed around memory, attention,
              flexibility, processing speed, and problem-solving.
            </p>

            <p>
              Instead of focusing on a single exercise, Lumosity provides a
              collection of games and training programs targeting different
              cognitive skills.
            </p>
          </div>
        </section>

        {/* KEY DIFFERENCES */}
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center mb-10">
            Key Differences
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-base-200 border border-base-300">
              <div className="card-body">
                <h3 className="card-title">Simplicity</h3>
                <p>Schulte Tables focus on one exercise with minimal setup.</p>
              </div>
            </div>

            <div className="card bg-base-200 border border-base-300">
              <div className="card-body">
                <h3 className="card-title">Variety</h3>
                <p>
                  Lumosity provides multiple game types and broader cognitive
                  training options.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 border border-base-300">
              <div className="card-body">
                <h3 className="card-title">Focus</h3>
                <p>
                  Schulte Tables specialise in attention, visual search and
                  concentration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHO SHOULD USE */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card bg-base-200">
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

            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="text-3xl font-black">Choose Lumosity If...</h2>

                <ul className="space-y-3 mt-4">
                  {lumosityUsers.map((item) => (
                    <li key={item}>✅ {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CAN YOU USE BOTH */}
        <section className="mb-20">
          <h2 className="text-4xl font-black mb-6">Can You Use Both?</h2>

          <p className="text-lg leading-relaxed">
            Absolutely. Many people combine Schulte Table exercises with broader
            cognitive training programs. Schulte Tables can serve as a fast
            daily focus workout, while Lumosity offers a wider variety of mental
            challenges.
          </p>
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
                Is Schulte Table better than Lumosity?
              </div>
              <div className="collapse-content">
                Neither is universally better. Schulte Tables specialise in
                attention and visual search, while Lumosity offers broader
                cognitive training.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
              <input type="radio" name="faq" />
              <div className="collapse-title font-bold">
                Which is better for focus?
              </div>
              <div className="collapse-content">
                Schulte Tables are often preferred by users specifically
                interested in focus and attention practice.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
              <input type="radio" name="faq" />
              <div className="collapse-title font-bold">
                Which is better for speed reading?
              </div>
              <div className="collapse-content">
                Schulte Tables are more commonly associated with speed-reading
                training.
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-content rounded-3xl p-16 text-center">
          <div className="text-7xl mb-4">🧠</div>

          <h2 className="text-5xl font-black mb-4">Try Schulte Table Free</h2>

          <p className="text-xl opacity-80 mb-8">
            Train attention, concentration and visual search skills in just a
            few minutes per day.
          </p>

          <Link href="/" className="btn btn-lg bg-white text-primary">
            Start Training →
          </Link>
        </section>
      </div>
    </div>
  );
}
