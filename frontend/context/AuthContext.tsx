'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, TokenResponse, UserProgress } from '../types';
import { api } from '../lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (formData: FormData) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface ProgressContextType {
  solvedProblems: Set<number>;
  progressList: UserProgress[];
  toggleSolved: (problemId: number) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = async (formData: FormData) => {
    const { access_token } = await api.login(formData);
    localStorage.setItem('token', access_token);
    await fetchUser();
    router.push('/problems');
  };

  const register = async (data: any) => {
    await api.register(data);
    // After registration, we could auto-login or redirect to login
    router.push('/login');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progressList, setProgressList] = useState<UserProgress[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(new Set());
  const { isAuthenticated } = useAuth();

  const refreshProgress = useCallback(async () => {
    if (!isAuthenticated) {
      setSolvedProblems(new Set());
      setProgressList([]);
      return;
    }
    try {
      const progress = await api.getUserProgress();
      setProgressList(progress);
      setSolvedProblems(new Set(progress.filter(p => p.status === 'solved').map(p => p.problem_id)));
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const toggleSolved = async (problemId: number) => {
    if (!isAuthenticated) {
      // Handle local state or prompt login
      return;
    }

    const isCurrentlySolved = solvedProblems.has(problemId);
    const newStatus = isCurrentlySolved ? 'pending' : 'solved';

    try {
      await api.updateProgress(problemId, newStatus);
      await refreshProgress();
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  return (
    <ProgressContext.Provider value={{ solvedProblems, progressList, toggleSolved, refreshProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
