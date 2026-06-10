import Link from "next/link";

export const metadata = {
  title: "Schulte Table for Kids | Improve Focus, Attention & Learning",
  description:
    "Learn how Schulte Tables help children improve concentration, visual perception, reading speed, attention span, memory, and cognitive development through fun brain training exercises.",
};

export default function SchulteTableForKidsPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}
      <section className="hero bg-base-200 py-20">
        <div className="hero-content max-w-5xl text-center">
          <div>
            <h1 className="text-5xl font-black mb-6">Schulte Table for Kids</h1>

            <p className="text-xl leading-relaxed opacity-80">
              A simple brain-training exercise that helps children improve
              concentration, attention span, visual processing, reading speed,
              and cognitive performance while having fun.
            </p>

            <div className="mt-8">
              <Link href="/" className="btn btn-primary btn-lg">
                Play Schulte Table Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">What Is a Schulte Table?</h2>

          <p className="text-lg leading-8 mb-6">
            A Schulte Table is a grid filled with randomly arranged numbers. The
            goal is simple: find the numbers in order as quickly as possible.
          </p>

          <p className="text-lg leading-8 mb-6">
            While the activity appears easy, it trains several important
            cognitive skills simultaneously. Children must focus their
            attention, scan the visual field efficiently, remember number
            sequences, and maintain concentration until the task is completed.
          </p>

          <p className="text-lg leading-8">
            Because it feels like a game rather than homework, many children
            enjoy practicing Schulte Tables regularly.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-base-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Benefits of Schulte Tables for Kids
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🎯 Better Concentration</h3>
                <p>
                  Children learn to maintain focus for longer periods without
                  becoming distracted.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">👀 Improved Visual Attention</h3>
                <p>
                  Trains the eyes and brain to process information across a
                  larger visual field.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">📚 Faster Reading Development</h3>
                <p>
                  Many speed-reading programs use Schulte Tables to improve eye
                  movement and visual recognition.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🧠 Stronger Cognitive Skills</h3>
                <p>
                  Encourages memory, processing speed, pattern recognition, and
                  mental agility.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">⚡ Faster Information Processing</h3>
                <p>
                  Children become more efficient at finding and recognizing
                  information quickly.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🏆 Builds Confidence</h3>
                <p>
                  Kids enjoy beating their previous times, creating a rewarding
                  sense of progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ages */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">
            What Age Is Best for Schulte Tables?
          </h2>

          <p className="text-lg leading-8 mb-6">
            Schulte Tables can be adapted for different age groups.
          </p>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Age</th>
                  <th>Recommended Grid</th>
                  <th>Difficulty</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>4–6 Years</td>
                  <td>3×3</td>
                  <td>Beginner</td>
                </tr>
                <tr>
                  <td>6–8 Years</td>
                  <td>4×4</td>
                  <td>Easy</td>
                </tr>
                <tr>
                  <td>8–12 Years</td>
                  <td>5×5</td>
                  <td>Standard</td>
                </tr>
                <tr>
                  <td>12+ Years</td>
                  <td>6×6 and Above</td>
                  <td>Advanced</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-lg leading-8 mt-8">
            Starting with smaller grids helps younger children develop
            confidence before progressing to more challenging layouts.
          </p>
        </div>
      </section>

      {/* How To Use */}
      <section className="bg-base-200 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">How Kids Should Practice</h2>

          <div className="space-y-6">
            <div className="alert">
              <span>
                <strong>Step 1:</strong> Start with a small grid.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 2:</strong> Find numbers in ascending order.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 3:</strong> Focus on accuracy before speed.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 4:</strong> Track completion times.
              </span>
            </div>

            <div className="alert">
              <span>
                <strong>Step 5:</strong> Gradually increase difficulty.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Science */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">
            Why Do Schulte Tables Work?
          </h2>

          <p className="text-lg leading-8 mb-6">
            Schulte Tables challenge the brain to process visual information
            quickly while maintaining attention. This combination activates
            multiple cognitive systems simultaneously.
          </p>

          <p className="text-lg leading-8 mb-6">
            Children repeatedly practice scanning, recognition, attention
            control, and decision-making. Over time, these skills become more
            efficient and automatic.
          </p>

          <p className="text-lg leading-8">
            Many educators, parents, and speed-reading trainers use Schulte
            Tables because they are simple, engaging, and require no special
            equipment.
          </p>
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
                Are Schulte Tables good for kids?
              </div>
              <div className="collapse-content">
                <p>
                  Yes. They help improve attention, concentration, visual
                  perception, and cognitive processing skills.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                Can Schulte Tables improve reading?
              </div>
              <div className="collapse-content">
                <p>
                  They may help develop visual tracking and peripheral vision,
                  skills often associated with reading efficiency.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                How often should children practice?
              </div>
              <div className="collapse-content">
                <p>
                  Around 5–10 minutes per day is usually enough to build
                  consistency and maintain engagement.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                What grid size should beginners use?
              </div>
              <div className="collapse-content">
                <p>
                  Young children should begin with 3×3 or 4×4 grids before
                  progressing to larger tables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-6">Start Training Today</h2>

          <p className="text-xl opacity-80 mb-8">
            Help your child develop focus, attention, and cognitive skills with
            a simple daily Schulte Table exercise.
          </p>

          <Link href="/" className="btn btn-primary btn-lg">
            Play Schulte Table Online
          </Link>
        </div>
      </section>
    </div>
  );
}
