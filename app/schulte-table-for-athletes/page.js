import Link from "next/link";
import {
  FaBrain,
  FaTrophy,
  FaEye,
  FaBolt,
  FaBullseye,
  FaClock,
  FaRunning,
  FaCheckCircle,
  FaDumbbell,
  FaMedal,
  FaArrowRight,
} from "react-icons/fa";
export const metadata = {
  title: "Schulte Table for Athletes | Improve Focus, Reaction Time & Vision",
  description:
    "Discover how Schulte Table training can help athletes improve concentration, peripheral vision, reaction speed, mental endurance, and on-field decision making.",
};

export default function SchulteTableForAthletesPage() {
  const benefits = [
    {
      icon: <FaEye className="text-4xl" />,
      title: "Better Peripheral Vision",
      description:
        "Athletes learn to process more visual information without constantly moving their eyes.",
    },
    {
      icon: <FaBolt className="text-4xl" />,
      title: "Faster Reaction Time",
      description:
        "Improve how quickly your brain identifies and responds to visual stimuli.",
    },
    {
      icon: <FaBrain className="text-4xl" />,
      title: "Enhanced Focus",
      description:
        "Train your ability to maintain concentration during high-pressure situations.",
    },
    {
      icon: <FaBullseye className="text-4xl" />,
      title: "Improved Decision Making",
      description:
        "Process information faster and make better decisions during competition.",
    },
    {
      icon: <FaClock className="text-4xl" />,
      title: "Mental Endurance",
      description: "Build cognitive stamina for long matches and competitions.",
    },
    {
      icon: <FaRunning className="text-4xl" />,
      title: "Visual Scanning Skills",
      description: "Develop awareness of your surroundings during gameplay.",
    },
  ];

  const sports = [
    "Football",
    "Basketball",
    "Cricket",
    "Tennis",
    "Badminton",
    "Hockey",
    "Baseball",
    "Volleyball",
    "Formula Racing",
    "Martial Arts",
    "Swimming",
    "Esports",
  ];

  const faq = [
    {
      q: "Can Schulte Tables improve athletic performance?",
      a: "Schulte Tables train concentration, visual scanning, and attention control. These skills are valuable in many sports where athletes must rapidly process visual information and make quick decisions.",
    },
    {
      q: "How often should athletes practice?",
      a: "Most athletes benefit from 5–10 minutes of daily practice. Consistency is more important than long sessions.",
    },
    {
      q: "Do professional athletes use visual training?",
      a: "Many elite athletes incorporate vision and cognitive training exercises into their routines to improve reaction speed, focus, and awareness.",
    },
    {
      q: "Which sports benefit the most?",
      a: "Sports requiring rapid visual processing and decision making, such as football, basketball, tennis, cricket, hockey, and esports, often benefit significantly.",
    },
    {
      q: "Can beginners use Schulte Tables?",
      a: "Absolutely. Schulte Tables are suitable for athletes of all ages and skill levels.",
    },
  ];

  return (
    <main className="bg-base-100 min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-warning/20 via-base-100 to-primary/10" />

        <div className="max-w-7xl mx-auto px-6 py-24 relative">
          <div className="max-w-4xl">
            <div className="badge badge-warning badge-lg mb-6">
              Athletic Performance Training
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              Schulte Table
              <span className="block text-warning">for Athletes</span>
            </h1>

            <p className="text-xl mt-8 text-base-content/80 max-w-3xl">
              Train your mind like you train your body. Schulte Tables help
              athletes develop concentration, visual awareness, reaction speed,
              and decision-making abilities that can translate into better
              performance during competition.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link href="/" className="btn btn-warning btn-lg text-black">
                Start Training
                <FaArrowRight />
              </Link>

              <Link
                href="/schulte-table-science"
                className="btn btn-outline btn-lg"
              >
                Research & Science
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY ATHLETES */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <FaTrophy className="text-6xl mx-auto text-warning mb-6" />

            <h2 className="text-4xl font-bold mb-6">
              Why Athletes Use Schulte Tables
            </h2>

            <p className="text-lg max-w-3xl mx-auto text-base-content/70">
              Success in sports depends on more than physical ability. Elite
              athletes constantly scan their environment, track movement,
              maintain concentration, and make split-second decisions. Schulte
              Table exercises challenge these cognitive skills in a simple but
              effective format.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p>
              During competition, athletes are exposed to a constant stream of
              information. Opponents move, teammates reposition themselves, game
              conditions change, and strategic decisions must be made instantly.
              The brain's ability to efficiently process this information often
              separates elite performers from average competitors.
            </p>

            <p>
              Schulte Tables encourage rapid visual scanning while maintaining
              central focus. This type of mental exercise may support skills
              related to attention control, visual awareness, and information
              processing speed.
            </p>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24 bg-base-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <FaBrain className="text-6xl mx-auto text-warning mb-6" />

            <h2 className="text-4xl font-bold mb-6">
              Benefits for Sports Performance
            </h2>

            <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
              While Schulte Tables are simple, they challenge several cognitive
              abilities that are important in athletic competition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((item, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="text-warning">{item.icon}</div>

                  <h3 className="card-title text-2xl">{item.title}</h3>

                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPORTS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <FaMedal className="text-6xl mx-auto text-warning mb-6" />

            <h2 className="text-4xl font-bold">Sports That Can Benefit</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sports.map((sport, index) => (
              <div
                key={index}
                className="card bg-base-200 hover:shadow-xl transition-all"
              >
                <div className="card-body items-center text-center">
                  <FaDumbbell className="text-3xl text-warning" />
                  <h3 className="font-bold">{sport}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINING ROUTINE */}
      <section className="py-24 bg-base-200">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            Recommended Training Routine
          </h2>

          <div className="space-y-6">
            {[
              "Complete 3–5 Schulte Tables daily.",
              "Focus on maintaining central vision.",
              "Avoid excessive eye movement.",
              "Track your completion times.",
              "Gradually increase difficulty.",
              "Combine with regular sports training.",
            ].map((item, index) => (
              <div key={index} className="flex gap-4 items-start">
                <FaCheckCircle className="text-success text-xl mt-1" />
                <p className="text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCIENCE */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-10 text-center">
            The Science Behind Visual Attention Training
          </h2>

          <div className="space-y-8 text-lg text-base-content/80">
            <p>
              Athletic performance often depends on how effectively the brain
              processes visual information. Researchers have long studied
              attention, visual search, reaction speed, and decision making in
              sports environments.
            </p>

            <p>
              Schulte Tables provide a structured way to challenge these
              cognitive systems. By locating numbers in sequence while
              maintaining focus, athletes train attention control and visual
              scanning skills in a measurable format.
            </p>

            <p>
              Although Schulte Tables are not a replacement for sport-specific
              training, they can serve as a valuable mental conditioning tool
              alongside physical preparation.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-base-200">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faq.map((item, index) => (
              <div key={index} className="collapse collapse-arrow bg-base-100">
                <input type="radio" name="faq" />

                <div className="collapse-title text-xl font-medium">
                  {item.q}
                </div>

                <div className="collapse-content">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="card bg-warning text-black shadow-2xl">
            <div className="card-body items-center text-center p-12">
              <h2 className="text-5xl font-black mb-6">
                Train Your Mind Like an Athlete
              </h2>

              <p className="text-xl max-w-2xl">
                Improve focus, visual awareness, concentration, and reaction
                speed with daily Schulte Table practice.
              </p>

              <Link href="/" className="btn btn-neutral btn-lg mt-8">
                Start Free Training
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
