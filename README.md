# Umoja

> Meet, decide, and act together.

## African Context

Community meetings and volunteer opportunities are often announced through word of mouth and scattered messaging groups. Residents can miss dates, organizers cannot easily see who plans to attend, and volunteer hours are hard to track. Umoja brings event details, sign-ups, attendance, and volunteer history into one place for community groups.

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
