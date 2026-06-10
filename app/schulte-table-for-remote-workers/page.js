import Link from "next/link";
import {
  FaHome,
  FaBrain,
  FaBullseye,
  FaLaptop,
  FaCheckCircle,
  FaClock,
  FaBolt,
  FaWifi,
} from "react-icons/fa";

export const metadata = {
  title:
    "Schulte Table for Remote Workers | Improve Focus, Productivity & Deep Work",

  description:
    "Train concentration, attention control, productivity, and deep work skills with Schulte Table exercises for remote workers. Improve focus while working from home and reduce distractions.",

  keywords: [
    "schulte table for remote workers",
    "remote work productivity",
    "work from home focus",
    "deep work training",
    "remote worker concentration",
    "attention management",
    "focus exercises",
    "brain training for remote workers",
    "productivity exercises",
    "mental performance",
    "work from home productivity",
    "remote work focus",
    "concentration training",
    "attention control",
    "cognitive performance",
  ],

  alternates: {
    canonical: "https://schultetable.com/schulte-table-for-remote-workers",
  },
};

export default function SchulteTableForRemoteWorkersPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* HERO */}
      <section className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="badge badge-primary badge-lg mb-6">
            Work From Home Brain Training
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Schulte Table for Remote Workers
          </h1>

          <p className="text-xl max-w-4xl mx-auto text-base-content/80">
            Improve focus, productivity, concentration, and deep work skills
            with Schulte Table training. Remote workers face constant
            distractions from notifications, emails, social media, and home
            environments. Schulte Tables provide a simple way to train attention
            and stay mentally sharp.
          </p>

          <div className="mt-10">
            <Link href="/" className="btn btn-primary btn-lg rounded-full">
              Start Training Now
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Remote Workers Use Schulte Tables
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="card bg-base-200">
            <div className="card-body">
              <FaBullseye className="text-4xl text-primary mb-3" />
              <h3 className="font-bold">Focus</h3>
              <p>Train sustained attention and reduce distractions.</p>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <FaLaptop className="text-4xl text-primary mb-3" />
              <h3 className="font-bold">Productivity</h3>
              <p>Improve concentration during work sessions.</p>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <FaBrain className="text-4xl text-primary mb-3" />
              <h3 className="font-bold">Mental Performance</h3>
              <p>Strengthen cognitive processing and attention control.</p>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <FaBolt className="text-4xl text-primary mb-3" />
              <h3 className="font-bold">Deep Work</h3>
              <p>Build habits that support uninterrupted work sessions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-base-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold mb-8">
            Improve Focus While Working From Home
          </h2>

          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              Remote work offers flexibility, but it also creates unique
              challenges. Notifications, household distractions, social media,
              and multitasking can reduce productivity and interrupt focus.
            </p>

            <p>
              Schulte Table exercises require rapid visual scanning and
              concentration, making them a useful attention-training activity
              before important work sessions.
            </p>

            <p>
              Many remote workers use focus-training exercises as part of their
              daily productivity routine.
            </p>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Skills Remote Workers Can Develop
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            "Focus",
            "Concentration",
            "Attention control",
            "Deep work",
            "Mental clarity",
            "Productivity",
            "Information processing",
            "Cognitive endurance",
          ].map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-4 bg-base-200 p-5 rounded-2xl"
            >
              <FaCheckCircle className="text-success text-2xl" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* REMOTE TYPES */}
      <section className="bg-base-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Great for Every Type of Remote Worker
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="card bg-base-100">
              <div className="card-body text-center">
                <FaLaptop className="text-4xl text-primary mx-auto" />
                <h3 className="font-bold">Developers</h3>
              </div>
            </div>

            <div className="card bg-base-100">
              <div className="card-body text-center">
                <FaWifi className="text-4xl text-primary mx-auto" />
                <h3 className="font-bold">Freelancers</h3>
              </div>
            </div>

            <div className="card bg-base-100">
              <div className="card-body text-center">
                <FaHome className="text-4xl text-primary mx-auto" />
                <h3 className="font-bold">Remote Employees</h3>
              </div>
            </div>

            <div className="card bg-base-100">
              <div className="card-body text-center">
                <FaClock className="text-4xl text-primary mx-auto" />
                <h3 className="font-bold">Digital Nomads</h3>
              </div>
            </div>
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
            <div className="collapse-title">
              What is a Schulte Table for remote workers?
            </div>
            <div className="collapse-content">
              <p>
                A concentration exercise designed to train focus, attention, and
                mental performance.
              </p>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="faq" />
            <div className="collapse-title">
              Can Schulte Tables improve productivity?
            </div>
            <div className="collapse-content">
              <p>
                Many people use them to strengthen concentration and reduce
                distractions.
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

          <Link
            href="/schulte-table-for-entrepreneurs"
            className="btn btn-outline"
          >
            Entrepreneurs
          </Link>

          <Link href="/schulte-table-for-designers" className="btn btn-outline">
            Designers
          </Link>

          <Link href="/schulte-table-for-teachers" className="btn btn-outline">
            Teachers
          </Link>

          <Link href="/schulte-table-for-readers" className="btn btn-outline">
            Readers
          </Link>
        </div>
      </section>
    </div>
  );
}
