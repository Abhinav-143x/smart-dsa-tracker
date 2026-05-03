'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Problem, TopicResponse } from '@/types';
import { ProblemCard } from '@/components/ProblemCard';
import { Search, Filter, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [topics, setTopics] = useState<TopicResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [problemsData, topicsData] = await Promise.all([
          api.getProblems({
            page,
            size: pageSize,
            topic: selectedTopic || undefined,
            difficulty: selectedDifficulty || undefined,
            search: search || undefined,
          }),
          api.getTopics(),
        ]);
        
        setProblems(problemsData.items);
        setTotalPages(problemsData.pages);
        setTopics(topicsData);
      } catch (err) {
        setError('Failed to load problems. Make sure the backend service is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [page, selectedTopic, selectedDifficulty, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedTopic(null);
    setSelectedDifficulty(null);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-6 dark:bg-black">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Problem Explorer
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Browse and search through 474+ curated DSA problems. Filter by topic and difficulty to target your practice.
          </p>
        </header>

        {/* Filters Section */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search problems, topics..."
                value={search}
                onChange={handleSearchChange}
                className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            {/* Topic Filter */}
            <select
              value={selectedTopic || ''}
              onChange={(e) => {
                setSelectedTopic(e.target.value || null);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm transition-all focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="">All Topics</option>
              {topics.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name} ({t.count})
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <div className="flex rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950">
              {['Easy', 'Medium', 'Hard'].map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setSelectedDifficulty(selectedDifficulty === d ? null : d);
                    setPage(1);
                  }}
                  className={cn(
                    "rounded-lg px-4 py-1.5 text-xs font-semibold transition-all",
                    selectedDifficulty === d
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {(search || selectedTopic || selectedDifficulty) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-zinc-300 dark:text-zinc-700" />
            <p className="text-zinc-500">Loading problems...</p>
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-red-100 bg-red-50/50 p-12 text-center dark:border-red-900/20 dark:bg-red-900/10">
            <p className="text-lg font-medium text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-red-600 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : problems.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
            <Filter className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
            <p className="text-lg font-medium text-zinc-500">No problems found matching your filters.</p>
            <button onClick={clearFilters} className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Reset all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {problems.map((p) => (
                <ProblemCard key={p.id} problem={p} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white transition-all hover:bg-zinc-50 disabled:opacity-30 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white transition-all hover:bg-zinc-50 disabled:opacity-30 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
