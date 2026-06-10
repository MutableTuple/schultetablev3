import Link from "next/link";

export const metadata = {
  title:
    "Schulte Table for Gamers | Focus, Attention & Visual Scanning Training",
  description:
    "Learn how Schulte Tables can help gamers practice focus, attention, visual scanning, concentration, and mental preparation before gaming sessions.",
};

export default function SchulteTableForGamersPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}
      <section className="hero bg-base-200 py-20">
        <div className="hero-content text-center max-w-5xl">
          <div>
            <h1 className="text-5xl font-black mb-6">
              Schulte Table for Gamers
            </h1>

            <p className="text-xl opacity-80 leading-relaxed">
              Train attention, concentration, visual scanning, and focus with a
              simple brain-training exercise used by people who enjoy
              competitive gaming and esports.
            </p>

            <Link href="/" className="btn btn-primary btn-lg mt-8">
              Start Training
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">
            Why Focus Matters in Gaming
          </h2>

          <p className="text-lg leading-8 mb-6">
            Whether you play competitive shooters, strategy games, MOBAs, sports
            titles, or casual games, attention plays a major role in
            performance.
          </p>

          <p className="text-lg leading-8 mb-6">
            Gamers constantly scan the screen, process information, track
            multiple elements, and make rapid decisions under pressure.
          </p>

          <p className="text-lg leading-8">
            Because of this, many players look for ways to practice attention,
            visual awareness, and concentration outside of actual gameplay.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-base-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Gamers Use Schulte Tables
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🎯 Attention Training</h3>
                <p>Practice maintaining focus during demanding visual tasks.</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">👀 Visual Scanning</h3>
                <p>
                  Train your ability to locate targets across a wider visual
                  field.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">⚡ Fast Information Processing</h3>
                <p>Quickly identify and process visual information.</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🎮 Gaming Warm-Up</h3>
                <p>
                  Many gamers enjoy mental exercises before starting ranked or
                  competitive matches.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🧠 Mental Focus</h3>
                <p>
                  Encourage sustained concentration and reduced distraction.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">📈 Track Progress</h3>
                <p>Use completion times to measure improvement over time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gaming Genres */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">
            Gaming Genres That Demand Attention
          </h2>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Genre</th>
                  <th>Attention Demand</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>FPS Games</td>
                  <td>Very High</td>
                </tr>

                <tr>
                  <td>Battle Royale</td>
                  <td>Very High</td>
                </tr>

                <tr>
                  <td>MOBA Games</td>
                  <td>Very High</td>
                </tr>

                <tr>
                  <td>RTS Games</td>
                  <td>Very High</td>
                </tr>

                <tr>
                  <td>Sports Games</td>
                  <td>High</td>
                </tr>

                <tr>
                  <td>Puzzle Games</td>
                  <td>Moderate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Warm Up */}
      <section className="bg-base-200 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">
            Use Schulte Tables as a Gaming Warm-Up
          </h2>

          <p className="text-lg leading-8 mb-6">
            Professional athletes often warm up before competition. Many gamers
            also have pre-game routines that help them focus before entering
            competitive matches.
          </p>

          <p className="text-lg leading-8 mb-6">
            Schulte Tables can be completed in just a few minutes and provide a
            focused visual challenge before gaming sessions.
          </p>

          <p className="text-lg leading-8">
            Because results are measurable, players can track improvement and
            challenge themselves over time.
          </p>
        </div>
      </section>

      {/* Routine */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">
            Suggested Pre-Game Routine
          </h2>

          <div className="space-y-4">
            <div className="alert">
              <span>
                <strong>Step 1:</strong> Complete 3 Schulte Tables.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 2:</strong> Track your completion times.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 3:</strong> Eliminate distractions.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 4:</strong> Begin your gaming session.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 5:</strong> Repeat consistently.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Difficulty */}
      <section className="bg-base-200 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">
            Recommended Difficulty Levels
          </h2>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Player Type</th>
                  <th>Grid Size</th>
                  <th>Difficulty</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Casual Gamer</td>
                  <td>5×5</td>
                  <td>Easy</td>
                </tr>

                <tr>
                  <td>Competitive Gamer</td>
                  <td>6×6</td>
                  <td>Moderate</td>
                </tr>

                <tr>
                  <td>Esports Player</td>
                  <td>7×7</td>
                  <td>Advanced</td>
                </tr>

                <tr>
                  <td>Challenge Mode</td>
                  <td>8×8+</td>
                  <td>Expert</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" defaultChecked />
              <div className="collapse-title text-xl font-medium">
                Are Schulte Tables good for gamers?
              </div>
              <div className="collapse-content">
                <p>
                  Many gamers use Schulte Tables as a concentration and visual
                  attention exercise.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                Can Schulte Tables improve gaming skills?
              </div>
              <div className="collapse-content">
                <p>
                  Schulte Tables do not teach gaming mechanics, but they can be
                  used to practice attention, concentration, and visual
                  scanning.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                How long should gamers practice?
              </div>
              <div className="collapse-content">
                <p>
                  Around 5 to 10 minutes per day is a common starting point.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                Should I use Schulte Tables before gaming?
              </div>
              <div className="collapse-content">
                <p>
                  Many players enjoy using them as a quick mental warm-up before
                  gaming sessions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-6">Train Your Gaming Focus</h2>

          <p className="text-xl opacity-80 mb-8">
            Practice attention, concentration, and visual scanning with daily
            Schulte Table training.
          </p>

          <Link href="/" className="btn btn-primary btn-lg">
            Play Schulte Table Online
          </Link>
        </div>
      </section>
    </div>
  );
}
