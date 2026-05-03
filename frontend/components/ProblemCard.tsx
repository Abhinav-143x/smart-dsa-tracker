import React from 'react';
import { Problem } from '@/types';
import { cn } from '@/lib/utils';
import { ExternalLink, Video, BookOpen, Code } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem }) => {
  const difficultyColor = {
    Easy: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
    Medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400',
    Hard: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
  }[problem.difficulty];

  return (
    <div className="group relative flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", difficultyColor)}>
              {problem.difficulty}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              #{problem.order_index}
            </span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {problem.title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {problem.topic} • {problem.subtopic}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-900">
        {problem.leetcode_link && (
          <a
            href={problem.leetcode_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
            title="Practice on LeetCode"
          >
            <Code className="h-3.5 w-3.5" />
            <span>LeetCode</span>
          </a>
        )}
        {problem.article_link && (
          <a
            href={problem.article_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
            title="Read Article"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Article</span>
          </a>
        )}
        {problem.youtube_link && (
          <a
            href={problem.youtube_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
            title="Watch Tutorial"
          >
            <Video className="h-3.5 w-3.5" />
            <span>Video</span>
          </a>
        )}
        {!problem.leetcode_link && problem.source_link && (
          <a
            href={problem.source_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
            title="Original Source"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Source</span>
          </a>
        )}
      </div>
    </div>
  );
};
