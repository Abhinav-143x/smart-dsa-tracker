from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
from datetime import datetime, timedelta
import os
import random
import calendar

from database import engine, Base, get_db, Problem, User, UserProgress, Streak, Achievement, UserAchievement
import schemas
import auth

# Initialize database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart DSA Tracker API",
    description="Backend API for tracking DSA problem progress",
    version="0.1.0"
)

# --- Helper Functions ---

def init_achievements(db: Session):
    """Seed default achievements if they don't exist"""
    default_achievements = [
        {"name": "First Blood", "description": "Solve your first problem.", "icon_name": "Zap", "criteria_type": "solve_count", "criteria_value": "1"},
        {"name": "Consistency Starter", "description": "Achieve a 3-day streak.", "icon_name": "Flame", "criteria_type": "streak_count", "criteria_value": "3"},
        {"name": "Weekly Warrior", "description": "Achieve a 7-day streak.", "icon_name": "Trophy", "criteria_type": "streak_count", "criteria_value": "7"},
        {"name": "Array Apprentice", "description": "Solve 10 Array problems.", "icon_name": "Layout", "criteria_type": "topic_completion", "criteria_value": "Arrays:10"},
        {"name": "DSA Enthusiast", "description": "Solve 50 problems in total.", "icon_name": "Award", "criteria_type": "solve_count", "criteria_value": "50"},
        {"name": "Master of Logic", "description": "Solve 100 problems in total.", "icon_name": "Star", "criteria_type": "solve_count", "criteria_value": "100"},
    ]
    
    for ach in default_achievements:
        exists = db.query(Achievement).filter(Achievement.name == ach["name"]).first()
        if not exists:
            db.add(Achievement(**ach))
    db.commit()

def check_achievements(user_id: int, db: Session):
    """Check and unlock achievements for a user"""
    # Get all achievements the user HASN'T unlocked yet
    unlocked_ids = [ua.achievement_id for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()]
    pending_achievements = db.query(Achievement).filter(~Achievement.id.in_(unlocked_ids)).all()
    
    if not pending_achievements:
        return
    
    # Get user stats
    total_solved = db.query(UserProgress).filter(UserProgress.user_id == user_id, UserProgress.status == "solved").count()
    streak = db.query(Streak).filter(Streak.user_id == user_id).first()
    current_streak = streak.current_streak if streak else 0
    
    for ach in pending_achievements:
        unlocked = False
        if ach.criteria_type == "solve_count":
            if total_solved >= int(ach.criteria_value):
                unlocked = True
        elif ach.criteria_type == "streak_count":
            if current_streak >= int(ach.criteria_value):
                unlocked = True
        elif ach.criteria_type == "topic_completion":
            topic, count_str = ach.criteria_value.split(":")
            topic_solved = db.query(UserProgress).join(Problem).filter(
                UserProgress.user_id == user_id,
                UserProgress.status == "solved",
                Problem.topic == topic
            ).count()
            if topic_solved >= int(count_str):
                unlocked = True
        
        if unlocked:
            db.add(UserAchievement(user_id=user_id, achievement_id=ach.id))
    
    db.commit()

def update_user_streak(user_id: int, db: Session):
    """Update user streak based on recent activity, handling freezes"""
    streak = db.query(Streak).filter(Streak.user_id == user_id).first()
    if not streak:
        streak = Streak(user_id=user_id, current_streak=0, longest_streak=0, freeze_tokens=1) # Start with 1 token
        db.add(streak)
    
    today = datetime.utcnow().date()
    
    if streak.last_solve_date:
        last_solve = streak.last_solve_date.date()
        diff = (today - last_solve).days
        
        if diff == 0:
            # Already solved today
            pass
        elif diff == 1:
            # Solved yesterday, increment
            streak.current_streak += 1
            streak.last_solve_date = datetime.utcnow()
        else:
            # Missed a day or more
            # Check for freeze tokens
            needed_tokens = diff - 1
            if streak.freeze_tokens >= needed_tokens:
                # Protection applied!
                streak.freeze_tokens -= needed_tokens
                streak.current_streak += 1
                streak.last_solve_date = datetime.utcnow()
            else:
                # Reset
                streak.current_streak = 1
                streak.last_solve_date = datetime.utcnow()
    else:
        # First solve
        streak.current_streak = 1
        streak.last_solve_date = datetime.utcnow()
    
    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = streak.current_streak
        
    # Award a freeze token every 10 solves (simplified logic)
    total_solved = db.query(UserProgress).filter(UserProgress.user_id == user_id, UserProgress.status == "solved").count()
    if total_solved > 0 and total_solved % 10 == 0:
        streak.freeze_tokens += 1
        
    db.commit()

