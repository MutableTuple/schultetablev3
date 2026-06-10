import Link from "next/link";

export const metadata = {
  title:
    "Schulte Table for Students | Improve Focus, Concentration & Study Performance",
  description:
    "Learn how Schulte Tables can help students improve concentration, attention span, study efficiency, visual processing speed, and academic performance.",
};

export default function SchulteTableForStudentsPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}
      <section className="hero bg-base-200 py-20">
        <div className="hero-content text-center max-w-5xl">
          <div>
            <h1 className="text-5xl font-black mb-6">
              Schulte Table for Students
            </h1>

            <p className="text-xl opacity-80 leading-relaxed">
              Train your attention, improve concentration, and develop stronger
              study habits with one of the most effective visual brain-training
              exercises available.
            </p>

            <Link href="/" className="btn btn-primary btn-lg mt-8">
              Start Training Now
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">
            Why Students Struggle With Focus
          </h2>

          <p className="text-lg leading-8 mb-6">
            Modern students face constant distractions. Smartphones, social
            media, notifications, streaming platforms, and multitasking can make
            it difficult to maintain deep concentration while studying.
          </p>

          <p className="text-lg leading-8 mb-6">
            Attention is one of the most important skills for academic success.
            The ability to focus on a task without becoming distracted affects
            reading comprehension, learning speed, memory retention, and exam
            performance.
          </p>

          <p className="text-lg leading-8">
            Schulte Tables provide a simple and measurable way to train
            concentration while improving visual attention and processing speed.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-base-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Benefits for Students
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🎯 Better Concentration</h3>
                <p>
                  Improve your ability to stay focused during classes,
                  assignments, and study sessions.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">📚 More Effective Studying</h3>
                <p>
                  Stronger attention can help students stay engaged with
                  learning materials for longer periods.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">⚡ Faster Information Processing</h3>
                <p>
                  Train your brain to recognize and process information more
                  efficiently.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">👀 Improved Visual Attention</h3>
                <p>
                  Enhance your ability to scan and identify information quickly
                  across a wider visual field.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🧠 Stronger Cognitive Skills</h3>
                <p>
                  Develop attention control, mental agility, and visual
                  processing abilities.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🏆 Trackable Progress</h3>
                <p>
                  Completion times provide a simple way to measure improvement
                  over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Study Connection */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">
            How Schulte Tables Support Studying
          </h2>

          <p className="text-lg leading-8 mb-6">
            Successful studying requires sustained attention. Students must
            focus on reading, solving problems, understanding concepts, and
            retaining information without becoming distracted.
          </p>

          <p className="text-lg leading-8 mb-6">
            Schulte Table practice encourages active concentration by requiring
            users to continuously search for numbers while maintaining accuracy.
          </p>

          <p className="text-lg leading-8">
            This combination of focus, visual scanning, and rapid recognition
            makes Schulte Tables a popular brain-training exercise among
            students.
          </p>
        </div>
      </section>

      {/* Study Routine */}
      <section className="bg-base-200 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Student Practice Routine</h2>

          <div className="space-y-4">
            <div className="alert">
              <span>
                <strong>Step 1:</strong> Complete 3–5 Schulte Tables before
                studying.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 2:</strong> Record your completion times.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 3:</strong> Focus on accuracy before speed.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 4:</strong> Increase difficulty gradually.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 5:</strong> Practice consistently for the best
                results.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Student Types */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Who Can Benefit?</h2>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Student Type</th>
                  <th>Potential Benefit</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>School Students</td>
                  <td>Improved attention and concentration.</td>
                </tr>

                <tr>
                  <td>High School Students</td>
                  <td>Better focus during exam preparation.</td>
                </tr>

                <tr>
                  <td>College Students</td>
                  <td>More efficient study sessions.</td>
                </tr>

                <tr>
                  <td>Competitive Exam Candidates</td>
                  <td>Enhanced attention and processing speed.</td>
                </tr>

                <tr>
                  <td>Lifelong Learners</td>
                  <td>Continued cognitive training.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Science */}
      <section className="bg-base-200 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Why Schulte Tables Work</h2>

          <p className="text-lg leading-8 mb-6">
            Schulte Tables challenge the brain to rapidly identify targets
            across a visual field while maintaining concentration.
          </p>

          <p className="text-lg leading-8 mb-6">
            This repeated practice develops visual attention, search efficiency,
            focus control, and processing speed.
          </p>

          <p className="text-lg leading-8">
            Because the exercise is measurable and engaging, students can easily
            monitor progress and stay motivated.
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
                Are Schulte Tables good for students?
              </div>
              <div className="collapse-content">
                <p>
                  Yes. They are commonly used as concentration and visual
                  attention exercises.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                Can Schulte Tables help with studying?
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
                How often should students practice?
              </div>
              <div className="collapse-content">
                <p>Most people benefit from 5–10 minutes of daily practice.</p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                Which grid size is best for students?
              </div>
              <div className="collapse-content">
                <p>The classic 5×5 grid is usually the best starting point.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-6">Train Your Focus Today</h2>

          <p className="text-xl opacity-80 mb-8">
            Improve concentration, visual attention, and study efficiency with
            regular Schulte Table practice.
          </p>

          <Link href="/" className="btn btn-primary btn-lg">
            Play Schulte Table Online
          </Link>
        </div>
      </section>
    </div>
  );
}
