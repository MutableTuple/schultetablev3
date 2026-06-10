import Link from "next/link";
import {
  FaChalkboardTeacher,
  FaBrain,
  FaBullseye,
  FaClock,
  FaBook,
  FaCheckCircle,
  FaLightbulb,
  FaGraduationCap,
} from "react-icons/fa";

export const metadata = {
  title:
    "Schulte Table for Teachers | Improve Focus, Attention & Mental Performance",

  description:
    "Train concentration, attention control, focus, and mental performance with Schulte Table exercises for teachers. Improve classroom productivity, information processing, and cognitive skills.",

  keywords: [
    "schulte table for teachers",
    "teacher focus training",
    "teacher concentration exercises",
    "attention training for teachers",
    "teacher productivity",
    "mental performance for teachers",
    "brain exercises for teachers",
    "classroom focus",
    "cognitive training",
    "teacher attention control",
    "focus exercises",
    "concentration training",
    "teacher brain training",
    "mental clarity",
    "schulte table teacher",
  ],

  alternates: {
    canonical: "https://schultetable.com/schulte-table-for-teachers",
  },

  openGraph: {
    title: "Schulte Table for Teachers",
    description:
      "Improve concentration, focus, attention control, and cognitive performance with Schulte Table training.",
    url: "https://schultetable.com/schulte-table-for-teachers",
    siteName: "Schulte Table",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Schulte Table for Teachers",
    description:
      "Train attention, concentration, and classroom focus with Schulte Table exercises.",
  },
};

export default function SchulteTableForTeachersPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a Schulte Table for teachers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Schulte Table is a visual attention exercise that helps teachers improve concentration, focus, attention control, and cognitive performance.",
        },
      },
      {
        "@type": "Question",
        name: "Can Schulte Tables improve concentration?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Many educators use Schulte Tables as a simple way to train concentration and sustained attention.",
        },
      },
      {
        "@type": "Question",
        name: "Do Schulte Tables help teachers focus?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Schulte Tables are commonly used to strengthen attention control and reduce mental distractions.",
        },
      },
      {
        "@type": "Question",
        name: "Can teachers use Schulte Tables daily?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Many people practice Schulte Tables for 5–10 minutes daily as part of their mental training routine.",
        },
      },
      {
        "@type": "Question",
        name: "Do Schulte Tables improve attention control?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Regular practice encourages stronger visual attention and concentration skills.",
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
                Educator Brain Training
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Schulte Table for Teachers
              </h1>

              <p className="text-xl max-w-4xl mx-auto leading-relaxed text-base-content/80">
                Improve focus, concentration, attention control, classroom
                awareness, and mental performance with Schulte Table exercises.
                Teachers constantly manage information, students, lessons, and
                classroom activities, making strong cognitive skills essential
                for success.
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
            Why Teachers Use Schulte Table Training
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaBullseye className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Improve Focus</h3>
                <p>
                  Strengthen your ability to stay focused during lesson
                  planning, grading, teaching, and classroom management.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaBrain className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Mental Performance</h3>
                <p>
                  Train concentration and cognitive processing skills that help
                  support effective teaching.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaGraduationCap className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Classroom Awareness</h3>
                <p>
                  Develop stronger attention skills while managing multiple
                  classroom activities simultaneously.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOCUS */}
        <section className="bg-base-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-8 text-center">
              Improve Focus During Busy School Days
            </h2>

            <div className="max-w-4xl mx-auto text-lg leading-relaxed space-y-6">
              <p>
                Teachers manage lesson plans, student questions, grading,
                assessments, meetings, and classroom activities throughout the
                day. Maintaining concentration can be challenging when so many
                responsibilities compete for attention.
              </p>

              <p>
                Schulte Tables challenge users to rapidly identify information
                while maintaining awareness of an entire visual field. This
                encourages attention control and concentration.
              </p>

              <p>
                Many educators use focus-training exercises to stay mentally
                sharp and productive throughout the school day.
              </p>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Skills Teachers Can Develop
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Concentration",
              "Attention control",
              "Mental clarity",
              "Productivity",
              "Information processing",
              "Classroom awareness",
              "Focus",
              "Cognitive performance",
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

        {/* ATTENTION MANAGEMENT */}
        <section className="bg-base-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-8">
              Train Attention Management Skills
            </h2>

            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Effective teaching often requires paying attention to multiple
                sources of information at once. Teachers monitor student
                engagement, classroom behavior, lesson progress, and learning
                outcomes simultaneously.
              </p>

              <p>
                Schulte Table exercises help train visual attention and
                information processing skills that can support stronger focus
                habits.
              </p>

              <p>
                Consistent practice can help educators build mental endurance
                and maintain concentration throughout demanding schedules.
              </p>
            </div>
          </div>
        </section>

        {/* TEACHER TYPES */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Benefits for Different Educators
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <FaChalkboardTeacher className="text-4xl text-primary mb-3" />
                <h3 className="font-bold">Classroom Teachers</h3>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <FaBook className="text-4xl text-primary mb-3" />
                <h3 className="font-bold">Tutors</h3>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <FaLightbulb className="text-4xl text-primary mb-3" />
                <h3 className="font-bold">Online Educators</h3>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <FaGraduationCap className="text-4xl text-primary mb-3" />
                <h3 className="font-bold">Professors</h3>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTIVITY */}
        <section className="bg-base-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-8">
              Enhance Mental Performance and Clarity
            </h2>

            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Teaching requires sustained mental effort. From preparing
                lessons to answering questions and evaluating student work,
                educators rely heavily on cognitive performance every day.
              </p>

              <p>
                Schulte Tables provide a quick mental warm-up exercise that many
                people use before focused work sessions.
              </p>

              <p>
                A short 5–10 minute session each day can become part of a
                productive routine that supports concentration and mental
                readiness.
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
                What is a Schulte Table for teachers?
              </div>
              <div className="collapse-content">
                <p>
                  A visual attention exercise designed to improve focus,
                  concentration, and cognitive performance.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-lg font-medium">
                Can Schulte Tables improve concentration?
              </div>
              <div className="collapse-content">
                <p>
                  Many people use Schulte Tables to train attention and
                  concentration skills.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-lg font-medium">
                How long should teachers practice?
              </div>
              <div className="collapse-content">
                <p>Most users practice for 5–10 minutes per day.</p>
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

            <Link href="/schulte-table-for-readers" className="btn btn-outline">
              Readers
            </Link>

            <Link href="/schulte-table-for-writers" className="btn btn-outline">
              Writers
            </Link>

            <Link
              href="/schulte-table-for-programmers"
              className="btn btn-outline"
            >
              Programmers
            </Link>

            <Link
              href="/schulte-table-for-entrepreneurs"
              className="btn btn-outline"
            >
              Entrepreneurs
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
