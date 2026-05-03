# Changelog

All notable changes to the Smart DSA Tracker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-05-03

### Added
- **Official Data Alignment**: Regrouped the entire 474-problem dataset to match the official TakeUForward A2Z sheet structure.
- **Data Enrichment**: Integrated missing YouTube tutorial links, articles, and LeetCode shortcuts into the core dataset.
- **UI Polishing**: Standardized spacing, alignment, and typography across the entire Sheet view.
- **Enhanced Visual Feedback**: Added progress glows, line-through states for solved problems, and optimized dark mode contrast.
- **Branding**: Added persistent TakeUForward quick-access button to the main dashboard.

### Fixed
- Backend API constraint: Increased maximum page size to 1000 to support full curriculum views.
- Icon missing: Replaced missing `Youtube` icon with `Video` in `ProblemRow`.

## [0.3.0] - 2026-05-03

### Added
- **Major UI Overhaul**: Transitioned to a "Developer Dark Mode" aesthetic.
- New "Sheet" view for problems, grouped by Topic and Subtopic.
- Collapsible `TopicAccordion` component for better curriculum navigation.
- High-density `ProblemRow` component replacing `ProblemCard`.
- Sticky `ProgressDashboard` for persistent global progress tracking.
- Client-side state management for toggling problem status (local session).

## [0.2.0] - 2026-05-03

### Added
- JWT-based authentication system for the backend.
- User registration (`/api/v1/auth/register`) and login (`/api/v1/auth/login`) endpoints.
- Current user info endpoint (`/api/v1/auth/me`).
- Password hashing using `bcrypt`.
- Authentication dependency for protected routes.
- Updated `User` model with `hashed_password` and `last_active` tracking.

### Changed
- Updated `backend/requirements.txt` with authentication and cryptography dependencies.
- Enhanced `backend/.env.example` with authentication configuration.

## [0.1.0] - 2026-05-03

### Added
- Initial project structure with Next.js 14 frontend and FastAPI backend.
- SQLite database integration with SQLAlchemy ORM.
- Comprehensive documentation following the Diátaxis framework.
- Core database schema for problems, users, progress tracking, and streaks.
- Problem dataset import utility.
- Integrated dataset of 474 DSA problems.
- Core API endpoints for problem listing, search, and filtering (`/api/v1/problems`).
- Topic and subtopic exploration endpoints (`/api/v1/topics`, `/api/v1/subtopics`).
- Professional Next.js Problem Explorer UI with search and filtering.
- API client utility and shared type definitions.
- Health check and automatic API documentation (Swagger/ReDoc).

### Planned
- User authentication and personalized progress system.
- Dashboard with performance metrics and activity tracking.
- Intelligent daily practice recommendation engine.
