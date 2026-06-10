import React from "react";
import Link from "next/link";
import { Chakra_Petch } from "next/font/google";

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Schulte Table FAQ - Everything You Need to Know",
  description:
    "Frequently asked questions about Schulte Tables, focus training, concentration exercises, brain training, world records, benefits, and how to play online for free.",
  keywords: [
    "schulte table faq",
    "what is schulte table",
    "schulte table benefits",
    "schulte table online",
    "schulte table brain training",
    "schulte table focus",
    "schulte table concentration",
    "schulte table world record",
  ],
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-faq",
  },
};

const faqs = [
  {
    question: "What is a Schulte Table?",
    answer:
      "A Schulte Table is a visual attention training exercise consisting of numbers arranged randomly in a grid. The goal is to find numbers in ascending order as quickly as possible. It is widely used to improve focus, concentration, visual perception, and reading efficiency.",
  },
  {
    question: "How do you play a Schulte Table?",
    answer:
      "Start by locating the number 1 and continue finding numbers in order until you reach the highest number in the grid. The objective is to complete the grid as quickly as possible while minimizing mistakes.",
  },
  {
    question: "What are the benefits of Schulte Table training?",
    answer:
      "Regular practice can help improve concentration, visual scanning speed, peripheral awareness, mental processing speed, attention control, and focus during demanding tasks.",
  },
  {
    question: "How long should I practice each day?",
    answer:
      "Most people benefit from 3–10 minutes of daily practice. Consistency is more important than long sessions.",
  },
  {
    question: "What size grid should beginners use?",
    answer:
      "Beginners should start with a 3x3 or 4x4 grid. As performance improves, moving to 5x5 and larger grids provides a greater challenge.",
  },
  {
    question: "Is Schulte Table scientifically proven?",
    answer:
      "Research suggests visual search and attention exercises can improve certain cognitive skills. While Schulte Tables are not a miracle solution, many users find them effective for training attention and focus.",
  },
  {
    question: "Can children use Schulte Tables?",
    answer:
      "Yes. Children often enjoy Schulte Tables because they feel like a game while helping develop concentration and visual attention skills.",
  },
  {
    question: "Can adults benefit from Schulte Tables?",
    answer:
      "Absolutely. Adults commonly use Schulte Tables to improve concentration, productivity, reading speed, and mental sharpness.",
  },
  {
    question: "Can seniors use Schulte Tables?",
    answer:
      "Yes. Many seniors use Schulte Tables as a mental exercise to keep their minds active and engaged.",
  },
  {
    question: "Can Schulte Tables improve reading speed?",
    answer:
      "Schulte Tables may help improve visual scanning and peripheral awareness, which are skills often associated with efficient reading.",
  },
  {
    question: "What is the best Schulte Table size?",
    answer:
      "The 5x5 Schulte Table is considered the standard version and provides an excellent balance of challenge and accessibility.",
  },
  {
    question: "What is a good Schulte Table score?",
    answer:
      "A good score depends on grid size. For a standard 5x5 table, completing it in under 40 seconds is generally considered strong performance.",
  },
  {
    question: "What is the Schulte Table world record?",
    answer:
      "World record performances vary depending on grid size and competition rules. Visit our world record page to learn more about exceptional performances.",
  },
  {
    question: "Can I play Schulte Table online for free?",
    answer:
      "Yes. You can play Schulte Table online directly on SchulteTable.com without downloading any software.",
  },
  {
    question: "Does Schulte Table improve concentration?",
    answer:
      "Many users report improvements in concentration and attention after consistent practice. Results vary from person to person.",
  },
  {
    question: "Does Schulte Table improve memory?",
    answer:
      "Schulte Tables primarily train attention and visual search skills. Memory benefits may occur indirectly through improved concentration.",
  },
  {
    question: "How often should I practice?",
    answer:
      "Three to five sessions per week is sufficient for most users. Daily practice may produce faster improvements.",
  },
  {
    question: "Can I play on mobile devices?",
    answer:
      "Yes. SchulteTable.com is fully mobile-friendly and works on phones, tablets, laptops, and desktop computers.",
  },
  {
    question: "Can students benefit from Schulte Tables?",
    answer:
      "Students frequently use Schulte Tables to improve focus, attention span, study efficiency, and concentration during learning sessions.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function Page() {
  return (
    <div
      className={`${chakra.className} min-h-screen bg-base-100 text-base-content`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      {/* HERO */}
      <section className="hero py-16 bg-gradient-to-b from-yellow-300/20 to-transparent">
        <div className="hero-content text-center max-w-5xl">
          <div>
            <div className="badge badge-warning badge-lg mb-4">
              Complete Guide
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Schulte Table FAQ
            </h1>

            <p className="text-lg md:text-xl opacity-80 max-w-3xl mx-auto">
              Everything you need to know about Schulte Tables, focus training,
              concentration improvement, world records, reading speed, brain
              exercises, and how to play online for free.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/" className="btn btn-warning">
                Play Now
              </Link>

              <Link href="/what-is-schulte-table" className="btn btn-outline">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-title">Standard Grid</div>
            <div className="stat-value text-warning">5×5</div>
          </div>

          <div className="stat">
            <div className="stat-title">Practice Time</div>
            <div className="stat-value text-warning">3-10m</div>
          </div>

          <div className="stat">
            <div className="stat-title">Difficulty Levels</div>
            <div className="stat-value text-warning">8+</div>
          </div>
        </div>
      </section>

      {/* PLAY SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title justify-center text-3xl">
              Play Schulte Table Online
            </h2>

            <p>
              Practice your focus and concentration right now using our free
              online Schulte Table trainer.
            </p>

            <div className="card-actions justify-center mt-4">
              <Link href="/" className="btn btn-warning btn-lg">
                Start Training
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>

          <p className="opacity-70 mt-3">
            Answers to the most common Schulte Table questions.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="collapse collapse-plus bg-base-200 shadow-md"
            >
              <input type="radio" name="faq-accordion" />

              <div className="collapse-title text-xl font-semibold">
                {faq.question}
              </div>

              <div className="collapse-content">
                <p className="leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PERFORMANCE TABLE */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="text-3xl font-bold mb-6">
              Schulte Table Performance Guide
            </h2>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Grid</th>
                    <th>Beginner</th>
                    <th>Good</th>
                    <th>Excellent</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>3x3</td>
                    <td>15+ sec</td>
                    <td>10 sec</td>
                    <td>Under 7 sec</td>
                  </tr>

                  <tr>
                    <td>4x4</td>
                    <td>30+ sec</td>
                    <td>20 sec</td>
                    <td>Under 15 sec</td>
                  </tr>

                  <tr>
                    <td>5x5</td>
                    <td>60+ sec</td>
                    <td>40 sec</td>
                    <td>Under 25 sec</td>
                  </tr>

                  <tr>
                    <td>6x6</td>
                    <td>90+ sec</td>
                    <td>60 sec</td>
                    <td>Under 40 sec</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED PAGES */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center mb-8">
          Related Resources
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/what-is-schulte-table" className="btn btn-outline h-20">
            What Is Schulte Table
          </Link>

          <Link
            href="/how-to-play-schulte-table"
            className="btn btn-outline h-20"
          >
            How To Play
          </Link>

          <Link href="/schulte-table-benefits" className="btn btn-outline h-20">
            Benefits
          </Link>

          <Link
            href="/schulte-table-world-record"
            className="btn btn-outline h-20"
          >
            World Record
          </Link>

          <Link href="/schulte-table-for-kids" className="btn btn-outline h-20">
            For Kids
          </Link>

          <Link
            href="/schulte-table-for-adults"
            className="btn btn-outline h-20"
          >
            For Adults
          </Link>

          <Link
            href="/schulte-table-for-seniors"
            className="btn btn-outline h-20"
          >
            For Seniors
          </Link>

          <Link
            href="/schulte-table-for-focus"
            className="btn btn-outline h-20"
          >
            Focus Training
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="hero rounded-3xl bg-warning text-warning-content">
          <div className="hero-content text-center py-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Ready to Improve Your Focus?
              </h2>

              <p className="text-lg mb-6 max-w-2xl">
                Join thousands of players using Schulte Table exercises to train
                attention, concentration, and mental speed.
              </p>

              <Link href="/" className="btn btn-neutral btn-lg">
                Play Schulte Table Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
