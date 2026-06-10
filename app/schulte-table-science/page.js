import Link from "next/link";

export const metadata = {
  title: "Schulte Table Science: Research, Psychology & Cognitive Training",
  description:
    "Explore the science behind Schulte Tables including attention, visual search, concentration, peripheral vision, processing speed and cognitive training research.",
};

export default function Page() {
  const scienceAreas = [
    {
      icon: "🎯",
      title: "Selective Attention",
      desc: "Training the ability to focus on relevant targets while ignoring distractions.",
    },
    {
      icon: "⚡",
      title: "Processing Speed",
      desc: "Rapid recognition and response to visual information.",
    },
    {
      icon: "👁️",
      title: "Visual Search",
      desc: "Efficiently locating targets within a crowded visual field.",
    },
    {
      icon: "🧠",
      title: "Concentration",
      desc: "Maintaining focus during demanding tasks.",
    },
    {
      icon: "🔭",
      title: "Peripheral Awareness",
      desc: "Expanding awareness beyond central vision.",
    },
    {
      icon: "👀",
      title: "Eye Movement Control",
      desc: "Reducing inefficient scanning behaviour.",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <section className="hero bg-base-200 py-24">
        <div className="hero-content text-center max-w-5xl">
          <div>
            <div className="badge badge-primary badge-lg mb-6">
              Cognitive Science
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              The Science Behind
              <br />
              Schulte Tables
            </h1>

            <p className="text-xl opacity-70 max-w-3xl mx-auto">
              Explore the psychology, attention research and cognitive
              mechanisms that make Schulte Tables one of the most popular visual
              training exercises in the world.
            </p>

            <div className="mt-10">
              <Link href="/" className="btn btn-primary btn-lg">
                Start Training
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <section className="mb-20">
          <h2 className="text-4xl font-black mb-10 text-center">
            What Does a Schulte Table Train?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {scienceAreas.map((item) => (
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

        <section className="mb-20">
          <h2 className="text-4xl font-black mb-8">Origins in Psychology</h2>

          <div className="prose prose-lg max-w-none">
            <p>
              Schulte Tables were developed by German psychiatrist Walter
              Schulte as part of research into attention and visual perception.
              Originally, the exercise was not intended as a game. It was a
              psychodiagnostic tool used to evaluate concentration, attention
              stability and visual search efficiency.
            </p>

            <p>
              Participants were asked to locate numbers arranged randomly in a
              grid as quickly as possible. Researchers measured completion time
              and observed search behaviour. This simple task provided valuable
              insights into how individuals process visual information.
            </p>

            <p>
              Over time, the method spread into educational psychology,
              cognitive training, speed-reading programs and modern digital
              brain-training platforms.
            </p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-black mb-8">
            Cognitive Processes Involved
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Working Memory",
              "Pattern Recognition",
              "Visual Scanning",
              "Target Detection",
              "Attention Control",
              "Reaction Planning",
            ].map((item) => (
              <div
                key={item}
                className="card bg-base-200 border border-base-300"
              >
                <div className="card-body text-center">
                  <h3 className="font-bold text-xl">{item}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-black mb-8">What Research Suggests</h2>

          <div className="alert alert-success mb-6">
            <span>
              Research generally supports visual-search exercises as useful
              tools for attention practice, concentration training and visual
              processing development.
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="font-black text-2xl">Supported Areas</h3>

                <ul>
                  <li>Attention training</li>
                  <li>Visual scanning practice</li>
                  <li>Concentration development</li>
                  <li>Visual search efficiency</li>
                </ul>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="font-black text-2xl">Less Certain Claims</h3>

                <ul>
                  <li>IQ increases</li>
                  <li>Permanent intelligence gains</li>
                  <li>Dramatic cognitive transformation</li>
                  <li>Universal effects for everyone</li>
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
            Schulte Tables became popular in speed-reading programs because they
            encourage wider visual span and improved awareness of multiple
            targets. Many instructors use them as supporting exercises for
            reducing unnecessary eye movements during reading.
          </p>
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

        <section className="bg-primary text-primary-content rounded-3xl p-16 text-center">
          <div className="text-7xl mb-4">🧠</div>

          <h2 className="text-5xl font-black mb-4">
            Experience The Science Yourself
          </h2>

          <p className="text-xl opacity-80 mb-8">
            Train attention, concentration and visual processing with free
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
