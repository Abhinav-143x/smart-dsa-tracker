'use client';

import React, { useState } from 'react';
import { Problem } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Hash } from 'lucide-react';
import { ProblemRow } from './ProblemRow';

interface TopicAccordionProps {
  topic: string;
  problems: Problem[];
  solvedIds: Set<number>;
  onToggleSolved: (id: number) => void;
  defaultOpen?: boolean;
}

export const TopicAccordion: React.FC<TopicAccordionProps> = ({
  topic,
  problems,
  solvedIds,
  onToggleSolved,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Group problems by subtopic
  const subtopics = problems.reduce((acc, problem) => {
    if (!acc[problem.subtopic]) {
      acc[problem.subtopic] = [];
    }
    acc[problem.subtopic].push(problem);
    return acc;
  }, {} as Record<string, Problem[]>);

  const solvedCount = problems.filter(p => solvedIds.has(p.id)).length;
  const totalCount = problems.length;
  const percentage = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;
  const isAllSolved = solvedCount === totalCount && totalCount > 0;

  return (
    <div className={cn(
      "mb-6 overflow-hidden rounded-2xl border transition-all duration-300",
      isOpen 
        ? "border-zinc-800 bg-zinc-900/20 ring-1 ring-zinc-800/50 shadow-2xl" 
        : "border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-900/10"
    )}>
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between px-6 py-5 transition-all",
          isOpen && "bg-zinc-900/40"
        )}
      >
        <div className="flex items-center gap-6">
          {/* Icon/Chevron */}
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300",
            isOpen 
              ? "border-blue-500/50 bg-blue-500/10 text-blue-400" 
              : "border-zinc-800 bg-zinc-900 text-zinc-500"
          )}>
            {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>

          <div className="flex flex-col items-start text-left">
            <h3 className={cn(
              "text-lg font-black tracking-tight transition-colors sm:text-xl",
              isAllSolved ? "text-green-500" : "text-zinc-100"
            )}>
              {topic}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {solvedCount} of {totalCount} mastered
              </span>
              <span className={cn(
                "h-1 w-1 rounded-full",
                isAllSolved ? "bg-green-500" : "bg-zinc-700"
              )} />
              <span className="text-[10px] font-bold text-zinc-600">{Math.round(percentage)}%</span>
            </div>
          </div>
        </div>

        {/* Desktop Progress Ring/Bar */}
        <div className="hidden items-center gap-4 sm:flex">
          <div className="relative h-1.5 w-32 overflow-hidden rounded-full bg-zinc-800/50">
            <div
              className={cn(
                "h-full transition-all duration-700 ease-out",
                isAllSolved ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-blue-500"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="flex flex-col animate-in fade-in slide-in-from-top-2 duration-300">
          {Object.entries(subtopics).map(([subtopic, subproblems]) => (
            <div key={subtopic} className="flex flex-col border-t border-zinc-900/50">
              {/* Subtopic Header */}
              <div className="flex items-center gap-2 bg-zinc-900/30 px-6 py-3">
                <Hash className="h-3 w-3 text-blue-500/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  {subtopic}
                </span>
              </div>
              
              {/* Problems Container */}
              <div className="flex flex-col bg-zinc-950/20">
                {subproblems.map((problem) => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                    isSolved={solvedIds.has(problem.id)}
                    onToggleSolved={onToggleSolved}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
