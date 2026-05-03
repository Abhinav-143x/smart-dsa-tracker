# Explanation: Architecture & Tech Stack

This document discusses the rationale behind the architectural choices and technical stack of the Smart DSA Tracker.

## Rationale for FastAPI (Backend)

We chose **FastAPI** over Express (Node.js) or Django for several strategic reasons:

1.  **Type Safety & Validation**: FastAPI leverages Python type hints and Pydantic for automatic request/response validation. This reduces runtime errors and provides excellent IDE auto-completion.
2.  **Performance**: Built on Starlette and Uvicorn, FastAPI is one of the fastest Python frameworks available, approaching the performance of Node.js and Go.
3.  **Auto-Documentation**: It automatically generates interactive OpenAPI (Swagger) and ReDoc documentation, which is crucial for frontend integration.
4.  **Data Ecosystem**: Python's ecosystem is superior for the ML and data analysis features planned for Phases F5 (Today Plan) and F6 (Analytics).

## Rationale for SQLite (Database)

While **PostgreSQL** is the eventual production target, we are starting with **SQLite** during the MVP phase (F1-F4):

-   **Zero Config**: No database server setup is required for local developers.
-   **Portability**: The entire database is a single file, making it easy to share and backup.
-   **Performance**: For single-user local development and small-scale MVPs, SQLite is faster and consumes fewer resources than a full SQL server.

## Rationale for Next.js App Router (Frontend)

We utilize **Next.js 14** with the **App Router** to leverage modern React features:

-   **React Server Components (RSC)**: Allows us to fetch data on the server, reducing the JavaScript bundle sent to the client and improving initial load times.
-   **Streaming**: Enables progressive rendering of UI components, which is vital for the Dashboard phase.
-   **Tailwind CSS Integration**: Provides a utility-first styling approach that ensures design consistency and rapid UI iteration.

## Architectural Pattern: Vertical Slices

Unlike traditional N-Tier architectures that group code by technical layer (Controllers, Services, Models), we aim to organize around **Vertical Slices**:

-   Each feature phase (e.g., Problem Engine, Progress System) is treated as a distinct unit.
-   This approach allows us to deliver functional end-to-end value faster and makes the codebase easier to reason about as it scales.
