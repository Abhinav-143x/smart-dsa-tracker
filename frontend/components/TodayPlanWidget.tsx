'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { TodayPlan, Recommendation } from '@/types';
import { useAuth, useProgress } from '@/context/AuthContext';
import { Sparkles, CheckCircle2, Circle, ArrowRight, Loader2, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const TodayPlanWidget: React.FC = () => {
  const [plan, setPlan] = useState<TodayPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { solvedProblems, toggleSolved } = useProgress();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPlan = async () => {
      try {
        const data = await api.getTodayPlan();
        setPlan(data);
      } catch (err) {
        console.error('Failed to fetch today plan:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [isAuthenticated, solvedProblems.size]); // Refresh when solved count changes

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="mb-12 rounded-[2rem] border border-zinc-900 bg-zinc-900/20 p-8">
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (!plan || plan.recommendations.length === 0) return null;

  const progressPercentage = Math.min(100, (plan.solved_today / plan.daily_goal) * 100);

  return (
    <div className="mb-12 overflow-hidden rounded-[2rem] border border-blue-500/10 bg-gradient-to-br from-blue-500/5 to-transparent p-8 backdrop-blur-sm">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        
        {/* Header & Progress */}
        <div className="flex-1">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">Today's Execution Plan</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Smart Recommendations</p>
            </div>
          </div>

          <div className="mb-8 max-w-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Daily Goal Progress</span>
              <span className="font-mono text-xs font-bold text-blue-400">{plan.solved_today} / {plan.daily_goal} Solved</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-900 ring-1 ring-zinc-800">
              <div 
                className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <p className="text-sm font-medium leading-relaxed text-zinc-500">
            We've analyzed your progress. Here are the most impactful problems to tackle right now to stay on track.
          </p>
        </div>

        {/* Recommendations List */}
        <div className="flex-[1.5] space-y-3">
          {plan.recommendations.map((rec) => (
            <RecommendationItem 
              key={rec.problem.id} 
              rec={rec} 
              isSolved={solvedProblems.has(rec.problem.id)}
              onToggle={toggleSolved}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const RecommendationItem = ({ 
  rec, 
  isSolved, 
  onToggle 
}: { 
  rec: Recommendation; 
  isSolved: boolean;
  onToggle: (id: number) => void;
}) => {
  const { problem, reason } = rec;

  return (
    <div className={cn(
      "group relative flex items-center gap-4 rounded-2xl border p-4 transition-all hover:border-blue-500/30",
      isSolved ? "border-zinc-900 bg-zinc-900/20" : "border-zinc-800 bg-zinc-900/40"
    )}>
      <button 
        onClick={() => onToggle(problem.id)}
        className="flex-shrink-0 text-zinc-600 transition-colors hover:text-blue-500 focus:outline-none"
      >
        {isSolved ? (
          <CheckCircle2 className="h-5 w-5 text-blue-500" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs font-bold uppercase tracking-widest",
            problem.difficulty === 'Easy' ? 'text-green-500' :
            problem.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'
          )}>
            {problem.difficulty}
          </span>
          <span className="h-1 w-1 rounded-full bg-zinc-800" />
          <span className="truncate text-xs font-black uppercase tracking-widest text-blue-500/70">{reason}</span>
        </div>
        <h4 className={cn(
          "truncate text-sm font-bold transition-colors",
          isSolved ? "text-zinc-600 line-through" : "text-zinc-100 group-hover:text-white"
        )}>
          {problem.title}
        </h4>
      </div>

      <div className="flex items-center gap-2">
        <a 
          href={problem.leetcode_link || problem.source_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 transition-all hover:bg-blue-600 hover:text-white"
        >
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};
