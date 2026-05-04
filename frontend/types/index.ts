export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: number;
  title: string;
  topic: string;
  subtopic: string;
  difficulty: Difficulty;
  source_link?: string;
  order_index: number;
  slug: string;
  article_link?: string;
  youtube_link?: string;
  leetcode_link?: string;
  created_at: string;
}

export interface ProblemListResponse {
  items: Problem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface TopicResponse {
  name: string;
  count: number;
}

export interface SubtopicResponse {
  name: string;
  count: number;
  topic: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  created_at: string;
  last_active: string;
}

export interface UserProgress {
  id: number;
  user_id: number;
  problem_id: number;
  status: 'pending' | 'solved' | 'revised';
  completed_at?: string;
  revision_count: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface DifficultyStat {
  difficulty: string;
  total: number;
  solved: number;
}

export interface TopicStat {
  topic: string;
  total: number;
  solved: number;
}

export interface DailyActivity {
  date: string;
  count: number;
}

export interface DashboardStats {
  total_solved: number;
  total_problems: number;
  current_streak: number;
  longest_streak: number;
  difficulty_stats: DifficultyStat[];
  topic_stats: TopicStat[];
  recent_activity: DailyActivity[];
}

export interface Recommendation {
  problem: Problem;
  reason: string;
  priority: number;
}

export interface TodayPlan {
  date: string;
  recommendations: Recommendation[];
  daily_goal: number;
  solved_today: number;
}

export interface TopicCompletion {
  topic: string;
  percentage: number;
  solved: number;
  total: number;
}

export interface WeeklyActivity {
  day: string;
  count: number;
}

export interface AnalyticsReport {
  solve_velocity_7d: number;
  solve_velocity_30d: number;
  most_active_day?: string;
  topic_completion: TopicCompletion[];
  weekly_distribution: WeeklyActivity[];
  total_revision_count: number;
  estimated_completion_date?: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon_name: string;
  criteria_type: string;
  criteria_value: string;
  unlocked: boolean;
  unlocked_at?: string;
}

export interface StreakInfo {
  current_streak: number;
  longest_streak: number;
  freeze_tokens: number;
  last_solve_date?: string;
}
