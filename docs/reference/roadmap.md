# Smart DSA Tracker - Roadmap

## Feature Progress

### ✅ F1 - Foundation Layer (Complete)
**Status:** Done
**Completion:** 100%

**Deliverables:**
- ✅ Monorepo structure setup
- ✅ Next.js frontend initialized
- ✅ FastAPI backend initialized  
- ✅ Database schema defined
- ✅ Environment configuration
- ✅ Basic project documentation
- ✅ Health check API endpoint

**Technical Details:**
- Frontend: Next.js 14 with TypeScript and Tailwind CSS
- Backend: FastAPI with SQLAlchemy ORM
- Database: SQLite with 4 core tables (problems, users, user_progress, streaks)
- API Documentation: Auto-generated Swagger UI at `/docs`

---

### 🔄 F2 - Problem Engine (In Progress)
**Status:** In Progress
**Completion:** 20%

**Goals:**
- Import extracted Striver dataset into database
- Implement problem browsing and filtering
- Create search functionality
- Build frontend problems page

**Tasks:**
- [ ] Import JSON data into database
- [ ] Normalize topics and subtopics
- [ ] Implement problem search API
- [ ] Add filtering by topic/difficulty
- [ ] Create pagination
- [ ] Build frontend problems listing page
- [ ] Add problem detail view
- [ ] Implement filtering UI

**API Endpoints:**
- `GET /api/v1/problems` - List all problems with pagination
- `GET /api/v1/problems/{id}` - Get specific problem
- `GET /api/v1/problems/search` - Search problems
- `GET /api/v1/topics` - List all topics
- `GET /api/v1/topics/{topic}/subtopics` - Get subtopics for topic

**Frontend Pages:**
- `/problems` - Main problems listing page
- `/problems/[id]` - Individual problem detail page

---

### ⏳ F3 - Progress System (Pending)
**Status:** Pending
**Completion:** 0%

**Goals:**
- Enable user progress tracking
- Implement solved/revision status
- Add progress persistence

**Tasks:**
- [ ] User authentication system
- [ ] Progress tracking API
- [ ] Mark problem as solved
- [ ] Mark problem for revision
- [ ] Reset progress functionality
- [ ] Progress history tracking
- [ ] Frontend progress UI

**API Endpoints:**
- `POST /api/v1/progress` - Update problem progress
- `GET /api/v1/progress` - Get user progress
- `GET /api/v1/progress/stats` - Get progress statistics
- `DELETE /api/v1/progress/{problem_id}` - Reset problem progress

---

### ⏳ F4 - Dashboard Intelligence (Pending)
**Status:** Pending
**Completion:** 0%

**Goals:**
- Create user dashboard with key metrics
- Display progress visualization
- Show activity patterns

**Tasks:**
- [ ] Dashboard aggregate queries
- [ ] Total solved counter
- [ ] Completion percentage
- [ ] Streak tracking display
- [ ] Today's target widget
- [ ] Pending problems count
- [ ] Recent activity feed
- [ ] Dashboard frontend components

**Dashboard Widgets:**
- Total problems solved
- Completion rate by topic
- Current streak
- Problems solved today
- Pending problems count
- Recent activity timeline
- Weekly activity heatmap

---

### ⏳ F5 - Today Plan Engine (Pending)
**Status:** Pending
**Completion:** 0%

**Goals:**
- Implement smart daily recommendations
- Prioritize unfinished and weak areas

**Tasks:**
- [ ] Recommendation algorithm
- [ ] Priority logic implementation
- [ ] Today's plan API
- [ ] Frontend plan display
- [ ] Plan customization options

**Recommendation Logic Priority:**
1. Unfinished easy problems
2. Weak topic problems
3. Next sequential sheet problem
4. Revision due items

**API Endpoints:**
- `GET /api/v1/recommendations/today` - Get today's practice plan
- `POST /api/v1/recommendations/complete` - Mark recommendation complete

---

### ⏳ F6 - Analytics Layer (Pending)
**Status:** Pending
**Completion:** 0%

**Goals:**
- Provide detailed progress analytics
- Identify weak areas and patterns

**Tasks:**
- [ ] Topic completion analysis
- [ ] Solve velocity tracking
- [ ] Weak topic identification
- [ ] Inactivity heatmap
- [ ] Hardest solved categories
- [ ] Consistency trend analysis
- [ ] Analytics dashboard

**Analytics Metrics:**
- Topic completion percentage
- Average solve time per problem
- Weak topics by error rate
- Daily/weekly activity patterns
- Difficulty progression
- Streak history

---

### ⏳ F7 - Retention Systems (Pending)
**Status:** Pending
**Completion:** 0%

**Goals:**
- Implement user retention features
- Prevent user churn

**Tasks:**
- [ ] Streak freeze system
- [ ] Inactivity warnings
- [ ] Comeback prompts
- [ ] Weekly summary emails
- [ ] Milestone badges system
- [ ] Achievement tracking

**Retention Features:**
- Streak freeze tokens
- Inactivity notifications
- Personalized comeback messages
- Weekly progress reports
- Achievement badges
- Milestone celebrations

---

### ⏳ F8 - Integrations/Premium Layer (Future)
**Status:** Future
**Completion:** 0%

**Goals:**
- Add advanced integrations
- Implement premium features

**Tasks:**
- [ ] GitHub repo verification
- [ ] LeetCode account sync
- [ ] AI study planner
- [ ] Resume report export
- [ ] Spaced repetition system
- [ ] Premium subscription tier

---

## MVP Definition

**Ship when these are complete:**
- ✅ Browse problems
- ✅ Mark solved
- ✅ Dashboard
- ✅ Streak tracking
- ✅ Today plan
- ✅ Basic analytics
- ✅ Deployed live

**Target MVP Release:** v1.0.0

---

## Version History

### v0.1.0 - Foundation (Current)
- Monorepo setup
- Frontend/backend initialization
- Database schema
- Basic API structure

### v0.2.0 - Problem Engine (Next)
- Problem import and browsing
- Search and filtering
- Problems UI

### v0.3.0 - Progress System
- User authentication
- Progress tracking
- Solved/revision features

### v0.4.0 - Dashboard
- Dashboard widgets
- Progress visualization
- Activity tracking

### v0.5.0 - Today Plan
- Recommendation engine
- Daily practice plans
- Smart prioritization

### v1.0.0 - MVP Release
- All core features
- Production deployment
- Basic analytics

---

## Timeline Estimates

- **F1 Foundation:** 1-2 days ✅
- **F2 Problem Engine:** 3-5 days
- **F3 Progress System:** 4-6 days
- **F4 Dashboard:** 3-4 days
- **F5 Today Plan:** 2-3 days
- **F6 Analytics:** 3-4 days
- **F7 Retention:** 4-5 days

**Total to MVP:** ~20-29 days

---

## Next Immediate Steps

1. **Complete F2** - Import dataset and build problem explorer
2. **Implement F3** - Add user authentication and progress tracking
3. **Build F4** - Create dashboard with key metrics
4. **Develop F5** - Implement recommendation engine
5. **Ship MVP** - Deploy and gather user feedback

---

## Notes

- Focus on vertical slices - each feature should be complete end-to-end
- Prioritize user value over technical perfection
- Gather real usage data before building advanced features
- Maintain code quality and test coverage
- Keep documentation updated as features are added