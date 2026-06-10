import Link from "next/link";

export const metadata = {
  title: "Schulte Table Research: Studies, Evidence & Cognitive Science",
  description:
    "Explore Schulte Table research, psychology studies, attention science, visual search training, concentration development and cognitive performance.",
};

export default function Page() {
  const researchAreas = [
    {
      icon: "🎯",
      title: "Attention",
      desc: "Selective and sustained attention are central to Schulte Table performance.",
    },
    {
      icon: "👁️",
      title: "Visual Search",
      desc: "Finding targets efficiently within a visual field.",
    },
    {
      icon: "⚡",
      title: "Processing Speed",
      desc: "Speed of recognising and responding to visual information.",
    },
    {
      icon: "🧠",
      title: "Concentration",
      desc: "Maintaining focus without distraction.",
    },
    {
      icon: "🔭",
      title: "Peripheral Vision",
      desc: "Awareness outside the central point of focus.",
    },
    {
      icon: "👀",
      title: "Eye Movements",
      desc: "Understanding scanning patterns and gaze behaviour.",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <section className="hero bg-base-200 py-24">
        <div className="hero-content text-center max-w-5xl">
          <div>
            <div className="badge badge-primary badge-lg mb-6">
              Research & Evidence
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Schulte Table Research
            </h1>

            <p className="text-xl opacity-70 max-w-3xl mx-auto">
              Discover what psychology, attention research, visual search
              studies and cognitive science reveal about Schulte Tables.
            </p>

            <div className="mt-10">
              <Link href="/" className="btn btn-primary btn-lg">
                Try Schulte Table
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <section className="mb-20">
          <h2 className="text-4xl font-black text-center mb-10">
            What Researchers Study
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {researchAreas.map((area) => (
              <div
                key={area.title}
                className="card bg-base-200 border border-base-300"
              >
                <div className="card-body">
                  <div className="text-5xl">{area.icon}</div>
                  <h3 className="card-title">{area.title}</h3>
                  <p>{area.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-black mb-8">
            Origins of Schulte Table Research
          </h2>

          <div className="prose prose-lg max-w-none">
            <p>
              The Schulte Table originated as a psychodiagnostic tool developed
              by German psychiatrist Walter Schulte. The original purpose was
              not entertainment but the assessment of attention, concentration,
              visual search efficiency and mental processing performance.
            </p>

            <p>
              Participants were asked to locate numbers arranged randomly in a
              grid while psychologists measured completion times and observed
              visual scanning behaviour.
            </p>

            <p>
              Over time, the exercise expanded beyond clinical environments into
              education, cognitive training, speed reading and modern digital
              brain-training applications.
            </p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-black mb-8">
            Cognitive Functions Investigated
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              "Selective Attention",
              "Sustained Attention",
              "Working Memory",
              "Visual Scanning",
              "Pattern Recognition",
              "Processing Speed",
              "Peripheral Vision",
              "Cognitive Control",
            ].map((item) => (
              <div
                key={item}
                className="card bg-base-200 border border-base-300"
              >
                <div className="card-body text-center">
                  <h3 className="font-bold">{item}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-black mb-8">
            What Existing Research Suggests
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card bg-success text-success-content">
              <div className="card-body">
                <h3 className="text-2xl font-black">Areas With Support</h3>

                <ul className="list-disc ml-6">
                  <li>Attention training</li>
                  <li>Visual search exercises</li>
                  <li>Concentration practice</li>
                  <li>Processing speed development</li>
                  <li>Visual scanning efficiency</li>
                </ul>
              </div>
            </div>

            <div className="card bg-warning text-warning-content">
              <div className="card-body">
                <h3 className="text-2xl font-black">Areas Less Certain</h3>

                <ul className="list-disc ml-6">
                  <li>IQ increases</li>
                  <li>General intelligence gains</li>
                  <li>Universal benefits for everyone</li>
                  <li>Dramatic long-term cognitive transformation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-black mb-8">
            Schulte Tables and Speed Reading
          </h2>

          <p className="text-lg leading-relaxed">
            Many speed-reading programs include Schulte Tables because they
            encourage broader visual awareness and efficient scanning. Some
            instructors use them as complementary exercises for improving
            reading-related visual skills.
          </p>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-black mb-8">
            Modern Cognitive Training
          </h2>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              "Students",
              "Professionals",
              "Athletes",
              "Gamers",
              "Lifelong Learners",
            ].map((item) => (
              <div
                key={item}
                className="card bg-base-200 border border-base-300"
              >
                <div className="card-body text-center">
                  <h3 className="font-bold">{item}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-black mb-8">Research Timeline</h2>

          <div className="grid md:grid-cols-5 gap-4">
            {["1950s", "1960s", "1980s", "2000s", "Today"].map((year) => (
              <div
                key={year}
                className="card bg-base-200 border border-base-300"
              >
                <div className="card-body text-center">
                  <h3 className="font-black text-2xl">{year}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-black text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
              <input type="radio" name="faq" defaultChecked />
              <div className="collapse-title font-bold">
                Is Schulte Table scientifically proven?
              </div>
              <div className="collapse-content">
                Schulte Tables have a long history in psychology and attention
                research. They are commonly used as visual-search and attention
                exercises.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
              <input type="radio" name="faq" />
              <div className="collapse-title font-bold">
                Does Schulte Table improve focus?
              </div>
              <div className="collapse-content">
                Many users report improvements in concentration and attention
                with regular practice.
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200 border border-base-300">
              <input type="radio" name="faq" />
              <div className="collapse-title font-bold">
                Does Schulte Table increase IQ?
              </div>
              <div className="collapse-content">
                Current evidence does not support claims that Schulte Tables
                directly increase IQ.
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-content rounded-3xl p-16 text-center">
          <div className="text-7xl mb-4">🧠</div>

          <h2 className="text-5xl font-black mb-4">
            Experience The Research Yourself
          </h2>

          <p className="text-xl opacity-80 mb-8">
            Train attention, concentration and visual search skills with free
            Schulte Table exercises.
          </p>

          <Link href="/" className="btn btn-lg bg-white text-primary">
            Start Training
          </Link>
        </section>
      </div>
    </div>
  );
}
