import Link from "next/link";
import {
  FaBrain,
  FaChartLine,
  FaClock,
  FaBolt,
  FaBullseye,
  FaCheckCircle,
  FaLightbulb,
  FaRocket,
} from "react-icons/fa";

export const metadata = {
  title:
    "Schulte Table for Entrepreneurs | Improve Focus, Productivity & Mental Clarity",

  description:
    "Train concentration, attention control, productivity, and mental clarity with Schulte Table exercises for entrepreneurs. Improve focus, decision-making, deep work, and cognitive performance.",

  keywords: [
    "schulte table for entrepreneurs",
    "entrepreneur productivity",
    "focus training for entrepreneurs",
    "entrepreneur concentration",
    "mental clarity exercises",
    "deep work training",
    "attention management",
    "startup founder productivity",
    "brain training for entrepreneurs",
    "decision making skills",
    "cognitive performance",
    "business productivity",
    "focus exercises",
    "entrepreneur mindset",
    "mental performance training",
  ],

  alternates: {
    canonical: "https://schultetable.com/schulte-table-for-entrepreneurs",
  },

  openGraph: {
    title: "Schulte Table for Entrepreneurs",
    description:
      "Improve focus, productivity, concentration, and mental performance with Schulte Table training.",
    url: "https://schultetable.com/schulte-table-for-entrepreneurs",
    siteName: "Schulte Table",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Schulte Table for Entrepreneurs",
    description:
      "Train focus, deep work, attention control, and decision-making with Schulte Tables.",
  },
};

export default function SchulteTableForEntrepreneursPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a Schulte Table for entrepreneurs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Schulte Table is a visual attention exercise that helps entrepreneurs improve focus, concentration, attention control, and mental performance.",
        },
      },
      {
        "@type": "Question",
        name: "Can Schulte Tables improve productivity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Schulte Tables can help train concentration and reduce mental distractions, which may support higher productivity.",
        },
      },
      {
        "@type": "Question",
        name: "Do Schulte Tables help with focus?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Many people use Schulte Tables to train sustained attention and concentration.",
        },
      },
      {
        "@type": "Question",
        name: "Can entrepreneurs use Schulte Tables daily?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Many entrepreneurs practice for 5 to 10 minutes daily as part of their mental training routine.",
        },
      },
      {
        "@type": "Question",
        name: "Do Schulte Tables improve decision making?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Schulte Tables help develop attention control and information processing skills that contribute to clearer thinking.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <div className="min-h-screen bg-base-100">
        {/* HERO */}
        <section className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="text-center">
              <div className="badge badge-primary badge-lg mb-6">
                Entrepreneur Brain Training
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Schulte Table for Entrepreneurs
              </h1>

              <p className="text-xl max-w-4xl mx-auto leading-relaxed text-base-content/80">
                Entrepreneurs make hundreds of decisions every week. Schulte
                Table training helps improve focus, concentration, attention
                control, productivity, and mental clarity so you can work more
                effectively and stay focused on what matters most.
              </p>

              <div className="mt-10">
                <Link href="/" className="btn btn-primary btn-lg rounded-full">
                  Start Training Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Entrepreneurs Use Schulte Table Training
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaBullseye className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Improve Focus</h3>
                <p>
                  Train your ability to stay locked in on important work and
                  avoid unnecessary distractions.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaChartLine className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Increase Productivity</h3>
                <p>
                  Develop stronger attention management habits and improve how
                  efficiently you process information.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaBrain className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Mental Clarity</h3>
                <p>
                  Train concentration and cognitive performance to think more
                  clearly throughout the day.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOCUS */}
        <section className="bg-base-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-8 text-center">
              Improve Focus in a Distracted World
            </h2>

            <div className="max-w-4xl mx-auto text-lg leading-relaxed space-y-6">
              <p>
                Entrepreneurs face constant interruptions from emails,
                notifications, meetings, social media, and customer demands.
                Maintaining focus has become one of the most valuable business
                skills.
              </p>

              <p>
                Schulte Tables challenge your attention by requiring rapid
                visual scanning and number recognition while maintaining
                awareness of the entire grid.
              </p>

              <p>
                Regular practice can help strengthen concentration habits that
                support focused work sessions and more effective task execution.
              </p>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Skills Entrepreneurs Can Develop
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Focus",
              "Concentration",
              "Mental clarity",
              "Attention control",
              "Decision making",
              "Deep work",
              "Information processing",
              "Productivity",
            ].map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-4 bg-base-200 p-5 rounded-2xl"
              >
                <FaCheckCircle className="text-success text-2xl" />
                <span className="font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </section>

        {/* DEEP WORK */}
        <section className="bg-base-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-8">
              Develop Deep Work Habits
            </h2>

            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Building a successful business often requires long periods of
                uninterrupted thinking. Whether you're designing products,
                writing content, creating marketing campaigns, or solving
                technical challenges, deep work is essential.
              </p>

              <p>
                Schulte Table training provides a simple way to practice focused
                attention before starting important work sessions.
              </p>

              <p>
                Many entrepreneurs use short concentration exercises as a mental
                warm-up before tackling their most demanding tasks.
              </p>
            </div>
          </div>
        </section>

        {/* CARDS */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Benefits for Startup Founders
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <FaRocket className="text-4xl text-primary mb-3" />
                <h3 className="font-bold">Startup Execution</h3>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <FaLightbulb className="text-4xl text-primary mb-3" />
                <h3 className="font-bold">Clear Thinking</h3>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <FaClock className="text-4xl text-primary mb-3" />
                <h3 className="font-bold">Better Time Use</h3>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <FaBolt className="text-4xl text-primary mb-3" />
                <h3 className="font-bold">Faster Processing</h3>
              </div>
            </div>
          </div>
        </section>

        {/* DAILY ROUTINE */}
        <section className="bg-base-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-8">
              Daily Entrepreneur Training Routine
            </h2>

            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                A simple routine is to spend 5–10 minutes practicing Schulte
                Tables before beginning your most important work of the day.
              </p>

              <p>
                This acts as a mental warm-up and helps transition your brain
                into a focused state before tackling strategic business tasks.
              </p>

              <p>
                Over time, many users notice improvements in concentration,
                attention control, and mental endurance.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" defaultChecked />
              <div className="collapse-title text-lg font-medium">
                What is a Schulte Table for entrepreneurs?
              </div>
              <div className="collapse-content">
                <p>
                  A visual attention exercise designed to improve focus,
                  concentration, and productivity.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-lg font-medium">
                Can Schulte Tables improve productivity?
              </div>
              <div className="collapse-content">
                <p>
                  They can help strengthen concentration and attention control,
                  which support productive work habits.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-lg font-medium">
                Do Schulte Tables help focus?
              </div>
              <div className="collapse-content">
                <p>
                  Yes. Many people use them specifically to train sustained
                  attention.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INTERNAL LINKS */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <h2 className="text-3xl font-bold mb-8">
            Explore More Schulte Table Training
          </h2>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/schulte-table-for-programmers"
              className="btn btn-outline"
            >
              Programmers
            </Link>

            <Link href="/schulte-table-for-readers" className="btn btn-outline">
              Readers
            </Link>

            <Link
              href="/schulte-table-for-students"
              className="btn btn-outline"
            >
              Students
            </Link>

            <Link href="/schulte-table-for-gamers" className="btn btn-outline">
              Gamers
            </Link>

            <Link
              href="/schulte-table-for-chess-players"
              className="btn btn-outline"
            >
              Chess Players
            </Link>

            <Link href="/schulte-table-for-writers" className="btn btn-outline">
              Writers
            </Link>

            <Link href="/schulte-table-for-adults" className="btn btn-outline">
              Adults
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
