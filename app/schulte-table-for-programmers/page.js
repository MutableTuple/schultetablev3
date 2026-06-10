import Link from "next/link";

export const metadata = {
  title:
    "Schulte Table for Programmers | Improve Focus, Attention & Coding Productivity",
  description:
    "Discover how Schulte Tables can help programmers practice concentration, attention, visual scanning, and focus before coding, debugging, and deep work sessions.",
};

export default function SchulteTableForProgrammersPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}
      <section className="hero bg-base-200 py-20">
        <div className="hero-content text-center max-w-5xl">
          <div>
            <h1 className="text-5xl font-black mb-6">
              Schulte Table for Programmers
            </h1>

            <p className="text-xl opacity-80 leading-relaxed">
              Train concentration, attention, and visual focus with a simple
              brain-training exercise that fits perfectly into a developer's
              daily workflow.
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
            Why Programmers Need Strong Focus
          </h2>

          <p className="text-lg leading-8 mb-6">
            Programming is one of the most mentally demanding professions.
            Developers spend hours reading code, debugging issues, reviewing
            pull requests, learning new technologies, and solving complex
            problems.
          </p>

          <p className="text-lg leading-8 mb-6">
            Even small distractions can break concentration and interrupt deep
            work. Regaining focus after interruptions often takes far longer
            than most people realize.
          </p>

          <p className="text-lg leading-8">
            Schulte Tables offer a quick and measurable way to practice
            attention, concentration, and visual processing before starting a
            coding session.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-base-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Benefits for Software Developers
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🎯 Improved Focus</h3>
                <p>
                  Practice maintaining attention on a single task without
                  becoming distracted.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">⚡ Faster Visual Recognition</h3>
                <p>
                  Train your ability to quickly identify information and
                  patterns.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🧠 Mental Warm-Up</h3>
                <p>
                  A short exercise that can help you transition into deep work
                  mode before coding.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🔍 Code Review Support</h3>
                <p>
                  Visual scanning skills are frequently used when reviewing
                  large codebases and pull requests.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">💻 Deep Work Preparation</h3>
                <p>
                  Many developers use short focus exercises before tackling
                  difficult technical challenges.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">📈 Trackable Progress</h3>
                <p>
                  Measure your improvement using completion times and personal
                  records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programming Tasks */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">
            Programming Tasks That Require Attention
          </h2>

          <p className="text-lg leading-8 mb-8">
            Successful software development relies heavily on sustained focus
            and attention to detail.
          </p>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Programming Task</th>
                  <th>Attention Requirement</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Debugging</td>
                  <td>Very High</td>
                </tr>

                <tr>
                  <td>Code Review</td>
                  <td>Very High</td>
                </tr>

                <tr>
                  <td>Refactoring</td>
                  <td>High</td>
                </tr>

                <tr>
                  <td>System Design</td>
                  <td>High</td>
                </tr>

                <tr>
                  <td>Reading Documentation</td>
                  <td>Moderate</td>
                </tr>

                <tr>
                  <td>Learning New Frameworks</td>
                  <td>Moderate to High</td>
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
            Use Schulte Tables as a Coding Warm-Up
          </h2>

          <p className="text-lg leading-8 mb-6">
            Athletes warm up before training. Musicians warm up before
            performing. Many developers have routines that help them prepare
            mentally before beginning deep work.
          </p>

          <p className="text-lg leading-8 mb-6">
            Schulte Tables can be used as a short pre-coding exercise that
            encourages attention and concentration before opening your editor.
          </p>

          <p className="text-lg leading-8">
            A few minutes of focused visual searching can help create a mindset
            for tackling complex programming tasks.
          </p>
        </div>
      </section>

      {/* Routine */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">
            Suggested Routine for Programmers
          </h2>

          <div className="space-y-4">
            <div className="alert">
              <span>
                <strong>Step 1:</strong> Complete 3 Schulte Tables.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 2:</strong> Record your completion times.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 3:</strong> Eliminate distractions.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 4:</strong> Start your coding session.
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
                  <th>Experience Level</th>
                  <th>Grid Size</th>
                  <th>Difficulty</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Beginner</td>
                  <td>5×5</td>
                  <td>Easy</td>
                </tr>

                <tr>
                  <td>Junior Developer</td>
                  <td>5×5</td>
                  <td>Standard</td>
                </tr>

                <tr>
                  <td>Mid-Level Developer</td>
                  <td>6×6</td>
                  <td>Moderate</td>
                </tr>

                <tr>
                  <td>Senior Engineer</td>
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
                Are Schulte Tables good for programmers?
              </div>
              <div className="collapse-content">
                <p>
                  Many developers use Schulte Tables as a concentration and
                  visual attention exercise before coding sessions.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                Can Schulte Tables improve coding skills?
              </div>
              <div className="collapse-content">
                <p>
                  Schulte Tables do not teach programming, but they can be used
                  to practice attention, focus, and visual scanning skills.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                How long should programmers practice?
              </div>
              <div className="collapse-content">
                <p>Most people benefit from 5–10 minutes of daily practice.</p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                Should I practice before coding?
              </div>
              <div className="collapse-content">
                <p>
                  Many programmers enjoy using Schulte Tables as a mental
                  warm-up before starting deep work sessions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="bg-base-200 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Related Resources</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/schulte-table-for-focus"
              className="btn btn-outline justify-start"
            >
              Schulte Table for Focus
            </Link>

            <Link
              href="/schulte-table-for-productivity"
              className="btn btn-outline justify-start"
            >
              Schulte Table for Productivity
            </Link>

            <Link
              href="/schulte-table-for-brain-training"
              className="btn btn-outline justify-start"
            >
              Schulte Table for Brain Training
            </Link>

            <Link
              href="/schulte-table-benefits"
              className="btn btn-outline justify-start"
            >
              Schulte Table Benefits
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-6">Train Your Coding Focus</h2>

          <p className="text-xl opacity-80 mb-8">
            Improve concentration, attention, and visual scanning with daily
            Schulte Table practice.
          </p>

          <Link href="/" className="btn btn-primary btn-lg">
            Play Schulte Table Online
          </Link>
        </div>
      </section>
    </div>
  );
}
