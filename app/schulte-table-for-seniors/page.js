import Link from "next/link";

export const metadata = {
  title:
    "Schulte Table for Seniors | Brain Exercise for Focus, Attention & Mental Activity",
  description:
    "Learn how Schulte Tables can help seniors stay mentally active by practicing attention, concentration, visual scanning, and cognitive engagement through simple daily exercises.",
};

export default function SchulteTableForSeniorsPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}
      <section className="hero bg-base-200 py-20">
        <div className="hero-content text-center max-w-5xl">
          <div>
            <h1 className="text-5xl font-black mb-6">
              Schulte Table for Seniors
            </h1>

            <p className="text-xl opacity-80 leading-relaxed">
              Stay mentally active with a simple visual exercise that helps
              practice attention, concentration, visual scanning, and cognitive
              engagement.
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
            Why Mental Activity Matters as We Age
          </h2>

          <p className="text-lg leading-8 mb-6">
            Just like physical exercise helps keep the body active, mental
            exercises help keep the brain engaged. Many seniors enjoy puzzles,
            reading, crosswords, number games, and other activities that
            encourage concentration and thinking.
          </p>

          <p className="text-lg leading-8 mb-6">
            Schulte Tables provide a simple and accessible brain-training
            exercise that can be completed in just a few minutes each day.
          </p>

          <p className="text-lg leading-8">
            The challenge involves finding numbers in sequence as quickly and
            accurately as possible, encouraging attention and visual scanning.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-base-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Benefits for Seniors
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🧠 Cognitive Engagement</h3>
                <p>
                  Provides a structured activity that keeps the mind active and
                  engaged.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🎯 Attention Practice</h3>
                <p>
                  Encourages sustained focus while searching for numbers in
                  sequence.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">👀 Visual Scanning</h3>
                <p>
                  Exercises the ability to locate information across the visual
                  field.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">⚡ Mental Activity</h3>
                <p>
                  Supports regular cognitive exercise through an enjoyable
                  challenge.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">📈 Progress Tracking</h3>
                <p>
                  Completion times make it easy to measure improvement over
                  time.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">😊 Fun and Accessible</h3>
                <p>
                  Easy to learn, requires no special equipment, and can be
                  practiced anywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Routine */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">
            A Simple Daily Brain Exercise
          </h2>

          <p className="text-lg leading-8 mb-6">
            One reason Schulte Tables are popular is that they require very
            little time. A short daily session can fit easily into a morning
            routine, coffee break, or evening activity.
          </p>

          <p className="text-lg leading-8 mb-6">
            Many seniors enjoy combining Schulte Table practice with reading,
            puzzles, walking, and other mentally stimulating activities.
          </p>

          <p className="text-lg leading-8">
            The goal is not perfection. Instead, focus on staying engaged and
            enjoying the challenge.
          </p>
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
                  <th>Experience Level</th>
                  <th>Grid Size</th>
                  <th>Recommendation</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Beginner</td>
                  <td>4×4</td>
                  <td>Comfortable starting point</td>
                </tr>

                <tr>
                  <td>Intermediate</td>
                  <td>5×5</td>
                  <td>Classic Schulte Table</td>
                </tr>

                <tr>
                  <td>Advanced</td>
                  <td>6×6</td>
                  <td>Greater challenge</td>
                </tr>

                <tr>
                  <td>Expert</td>
                  <td>7×7+</td>
                  <td>For experienced users</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Practice Tips */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Tips for Senior Players</h2>

          <div className="space-y-4">
            <div className="alert">
              <span>
                <strong>Tip 1:</strong> Start with smaller grids.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Tip 2:</strong> Focus on accuracy before speed.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Tip 3:</strong> Practice consistently.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Tip 4:</strong> Track your times and celebrate progress.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Tip 5:</strong> Make it part of your daily routine.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-base-200 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="faq" defaultChecked />
              <div className="collapse-title text-xl font-medium">
                Are Schulte Tables good for seniors?
              </div>
              <div className="collapse-content">
                <p>
                  Many seniors enjoy Schulte Tables as a mental exercise that
                  encourages attention and visual scanning.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                How often should seniors practice?
              </div>
              <div className="collapse-content">
                <p>
                  Around 5 to 10 minutes per day is a common starting point.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                What grid size should seniors start with?
              </div>
              <div className="collapse-content">
                <p>Most beginners start with a 4×4 or 5×5 table.</p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                Is the exercise difficult to learn?
              </div>
              <div className="collapse-content">
                <p>
                  No. The rules are simple and can be learned in just a few
                  minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-6">
            Stay Mentally Active Every Day
          </h2>

          <p className="text-xl opacity-80 mb-8">
            Challenge your attention, practice concentration, and enjoy a simple
            daily brain exercise with Schulte Tables.
          </p>

          <Link href="/" className="btn btn-primary btn-lg">
            Play Schulte Table Online
          </Link>
        </div>
      </section>
    </div>
  );
}
