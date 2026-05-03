'use client';

import React from 'react';
import { Problem } from '@/types';
import { cn } from '@/lib/utils';
import { ExternalLink, Video, BookOpen, Code, CheckCircle2, Circle } from 'lucide-react';

interface ProblemRowProps {
  problem: Problem;
  isSolved?: boolean;
  onToggleSolved?: (id: number) => void;
}

export const ProblemRow: React.FC<ProblemRowProps> = ({ problem, isSolved = false, onToggleSolved }) => {
  const difficultyColor = {
    Easy: 'text-green-500 border-green-500/20 bg-green-500/10',
    Medium: 'text-amber-500 border-amber-500/20 bg-amber-500/10',
    Hard: 'text-red-500 border-red-500/20 bg-red-500/10',
  }[problem.difficulty] || 'text-zinc-500 border-zinc-500/20 bg-zinc-500/10';

  return (
    <div className={cn(
      "group flex min-h-[52px] items-center gap-4 border-b border-zinc-900/50 px-6 py-2 transition-all hover:bg-zinc-800/30",
      isSolved && "bg-green-500/5"
    )}>
      {/* Status Checkbox */}
      <button 
        onClick={() => onToggleSolved?.(problem.id)}
        className="flex-shrink-0 text-zinc-600 transition-colors hover:text-green-500 focus:outline-none"
      >
        {isSolved ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      {/* ID & Title */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span className="w-10 flex-shrink-0 font-mono text-[11px] font-medium tracking-tight text-zinc-600">
          {problem.order_index.toString().padStart(3, '0')}
        </span>
        <h4 className={cn(
          "truncate text-sm font-medium transition-colors",
          isSolved ? "text-zinc-500 line-through decoration-zinc-700" : "text-zinc-200 group-hover:text-white"
        )}>
          {problem.title}
        </h4>
      </div>

      {/* Difficulty Badge */}
      <div className="hidden w-24 flex-shrink-0 justify-center sm:flex">
        <span className={cn(
          "inline-flex w-20 items-center justify-center rounded-full border py-0.5 text-[9px] font-black uppercase tracking-widest",
          difficultyColor
        )}>
          {problem.difficulty}
        </span>
      </div>

      {/* Action Links */}
      <div className="flex flex-shrink-0 items-center gap-1.5">
        {problem.leetcode_link && (
          <a
            href={problem.leetcode_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-all hover:bg-zinc-800 hover:text-[#FFA116]"
            title="LeetCode"
          >
            <Code className="h-4 w-4" />
          </a>
        )}
        {problem.source_link && (
          <a
            href={problem.source_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-all hover:bg-zinc-800 hover:text-blue-500"
            title="TakeUForward"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        {problem.article_link && (
          <a
            href={problem.article_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-all hover:bg-zinc-800 hover:text-zinc-100"
            title="Article"
          >
            <BookOpen className="h-4 w-4" />
          </a>
        )}
        {problem.youtube_link && (
          <a
            href={problem.youtube_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-all hover:bg-zinc-800 hover:text-red-500"
            title="Video"
          >
            <Video className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
};
