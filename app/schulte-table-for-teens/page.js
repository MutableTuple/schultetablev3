import Link from "next/link";

export const metadata = {
  title:
    "Schulte Table for Teens | Improve Focus, Study Performance & Concentration",
  description:
    "Discover how Schulte Tables help teenagers improve concentration, study efficiency, visual attention, reading speed, memory, and cognitive performance.",
};

export default function SchulteTableForTeensPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}
      <section className="hero bg-base-200 py-20">
        <div className="hero-content text-center max-w-5xl">
          <div>
            <h1 className="text-5xl font-black mb-6">
              Schulte Table for Teens
            </h1>

            <p className="text-xl opacity-80 leading-relaxed">
              Train concentration, attention span, visual processing, and study
              performance with one of the most effective cognitive exercises
              used by students worldwide.
            </p>

            <Link href="/" className="btn btn-primary btn-lg mt-8">
              Start Training
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">
            Why Teenagers Need Better Focus
          </h2>

          <p className="text-lg leading-8 mb-6">
            Teenagers face more distractions than ever before. Social media,
            messaging apps, gaming, streaming services, and academic pressure
            constantly compete for attention.
          </p>

          <p className="text-lg leading-8 mb-6">
            Maintaining deep focus for studying, reading, and learning can
            become increasingly difficult. Schulte Tables offer a simple and
            effective way to train concentration and improve attention control.
          </p>

          <p className="text-lg leading-8">
            Just a few minutes of daily practice can help students strengthen
            cognitive skills that support academic success and everyday
            productivity.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-base-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Benefits for Teenagers
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🎯 Better Concentration</h3>
                <p>
                  Learn to stay focused on tasks for longer periods without
                  becoming distracted.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">📚 Improved Study Sessions</h3>
                <p>
                  Enhanced attention can make learning and revision more
                  efficient.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">⚡ Faster Information Processing</h3>
                <p>
                  Train the brain to identify information more quickly and
                  accurately.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">👀 Better Visual Attention</h3>
                <p>
                  Expand peripheral awareness and improve visual scanning
                  abilities.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🚀 Reading Speed Support</h3>
                <p>
                  Many speed-reading programs incorporate Schulte Tables to
                  improve eye movement patterns.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🧠 Cognitive Development</h3>
                <p>
                  Strengthen mental flexibility, processing speed, and attention
                  control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Students */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Perfect for Students</h2>

          <p className="text-lg leading-8 mb-6">
            Teenagers preparing for exams often spend hours reading textbooks,
            solving problems, and memorizing information.
          </p>

          <p className="text-lg leading-8 mb-6">
            Schulte Table practice trains the brain to maintain attention under
            mental workload, making it easier to stay engaged during study
            sessions.
          </p>

          <p className="text-lg leading-8">
            Many students use Schulte Tables as part of their daily study
            routine because the exercise takes only a few minutes.
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
                  <th>Age</th>
                  <th>Recommended Grid</th>
                  <th>Level</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>13–15</td>
                  <td>5×5</td>
                  <td>Standard</td>
                </tr>

                <tr>
                  <td>15–17</td>
                  <td>6×6</td>
                  <td>Intermediate</td>
                </tr>

                <tr>
                  <td>17–19</td>
                  <td>7×7</td>
                  <td>Advanced</td>
                </tr>

                <tr>
                  <td>Competitive Learners</td>
                  <td>8×8+</td>
                  <td>Expert</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Practice */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Daily Practice Routine</h2>

          <div className="space-y-4">
            <div className="alert">
              <span>
                <strong>1.</strong> Complete 3–5 Schulte Tables.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>2.</strong> Record your completion times.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>3.</strong> Focus on accuracy first.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>4.</strong> Challenge your previous records.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>5.</strong> Practice consistently for best results.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Science */}
      <section className="bg-base-200 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Why Schulte Tables Work</h2>

          <p className="text-lg leading-8 mb-6">
            The exercise forces the brain to rapidly search, identify, and
            process information across the visual field.
          </p>

          <p className="text-lg leading-8 mb-6">
            This repeated practice strengthens visual attention, processing
            speed, concentration, and cognitive efficiency.
          </p>

          <p className="text-lg leading-8">
            Because the challenge is measurable through completion time,
            teenagers can easily track progress and stay motivated.
          </p>
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
                Are Schulte Tables good for teenagers?
              </div>
              <div className="collapse-content">
                <p>
                  Yes. They help train attention, concentration, visual
                  processing, and cognitive speed.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                Can Schulte Tables improve studying?
              </div>
              <div className="collapse-content">
                <p>
                  They may support focus and attention skills that are useful
                  during study sessions.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                How long should teens practice?
              </div>
              <div className="collapse-content">
                <p>Around 5 to 10 minutes daily is usually enough.</p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                Which grid size is best?
              </div>
              <div className="collapse-content">
                <p>Most teenagers benefit from 5×5 to 7×7 grids.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-6">
            Improve Focus Starting Today
          </h2>

          <p className="text-xl opacity-80 mb-8">
            Challenge yourself, track your progress, and build stronger
            concentration skills with daily Schulte Table practice.
          </p>

          <Link href="/" className="btn btn-primary btn-lg">
            Play Schulte Table
          </Link>
        </div>
      </section>
    </div>
  );
}