# On startup, seed achievements
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    init_achievements(db)

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

# --- Authentication Endpoints ---

@app.post("/api/v1/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    if user.email:
        db_email = db.query(User).filter(User.email == user.email).first()
        if db_email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = auth.get_password_hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create streak record
    new_streak = Streak(user_id=new_user.id)
    db.add(new_streak)
    db.commit()
    
    return new_user

@app.post("/api/v1/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.username})
    
    # Update last active
    user.last_active = datetime.utcnow()
    db.commit()
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/v1/auth/me", response_model=schemas.UserResponse)
def read_users_me(current_user: User = Depends(auth.get_current_user)):
    return current_user

# --- Progress Tracking Endpoints ---

@app.get("/api/v1/progress", response_model=List[schemas.UserProgressResponse])
def get_user_progress(
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(UserProgress).filter(UserProgress.user_id == current_user.id).all()

@app.post("/api/v1/progress", response_model=schemas.UserProgressResponse)
def update_or_create_progress(
    progress_data: schemas.UserProgressCreate,
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Check if problem exists
    problem = db.query(Problem).filter(Problem.id == progress_data.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Check if progress already exists
    db_progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.problem_id == progress_data.problem_id
    ).first()
    
    if db_progress:
        # Update existing progress
        db_progress.status = progress_data.status
        db_progress.notes = progress_data.notes
        if progress_data.status == "solved" and not db_progress.completed_at:
            db_progress.completed_at = datetime.utcnow()
        db_progress.updated_at = datetime.utcnow()
    else:
        # Create new progress
        db_progress = UserProgress(
            user_id=current_user.id,
            problem_id=progress_data.problem_id,
            status=progress_data.status,
            notes=progress_data.notes,
            completed_at=datetime.utcnow() if progress_data.status == "solved" else None
        )
        db.add(db_progress)
    
    db.commit()

    if db_progress.status == "solved":
        update_user_streak(current_user.id, db)
        check_achievements(current_user.id, db)

    db.refresh(db_progress)
    return db_progress

@app.get("/api/v1/progress/{problem_id}", response_model=schemas.UserProgressResponse)
def get_problem_progress(
    problem_id: int,
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    db_progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.problem_id == problem_id
    ).first()
    
    if not db_progress:
        raise HTTPException(status_code=404, detail="Progress record not found")
    
    return db_progress

# --- Dashboard Endpoints ---

@app.get("/api/v1/dashboard/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Total progress
    total_problems = db.query(Problem).count()
    user_progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.status == "solved"
    ).all()
    total_solved = len(user_progress)
    
    # Streak
    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    current_streak = streak.current_streak if streak else 0
    longest_streak = streak.longest_streak if streak else 0
    
    # Difficulty breakdown
    difficulties = ["Easy", "Medium", "Hard"]
    diff_stats = []
    for diff in difficulties:
        total_diff = db.query(Problem).filter(Problem.difficulty == diff).count()
        solved_diff = db.query(UserProgress).join(Problem).filter(
            UserProgress.user_id == current_user.id,
            UserProgress.status == "solved",
            Problem.difficulty == diff
        ).count()
        diff_stats.append(schemas.DifficultyStat(difficulty=diff, total=total_diff, solved=solved_diff))
    
    # Topic breakdown
    topics = db.query(Problem.topic).distinct().all()
    topic_stats = []
    for (topic_name,) in topics:
        total_topic = db.query(Problem).filter(Problem.topic == topic_name).count()
        solved_topic = db.query(UserProgress).join(Problem).filter(
            UserProgress.user_id == current_user.id,
            UserProgress.status == "solved",
            Problem.topic == topic_name
        ).count()
        topic_stats.append(schemas.TopicStat(topic=topic_name, total=total_topic, solved=solved_topic))
    
    # Recent activity (Last 14 days)
    recent_activity = []
    today = datetime.utcnow().date()
    for i in range(13, -1, -1):
        date = today - timedelta(days=i)
        count = db.query(UserProgress).filter(
            UserProgress.user_id == current_user.id,
            UserProgress.status == "solved",
            func.date(UserProgress.completed_at) == date
        ).count()
        recent_activity.append(schemas.DailyActivity(date=date.isoformat(), count=count))
    
    return schemas.DashboardStats(
        total_solved=total_solved,
        total_problems=total_problems,
        current_streak=current_streak,
        longest_streak=longest_streak,
        difficulty_stats=diff_stats,
        topic_stats=topic_stats,
        recent_activity=recent_activity
    )

# --- Recommendation Endpoints ---

@app.get("/api/v1/recommendations/today", response_model=schemas.TodayPlan)
def get_today_plan(
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Get solved problem IDs
    solved_ids = [p.problem_id for p in db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.status == "solved"
    ).all()]
    
    # 2. Get revision problem IDs
    revision_ids = [p.problem_id for p in db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.status == "revised"
    ).all()]
    
    recommendations = []
    
    # Logic 1: Next sequential problems (Top 3 unsolved)
    next_problems = db.query(Problem).filter(
        ~Problem.id.in_(solved_ids)
    ).order_by(Problem.order_index.asc()).limit(3).all()
    
    for p in next_problems:
        recommendations.append(schemas.Recommendation(
            problem=p,
            reason="Next in curriculum",
            priority=1
        ))
    
    # Logic 2: Revision needed
    if revision_ids:
        rev_problem = db.query(Problem).filter(Problem.id.in_(revision_ids)).first()
        if rev_problem:
            recommendations.append(schemas.Recommendation(
                problem=rev_problem,
                reason="Scheduled for revision",
                priority=2
            ))
            
    # Logic 3: Weak area / Unfinished Easy
    # Find a topic where the user has solved something but not everything
    topic_progress = db.query(
        Problem.topic, 
        func.count(Problem.id).label("total")
    ).group_by(Problem.topic).all()
    
    for topic_name, total_in_topic in topic_progress:
        solved_in_topic = db.query(UserProgress).join(Problem).filter(
            UserProgress.user_id == current_user.id,
            UserProgress.status == "solved",
            Problem.topic == topic_name
        ).count()
        
        if 0 < solved_in_topic < total_in_topic:
            # Topic in progress, pick an unsolved easy problem from it
            weak_problem = db.query(Problem).filter(
                Problem.topic == topic_name,
                Problem.difficulty == "Easy",
                ~Problem.id.in_(solved_ids)
            ).first()
            
            if weak_problem:
                recommendations.append(schemas.Recommendation(
                    problem=weak_problem,
                    reason=f"Strengthen {topic_name}",
                    priority=3
                ))
                break # Just one for now
    
    # Solved today count
    today = datetime.utcnow().date()
    solved_today = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.status == "solved",
        func.date(UserProgress.completed_at) == today
    ).count()
    
    return schemas.TodayPlan(
        date=today.isoformat(),
        recommendations=recommendations[:5], # Limit to 5
        solved_today=solved_today
    )

# --- Analytics Endpoints ---

@app.get("/api/v1/analytics/report", response_model=schemas.AnalyticsReport)
def get_analytics_report(
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    now = datetime.utcnow()
    
    # 1. Solve Velocity (Last 7d and 30d)
    def get_velocity(days: int):
        start_date = now - timedelta(days=days)
        count = db.query(UserProgress).filter(
            UserProgress.user_id == current_user.id,
            UserProgress.status == "solved",
            UserProgress.completed_at >= start_date
        ).count()
        return round(count / days, 2)
    
    velocity_7d = get_velocity(7)
    velocity_30d = get_velocity(30)
    
    # 2. Topic Completion
    topic_stats = []
    topics = db.query(Problem.topic).distinct().all()
    for (topic_name,) in topics:
        total = db.query(Problem).filter(Problem.topic == topic_name).count()
        solved = db.query(UserProgress).join(Problem).filter(
            UserProgress.user_id == current_user.id,
            UserProgress.status == "solved",
            Problem.topic == topic_name
        ).count()
        percentage = round((solved / total) * 100, 2) if total > 0 else 0
        topic_stats.append(schemas.TopicCompletion(
            topic=topic_name,
            percentage=percentage,
            solved=solved,
            total=total
        ))
    
    # Sort topics by percentage descending
    topic_stats.sort(key=lambda x: x.percentage, reverse=True)
    
    # 3. Weekly Distribution
    weekly_dist = []
    # sqlite specific weekday extraction: 0=Sunday, 1=Monday...
    # We want a more cross-platform/pythonic way since we are using SQLAlchemy
    day_counts = {i: 0 for i in range(7)} # 0=Monday, 6=Sunday in python's weekday()
    
    recent_solves = db.query(UserProgress.completed_at).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.status == "solved",
        UserProgress.completed_at.isnot(None)
    ).all()
    
    for (completed_at,) in recent_solves:
        day_counts[completed_at.weekday()] += 1
        
    days_of_week = list(calendar.day_name) # Monday to Sunday
    for i in range(7):
        weekly_dist.append(schemas.WeeklyActivity(
            day=days_of_week[i],
            count=day_counts[i]
        ))
    
    # Most active day
    most_active_idx = max(day_counts, key=day_counts.get)
    most_active_day = days_of_week[most_active_idx] if sum(day_counts.values()) > 0 else "None"
    
    # 4. Revision Stats
    total_revisions = db.query(func.sum(UserProgress.revision_count)).filter(
        UserProgress.user_id == current_user.id
    ).scalar() or 0
    
    # 5. Estimated Completion Date
    est_completion = None
    if velocity_30d > 0:
        total_problems = db.query(Problem).count()
        total_solved = db.query(UserProgress).filter(
            UserProgress.user_id == current_user.id,
            UserProgress.status == "solved"
        ).count()
        remaining = total_problems - total_solved
        days_remaining = remaining / velocity_30d
        est_date = now + timedelta(days=days_remaining)
        est_completion = est_date.date().isoformat()
        
    return schemas.AnalyticsReport(
        solve_velocity_7d=velocity_7d,
        solve_velocity_30d=velocity_30d,
        most_active_day=most_active_day,
        topic_completion=topic_stats,
        weekly_distribution=weekly_dist,
        total_revision_count=total_revisions,
        estimated_completion_date=est_completion
    )

# --- Retention Endpoints ---

@app.get("/api/v1/retention/achievements", response_model=List[schemas.AchievementResponse])
def get_achievements(
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    all_achievements = db.query(Achievement).all()
    user_unlocked = db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).all()
    unlocked_map = {ua.achievement_id: ua.unlocked_at for ua in user_unlocked}
    
    result = []
    for ach in all_achievements:
        is_unlocked = ach.id in unlocked_map
        result.append(schemas.AchievementResponse(
            id=ach.id,
            name=ach.name,
            description=ach.description,
            icon_name=ach.icon_name,
            criteria_type=ach.criteria_type,
            criteria_value=ach.criteria_value,
            unlocked=is_unlocked,
            unlocked_at=unlocked_map.get(ach.id)
        ))
    return result

@app.get("/api/v1/retention/streak", response_model=schemas.StreakResponse)
def get_streak_info(
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    if not streak:
        # Create default streak if not found
        streak = Streak(user_id=current_user.id, current_streak=0, longest_streak=0, freeze_tokens=1)
        db.add(streak)
        db.commit()
        db.refresh(streak)
    return streak

# --- Problem Engine Endpoints ---

@app.get("/api/v1/problems", response_model=schemas.ProblemListResponse)
def list_problems(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=1000),
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
