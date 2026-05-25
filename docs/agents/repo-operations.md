# Repo Operations

- Frontend and backend run together in development via Portless.
- Use the Portless host printed by `npm run dev` instead of hardcoding ports.
- The app uses relative `/api` requests, so there is no frontend/backend port configuration.
- On Windows, Portless may leave a registered hostname behind; use `taskkill` to stop lingering Node processes if `scripts/dev.mjs` reports an already-registered name.
- Start from `scripts/dev.mjs` for local development behavior.
- `backend/src/routes/locations.test.ts` is the main route test file.
