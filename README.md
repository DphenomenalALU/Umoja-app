# Umoja

> Meet, decide, and act together.

## African Context: Community Work in Kigali, Rwanda

Umoja is being designed for community leaders and youth volunteers coordinating recurring activities in an urban Rwandan context. At Kimisagara YEGO Center in Kigali, the Community Outreach Program describes youth volunteerism and monthly or thematic Umuganda, including environmental cleanups and public-space improvements ([Kimisagara YEGO Center](https://www.yego.gov.rw/programs/community-outreach-program)). Rwanda National Police also documented residents and youth volunteers taking part in an Umuganda tree-planting activity in Gasogi, Gasabo District ([Rwanda National Police, October 2025](https://police.gov.rw/rw/amakuru/amakuru-ya-polisi/news-detail/news/umuganda-rwanda-national-police-join-gasogi-residents-in-tree-planting-drive-to-conserve-the-enviro/)). These are concrete examples of the community meetings and volunteer events Umoja is intended to support; they are not Umoja pilots or partnerships.

Research based on 21 interviews with youth volunteers, residents, and local and government leaders in Huye District found that social media helped with information sharing and collaborative problem-solving during COVID-19 ([Bimenyimana et al., 2025](https://link.springer.com/article/10.1007/s44155-025-00223-3)). The study concerns pandemic response in Huye, not missed event announcements or attendance tracking in Kigali, so it provides context about digital coordination rather than proof of Umoja's specific product need.

**Problem hypothesis:** Details for local meetings and volunteer days can be spread across conversations, while organizers need a clear view of RSVPs, capacity, attendance, and volunteer contributions. Umoja brings event details, sign-ups, check-ins, and volunteer history together. The cited sources establish the local activity and communication context; conversations with Kigali organizers and volunteers are still needed to confirm how often these coordination gaps occur and whether this workflow fits their needs.

## Team Members

- Ibrahim Salami - Team lead, planning, product scope, integration, and submission - Student ID: i.salami@alustudent.com
- Evander Manna - Backend, PostgreSQL, and repository hygiene - Student ID: e.manna@alustudent.com
- Veronica Wanjuu - Frontend and event API integration - Student ID: v.wanjuu@alustudent.com
- Alice Uwase - Quality assurance, Jest, and attendance/profile follow-up - Student ID: a.uwase3@alustudent.com

## Project Overview

Umoja is a community coordination app for meetings and volunteer events. Organizers can publish an event with its date, venue, agenda, and (for volunteer events) a volunteer limit. Residents can browse events and RSVP, while organizers can record attendance and volunteer hours for each person.

The current Next.js app has a PostgreSQL-backed event flow: the workspace loads events, organizers can create them, and residents can sign up with capacity checks. PostgreSQL API routes and feature services also support check-in, volunteer hours, and profile history. The Attendance and Volunteers dashboard screens still use sample state, and the login page is a preview; authentication and organizer permissions are not implemented.

### Target Users

- Community leaders and residents' associations
- Youth groups and students
- NGOs and community-based organizations
- Residents and volunteers

### Core Features

- **Create and announce events:** Publish community meetings and volunteer events with a date, venue, agenda, and volunteer capacity.
- **RSVP and volunteer sign-up:** Join an event and show organizers how many spaces remain.
- **Check-in and attendance:** Confirm attendance and record volunteer hours through the API.
- **Volunteer profiles:** Retrieve attended events and total hours through the profile API.

## Technology Stack

- **Backend:** Next.js App Router route handlers and TypeScript feature services
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui
- **Database:** PostgreSQL with `pg` (node-postgres)
- **Testing:** Jest and ts-jest
- **Other:** npm and ESLint

## Tests

Run the full Jest suite:

~~~bash
npm test
~~~

The tests cover event input validation, sign-up capacity and service behavior, and the events API route contract. They do not require a running PostgreSQL database: service tests mock the connection pool, and the route test checks invalid input before making a database call. To demonstrate real PostgreSQL-backed event creation and listing, follow the local setup and API steps below.

## Getting Started

### Prerequisites

- Node.js 20.9 or newer
- npm
- PostgreSQL 13 or newer

### Installation

1. Clone the `dev` branch and enter the project directory:

   ```bash
   git clone --branch dev --single-branch https://github.com/DphenomenalALU/Umoja-app.git
   cd Umoja-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a PostgreSQL database, copy the example environment file, and set `DATABASE_URL` in `.env.local`:

   ```bash
   createdb umoja
   cp .env.example .env.local
   ```

   Replace the sample connection string with the username, password, host, and database used by your local PostgreSQL setup. Keep `.env.local` private; it is ignored by Git.

4. Apply the database schema. Adjust the example credentials if your local setup uses different ones:

   ```bash
   psql "postgresql://postgres:password@localhost:5432/umoja" -f backend/migrations/001_initial_schema.sql
   ```

5. Start the app:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) for the landing page or [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the workspace. If PostgreSQL is unavailable, the workspace shows labeled sample events and the API returns a database connection error.

### Usage

List events:

```bash
curl http://localhost:3000/api/events
```

Create a volunteer event:

```bash
curl -X POST http://localhost:3000/api/events \
  -H 'Content-Type: application/json' \
  -d '{"title":"Community garden day","kind":"volunteer","startsAt":"2030-11-07T08:00:00Z","venue":"Community garden","agenda":"Prepare beds and plant seedlings","capacity":20}'
```

Use the returned event `id` to sign up. The response includes a signup `id` that can be used to check in the volunteer:

```bash
curl -X POST http://localhost:3000/api/events/<event-id>/signups \
  -H 'Content-Type: application/json' \
  -d '{"fullName":"Amina Dube","email":"amina@example.org"}'

curl -X POST http://localhost:3000/api/events/<event-id>/checkin \
  -H 'Content-Type: application/json' \
  -d '{"signupId":"<signup-id>","volunteerHours":2.5}'
```

These routes list sign-ups and volunteer history:

```bash
curl http://localhost:3000/api/events/<event-id>/signups
curl 'http://localhost:3000/api/profiles?email=amina@example.org'
```

Replace `<event-id>` and `<signup-id>` with IDs returned by the API.

## Project Structure

```text
app/
  api/                         Next.js API routes for events, sign-ups, check-in, and profiles
  dashboard/                   Organizer workspace
  login/                       Login preview
backend/
  migrations/                  PostgreSQL schema
  src/
    events/                    Event service
    signups/                   RSVP and capacity service
    checkin/                   Attendance and hours service
    profiles/                  Volunteer history service
    shared/                    Validation and shared errors
components/
  dashboard/                   Workspace, event, and notification components
  marketing/                   Landing page components
  ui/                          Shared UI primitives
lib/                           Frontend event API client
```

## Links

- [GitHub repository](https://github.com/DphenomenalALU/Umoja-app)
- [Umoja F1 project board](https://github.com/users/DphenomenalALU/projects/2)
- [Course README template](https://github.com/ALU-BSE/devops-2025s-templates/blob/main/formative-1-readme-template.md)
- [License](LICENSE)

## License

MIT. See [LICENSE](LICENSE).


## Formative 2: Runtime Contract

Node.js: 20.x (minimum 20.9); use Node 20 in CI.
App port: 3000; set PORT=3000 in the container.
Database: the app reads DATABASE_URL. In Compose, use the PostgreSQL service hostname; for local development, use localhost.
Health check: GET /api/health returns 200 when the app can reach PostgreSQL and 503 when the database check fails. Veronica is adding this route in issue #27.
Schema migration: `psql "$DATABASE_URL" -f backend/migrations/001_initial_schema.sql`
Local start: npm run dev. Production start: npm run build followed by npm run start.
CI checks: npm ci, npm test, npm run lint, npm run typecheck, and npm run build.

The team writes its own Docker, Compose, and CI configuration for the assessment.
