import Link from "next/link";
import {
  FaPlane,
  FaEye,
  FaBrain,
  FaClock,
  FaCrosshairs,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";

export const metadata = {
  title:
    "Schulte Table for Pilots | Improve Focus, Scanning & Situational Awareness",
  description:
    "Train like a pilot with Schulte Table exercises. Improve visual scanning speed, concentration, peripheral awareness, cognitive processing, and situational awareness for aviation training and flight operations.",

  keywords: [
    "schulte table for pilots",
    "pilot brain training",
    "pilot concentration exercises",
    "aviation concentration training",
    "pilot focus training",
    "visual scanning training",
    "aviation cognitive training",
    "pilot attention training",
    "flight training exercises",
    "peripheral vision training",
    "situational awareness training",
    "pilot mental performance",
    "brain exercises for pilots",
    "student pilot training",
    "aviation focus exercises",
  ],

  alternates: {
    canonical: "https://schultetable.com/schulte-table-for-pilots",
  },

  openGraph: {
    title: "Schulte Table for Pilots",
    description:
      "Improve visual scanning, concentration, situational awareness, and cognitive performance with Schulte Table exercises designed for pilots.",
    url: "https://schultetable.com/schulte-table-for-pilots",
    siteName: "Schulte Table",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Schulte Table for Pilots",
    description:
      "Train visual attention, scanning speed, concentration, and situational awareness with Schulte Tables.",
  },
};

export default function SchulteTableForPilotsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a Schulte Table for pilots?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Schulte Table is a visual attention training exercise that helps pilots improve scanning speed, concentration, peripheral awareness, and cognitive processing.",
        },
      },
      {
        "@type": "Question",
        name: "Can Schulte Tables improve situational awareness?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Schulte Table training encourages efficient visual scanning and attention control, skills that contribute to stronger situational awareness.",
        },
      },
      {
        "@type": "Question",
        name: "Do student pilots benefit from Schulte Tables?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Student pilots can use Schulte Tables to practice focus, visual attention, and information processing during training.",
        },
      },
      {
        "@type": "Question",
        name: "How often should pilots practice Schulte Tables?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Many people practice for 5–10 minutes daily to improve concentration, scanning efficiency, and mental sharpness.",
        },
      },
      {
        "@type": "Question",
        name: "Can Schulte Tables improve concentration during flight training?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Schulte Tables are commonly used as attention-training exercises and may help strengthen concentration skills useful during flight training.",
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
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="text-center">
              <div className="badge badge-primary badge-lg mb-6">
                Aviation Brain Training
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Schulte Table for Pilots
              </h1>

              <p className="text-xl max-w-4xl mx-auto leading-relaxed text-base-content/80">
                Improve visual scanning speed, concentration, peripheral
                awareness, attention control, and situational awareness with
                Schulte Table training. Pilots constantly process large amounts
                of visual information, making focused attention training an
                important part of cognitive performance.
              </p>

              <div className="mt-10">
                <Link href="/" className="btn btn-primary btn-lg rounded-full">
                  Start Training Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Pilots Use Schulte Table Training
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaEye className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Improve Visual Scanning Speed</h3>
                <p>
                  Pilots frequently scan instruments, airspace, navigation
                  displays, and cockpit systems. Schulte Tables encourage faster
                  and more organized visual scanning patterns.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaCrosshairs className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Strengthen Concentration</h3>
                <p>
                  Consistent training helps develop sustained attention and
                  focus, valuable skills during flight operations and training
                  sessions.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaBrain className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Enhance Cognitive Processing</h3>
                <p>
                  Schulte Table exercises challenge the brain to identify,
                  process, and react to visual information efficiently.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Situational Awareness */}
        <section className="bg-base-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-8 text-center">
              Build Better Situational Awareness
            </h2>

            <div className="max-w-4xl mx-auto text-lg leading-relaxed space-y-6">
              <p>
                Situational awareness is one of the most important skills in
                aviation. Pilots must continuously monitor aircraft systems,
                navigation information, weather conditions, air traffic, and
                surrounding airspace.
              </p>

              <p>
                Schulte Table exercises train visual attention and scanning
                efficiency by requiring users to locate numbers rapidly while
                maintaining awareness of the entire grid. This style of training
                can help develop habits associated with effective information
                processing.
              </p>

              <p>
                While Schulte Tables are not a replacement for formal flight
                training, many pilots and aviation enthusiasts use them as part
                of their mental performance and focus-training routines.
              </p>
            </div>
          </div>
        </section>

        {/* Pilot Skills */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Skills Pilots Can Train
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Visual scanning efficiency",
              "Peripheral awareness",
              "Concentration",
              "Attention control",
              "Mental processing speed",
              "Focus under pressure",
              "Pattern recognition",
              "Cognitive endurance",
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

        {/* Student Pilots */}
        <section className="bg-base-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-8">
              Benefits of Schulte Tables for Student Pilots
            </h2>

            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Student pilots spend significant time learning procedures,
                navigation concepts, communication protocols, and aircraft
                systems. Attention and information processing are essential
                during this learning phase.
              </p>

              <p>
                Daily Schulte Table practice can provide a simple and engaging
                way to train focus and visual attention outside the cockpit.
              </p>

              <p>
                Many users complete short 5–10 minute sessions to keep their
                minds active and improve concentration performance over time.
              </p>
            </div>
          </div>
        </section>

        {/* Airline Pilots */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold mb-8">
            How Airline Pilots Can Use Schulte Tables
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-200">
              <div className="card-body">
                <FaPlane className="text-4xl text-primary mb-4" />
                <h3 className="font-bold text-xl">Pre-Flight Mental Warmup</h3>
                <p>
                  Complete a short training session before studying or reviewing
                  procedures.
                </p>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body">
                <FaClock className="text-4xl text-primary mb-4" />
                <h3 className="font-bold text-xl">Daily Focus Training</h3>
                <p>
                  Use Schulte Tables as part of a consistent cognitive training
                  routine.
                </p>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body">
                <FaChartLine className="text-4xl text-primary mb-4" />
                <h3 className="font-bold text-xl">Track Progress</h3>
                <p>
                  Measure improvements in completion time and scanning
                  efficiency over weeks and months.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-base-200">
          <div className="max-w-4xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="collapse collapse-arrow bg-base-100">
                <input type="radio" name="faq" defaultChecked />
                <div className="collapse-title text-lg font-medium">
                  What is a Schulte Table for pilots?
                </div>
                <div className="collapse-content">
                  <p>
                    A Schulte Table is a visual attention exercise used to train
                    concentration, scanning speed, and peripheral awareness.
                  </p>
                </div>
              </div>

              <div className="collapse collapse-arrow bg-base-100">
                <input type="radio" name="faq" />
                <div className="collapse-title text-lg font-medium">
                  Can Schulte Tables improve situational awareness?
                </div>
                <div className="collapse-content">
                  <p>
                    They can help train visual attention and scanning habits
                    that contribute to broader situational awareness skills.
                  </p>
                </div>
              </div>

              <div className="collapse collapse-arrow bg-base-100">
                <input type="radio" name="faq" />
                <div className="collapse-title text-lg font-medium">
                  Are Schulte Tables useful for student pilots?
                </div>
                <div className="collapse-content">
                  <p>
                    Yes. Student pilots often use focus-training exercises to
                    strengthen concentration and cognitive performance.
                  </p>
                </div>
              </div>

              <div className="collapse collapse-arrow bg-base-100">
                <input type="radio" name="faq" />
                <div className="collapse-title text-lg font-medium">
                  How long should I practice?
                </div>
                <div className="collapse-content">
                  <p>
                    Most users practice for 5–10 minutes daily and track their
                    completion times over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-8">
            Explore More Schulte Table Training
          </h2>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/schulte-table-for-athletes"
              className="btn btn-outline"
            >
              Athletes
            </Link>

            <Link
              href="/schulte-table-for-chess-players"
              className="btn btn-outline"
            >
              Chess Players
            </Link>

            <Link href="/schulte-table-for-gamers" className="btn btn-outline">
              Gamers
            </Link>

            <Link
              href="/schulte-table-for-programmers"
              className="btn btn-outline"
            >
              Programmers
            </Link>

            <Link
              href="/schulte-table-for-students"
              className="btn btn-outline"
            >
              Students
            </Link>

            <Link href="/schulte-table-for-adults" className="btn btn-outline">
              Adults
            </Link>

            <Link href="/schulte-table-for-seniors" className="btn btn-outline">
              Seniors
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
