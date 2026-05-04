'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink, Target, Trophy, Flame, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface ProgressDashboardProps {
  total: number;
  solved: number;
  easy: { total: number; solved: number };
  medium: { total: number; solved: number };
  hard: { total: number; solved: number };
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  total,
  solved,
  easy,
  medium,
  hard,
}) => {
  const { user, logout, isAuthenticated } = useAuth();
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Main Progress Section */}
          <div className="flex flex-1 items-center gap-6">
            <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <Target className="h-7 w-7" />
              <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-black text-white">
                %
              </div>
            </div>
            
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Global Proficiency</h2>
                <span className="font-mono text-sm font-bold text-zinc-100">{percentage}%</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-900 ring-1 ring-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  {solved} / {total} Completed
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Stats Section */}
          <div className="flex items-center gap-4 sm:gap-10">
            <div className="flex items-center gap-8">
              <StatItem label="Easy" solved={easy.solved} total={easy.total} color="text-green-500" />
              <StatItem label="Medium" solved={medium.solved} total={medium.total} color="text-amber-500" />
              <StatItem label="Hard" solved={hard.solved} total={hard.total} color="text-red-500" />
            </div>
            
            <div className="hidden h-10 w-px bg-zinc-900 lg:block" />
            
            <div className="flex items-center gap-3">
              <a
                href="https://takeuforward.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] active:scale-95"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">TUF</span>
              </a>

              {isAuthenticated ? (
                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-zinc-900">
                  <Link
                    href="/dashboard"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-900 bg-zinc-950 text-zinc-500 transition-all hover:border-blue-500/50 hover:text-blue-500 hover:bg-blue-500/5"
                    title="Dashboard"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                  </Link>
                  <div className="hidden flex-col items-end sm:flex">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">{user?.username}</span>
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Active Member</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-900 bg-zinc-950 text-zinc-500 transition-all hover:border-red-500/50 hover:text-red-500 hover:bg-red-500/5"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800 hover:border-zinc-700 active:scale-95"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, solved, total, color }: { label: string; solved: number; total: number; color: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">{label}</span>
    <div className="flex items-baseline gap-1.5">
      <span className={cn("text-xl font-black tabular-nums tracking-tighter", color)}>{solved}</span>
      <span className="text-[10px] font-bold text-zinc-700">/ {total}</span>
    </div>
  </div>
);
