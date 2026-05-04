'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AnalyticsReport } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { 
  ChevronLeft, 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock, 
  BookOpen, 
  Loader2, 
  AlertCircle,
  Zap,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setError('Please login to view your analytics');
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await api.getAnalyticsReport();
        setReport(data);
      } catch (err) {
        setError('Failed to load analytics report.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [isAuthenticated, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-center">
        <AlertCircle className="mb-4 h-16 w-16 text-red-500/50" />
        <h2 className="text-2xl font-bold text-white">Analysis Failed</h2>
        <p className="mt-2 text-zinc-500">{error || 'Unable to retrieve analytics data.'}</p>
        <Link 
          href="/login" 
          className="mt-8 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-500/30">
      <header className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-white">
            <ChevronLeft className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <span className="text-xs font-black uppercase tracking-widest text-white">Performance Analytics</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Execution <span className="text-blue-500">Velocity</span></h1>
          <p className="mt-4 text-zinc-500 font-medium">Data-driven insights into your learning patterns.</p>
        </div>

        {/* Velocity Metrics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard 
            title="Solve Velocity (7D)" 
            value={`${report.solve_velocity_7d} / day`} 
            description="Average problems solved daily in the last week."
            icon={<Zap className="h-6 w-6 text-yellow-500" />}
          />
          <MetricCard 
            title="Solve Velocity (30D)" 
            value={`${report.solve_velocity_30d} / day`} 
            description="Average problems solved daily in the last month."
            icon={<TrendingUp className="h-6 w-6 text-green-500" />}
          />
          <MetricCard 
            title="Estimated Completion" 
            value={report.estimated_completion_date || 'N/A'} 
            description="Based on your 30-day velocity trend."
            icon={<Clock className="h-6 w-6 text-blue-500" />}
          />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Weekly Distribution */}
          <div className="rounded-3xl border border-zinc-900 bg-zinc-900/30 p-8">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">Weekly Pulse</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Peak Activity</p>
                <p className="text-xs font-bold text-white">{report.most_active_day}</p>
              </div>
            </div>
            <div className="flex items-end justify-between gap-4 h-48">
              {report.weekly_distribution.map((w) => {
                const maxHeight = Math.max(...report.weekly_distribution.map(d => d.count), 1);
                const height = (w.count / maxHeight) * 100;
                return (
                  <div key={w.day} className="flex flex-1 flex-col items-center gap-3">
                    <div 
                      className={cn(
                        "w-full rounded-t-xl transition-all duration-700",
                        w.count > 0 ? "bg-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]" : "bg-zinc-800"
                      )}
                      style={{ height: `${height === 0 ? 5 : height}%` }}
                    />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{w.day.substring(0, 3)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topic Performance List */}
          <div className="rounded-3xl border border-zinc-900 bg-zinc-900/30 p-8">
            <div className="mb-8 flex items-center gap-3">
              <Target className="h-5 w-5 text-blue-500" />
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">Topic Completion Rankings</h3>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-zinc-800">
              {report.topic_completion.map((t) => (
                <div key={t.topic} className="flex items-center justify-between rounded-2xl border border-zinc-800/50 bg-zinc-800/20 p-4 transition-colors hover:border-zinc-700">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-100">{t.topic}</span>
                    <span className="text-[9px] font-bold text-zinc-500">{t.solved} of {t.total} Mastered</span>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "font-mono text-sm font-black",
                      t.percentage === 100 ? "text-green-500" : 
                      t.percentage > 50 ? "text-blue-500" : "text-zinc-500"
                    )}>
                      {Math.round(t.percentage)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Impact */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
           <div className="rounded-3xl border border-zinc-900 bg-gradient-to-br from-indigo-500/5 to-transparent p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">Revision Volume</h3>
                  <p className="text-2xl font-black text-indigo-400">{report.total_revision_count}</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600 mt-1">Total Concepts Reinforced</p>
                </div>
              </div>
           </div>

           <div className="rounded-3xl border border-zinc-900 bg-gradient-to-br from-green-500/5 to-transparent p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">Growth Index</h3>
                  <p className="text-2xl font-black text-green-400">
                    {report.solve_velocity_7d > report.solve_velocity_30d ? 'Accelerating' : 'Consistent'}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600 mt-1">Short-term vs Long-term Trend</p>
                </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, description, icon }: { title: string, value: string | number, description: string, icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-zinc-900 bg-zinc-900/30 p-8 transition-all hover:border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{title}</span>
        {icon}
      </div>
      <h2 className="text-3xl font-black text-white">{value}</h2>
      <p className="mt-2 text-xs font-medium text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}
