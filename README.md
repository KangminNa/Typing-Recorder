# Typing Practice

Monorepo with frontend (React + Vite) and backend (NestJS + Postgres). Dockerized via docker-compose.

How to run

- Install Docker and Docker Compose
- From repo root:

  docker-compose build
  docker-compose up

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/typing

Notes
- Backend uses TypeORM with synchronize=true for dev. For production, use migrations and secure credentials.
- Frontend posts score to /api/typing/result (relative path expected to be proxied; with docker-compose both are on same host).

Structure
- backend/: NestJS app
- frontend/: Vite + React app

You can expand with auth, more lessons, per-user leaderboard, and nicer UI.
