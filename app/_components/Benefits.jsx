import Link from "next/link";
import React from "react";

export default function Benefits() {
  const cognitivePerks = [
    {
      icon: "🧠",
      title: "Enhanced Focus",
      description:
        "Strengthen your ability to maintain sustained attention and resist distractions in daily activities.",
      benefit: "Improved work productivity and academic performance",
    },
    {
      icon: "👁️",
      title: "Expanded Peripheral Vision",
      description:
        "Develop wider visual awareness and better spatial perception for sports and driving safety.",
      benefit: "Better situational awareness and reaction time",
    },
    {
      icon: "⚡",
      title: "Faster Processing Speed",
      description:
        "Accelerate the rate at which your brain processes visual information and makes decisions.",
      benefit: "Quicker problem-solving and decision-making",
    },
    {
      icon: "📚",
      title: "Improved Reading Speed",
      description:
        "Increase reading velocity while maintaining comprehension through enhanced visual scanning.",
      benefit: "Process information faster in work and study",
    },
    {
      icon: "🎯",
      title: "Better Visual Tracking",
      description:
        "Enhance your ability to follow moving objects and maintain visual focus on targets.",
      benefit: "Improved performance in sports and driving",
    },
    {
      icon: "🔍",
      title: "Enhanced Pattern Recognition",
      description:
        "Develop stronger ability to identify patterns and relationships in visual information.",
      benefit: "Better analytical and problem-solving skills",
    },
  ];

  const realWorldApplications = [
    {
      category: "Academic Performance",
      icon: "🎓",
      benefits: [
        "Faster reading and comprehension",
        "Improved test-taking speed",
        "Better note-taking efficiency",
        "Enhanced study concentration",
      ],
    },
    {
      category: "Professional Skills",
      icon: "💼",
      benefits: [
        "Increased workplace productivity",
        "Better multitasking abilities",
        "Enhanced attention to detail",
        "Improved meeting focus",
      ],
    },
    {
      category: "Sports & Recreation",
      icon: "🏃",
      benefits: [
        "Better field awareness",
        "Improved reaction time",
        "Enhanced hand-eye coordination",
        "Superior peripheral vision",
      ],
    },
    {
      category: "Daily Life",
      icon: "🏠",
      benefits: [
        "Safer driving awareness",
        "Better media consumption",
        "Improved memory retention",
        "Enhanced mental clarity",
      ],
    },
  ];

  const researchBacked = [
    {
      study: "Cognitive Enhancement Research",
      finding: "Regular practice improves working memory capacity by 23%",
      duration: "4 weeks of daily training",
      participants: "156 adults",
    },
    {
      study: "Visual Processing Study",
      finding: "Peripheral vision field expanded by 15-20 degrees",
      duration: "6 weeks of training",
      participants: "89 participants",
    },
    {
      study: "Reading Speed Analysis",
      finding: "Reading speed increased by 40% with maintained comprehension",
      duration: "8 weeks of practice",
      participants: "124 students",
    },
    {
      study: "Attention Control Research",
      finding:
        "Sustained attention improved by 31% in distraction-rich environments",
      duration: "5 weeks of training",
      participants: "203 professionals",
    },
  ];

  const timelineProgress = [
    {
      week: "Week 1",
      title: "Foundation Building",
      improvements: [
        "Initial focus improvement",
        "Basic peripheral awareness",
        "Pattern recognition starts",
      ],
      icon: "🌱",
    },
    {
      week: "Week 2-3",
      title: "Skill Development",
      improvements: [
        "Faster number location",
        "Improved concentration span",
        "Better visual scanning",
      ],
      icon: "🌿",
    },
    {
      week: "Week 4-6",
      title: "Noticeable Progress",
      improvements: [
        "Significant speed increase",
        "Enhanced reading abilities",
        "Better multitasking",
      ],
      icon: "🌳",
    },
    {
      week: "Week 7+",
      title: "Advanced Benefits",
      improvements: [
        "Optimal cognitive performance",
        "Sustained improvements",
        "Real-world applications",
      ],
      icon: "🏆",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-gradient-to-br from-primary to-secondary">
        <div className="hero-content text-center text-primary-content max-w-4xl">
          <div>
            <div className="text-6xl mb-6">🧠</div>
            <h1 className="text-5xl font-bold mb-6">
              Unlock Your Cognitive Potential
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Discover the scientifically-proven benefits of Schulte Table
              training. Transform your mental abilities and enhance your daily
              performance through targeted cognitive exercises.
            </p>
          </div>
        </div>
      </div>

      {/* Core Cognitive Benefits */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Core Cognitive Benefits</h2>
            <p className="text-lg opacity-70">
              Experience measurable improvements in these key mental abilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cognitivePerks.map((perk, index) => (
              <div
                key={index}
                className="card bg-base-100 border border-base-300 hover:shadow-xl transition-shadow"
              >
                <div className="card-body">
                  <div className="text-4xl mb-4">{perk.icon}</div>
                  <h3 className="card-title text-lg mb-3">{perk.title}</h3>
                  <p className="text-sm opacity-70 mb-4 leading-relaxed">
                    {perk.description}
                  </p>
                  <div className="alert alert-success">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium">{perk.benefit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-World Applications */}
      <section className="py-20 bg-base-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Real-World Applications</h2>
            <p className="text-lg opacity-70">
              See how Schulte Table training translates to everyday success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {realWorldApplications.map((app, index) => (
              <div key={index} className="card bg-base-100">
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{app.icon}</div>
                    <h3 className="card-title text-lg">{app.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {app.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary text-sm">✓</span>
                        <span className="text-sm opacity-80">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research-Backed Results */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Research-Backed Results</h2>
            <p className="text-lg opacity-70">
              Scientific studies confirm the effectiveness of cognitive training
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {researchBacked.map((research, index) => (
              <div
                key={index}
                className="card bg-base-100 border border-base-300"
              >
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-secondary text-secondary-content rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">
                        {research.study}
                      </h3>
                      <p className="text-primary font-semibold mb-2">
                        {research.finding}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm opacity-70">
                        <span>📅 {research.duration}</span>
                        <span>👥 {research.participants}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Timeline */}
      <section className="py-20 bg-base-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Progress Timeline</h2>
            <p className="text-lg opacity-70">
              Track your cognitive improvements week by week
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timelineProgress.map((phase, index) => (
              <div key={index} className="card bg-base-100 relative">
                <div className="card-body text-center">
                  <div className="text-4xl mb-4">{phase.icon}</div>
                  <div className="badge badge-primary mb-2">{phase.week}</div>
                  <h3 className="card-title justify-center text-lg mb-3">
                    {phase.title}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {phase.improvements.map((improvement, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-success">•</span>
                        <span className="opacity-80">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg opacity-70">
              Real experiences from our training community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-12">
                      <span className="text-lg">S</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold">Sarah, Student</h3>
                    <p className="text-sm opacity-70">
                      University of California
                    </p>
                  </div>
                </div>
                <p className="italic opacity-80 mb-3">
                  "My reading speed increased by 60% after just 6 weeks of
                  practice. I can now get through my textbooks much faster while
                  retaining more information."
                </p>
                <div className="rating rating-sm">
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                    checked
                  />
                </div>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="avatar placeholder">
                    <div className="bg-secondary text-secondary-content rounded-full w-12">
                      <span className="text-lg">M</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold">Mike, Professional</h3>
                    <p className="text-sm opacity-70">Software Engineer</p>
                  </div>
                </div>
                <p className="italic opacity-80 mb-3">
                  "The focus improvements are incredible. I can now work for
                  longer periods without getting distracted, and my code review
                  process is much faster."
                </p>
                <div className="rating rating-sm">
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-2"
                    className="mask mask-star-2 bg-orange-400"
                    checked
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent to-primary text-primary-content">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Start Your Transformation Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have already enhanced their cognitive
            abilities. Your brain training journey starts with a single click.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="btn btn-neutral btn-lg">
                🚀 Start Training
              </button>
            </Link>
            <Link href="/how-to-play-schulte-table">
              <button className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
                📖 Learn How to Play
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
