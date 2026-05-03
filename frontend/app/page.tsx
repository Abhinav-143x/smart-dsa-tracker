import Link from "next/link";
import { ChevronRight, Target, BarChart3, Clock, LayoutDashboard, BrainCircuit } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-900">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
            <Target className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Smart DSA</span>
        </div>
        <div className="hidden items-center gap-8 sm:flex">
          <Link href="/problems" className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">
            Problems
          </Link>
          <Link href="#" className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">
            Dashboard
          </Link>
          <Link href="#" className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">
            Analytics
          </Link>
        </div>
        <button className="rounded-full bg-black px-5 py-2 text-sm font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
          Get Started
        </button>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-24 text-center sm:py-32">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              Now with 474+ Problems
            </div>
            <h1 className="mb-8 text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl">
              Master DSA with <span className="text-blue-600">Intelligence</span>.
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
              The Smart DSA Tracker is a focused execution system for Striver DSA Sheet users. Track progress, visualize streaks, and get smart recommendations for daily practice.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/problems"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-black px-8 text-lg font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 sm:w-auto"
              >
                Browse Problems
                <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="flex h-14 w-full items-center justify-center rounded-full border border-zinc-200 px-8 text-lg font-bold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-900 sm:w-auto"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-zinc-50 px-6 py-24 dark:bg-zinc-950 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              Engineered for consistency.
            </h2>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Deep Analytics</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Identify your weak topics and track your improvement velocity over time with detailed charts and heatmaps.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Smart Today Plan</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Our recommendation engine prioritizes unfinished easy problems and areas needing revision to keep you on track.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Sheet Integration</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Native support for the Striver A2Z DSA sheet, ensuring you follow the most effective path to mastery.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100 px-6 py-12 dark:border-zinc-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-zinc-400" />
            <span className="text-sm font-semibold text-zinc-500">Smart DSA Tracker</span>
          </div>
          <p className="text-sm text-zinc-500">
            &copy; 2026 Smart DSA. Built for learners.
          </p>
        </div>
      </footer>
    </div>
  );
}
