import React from "react";
import {
  FaChessKing,
  FaChessKnight,
  FaBrain,
  FaBullseye,
  FaBolt,
  FaEye,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
export const metadata = {
  title: "Schulte Table for Chess Players | Improve Board Vision & Focus",
  description:
    "Discover how Schulte Table training can help chess players improve board vision, concentration, calculation speed, pattern recognition, and mental endurance..",
  keywords: [
    "schulte table vs elevate",
    "elevate vs schulte table",
    "brain training comparison",
    "best brain training app",
    "schulte table focus",
    "elevate review",
    "schulte table review",
    "attention training",
    "focus training",
    "speed reading training",
  ],
  alternates: {
    canonical: "https://schultetable.com/schulte-table-vs-elevate",
  },
  openGraph: {
    title: "Schulte Table vs Elevate: Which Brain Training App Is Better?",
    description:
      "Compare Schulte Table and Elevate for focus, concentration, reading, attention and cognitive training.",
    url: "https://schultetable.com/schulte-table-vs-elevate",
    type: "article",
  },
};

export default function SchulteTableForChessPlayers() {
  const benefits = [
    {
      icon: <FaEye />,
      title: "Board Vision",
      description:
        "Train your eyes to quickly scan and recognize patterns across the entire chessboard.",
    },
    {
      icon: <FaBolt />,
      title: "Faster Move Calculation",
      description:
        "Improve processing speed when evaluating positions and calculating variations.",
    },
    {
      icon: <FaBrain />,
      title: "Mental Endurance",
      description:
        "Develop concentration for long tournament games and difficult positions.",
    },
    {
      icon: <FaBullseye />,
      title: "Improved Focus",
      description:
        "Reduce distractions and maintain attention during critical moments.",
    },
  ];

  const chessSkills = [
    "Opening preparation",
    "Tactical pattern recognition",
    "Positional evaluation",
    "Endgame calculation",
    "Time management",
    "Visualization ability",
  ];

  const tips = [
    "Complete a 5x5 Schulte Table before studying openings.",
    "Use a 6x6 table before solving tactical puzzles.",
    "Practice daily for 5-10 minutes for best results.",
    "Focus on peripheral vision instead of moving your eyes excessively.",
    "Track your completion times and aim for gradual improvement.",
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}
      <section className="hero bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 py-20">
        <div className="hero-content text-center max-w-5xl">
          <div>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-5xl">
                <FaChessKing />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Schulte Table for Chess Players
            </h1>

            <p className="text-xl opacity-80 max-w-3xl mx-auto mb-8">
              Improve board vision, concentration, calculation speed, and
              pattern recognition with Schulte Table training designed for chess
              players.
            </p>

            <a href="/" className="btn btn-primary btn-lg">
              Start Training Free
              <FaArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* Why Chess Players Use It */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">
              Why Chess Players Train With Schulte Tables
            </h2>
            <p className="text-lg opacity-70 max-w-3xl mx-auto">
              Chess masters rely heavily on visual processing speed,
              concentration, and pattern recognition. Schulte Tables help train
              the cognitive skills used during competitive play.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item, index) => (
              <div
                key={index}
                className="card bg-base-200 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="card-body">
                  <div className="text-4xl text-primary mb-3">{item.icon}</div>

                  <h3 className="card-title">{item.title}</h3>

                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chess Connection */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Train the Same Skills Used During Chess Games
              </h2>

              <p className="mb-4 text-lg">
                Strong chess players constantly scan the board, identify
                patterns, and calculate possibilities. Schulte Table exercises
                challenge your visual attention system in a similar way.
              </p>

              <p className="mb-4">
                Many players use visual attention exercises before puzzle
                solving, game analysis, and tournament preparation sessions.
              </p>

              <p>
                While Schulte Tables won't replace tactical training, they can
                complement your existing chess study routine by strengthening
                concentration and visual processing speed.
              </p>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="text-2xl font-bold mb-4">
                  Chess Skills Supported
                </h3>

                <div className="space-y-4">
                  {chessSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-lg"
                    >
                      <FaCheckCircle className="text-success" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Routine */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Recommended Chess Training Routine
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-primary text-primary-content">
              <div className="card-body">
                <h3 className="text-2xl font-bold">Step 1</h3>
                <p className="text-lg">Complete 2-3 Schulte Table rounds.</p>
              </div>
            </div>

            <div className="card bg-secondary text-secondary-content">
              <div className="card-body">
                <h3 className="text-2xl font-bold">Step 2</h3>
                <p className="text-lg">
                  Solve tactical chess puzzles for 15-20 minutes.
                </p>
              </div>
            </div>

            <div className="card bg-accent text-accent-content">
              <div className="card-body">
                <h3 className="text-2xl font-bold">Step 3</h3>
                <p className="text-lg">
                  Review games and calculate variations deeply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            Tips for Chess Players
          </h2>

          <div className="space-y-4">
            {tips.map((tip, index) => (
              <div key={index} className="alert bg-base-100 shadow-md">
                <FaChessKnight className="text-primary text-xl" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="faq" defaultChecked />
              <div className="collapse-title text-xl font-medium">
                Can Schulte Tables improve chess rating?
              </div>
              <div className="collapse-content">
                <p>
                  Schulte Tables can help improve concentration, visual
                  attention, and processing speed. These skills may support
                  chess improvement when combined with proper study and
                  practice.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                How often should chess players train?
              </div>
              <div className="collapse-content">
                <p>
                  Most players benefit from 5-10 minutes daily before chess
                  study sessions or tournaments.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-xl font-medium">
                Which table size is best?
              </div>
              <div className="collapse-content">
                <p>
                  Beginners can start with 5x5 tables. Intermediate and advanced
                  players often prefer 6x6 or larger grids.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-content">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <FaChessKing className="text-6xl mx-auto mb-6" />

          <h2 className="text-4xl font-bold mb-4">
            Sharpen Your Chess Focus Today
          </h2>

          <p className="text-xl mb-8">
            Train your visual attention and concentration with free Schulte
            Table exercises.
          </p>

          <a href="/" className="btn btn-neutral btn-lg">
            Play Schulte Table Now
          </a>
        </div>
      </section>
    </div>
  );
}
