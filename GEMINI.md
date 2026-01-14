# EventFlow API (`eventflow-app`)

## Project Overview

`eventflow-app` is a backend API service built with **Node.js** and **Express**, utilizing **TypeScript** for type safety. It provides endpoints for managing events and user authentication.

**Key Technologies:**

*   **Runtime:** Node.js
*   **Framework:** Express.js (v5)
*   **Language:** TypeScript
*   **Database:** PostgreSQL
*   **Database Driver:** `pg` (node-postgres)
*   **Dependency Injection:** `tsyringe`
*   **Validation:** `zod`
*   **Testing:** `vitest`, `supertest`
*   **Migrations:** `node-pg-migrate`

## Architecture

The project follows a **Modular Architecture** where features are organized into self-contained modules.

### Directory Structure (`src/`)

*   **`app.ts`**: Application entry point, configures middlewares and routes.
*   **`core/`**: Core infrastructure code.
    *   `server.ts`: Server initialization and graceful shutdown logic.
    *   `routes.ts`: Main router aggregating module routes.
    *   `config/`: Configuration files (e.g., environment variables).
*   **`database/`**: Database related files.
    *   `data-source.ts`: PostgreSQL connection pool wrapper.
    *   `migrations/`: SQL migration files managed by `node-pg-migrate`.
*   **`modules/`**: Feature modules.
    *   **`auth/`**: Authentication logic (SignUp, SignIn).
    *   **`events/`**: Event management.
    *   **`user/`**: User management.
    *   *Structure within modules:* Typically includes `Controller`, `Service`, `Repository`, `Routes`, and `DTOs`.
*   **`shared/`**: Shared utilities, errors, and middlewares.
    *   `middlewares/`: Global middlewares (e.g., Error Handler, Validation).
    *   `errors/`: Custom error classes.

## Development

### Prerequisites

*   Node.js (v20+ recommended)
*   Docker & Docker Compose

### Quick Start (Docker)

The easiest way to run the application is using Docker Compose, which sets up both the API and the PostgreSQL database.

```bash
# Start the application and database
npm run docker:up

# View API logs
npm run logs:api

# Stop the application
npm run docker:down
```

The API will be available at `http://localhost:3333`.

### Local Development

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Copy `.env.example` to `.env` and configure your local database credentials if running locally without Docker for the app itself.
    ```bash
    cp .env.example .env
    ```

3.  **Run Migrations:**
    ```bash
    npm run migrate:up
    ```

4.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    This uses `tsx` to watch for changes in `src/core/server.ts`.

### Testing

Tests are configured using `vitest`.

```bash
# Run tests inside the docker container
npm test
```

## Database Migrations

Managed via `node-pg-migrate`.

*   **Create Migration:** `npm run migrate:create -- my_migration_name`
*   **Run Migrations:** `npm run migrate:up`
*   **Revert Migration:** `npm run migrate:down`

## API Endpoints

(Inferred from `src/core/routes.ts`)

*   **Health Check:** `GET /health`
*   **Base API Path:** `/api/v1`
    *   **Events:** `/api/v1/events`
    *   **Auth:** `/api/v1/auth`
