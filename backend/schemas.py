from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProblemBase(BaseModel):
    title: str
    topic: str
    subtopic: str
    difficulty: str
    source_link: Optional[str] = None
    order_index: int
    slug: str
    article_link: Optional[str] = None
    youtube_link: Optional[str] = None
    leetcode_link: Optional[str] = None

class ProblemResponse(ProblemBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProblemListResponse(BaseModel):
    items: List[ProblemResponse]
    total: int
    page: int
    size: int
    pages: int

class TopicResponse(BaseModel):
    name: str
    count: int

class SubtopicResponse(BaseModel):
    name: str
    count: int
    topic: str

# --- Auth Schemas ---

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    last_active: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# --- Progress Schemas ---

class UserProgressBase(BaseModel):
    problem_id: int
    status: str = "solved"  # pending, solved, revised
    notes: Optional[str] = None

class UserProgressCreate(UserProgressBase):
    pass

class UserProgressResponse(UserProgressBase):
    id: int
    user_id: int
    completed_at: Optional[datetime] = None
    revision_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserProgressUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    revision_count: Optional[int] = None

# --- Dashboard Schemas ---

class DifficultyStat(BaseModel):
    difficulty: str
    total: int
    solved: int

class TopicStat(BaseModel):
    topic: str
    total: int
    solved: int

class DailyActivity(BaseModel):
    date: str
    count: int

class DashboardStats(BaseModel):
    total_solved: int
    total_problems: int
    current_streak: int
    longest_streak: int
    difficulty_stats: List[DifficultyStat]
    topic_stats: List[TopicStat]
    recent_activity: List[DailyActivity]

# --- Recommendation Schemas ---

class Recommendation(BaseModel):
    problem: ProblemResponse
    reason: str
    priority: int

class TodayPlan(BaseModel):
    date: str
    recommendations: List[Recommendation]
    daily_goal: int = 3
    solved_today: int

# --- Analytics Schemas ---

class TopicCompletion(BaseModel):
    topic: str
    percentage: float
    solved: int
    total: int

class WeeklyActivity(BaseModel):
    day: str
    count: int

class AnalyticsReport(BaseModel):
    solve_velocity_7d: float
    solve_velocity_30d: float
    most_active_day: Optional[str] = None
    topic_completion: List[TopicCompletion]
    weekly_distribution: List[WeeklyActivity]
    total_revision_count: int
    estimated_completion_date: Optional[str] = None
