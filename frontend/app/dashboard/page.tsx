'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { DashboardStats, Achievement, StreakInfo } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { 
  Trophy, 
  Flame, 
  Target, 
  ChevronLeft, 
  Activity, 
  BarChart3, 
  PieChart, 
  Calendar,
  Loader2,
  AlertCircle,
  Zap,
  Award,
  ShieldCheck,
  Star,
  Layout
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setError('Please login to view your dashboard');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, achData, streakData] = await Promise.all([
          api.getDashboardStats(),
          api.getAchievements(),
          api.getStreakInfo()
        ]);
        setStats(statsData);
        setAchievements(achData);
        setStreakInfo(streakData);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-center">
        <AlertCircle className="mb-4 h-16 w-16 text-red-500/50" />
        <h2 className="text-2xl font-bold text-white">Access Restricted</h2>
        <p className="mt-2 text-zinc-500">{error || 'Unable to retrieve dashboard data.'}</p>
        <Link 
          href="/login" 
          className="mt-8 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const overallPercentage = Math.round((stats.total_solved / stats.total_problems) * 100);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-500/30">
      <header className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/problems" className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-white">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Sheet</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link 
              href="/analytics" 
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-zinc-800 hover:border-zinc-700 active:scale-95"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Advanced Analytics</span>
            </Link>
            <div className="text-right ml-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Authenticated as</p>
              <p className="text-sm font-bold text-white">{user?.username}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-zinc-950">
                <span className="text-xs font-black text-white">{user?.username?.[0]?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Dashboard <span className="text-blue-500">Intelligence</span></h1>
          <p className="mt-4 text-zinc-500 font-medium">Visualizing your path to mastery.</p>
        </div>

        {/* Grid Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Solved" 
            value={stats.total_solved} 
            subtitle={`${stats.total_problems} Total Problems`} 
            icon={<Trophy className="h-6 w-6 text-amber-500" />}
            color="border-amber-500/20 bg-amber-500/5"
          />
          <StatCard 
            title="Current Streak" 
            value={`${stats.current_streak} Days`} 
            subtitle={`Longest: ${stats.longest_streak} Days`} 
            icon={<Flame className="h-6 w-6 text-orange-500" />}
            color="border-orange-500/20 bg-orange-500/5"
          />
          <StatCard 
            title="Overall Mastery" 
            value={`${overallPercentage}%`} 
            subtitle="Curriculum Completion" 
            icon={<Target className="h-6 w-6 text-blue-500" />}
            color="border-blue-500/20 bg-blue-500/5"
          />
          <StatCard 
            title="Streak Protection" 
            value={streakInfo?.freeze_tokens || 0} 
            subtitle="Freeze Tokens Available" 
            icon={<ShieldCheck className="h-6 w-6 text-blue-400" />}
            color="border-blue-400/20 bg-blue-400/5"
          />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Achievements Section */}
          <div className="rounded-3xl border border-zinc-900 bg-zinc-900/30 p-8 lg:col-span-1">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-blue-500" />
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">Milestones</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                {achievements.filter(a => a.unlocked).length} / {achievements.length}
              </span>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
              {achievements.map((ach) => (
                <div 
                  key={ach.id} 
                  className={cn(
                    "flex items-start gap-4 rounded-2xl border p-4 transition-all",
                    ach.unlocked ? "border-blue-500/20 bg-blue-500/5" : "border-zinc-800 bg-zinc-900/20 opacity-50"
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
                    ach.unlocked ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-zinc-800 text-zinc-600"
                  )}>
                    {getAchievementIcon(ach.icon_name)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-100">{ach.name}</h4>
                    <p className="mt-1 text-[10px] font-medium leading-relaxed text-zinc-500">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div className="rounded-3xl border border-zinc-900 bg-zinc-900/30 p-8 lg:col-span-1">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PieChart className="h-5 w-5 text-blue-500" />
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">Difficulty Bias</h3>
              </div>
            </div>
            <div className="space-y-6">
              {stats.difficulty_stats.map((d) => (
                <div key={d.difficulty}>
                  <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-zinc-500">{d.difficulty}</span>
                    <span className="text-zinc-100">{d.solved} / {d.total}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800 ring-1 ring-zinc-800">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        d.difficulty === 'Easy' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' :
                        d.difficulty === 'Medium' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' :
                        'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                      )}
                      style={{ width: `${(d.solved / d.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="rounded-3xl border border-zinc-900 bg-zinc-900/30 p-8 lg:col-span-2">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">Consistency Matrix</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Last 14 Days</span>
            </div>
            
            <div className="flex items-end justify-between gap-2 h-40">
              {stats.recent_activity.map((a, i) => {
                const height = Math.min(100, (a.count / 10) * 100); // Scale 10 problems as 100%
                return (
                  <div key={a.date} className="group relative flex flex-1 flex-col items-center gap-2">
                    <div className="absolute -top-10 hidden rounded bg-zinc-800 px-2 py-1 text-[10px] font-bold text-white group-hover:block">
                      {a.count} Solved
                    </div>
                    <div 
                      className={cn(
                        "w-full rounded-t-lg transition-all duration-500",
                        a.count > 0 ? "bg-blue-500/40 hover:bg-blue-500" : "bg-zinc-800"
                      )}
                      style={{ height: `${height === 0 ? 10 : height}%` }}
                    />
                    <span className="text-[9px] font-bold text-zinc-600">
                      {new Date(a.date).toLocaleDateString(undefined, { day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Topic Proficiency */}
        <div className="mt-6 rounded-3xl border border-zinc-900 bg-zinc-900/30 p-8">
          <div className="mb-8 flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">Topic Proficiency</h3>
          </div>
          <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {stats.topic_stats.filter(t => t.solved > 0).sort((a, b) => (b.solved / b.total) - (a.solved / a.total)).map((t) => (
              <div key={t.topic} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="truncate text-[10px] font-black uppercase tracking-wider text-zinc-500">{t.topic}</span>
                  <span className="font-mono text-[10px] font-bold text-zinc-100">{Math.round((t.solved / t.total) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div 
                    className="h-full bg-blue-500/50"
                    style={{ width: `${(t.solved / t.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {stats.topic_stats.filter(t => t.solved === 0).length > 0 && (
              <div className="flex items-center gap-2 text-zinc-700 italic text-[10px] font-bold uppercase tracking-widest">
                + {stats.topic_stats.filter(t => t.solved === 0).length} Topics Untouched
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }: { title: string, value: string | number, subtitle: string, icon: React.ReactNode, color: string }) {
  return (
    <div className={cn("rounded-3xl border p-6 transition-all hover:scale-[1.02]", color)}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{title}</span>
        {icon}
      </div>
      <div className="mt-4">
        <h2 className="text-3xl font-black text-white">{value}</h2>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">{subtitle}</p>
      </div>
    </div>
  );
}

function getAchievementIcon(name: string) {
  switch (name) {
    case 'Zap': return <Zap className="h-5 w-5" />;
    case 'Flame': return <Flame className="h-5 w-5" />;
    case 'Trophy': return <Trophy className="h-5 w-5" />;
    case 'Layout': return <Layout className="h-5 w-5" />;
    case 'Award': return <Award className="h-5 w-5" />;
    case 'Star': return <Star className="h-5 w-5" />;
    default: return <Target className="h-5 w-5" />;
  }
}
