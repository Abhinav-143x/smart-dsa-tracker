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
