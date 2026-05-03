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
