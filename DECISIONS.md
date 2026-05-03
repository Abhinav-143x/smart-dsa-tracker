# Architecture Decisions Log

## Decision 001: Use FastAPI over Express

**Date:** 2026-05-03
**Status:** Accepted

### Context
Need to choose between FastAPI (Python) and Express (Node.js) for the backend API.

### Decision
Use FastAPI with Python.

### Rationale
- Built-in Pydantic validation for request/response models
- Automatic API documentation with Swagger UI
- Better type safety with Python type hints
- Async support out of the box
- Easier integration with data processing libraries
- Better performance for I/O operations

### Consequences
- Team needs Python expertise
- Natural fit for data processing and ML features
- Excellent developer experience with auto-completion

---

## Decision 002: Use SQLite First for Velocity

**Date:** 2026-05-03
**Status:** Accepted

### Context
Need to choose initial database for MVP development.

### Decision
Start with SQLite, migrate to PostgreSQL for production.

### Rationale
- Zero configuration for local development
- Single file database, easy to version control
- Sufficient for MVP and early users
- Easy migration path to PostgreSQL
- Faster development iteration
- Lower infrastructure complexity

### Consequences
- Limited concurrency compared to PostgreSQL
- Will need migration strategy for production
- Excellent for development and testing

---

## Decision 003: Use Next.js App Router

**Date:** 2026-05-03
**Status:** Accepted

### Context
Choose between Next.js Pages Router vs App Router.

### Decision
Use Next.js 14 with App Router.

### Rationale
- Latest Next.js features and improvements
- Better support for React Server Components
- Improved performance with streaming
- Better TypeScript support
- Future-proof choice
- Simpler data fetching patterns

### Consequences
- Requires newer React and Next.js knowledge
- Some libraries may not support App Router yet
- Better long-term maintainability

---

## Decision 004: Delay Authentication Until F3

**Date:** 2026-05-03
**Status:** Accepted

### Context
When to implement user authentication in the development roadmap.

### Decision
Implement authentication in F3 (Progress System), not in F1-F2.

### Rationale
- Focus on core value first (problem exploration)
- Reduce initial complexity
- Test core functionality without auth overhead
- Can add auth later without major refactoring
- Faster time to MVP

### Consequences
- F1-F2 will have single-user mode
- Need to design auth system for F3
- Easier to test core features initially

---

## Decision 005: Monorepo Structure

**Date:** 2026-05-03
**Status:** Accepted

### Context
Choose between monorepo vs multi-repo structure.

### Decision
Use monorepo with separate frontend/backend directories.

### Rationale
- Easier dependency management
- Shared configurations and scripts
- Simpler CI/CD pipeline
- Better for small to medium teams
- Easier local development setup

### Consequences
- Need to organize code carefully
- Clear separation between frontend/backend
- Shared tooling and configurations

---

## Decision 006: Use Tailwind CSS for Styling

**Date:** 2026-05-03
**Status:** Accepted

### Context
Choose CSS framework for frontend styling.

### Decision
Use Tailwind CSS with Next.js.

### Rationale
- Utility-first approach for rapid development
- Consistent design system
- No custom CSS files needed
- Excellent responsive design support
- Built-in with Next.js templates
- Easy customization

### Consequences
- HTML classes can become verbose
- Need to learn Tailwind utility classes
- Smaller bundle size compared to traditional CSS

---

## Decision 007: Implement Recommendation Engine in F5

**Date:** 2026-05-03
**Status:** Accepted

### Context
When to implement the "Today's Plan" recommendation system.

### Decision
Implement basic recommendation logic in F5, enhance in later phases.

### Rationale
- Core value proposition of the product
- Needs user progress data from F3-F4
- Can start with simple rules, improve over time
- Differentiator from simple problem lists
- User retention feature

### Consequences
- Need to design extensible recommendation system
- Can gather usage data for improvements
- Potential for ML-based enhancements later

---

## Decision 008: Use Semantic Versioning

**Date:** 2026-05-03
**Status:** Accepted

### Context
Version numbering strategy for releases.

### Decision
Use semantic versioning (MAJOR.MINOR.PATCH).

### Rationale
- Industry standard for versioning
- Clear communication of changes
- Better dependency management
- Professional release process
- Easier rollback planning

### Consequences
- Need to follow versioning rules strictly
- Breaking changes require major version bump
- Clear changelog maintenance required

---

## Decision 009: Prioritize Vertical Slices

**Date:** 2026-05-03
**Status:** Accepted

### Context
Development approach - horizontal layers vs vertical features.

### Decision
Build complete vertical slices for each feature.

### Rationale
- Faster delivery of working features
- Each feature is independently testable
- Better user feedback loop
- Easier to pivot or drop features
- More motivating for developers

### Consequences
- Some code duplication initially
- Need to refactor for common patterns
- Better incremental value delivery

---

## Decision 010: Defer Analytics Until Real Usage

**Date:** 2026-05-03
**Status:** Accepted

### Context
When to implement comprehensive analytics system.

### Decision
Implement basic analytics in F6, defer advanced analytics until after real usage.

### Rationale
- Don't build what users might not need
- Real usage data informs analytics design
- Faster time to core features
- Can add analytics incrementally
- Avoid premature optimization

### Consequences
- Need to design extensible analytics schema
- Can gather basic metrics from start
- Advanced analytics can be added later