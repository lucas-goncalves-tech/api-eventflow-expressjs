# Event Flow API

## Project Overview

This is the backend API for the **Event Flow** application. It is built with **Node.js** and **Express.js**, written in **TypeScript**. The project follows a modular architecture using dependency injection and connects to a **PostgreSQL** database.

### Key Technologies
-   **Runtime:** Node.js
-   **Framework:** Express.js (v5)
-   **Language:** TypeScript
-   **Database:** PostgreSQL (using `pg` driver)
-   **Migrations:** `node-pg-migrate`
-   **Dependency Injection:** `tsyringe`
-   **Validation:** `zod`
-   **Testing:** `vitest`, `supertest`
-   **Containerization:** Docker & Docker Compose

## Architecture

The project is structured into modules (`src/modules`) and shared resources (`src/shared`). It uses a layered approach:
1.  **Routes:** Define API endpoints.
2.  **Controllers:** Handle HTTP requests and responses.
3.  **Services:** Contain business logic.
4.  **Repositories:** Interact with the database (raw SQL queries).

Dependency Injection (DI) is handled by `tsyringe`. `App` and `Server` classes are resolved from the container.

### Directory Structure
-   `src/app.ts`: Main Express application setup.
-   `src/core/`: Core configurations, server entry point (`server.ts`), and global routes.
-   `src/database/`: Database connection (`data-source.ts`) and migrations.
-   `src/modules/`: Feature modules (auth, events, tickets, user).
-   `src/shared/`: Shared utilities, middlewares, errors, and types.
-   `tests/`: Test setup.

## Building and Running

### Prerequisites
-   Node.js
-   Docker & Docker Compose

### Development Scripts
The project uses `npm` scripts defined in `package.json`:

*   **Start Development Server:**
    ```bash
    npm run dev
    ```
    Uses `tsx` for hot-reloading.

*   **Docker Environment:**
    ```bash
    npm run docker:up   # Start API and DB containers
    npm run docker:down # Stop containers
    ```

*   **View Logs:**
    ```bash
    npm run logs:api
    npm run logs:db
    ```

*   **Migrations:**
    ```bash
    npm run migrate:up      # Run migrations
    npm run migrate:down    # Revert migrations
    npm run migrate:create -- <name> # Create new migration
    ```
    *Note: `migrate:up` and `migrate:down` execute inside the running API container.*

*   **Testing:**
    ```bash
    npm test
    ```
    Executes `vitest` inside the API container.

## Development Conventions

-   **Dependency Injection:** Use `@injectable()` and `@inject()` decorators for classes and dependencies. Register classes in the DI container (mostly automatic with `tsyringe` for classes).
-   **Database Access:** Use the `DatabasePool` singleton for executing raw SQL queries.
-   **Validation:** Use `zod` schemas to validate request data (body, query, params).
-   **Error Handling:** Throw custom error classes (e.g., `BadRequestError`, `NotFoundError`) from `src/shared/errors`. The global error handler middleware will format the response.
-   **Testing:** Write unit/integration tests using `vitest`. Place tests in `specs/` folder within each module.
