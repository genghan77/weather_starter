# Backend Conventions

- Keep backend routes and DB schema stable unless the user asks for schema changes.
- Migrations live in `backend/drizzle`; run `npm run db:migrate` after altering `backend/src/schema.ts`.
- The backend persists location snapshots in SQLite via Drizzle ORM.
- Reuse the existing `fetchNearestReading()` pattern in `backend/src/weather.ts` when adding weather readings or related data sources.
- Backend server entry point: `backend/src/server.ts`.
- DB helpers and persistence live in `backend/src/db.ts` and `backend/drizzle`.
- Weather client and data sources live in `backend/src/weather.ts`.
- Location routes live in `backend/src/routes/locations.ts`.
