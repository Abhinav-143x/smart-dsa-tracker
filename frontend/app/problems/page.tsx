'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { api } from '@/lib/api';
import { Problem, TopicResponse } from '@/types';
import { ProgressDashboard } from '@/components/ProgressDashboard';
import { TopicAccordion } from '@/components/TopicAccordion';
import { Search, Filter, Loader2, X, Command, Code2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const problemsData = await api.getProblems({ size: 1000 });
        setProblems(problemsData.items);
      } catch (err) {
        setError('Failed to load problems. Make sure the backend service is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter and Group problems
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchesSearch = search === '' || 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.topic.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = !selectedDifficulty || p.difficulty === selectedDifficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [problems, search, selectedDifficulty]);

  const groupedProblems = useMemo(() => {
    return filteredProblems.reduce((acc, problem) => {
      if (!acc[problem.topic]) acc[problem.topic] = [];
      acc[problem.topic].push(problem);
      return acc;
    }, {} as Record<string, Problem[]>);
  }, [filteredProblems]);

  // Progress metrics
  const stats = useMemo(() => {
    const getStats = (diff?: string) => {
      const filtered = diff ? problems.filter(p => p.difficulty === diff) : problems;
      return {
        total: filtered.length,
        solved: filtered.filter(p => solvedIds.has(p.id)).length
      };
    };

    return {
      total: problems.length,
      solved: solvedIds.size,
      easy: getStats('Easy'),
      medium: getStats('Medium'),
      hard: getStats('Hard'),
    };
  }, [problems, solvedIds]);

  const handleToggleSolved = (id: number) => {
    setSolvedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30">
      <ProgressDashboard 
        total={stats.total}
        solved={stats.solved}
        easy={stats.easy}
        medium={stats.medium}
        hard={stats.hard}
      />

      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero Header */}
        <div className="relative mb-20">
          <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative">
            <div className="mb-4 flex items-center gap-3 text-blue-500">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official Roadmap</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Striver's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">A2Z</span> Sheet
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-zinc-500">
              Master the curriculum trusted by thousands. This tracker keeps your progress high-fidelity 
              and your practice consistent.
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              placeholder="Search by topic, pattern or problem name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 w-full rounded-2xl border border-zinc-900 bg-zinc-950 px-12 text-sm text-zinc-100 transition-all focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 placeholder:text-zinc-700"
            />
          </div>

          <div className="flex items-center gap-3">
            {['Easy', 'Medium', 'Hard'].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                className={cn(
                  "h-11 rounded-xl border px-6 text-[10px] font-black uppercase tracking-widest transition-all",
                  selectedDifficulty === d
                    ? {
                        'Easy': 'border-green-500/50 bg-green-500/10 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]',
                        'Medium': 'border-amber-500/50 bg-amber-500/10 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]',
                        'Hard': 'border-red-500/50 bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]',
                      }[d]
                    : "border-zinc-900 bg-zinc-950 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300"
                )}
              >
                {d}
              </button>
            ))}
            
            {(search || selectedDifficulty) && (
              <button
                onClick={() => {setSearch(''); setSelectedDifficulty(null);}}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-900 bg-zinc-950 text-zinc-500 transition-all hover:border-red-500/50 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex h-96 flex-col items-center justify-center gap-6">
             <div className="h-12 w-12 rounded-full border-2 border-zinc-800 border-t-blue-500 animate-spin" />
             <div className="flex flex-col items-center gap-1">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Syncing Intelligence</span>
               <span className="text-xs font-bold text-zinc-800">Please wait...</span>
             </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-6 rounded-[2rem] border border-red-500/10 bg-red-500/5 p-20 text-center">
            <div className="rounded-2xl bg-red-500/10 p-4 ring-1 ring-red-500/20">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <div className="max-w-md">
              <h3 className="text-2xl font-black text-white mb-3">Transmission Failed</h3>
              <p className="text-zinc-500 mb-8 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-white px-10 py-4 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-zinc-200 active:scale-95"
              >
                Retry Connection
              </button>
            </div>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 rounded-[2rem] border-2 border-dashed border-zinc-900 py-32 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 text-zinc-800">
              <Search className="h-10 w-10" />
            </div>
            <div className="max-w-xs">
              <p className="text-xl font-black text-zinc-400">Zero matches</p>
              <p className="mt-2 text-sm font-medium text-zinc-600">No problems found for your current filter configuration.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {Object.entries(groupedProblems).map(([topic, topicProblems]) => (
              <TopicAccordion
                key={topic}
                topic={topic}
                problems={topicProblems}
                solvedIds={solvedIds}
                onToggleSolved={handleToggleSolved}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="mt-40 border-t border-zinc-900 bg-black/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
            <div className="flex flex-col items-center gap-4 md:items-start">
               <div className="flex items-center gap-2 text-zinc-400">
                 <Sparkles className="h-4 w-4 text-blue-500" />
                 <span className="text-xs font-black uppercase tracking-[0.2em]">Smart DSA Tracker</span>
               </div>
               <p className="text-sm font-bold text-zinc-700">Precision Practice. Optimized Results.</p>
            </div>
            <div className="h-10 w-px bg-zinc-900 hidden md:block" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-800">
              © 2026 Smart DSA • For Private Practice Only
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
