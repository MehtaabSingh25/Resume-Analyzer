import Link from "next/link";
import { ArrowRight, BarChart3, FileSearch, GitCompareArrows, Target } from "lucide-react";

const features = [
  {
    title: "Resume review",
    description:
      "Upload your resume and get clear feedback on structure, strengths, gaps, and ATS readiness.",
    icon: FileSearch,
  },
  {
    title: "Version history",
    description:
      "Keep track of your uploaded resumes and see how your score changes as you improve.",
    icon: BarChart3,
  },
  {
    title: "Resume comparison",
    description:
      "Compare two resume versions to understand what improved and what still needs work.",
    icon: GitCompareArrows,
  },
  {
    title: "Career roadmap",
    description:
      "Turn missing skills into a focused plan so you know what to improve next.",
    icon: Target,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-950 text-sm text-white">
              AI
            </span>
            ResumeAI
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 sm:block"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600">
            Resume analyzer for students and job seekers
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Improve your resume before you apply.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
            ResumeAI helps you review your resume, understand weak areas,
            compare versions, and plan what to improve next before sending
            applications.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-6 font-medium text-white hover:bg-zinc-800"
            >
              Get started <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-200 px-6 font-medium text-zinc-800 hover:bg-zinc-100"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">
            What you can do
          </h2>
          <div className="mt-6 space-y-4">
            {[
              "Upload your resume as a PDF.",
              "Review your overall score and ATS score.",
              "Find strengths, weaknesses, missing skills, and suggestions.",
              "Track history and compare resume versions.",
            ].map((step, index) => (
              <div key={step} className="flex gap-4 rounded-lg bg-white p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-950 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-zinc-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-3xl font-semibold tracking-tight">
            Focused tools, no noise
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-lg border border-zinc-200 bg-white p-5">
                  <Icon size={24} />
                  <h3 className="mt-5 font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-700">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 text-sm text-zinc-600 md:flex-row md:px-8">
          <p>ResumeAI</p>
          <p>Login or sign up to review your resume.</p>
        </div>
      </footer>
    </main>
  );
}
