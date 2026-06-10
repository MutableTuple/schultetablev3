import Link from "next/link";
import {
  FaBookOpen,
  FaEye,
  FaBrain,
  FaBolt,
  FaClock,
  FaChartLine,
  FaCheckCircle,
  FaBook,
} from "react-icons/fa";

export const metadata = {
  title:
    "Schulte Table for Readers | Improve Reading Speed, Focus & Concentration",

  description:
    "Train your eyes and brain with Schulte Table exercises for readers. Improve reading speed, concentration, visual attention, peripheral vision, and information processing while reading books, articles, and study materials.",

  keywords: [
    "schulte table for readers",
    "reading speed training",
    "speed reading exercises",
    "reading concentration",
    "reading focus exercises",
    "visual attention training",
    "peripheral vision reading",
    "reading comprehension training",
    "brain exercises for readers",
    "schulte table reading",
    "improve reading speed",
    "focus while reading",
    "attention training for readers",
    "reading productivity",
    "reading efficiency",
  ],

  alternates: {
    canonical: "https://schultetable.com/schulte-table-for-readers",
  },

  openGraph: {
    title: "Schulte Table for Readers",
    description:
      "Improve reading speed, concentration, visual attention, and focus with Schulte Table exercises designed for readers.",
    url: "https://schultetable.com/schulte-table-for-readers",
    siteName: "Schulte Table",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Schulte Table for Readers",
    description:
      "Train concentration, eye movement, and reading efficiency using Schulte Tables.",
  },
};

export default function SchulteTableForReadersPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a Schulte Table for readers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Schulte Table is a visual attention exercise that helps readers improve concentration, eye movement efficiency, visual scanning, and reading focus.",
        },
      },
      {
        "@type": "Question",
        name: "Can Schulte Tables improve reading speed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Schulte Tables are commonly used in reading and speed-reading training because they encourage faster visual recognition and scanning abilities.",
        },
      },
      {
        "@type": "Question",
        name: "Do Schulte Tables help concentration while reading?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Regular practice can help strengthen focus and attention control, making it easier to stay engaged while reading.",
        },
      },
      {
        "@type": "Question",
        name: "Can Schulte Tables improve peripheral vision?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Schulte Tables encourage users to recognize information without constantly shifting their gaze, helping train peripheral awareness.",
        },
      },
      {
        "@type": "Question",
        name: "How often should readers practice Schulte Tables?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most readers practice for 5 to 10 minutes per day to develop stronger attention and visual processing skills.",
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
                Reading Performance Training
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Schulte Table for Readers
              </h1>

              <p className="text-xl max-w-4xl mx-auto leading-relaxed text-base-content/80">
                Improve reading speed, visual attention, concentration,
                peripheral awareness, and information processing with Schulte
                Table exercises. Readers, students, and book lovers use Schulte
                Tables to strengthen focus and develop more efficient reading
                habits.
              </p>

              <div className="mt-10">
                <Link href="/" className="btn btn-primary btn-lg rounded-full">
                  Start Reading Training
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Readers Use Schulte Table Training
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaBookOpen className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Improve Reading Speed</h3>
                <p>
                  Train your eyes to recognize information more efficiently and
                  develop faster visual scanning abilities.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaEye className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Expand Peripheral Vision</h3>
                <p>
                  Learn to process more information at once instead of focusing
                  on individual words one at a time.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaBrain className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Strengthen Focus</h3>
                <p>
                  Improve attention control and reduce distractions during long
                  reading sessions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* READING SPEED */}
        <section className="bg-base-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-8 text-center">
              Improve Reading Speed Naturally
            </h2>

            <div className="max-w-4xl mx-auto text-lg leading-relaxed space-y-6">
              <p>
                Reading speed depends on several factors including visual
                attention, concentration, eye movement efficiency, and
                information processing. Schulte Tables challenge readers to
                locate numbers quickly while maintaining awareness of the entire
                grid.
              </p>

              <p>
                This type of visual training helps encourage broader attention
                across the page rather than focusing on a single point. Many
                speed-reading programs include Schulte Tables as part of their
                training systems.
              </p>

              <p>
                While Schulte Tables are not a replacement for reading practice,
                they can complement existing reading habits by helping train
                visual attention and scanning efficiency.
              </p>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Skills Readers Can Develop
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Reading speed",
              "Visual scanning",
              "Concentration",
              "Peripheral awareness",
              "Information processing",
              "Focus endurance",
              "Pattern recognition",
              "Attention control",
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

        {/* PERIPHERAL VISION */}
        <section className="bg-base-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-8">
              Train Peripheral Vision While Reading
            </h2>

            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                One reason Schulte Tables are popular among readers is their
                connection to peripheral awareness. Readers often move their
                eyes across lines of text thousands of times during a single
                reading session.
              </p>

              <p>
                By practicing Schulte Tables, readers train themselves to
                recognize information more efficiently while maintaining
                awareness of a wider visual field.
              </p>

              <p>
                This skill is often associated with smoother reading and reduced
                visual effort during extended study sessions.
              </p>
            </div>
          </div>
        </section>

        {/* BENEFIT CARDS */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Benefits for Book Lovers and Students
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-200">
              <div className="card-body">
                <FaBolt className="text-4xl text-primary mb-4" />
                <h3 className="font-bold text-xl">
                  Faster Information Processing
                </h3>
                <p>
                  Improve the speed at which your brain recognizes and organizes
                  visual information.
                </p>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body">
                <FaClock className="text-4xl text-primary mb-4" />
                <h3 className="font-bold text-xl">Longer Focus Sessions</h3>
                <p>
                  Develop the ability to stay attentive during extended reading
                  periods.
                </p>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body">
                <FaChartLine className="text-4xl text-primary mb-4" />
                <h3 className="font-bold text-xl">Better Reading Efficiency</h3>
                <p>
                  Create stronger reading habits through consistent cognitive
                  training.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DAILY ROUTINE */}
        <section className="bg-base-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-8">
              Daily Reading Training Routine
            </h2>

            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Many readers complete a short Schulte Table session before
                reading books, studying, or working on educational material.
              </p>

              <p>
                Just 5–10 minutes of daily practice can help build consistency
                and encourage stronger concentration habits over time.
              </p>

              <p>
                Tracking completion times allows readers to monitor progress and
                stay motivated as their scanning speed improves.
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
                What is a Schulte Table for readers?
              </div>
              <div className="collapse-content">
                <p>
                  A visual attention exercise designed to improve concentration,
                  scanning speed, and reading efficiency.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-lg font-medium">
                Can Schulte Tables improve reading speed?
              </div>
              <div className="collapse-content">
                <p>
                  They are commonly used in speed-reading programs because they
                  help train visual scanning and recognition skills.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-lg font-medium">
                Do Schulte Tables improve concentration?
              </div>
              <div className="collapse-content">
                <p>
                  Regular practice can help strengthen focus and attention
                  control while reading.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-lg font-medium">
                How long should I practice?
              </div>
              <div className="collapse-content">
                <p>Most readers practice for 5–10 minutes per day.</p>
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
              href="/schulte-table-for-students"
              className="btn btn-outline"
            >
              Students
            </Link>

            <Link
              href="/schulte-table-for-programmers"
              className="btn btn-outline"
            >
              Programmers
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

            <Link href="/schulte-table-for-adults" className="btn btn-outline">
              Adults
            </Link>

            <Link href="/schulte-table-for-seniors" className="btn btn-outline">
              Seniors
            </Link>

            <Link href="/schulte-table-for-writers" className="btn btn-outline">
              Writers
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
