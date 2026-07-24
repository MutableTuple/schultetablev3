import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FlaskConical,
  Target,
  Zap,
  Eye,
  Brain,
  Telescope,
  ScanEye,
  CircleCheck,
  CircleAlert,
  Clock,
  History,
  BookOpen,
  Trophy,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Schulte Table Science: Research, Psychology & Cognitive Training",
  description:
    "Explore the science behind Schulte Tables — attention, visual search, concentration, and processing speed research.",
  alternates: {
    canonical: "https://www.schultetable.com/schulte-table-science",
  },
  openGraph: {
    title: "The Science Behind Schulte Tables",
    description:
      "Explore the psychology and cognitive research behind Schulte Table training.",
    url: "https://www.schultetable.com/schulte-table-science",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Science Behind Schulte Tables",
    description:
      "Explore the psychology and cognitive research behind Schulte Table training.",
  },
};

const scienceAreas = [
  {
    Icon: Target,
    title: "Selective Attention",
    desc: "Training the ability to focus on relevant targets while ignoring distractions.",
  },
  {
    Icon: Zap,
    title: "Processing Speed",
    desc: "Rapid recognition and response to visual information.",
  },
  {
    Icon: Eye,
    title: "Visual Search",
    desc: "Efficiently locating targets within a crowded visual field.",
  },
  {
    Icon: Brain,
    title: "Concentration",
    desc: "Maintaining focus during demanding tasks.",
  },
  {
    Icon: Telescope,
    title: "Peripheral Awareness",
    desc: "Expanding awareness beyond central vision.",
  },
  {
    Icon: ScanEye,
    title: "Eye Movement Control",
    desc: "Reducing inefficient scanning behaviour.",
  },
];

const cognitiveProcesses = [
  "Working Memory",
  "Pattern Recognition",
  "Visual Scanning",
  "Target Detection",
  "Attention Control",
  "Reaction Planning",
];

const supportedAreas = [
  "Attention training",
  "Visual scanning practice",
  "Concentration development",
  "Visual search efficiency",
];

const lessCertainClaims = [
  "IQ increases",
  "Permanent intelligence gains",
  "Dramatic cognitive transformation",
  "Universal effects for everyone",
];

const timeline = ["1950s", "1960s", "1980s", "2000s", "Today"];

const relatedPages = [
  {
    href: "/schulte-table-history",
    label: "The History of the Schulte Table",
    Icon: History,
  },
  {
    href: "/schulte-table-research",
    label: "Deeper Research Findings",
    Icon: BookOpen,
  },
  {
    href: "/schulte-table-world-record",
    label: "Schulte Table World Records",
    Icon: Trophy,
  },
  {
    href: "/what-is-schulte-table",
    label: "What Is a Schulte Table?",
    Icon: HelpCircle,
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Schulte Table Science: Research, Psychology & Cognitive Training",
  description:
    "Explore the science behind Schulte Tables — attention, visual search, concentration, and processing speed research.",
  author: { "@type": "Organization", name: "Schulte Table" },
  publisher: {
    "@type": "Organization",
    name: "Schulte Table",
    url: "https://www.schultetable.com/",
  },
  mainEntityOfPage: "https://www.schultetable.com/schulte-table-science",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <section className="bg-muted py-24">
        <div className="max-w-5xl mx-auto text-center px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 text-primary text-sm font-semibold px-4 py-1.5 mb-6">
            <FlaskConical size={14} />
            Cognitive Science
          </span>

          <h1 className="text-5xl md:text-7xl font-black mb-6 text-foreground">
            The Science Behind
            <br />
            Schulte Tables
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the psychology, attention research and cognitive mechanisms
            that make Schulte Tables one of the most popular visual training
            exercises in the world.
          </p>

          <div className="mt-10">
            <Button size="lg" render={<Link href="/" />}>
              Start Training
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <section className="mb-20">
          <h2 className="text-4xl font-black mb-10 text-center text-foreground">
            What Does a Schulte Table Train?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {scienceAreas.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-black mb-8 text-foreground">
            Origins in Psychology
          </h2>

          <div className="space-y-4 text-lg leading-relaxed text-foreground/90 max-w-none">
            <p>
              Schulte Tables were developed by German psychiatrist Walter
              Schulte as part of research into attention and visual perception.
              Originally, the exercise was not intended as a game. It was a
              psychodiagnostic tool used to evaluate concentration, attention
              stability and visual search efficiency.
            </p>

            <p>
              Participants were asked to locate numbers arranged randomly in a
              grid as quickly as possible. Researchers measured completion time
              and observed search behaviour. This simple task provided valuable
              insights into how individuals process visual information.
            </p>

            <p>
              Over time, the method spread into educational psychology,
              cognitive training, speed-reading programs and modern digital
              brain-training platforms.
            </p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-black mb-8 text-foreground">
            Cognitive Processes Involved
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {cognitiveProcesses.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-border bg-card p-6 text-center"
              >
                <h3 className="font-bold text-xl text-foreground">{item}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-black mb-8 text-foreground">
            What Research Suggests
          </h2>

          <div className="flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-4 mb-6">
            <CircleCheck size={20} className="text-success shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Research generally supports visual-search exercises as useful
              tools for attention practice, concentration training and visual
              processing development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-success/30 bg-success/5 p-6">
              <h3 className="font-black text-2xl mb-4 text-foreground">
                Supported Areas
              </h3>
              <ul className="space-y-2">
                {supportedAreas.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <CircleCheck size={16} className="text-success shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-warning/30 bg-warning/5 p-6">
              <h3 className="font-black text-2xl mb-4 text-foreground">
                Less Certain Claims
              </h3>
              <ul className="space-y-2">
                {lessCertainClaims.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <CircleAlert size={16} className="text-warning shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-black mb-8 text-foreground">
            Schulte Tables and Speed Reading
          </h2>

          <p className="text-lg leading-relaxed text-foreground/90">
            Schulte Tables became popular in speed-reading programs because they
            encourage wider visual span and improved awareness of multiple
            targets. Many instructors use them as supporting exercises for
            reducing unnecessary eye movements during reading.
          </p>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-black mb-8 text-foreground">
            Research Timeline
          </h2>

          <div className="grid md:grid-cols-5 gap-4">
            {timeline.map((year) => (
              <div
                key={year}
                className="rounded-2xl border border-border bg-card p-6 text-center"
              >
                <Clock
                  size={18}
                  className="text-muted-foreground mx-auto mb-2"
                />
                <h3 className="font-black text-2xl text-foreground">{year}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-black mb-6 text-foreground">
            Related Reading
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {relatedPages.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <span className="font-semibold text-foreground">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-primary text-primary-foreground rounded-3xl p-16 text-center">
          <Sparkles size={56} className="mx-auto mb-4" />

          <h2 className="text-5xl font-black mb-4">
            Experience The Science Yourself
          </h2>

          <p className="text-xl opacity-90 mb-8">
            Train attention, concentration and visual processing with free
            Schulte Table exercises.
          </p>

          <Button
            size="lg"
            className="bg-background text-primary hover:bg-background/90"
            render={<Link href="/" />}
          >
            Start Training
          </Button>
        </section>
      </div>
    </div>
  );
}
