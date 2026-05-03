# Tutorial: Local Development Setup

This guide provides a comprehensive walkthrough for setting up the Smart DSA Tracker development environment. Upon completion, you will have a functional FastAPI backend and Next.js frontend running locally.

## Prerequisites

Ensure the following software is installed on your system:
- **Node.js**: Version 18.x or higher.
- **Python**: Version 3.9.x or higher.
- **Git**: Latest stable version.

---

## Step 1: Initial Repository Setup

Clone the repository and navigate to the project root:

```bash
git clone <repository-url>
cd smart-dsa-tracker
```

## Step 2: Backend Configuration

The backend services are built with FastAPI and utilize SQLite for local storage.

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Initialize a Python virtual environment**:
   - **Windows**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize the local database**:
   ```bash
   python init_db.py
   ```

5. **Start the service**:
   ```bash
   python main.py
   ```
   The API service is hosted at `http://localhost:8000`.

---

## Step 3: Frontend Configuration

The frontend is built with Next.js 14.

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js packages**:
   ```bash
   npm install
   ```

3. **Execute the development server**:
   ```bash
   npm run dev
   ```
   The web application is available at `http://localhost:3000`.

---

## Step 4: Verification

To ensure all components are functioning correctly:

1. **Service Health**: Access `http://localhost:8000/health`. A successful response returns `{"status": "healthy"}`.
2. **API Documentation**: Review the interactive Swagger UI at `http://localhost:8000/docs`.
3. **Web Application**: Access `http://localhost:3000` to view the landing interface.

## Next Steps

With the environment established, you may proceed to:
- Review the [Database Schema](../reference/database-schema.md) for technical specifications.
- Consult the [Project Roadmap](../reference/roadmap.md) for current development priorities.
