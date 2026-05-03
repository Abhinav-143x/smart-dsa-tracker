# Changelog

All notable changes to the Smart DSA Tracker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
