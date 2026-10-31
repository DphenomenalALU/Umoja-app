# Umoja Baraza

Umoja Baraza is a shared place for community meetings and volunteer events. People can find an event, sign up, and build a record of the work they did together.

## Stack

- Next.js App Router, React, TypeScript, and Tailwind CSS
- shadcn/ui with Radix primitives
- PostgreSQL through `pg`
- Jest with `ts-jest`

## Run locally

Use Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page links to a sample workspace. Its sample events and attendance are held in browser state so the interface can be reviewed without a database.

## PostgreSQL API

Create a PostgreSQL database, copy `.env.example` to `.env.local`, and set `DATABASE_URL` to the database connection string. Apply the initial schema:

```bash
psql "$DATABASE_URL" -f backend/migrations/001_initial_schema.sql
```

The API reads and writes to that database:

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/events` | List events and active sign-up counts |
| `GET` | `/api/health` | Check app and PostgreSQL readiness: `200` `{"status":"healthy","database":"ready"}`, or `503` `{"status":"unhealthy","database":"unavailable"}` |
| `POST` | `/api/events` | Create a meeting or volunteer event |
| `GET` | `/api/events/:eventId/signups` | List sign-ups and any recorded attendance |
| `POST` | `/api/events/:eventId/signups` | RSVP with a name and email |
| `POST` | `/api/events/:eventId/checkin` | Confirm attendance and record hours |
| `GET` | `/api/profiles?email=...` | Read a volunteer profile and attended-event history |

Feature services are separated under `backend/src/events`, `signups`, `checkin`, and `profiles`. The sign-up transaction locks an event row while checking capacity, which prevents concurrent requests from taking the final spot twice.

The login page is a preview entry point. Authentication and organizer permissions still need an agreed provider and policy before the API is exposed to a community.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## UI references

The marketing feature preview follows Omentir’s interactive tabbed showcase pattern. The app shell adapts the Sales CRM sidebar, tab header, and dense list/table components for events and volunteers.
