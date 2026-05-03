# Smart DSA Tracker

The Smart DSA Tracker is a specialized execution system designed for users of the Striver DSA Sheet. It provides a structured environment to improve consistency, planning, and completion rates through data-driven tracking and intelligent practice recommendations.

## Documentation Overview

This project utilizes the Diátaxis framework to provide clear, goal-oriented documentation.

### Tutorials
- [Local Development Setup](./docs/tutorials/setup-guide.md): A step-by-step guide to initializing the backend and frontend environments.

### How-to Guides
- [Dataset Import (Pending)](./docs/how-to/dataset-import.md): Instructions for importing or updating problem sets.
- Progress Tracking (Pending): Procedures for managing individual problem status.

### Reference
- [Database Schema](./docs/reference/database-schema.md): Technical specification of tables and data relationships.
- [Project Roadmap](./docs/reference/roadmap.md): Current development status and planned feature phases.
- [Changelog](./CHANGELOG.md): Historical record of all significant changes and releases.

### Explanation
- [Architecture and Technical Stack](./docs/explanation/architecture.md): Discussion of the design principles and technologies used.
- [Project Vision](./docs/explanation/project-vision.md): Conceptual overview of the system's purpose and logic.

## Quick Start

1. **Backend**: 
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python main.py
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. **Access**: Navigate to `http://localhost:3000` in a web browser.

## Project Structure

- `frontend/`: Next.js 14 web application.
- `backend/`: FastAPI service layer.
- `docs/`: Technical documentation organized by Diátaxis quadrant.
- `data/`: Source datasets for problem sets.
- `MEMORY.md`: Development state tracking (internal use).

---
*Technical Project for DSA Learners*
