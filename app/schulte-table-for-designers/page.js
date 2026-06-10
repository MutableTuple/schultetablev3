import Link from "next/link";
import {
  FaPalette,
  FaEye,
  FaBrain,
  FaBolt,
  FaSearch,
  FaCheckCircle,
  FaPaintBrush,
  FaLightbulb,
} from "react-icons/fa";

export const metadata = {
  title:
    "Schulte Table for Designers | Improve Focus, Visual Attention & Creativity",

  description:
    "Train visual attention, concentration, pattern recognition, and creative focus with Schulte Table exercises for designers. Improve attention to detail, visual processing, and design productivity.",

  keywords: [
    "schulte table for designers",
    "designer focus training",
    "visual attention exercises",
    "creative focus",
    "pattern recognition training",
    "graphic designer productivity",
    "design concentration exercises",
    "visual processing training",
    "attention to detail exercises",
    "creative productivity",
    "brain training for designers",
    "ui ux designer focus",
    "visual scanning training",
    "creative concentration",
    "designer mental performance",
  ],

  alternates: {
    canonical: "https://schultetable.com/schulte-table-for-designers",
  },

  openGraph: {
    title: "Schulte Table for Designers",
    description:
      "Improve visual attention, pattern recognition, creative focus, and concentration with Schulte Table training.",
    url: "https://schultetable.com/schulte-table-for-designers",
    siteName: "Schulte Table",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Schulte Table for Designers",
    description:
      "Train focus, attention to detail, visual processing, and creativity with Schulte Tables.",
  },
};

export default function SchulteTableForDesignersPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a Schulte Table for designers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Schulte Table is a visual attention exercise that helps designers improve concentration, pattern recognition, visual scanning, and focus.",
        },
      },
      {
        "@type": "Question",
        name: "Can Schulte Tables improve attention to detail?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Many designers use Schulte Tables to train visual awareness and observation skills that support attention to detail.",
        },
      },
      {
        "@type": "Question",
        name: "Do Schulte Tables help designers focus?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Schulte Tables are commonly used as concentration exercises that help improve focus and attention control.",
        },
      },
      {
        "@type": "Question",
        name: "Can designers use Schulte Tables daily?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Many designers practice Schulte Tables for 5–10 minutes daily as part of their productivity routine.",
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
                Designer Brain Training
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-6">
                Schulte Table for Designers
              </h1>

              <p className="text-xl max-w-4xl mx-auto leading-relaxed text-base-content/80">
                Improve visual attention, creative focus, concentration,
                observation skills, and pattern recognition with Schulte Table
                training. Graphic designers, UI designers, UX designers, web
                designers, and digital artists can use Schulte Tables to
                strengthen the cognitive skills needed for high-quality creative
                work.
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
            Why Designers Use Schulte Table Training
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaEye className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Visual Attention</h3>
                <p>
                  Train your ability to notice details, patterns, and visual
                  relationships more effectively.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaSearch className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Pattern Recognition</h3>
                <p>
                  Improve the ability to identify visual structures, layouts,
                  and design elements quickly.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <FaBrain className="text-5xl text-primary mb-4" />
                <h3 className="card-title">Creative Focus</h3>
                <p>
                  Strengthen concentration and reduce distractions during
                  creative projects.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VISUAL ATTENTION */}
        <section className="bg-base-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-8 text-center">
              Improve Visual Attention and Observation
            </h2>

            <div className="max-w-4xl mx-auto text-lg leading-relaxed space-y-6">
              <p>
                Design work depends heavily on observation. Whether you're
                creating interfaces, logos, illustrations, websites, or digital
                products, the ability to notice subtle details is a valuable
                skill.
              </p>

              <p>
                Schulte Tables challenge users to rapidly locate information
                while maintaining awareness of the entire visual field. This
                encourages stronger visual attention and observation habits.
              </p>

              <p>
                Many designers use cognitive exercises to stay mentally sharp
                and maintain high levels of creative performance.
              </p>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Skills Designers Can Develop
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Visual attention",
              "Pattern recognition",
              "Creative focus",
              "Attention to detail",
              "Visual scanning",
              "Information processing",
              "Concentration",
              "Design productivity",
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

        {/* DETAIL */}
        <section className="bg-base-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-8">
              Develop Better Attention to Detail
            </h2>

            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Small details often make the difference between average and
                exceptional design. Alignment, spacing, hierarchy, typography,
                and consistency all require careful observation.
              </p>

              <p>
                Schulte Table exercises encourage designers to stay visually
                engaged and process information efficiently.
              </p>

              <p>
                Regular training can help build habits that support more careful
                design review and quality control.
              </p>
            </div>
          </div>
        </section>

        {/* DESIGN TYPES */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Benefits for Different Types of Designers
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <FaPalette className="text-4xl text-primary mb-3" />
                <h3 className="font-bold">Graphic Designers</h3>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <FaPaintBrush className="text-4xl text-primary mb-3" />
                <h3 className="font-bold">UI Designers</h3>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <FaLightbulb className="text-4xl text-primary mb-3" />
                <h3 className="font-bold">UX Designers</h3>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body items-center text-center">
                <FaBolt className="text-4xl text-primary mb-3" />
                <h3 className="font-bold">Digital Artists</h3>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTIVITY */}
        <section className="bg-base-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold mb-8">
              Boost Creative Productivity
            </h2>

            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Creative professionals often juggle multiple projects, client
                revisions, design systems, and deadlines simultaneously.
              </p>

              <p>
                Schulte Tables provide a simple mental warm-up exercise that can
                help transition your brain into a focused working state before
                starting creative work.
              </p>

              <p>
                Many designers incorporate concentration exercises into their
                daily routine to improve consistency and productivity.
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
                What is a Schulte Table for designers?
              </div>
              <div className="collapse-content">
                <p>
                  A visual attention exercise that helps designers train focus,
                  observation, and concentration.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-lg font-medium">
                Can Schulte Tables improve attention to detail?
              </div>
              <div className="collapse-content">
                <p>
                  Many users practice Schulte Tables to strengthen visual
                  awareness and observation skills.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq" />
              <div className="collapse-title text-lg font-medium">
                How long should designers practice?
              </div>
              <div className="collapse-content">
                <p>Most people practice for 5–10 minutes daily.</p>
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

            <Link href="/schulte-table-for-writers" className="btn btn-outline">
              Writers
            </Link>

            <Link
              href="/schulte-table-for-entrepreneurs"
              className="btn btn-outline"
            >
              Entrepreneurs
            </Link>

            <Link href="/schulte-table-for-gamers" className="btn btn-outline">
              Gamers
            </Link>

            <Link
              href="/schulte-table-for-students"
              className="btn btn-outline"
            >
              Students
            </Link>

            <Link
              href="/schulte-table-for-chess-players"
              className="btn btn-outline"
            >
              Chess Players
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
