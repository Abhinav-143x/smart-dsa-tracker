import { 
  ProblemListResponse, 
  TopicResponse, 
  SubtopicResponse, 
  Problem, 
  User, 
  UserProgress, 
  TokenResponse,
  DashboardStats,
  TodayPlan
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const api = {
  // Problems
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

    const response = await fetch(`${API_BASE_URL}/api/v1/problems?${searchParams.toString()}`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch problems');
    }
    return response.json();
  },

  async getProblem(id: number): Promise<Problem> {
    const response = await fetch(`${API_BASE_URL}/api/v1/problems/${id}`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch problem');
    }
    return response.json();
  },

  async getTopics(): Promise<TopicResponse[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/topics`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch topics');
    }
    return response.json();
  },

  async getSubtopics(topic?: string): Promise<SubtopicResponse[]> {
    const url = topic 
      ? `${API_BASE_URL}/api/v1/subtopics?topic=${encodeURIComponent(topic)}`
      : `${API_BASE_URL}/api/v1/subtopics`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch subtopics');
    }
    return response.json();
  },

  // Auth
  async login(formData: FormData): Promise<TokenResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      body: formData, // OAuth2PasswordRequestForm expects form data
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    return response.json();
  },

  async register(data: any): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }
    return response.json();
  },

  async getMe(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  },

  // Progress
  async getUserProgress(): Promise<UserProgress[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/progress`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch progress');
    }
    return response.json();
  },

  async updateProgress(problemId: number, status: string, notes?: string): Promise<UserProgress> {
    const response = await fetch(`${API_BASE_URL}/api/v1/progress`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        problem_id: problemId,
        status,
        notes,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to update progress');
    }
    return response.json();
  },

  async getProblemProgress(problemId: number): Promise<UserProgress> {
    const response = await fetch(`${API_BASE_URL}/api/v1/progress/${problemId}`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch problem progress');
    }
    return response.json();
  },

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/stats`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    return response.json();
  },

  // Recommendations
  async getTodayPlan(): Promise<TodayPlan> {
    const response = await fetch(`${API_BASE_URL}/api/v1/recommendations/today`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch today plan');
    }
    return response.json();
  }
};
