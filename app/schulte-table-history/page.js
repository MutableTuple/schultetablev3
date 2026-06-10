import Link from "next/link";

export const metadata = {
  title: "Schulte Table History: Origins, Walter Schulte & Evolution",
  description:
    "Discover the history of the Schulte Table, its inventor Walter Schulte, its role in psychology, speed reading, and modern brain training.",
  keywords: [
    "schulte table history",
    "history of schulte table",
    "who invented schulte table",
    "walter schulte",
    "schulte table origin",
  ],
};

export default function Page() {
  const timeline = [
    {
      year: "1950s",
      title: "Early Research",
      desc: "Walter Schulte studies attention, concentration and visual search processes.",
    },
    {
      year: "1960s",
      title: "Schulte Table Created",
      desc: "The Schulte Table becomes a psychodiagnostic tool for measuring attention and visual perception.",
    },
    {
      year: "1970s–1980s",
      title: "Educational Adoption",
      desc: "Used in schools, psychology programs, and attention training.",
    },
    {
      year: "1990s–2000s",
      title: "Speed Reading Era",
      desc: "Widely adopted by speed-reading instructors.",
    },
    {
      year: "Today",
      title: "Digital Brain Training",
      desc: "Available worldwide through online platforms and mobile apps.",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <section className="hero py-24 bg-base-200">
        <div className="hero-content text-center max-w-5xl">
          <div>
            <h1 className="text-5xl md:text-7xl font-black">
              Schulte Table History
            </h1>
            <p className="py-6 text-lg opacity-80">
              Explore the origins of the Schulte Table, the work of Walter
              Schulte, and how a psychological attention test became one of the
              world's most popular brain training exercises.
            </p>
            <Link href="/" className="btn btn-primary btn-lg">
              Play Schulte Table
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
        <section>
          <h2 className="text-4xl font-black mb-6">
            Who Invented the Schulte Table?
          </h2>
          <p className="text-lg leading-relaxed">
            The Schulte Table was developed by German psychiatrist and
            psychotherapist Walter Schulte. Originally designed as a
            psychodiagnostic assessment tool, it was used to study attention,
            concentration, visual perception, and mental processing speed.
          </p>
        </section>

        <section>
          <h2 className="text-4xl font-black mb-10">Historical Timeline</h2>
          <div className="space-y-6">
            {timeline.map((item) => (
              <div
                key={item.year}
                className="card bg-base-200 border border-base-300"
              >
                <div className="card-body">
                  <div className="badge badge-primary">{item.year}</div>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-4xl font-black mb-6">Why Was It Created?</h2>
          <p className="text-lg leading-relaxed">
            Walter Schulte developed the exercise to measure visual search
            efficiency, concentration, and attention stability. Participants
            searched for numbers arranged randomly in a grid while researchers
            measured performance and attention patterns.
          </p>
        </section>

        <section>
          <h2 className="text-4xl font-black mb-6">
            Schulte Tables and Speed Reading
          </h2>
          <p className="text-lg leading-relaxed">
            During the late twentieth century, Schulte Tables became popular in
            speed-reading programs. Trainers believed the exercise could help
            expand visual span, improve peripheral awareness, and reduce
            unnecessary eye movements while reading.
          </p>
        </section>

        <section>
          <h2 className="text-4xl font-black mb-6">The Modern Era</h2>
          <p className="text-lg leading-relaxed">
            Today Schulte Tables are used online by students, professionals,
            gamers, athletes, and lifelong learners seeking to improve focus,
            concentration, and processing speed.
          </p>
        </section>

        <section className="bg-primary text-primary-content rounded-3xl p-12 text-center">
          <h2 className="text-5xl font-black mb-4">
            Experience History in Action
          </h2>
          <p className="mb-8 text-lg">
            Train using the same attention exercise that evolved from clinical
            psychology into a global brain-training phenomenon.
          </p>
          <Link href="/" className="btn btn-lg">
            Play Free Now
          </Link>
        </section>
      </div>
    </div>
  );
}
