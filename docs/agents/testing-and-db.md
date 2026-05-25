# Testing and DB Workflows

- Tests are primarily backend API tests using Vitest and Supertest.
- Run targeted tests when modifying routes or DB code.
- Useful commands:
  - `npm test`
  - `npx vitest run backend/src/routes/locations.test.ts`
  - `npm run reset`
- Database changes should be made deliberately because the app stores location snapshots in `backend/weather.db`.
- If you change schema definitions, remember to generate and apply migrations.
