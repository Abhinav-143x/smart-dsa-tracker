from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
import os

from database import engine, Base, get_db, Problem
import schemas

# Initialize database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart DSA Tracker API",
    description="Backend API for tracking DSA problem progress",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Smart DSA Tracker API",
        "version": "0.1.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "0.1.0"}

# --- Problem Engine Endpoints ---

@app.get("/api/v1/problems", response_model=schemas.ProblemListResponse)
def list_problems(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    topic: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Problem)
    
    # Filtering
    if topic:
        query = query.filter(Problem.topic == topic)
    if difficulty:
        query = query.filter(Problem.difficulty == difficulty)
    if search:
        search_filter = or_(
            Problem.title.ilike(f"%{search}%"),
            Problem.topic.ilike(f"%{search}%"),
            Problem.subtopic.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    # Total count for pagination
    total = query.count()
    pages = (total + size - 1) // size
    
    # Pagination and sorting
    items = query.order_by(Problem.order_index.asc()).offset((page - 1) * size).limit(size).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": pages
    }

@app.get("/api/v1/problems/{problem_id}", response_model=schemas.ProblemResponse)
def get_problem(problem_id: int, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@app.get("/api/v1/topics", response_model=List[schemas.TopicResponse])
def list_topics(db: Session = Depends(get_db)):
    topics_query = db.query(
        Problem.topic.label("name"), 
        func.count(Problem.id).label("count")
    ).group_by(Problem.topic).all()
    return topics_query

@app.get("/api/v1/subtopics", response_model=List[schemas.SubtopicResponse])
def list_subtopics(topic: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(
        Problem.subtopic.label("name"),
        func.count(Problem.id).label("count"),
        Problem.topic
    )
    if topic:
        query = query.filter(Problem.topic == topic)
    
    subtopics = query.group_by(Problem.subtopic, Problem.topic).all()
    return subtopics

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
