import { ProblemListResponse, TopicResponse, SubtopicResponse, Problem } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  async getProblems(params: {
    page?: number;
    size?: number;
    topic?: string;
    difficulty?: string;
    search?: string;
  }): Promise<ProblemListResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.size) searchParams.append('size', params.size.toString());
    if (params.topic) searchParams.append('topic', params.topic);
    if (params.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params.search) searchParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/api/v1/problems?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch problems');
    }
    return response.json();
  },

  async getProblem(id: number): Promise<Problem> {
    const response = await fetch(`${API_BASE_URL}/api/v1/problems/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch problem');
    }
    return response.json();
  },

  async getTopics(): Promise<TopicResponse[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/topics`);
    if (!response.ok) {
      throw new Error('Failed to fetch topics');
    }
    return response.json();
  },

  async getSubtopics(topic?: string): Promise<SubtopicResponse[]> {
    const url = topic 
      ? `${API_BASE_URL}/api/v1/subtopics?topic=${encodeURIComponent(topic)}`
      : `${API_BASE_URL}/api/v1/subtopics`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch subtopics');
    }
    return response.json();
  }
};
