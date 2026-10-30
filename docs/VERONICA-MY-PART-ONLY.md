# Veronica's Work Only

This is the execution guide for Veronica Wanjuu. It records the work assigned to
me, the exact commands to run, the expected checks, and the PR handoff.

## 1. Confirmed assignment and current repository state

### Product work

| Issue | Responsibility | Required result |
|---|---|---|
| #7 | Event dashboard/list | Already completed by merged PR #20; regression-test the API-backed list and capacity display. |
| #9 | Create-event form | Already completed by merged PR #20; regression-test payload, validation, success, and error states. |
| #10 | RSVP/capacity flow | Already completed by merged PR #20; regression-test duplicate, full-event, and persisted refresh behavior. |

### F2 work

| Issue | Responsibility | Required result |
|---|---|---|
| #27 | App health endpoint | Add `GET /api/health`, check PostgreSQL readiness, return healthy/unhealthy HTTP responses, and add Jest coverage. |

Issue #27 is assigned to `VeronicahWanjuu` and is still open. It explicitly says
to implement application code only. The team, not this branch, must author Docker,
Compose, and CI configuration.

### Confirmed team contract

This is the contract recorded in issue #25 and merged by PR #29:

- Node.js: `20.x`, minimum `20.9`; use Node 20 in CI.
- Application port: `3000`.
- Database variable: `DATABASE_URL`.
- Health route: `GET /api/health`.
- Health route returns `200` only when PostgreSQL is reachable and `503` when
  the database check fails.
- Migration:
  `psql "$DATABASE_URL" -f backend/migrations/001_initial_schema.sql`
- Local start: `npm run dev`.
- Production start: `npm run build`, then `npm run start`.
- CI checks owned by the team workflow: `npm ci`, `npm test`, `npm run lint`,
  `npm run typecheck`, and `npm run build`.

The latest relevant repository activity is:

- PR #20 (`feat: connect dashboard events to API`) is merged and closes #7,
  #9, and #10. Do not recommit those completed features unless a regression is
  found.
- PR #29 (`docs: document F2 runtime contract`) is merged into `dev`.
- PR #30 (`feat(ci): add pull request workflow checks`) is closed and not merged.
- PR #24 is an unrelated open documentation PR targeting `main`; do not include
  it in this work.
- There is no completed PR for issue #27 yet.

## 2. Scope boundary

### I may change

- Regression fixes for the event dashboard/list, create-event form, and RSVP
  flow if verification finds one.
- The application health route and its Jest tests.
- Direct documentation for the work above.

### I must not change

- `.github/workflows/*` or any other CI workflow.
- `Dockerfile`, `docker-compose.yml`, container or deployment configuration.
- Branch protection or GitHub repository settings.
- Database migration files owned by another teammate.
- Unrelated attendance/profile features.
- Another teammate's PR review comments.
- The existing unrelated worktree change in `app/api/events/route.test.ts`.

If a change is needed outside the allowed application files, stop and coordinate
with the owner instead of silently including it in this branch.

## 3. Branch and worktree safety

Run these commands from `C:\Users\Veronicah\Umoja-app`:

```bash
git status --short
git branch --show-current
git fetch origin
git log --oneline --decorate -8
```

Expected state before starting:

- Current branch: `veronica-events-ui`, or a new branch created from `dev`.
- The existing `app/api/events/route.test.ts` modification is visible and is
  not mine; do not stage or revert it.
- `docs/VERONICA-MY-PART-ONLY.md` may be untracked until this documentation
  change is committed.

If starting cleanly from the latest `dev` for the remaining #27 work:

```bash
git switch dev
git pull --ff-only origin dev
git switch -c veronica-health-endpoint
```

If `veronica-events-ui` already contains my event work:

```bash
git switch veronica-events-ui
git pull --ff-only origin veronica-events-ui
```

Never use `git add .` in this repository because it can stage another person's
work. Always stage named files.

## 4. Local setup and runtime

Check the required Node version:

```bash
node --version
```

Expected output starts with:

```text
v20.
```

Install dependencies:

```bash
npm ci
```

Expected result ends with a successful package audit/install and exit code `0`.
If `npm ci` rejects the lockfile, do not delete the lockfile; report the
dependency error and resolve it with the team.

Create local configuration without committing secrets:

```bash
Copy-Item .env.example .env.local
notepad .env.local
```

Set a local PostgreSQL connection in `.env.local`:

```text
DATABASE_URL=postgresql://<local-user>:<local-password>@localhost:5432/<local-database>
```

Apply the agreed schema:

```bash
psql "$DATABASE_URL" -f backend/migrations/001_initial_schema.sql
```

Expected result: the migration completes without SQL errors and creates the
`events`, `people`, `signups`, and attendance-related tables defined by the
schema. Never commit `.env.local` or a real password.

Start the app:

```bash
npm run dev
```

Expected result: Next.js reports a local URL at
`http://localhost:3000`. Keep this process running in one terminal and use a
second terminal for API checks.

## 5. Verify the completed #7, #9, and #10 work

Use the existing API contract in `README.md`; do not invent a second payload
shape.

### #7 — event dashboard/list regression check

1. Confirm the dashboard uses the existing `GET /api/events` client call.
2. Confirm it renders title, kind, start time, venue, agenda, capacity, and active signup
   count.
3. Confirm remaining capacity is calculated as `capacity - active signups`, never below zero.
4. Confirm any intentionally retained browser-only sample content is labeled
   `Preview/sample`; do not present it as database data.
5. Confirm loading, empty, API-error, and narrow-screen states are understandable.

Verify from the second terminal:

```bash
curl.exe -i http://localhost:3000/api/events
```

Expected successful response:

```text
HTTP/1.1 200 OK
...
{"events":[...]}
```

### #9 — create-event form regression check

Submit exactly these fields to `POST /api/events`:

```json
{
  "title": "Community clean-up",
  "kind": "volunteer",
  "startsAt": "2026-11-15T09:00:00.000Z",
  "venue": "Kimisagara Community Centre",
  "agenda": "Neighbourhood clean-up and planning",
  "capacity": 30
}
```

Verify with:

```bash
curl.exe -i -X POST http://localhost:3000/api/events `
  -H "Content-Type: application/json" `
  --data-raw '{"title":"Community clean-up","kind":"volunteer","startsAt":"2026-11-15T09:00:00.000Z","venue":"Kimisagara Community Centre","agenda":"Neighbourhood clean-up and planning","capacity":30}'
```

Expected successful result: HTTP `201` with the created event JSON. Invalid
titles, dates, or capacity values must show the API error in the form and must
not reset the form as if creation succeeded.

### #10 — RSVP and capacity regression check

Submit exactly this shape to
`POST /api/events/<event-id>/signups`:

```json
{
  "name": "Aline Uwase",
  "email": "aline@example.com"
}
```

Verify the first signup:

```bash
curl.exe -i -X POST http://localhost:3000/api/events/<event-id>/signups `
  -H "Content-Type: application/json" `
  --data-raw '{"name":"Aline Uwase","email":"aline@example.com"}'
```

Expected result: HTTP `201` (or the repository's existing successful signup
status) and one active signup.

Repeat the same command with the same event ID and email. Expected result:
HTTP `409` (duplicate signup), with a visible message and no second signup.
Attempt signup after capacity is reached. Expected result: HTTP `409` (full
event), with the UI showing that no spaces remain. Refresh the event list after
successful signup and confirm the remaining capacity decreases by one.

## 6. Implement F2 #27 — health endpoint

Add application code only:

```text
app/api/health/route.ts
app/api/health/route.test.ts
```

The route must:

1. Accept `GET` at `/api/health`.
2. Use the existing PostgreSQL pool/helper and execute a lightweight database
   query such as `SELECT 1`.
3. Return HTTP `200` only when the query succeeds.
4. Return HTTP `503` when PostgreSQL is unavailable or the readiness query fails.
5. Return JSON with an explicit status; use the following stable contract:

Healthy:

```json
{"status":"healthy","database":"ready"}
```

Unhealthy:

```json
{"status":"unhealthy","database":"unavailable"}
```

Do not catch errors and return `200`. Do not expose connection strings, SQL
details, passwords, or stack traces in the response. Log through the existing
repository pattern if one is already present.

Run the focused health test:

```bash
npx jest app/api/health/route.test.ts --runInBand
```

Expected result after implementation:

```text
PASS app/api/health/route.test.ts
  GET /api/health
    ✓ returns 200 when PostgreSQL is reachable
    ✓ returns 503 when PostgreSQL is unavailable
```

The test must mock the database helper; it must not require production data.
Also verify the running route with PostgreSQL available:

```bash
curl.exe -i http://localhost:3000/api/health
```

Expected result:

```text
HTTP/1.1 200 OK
...
{"status":"healthy","database":"ready"}
```

With PostgreSQL stopped or an invalid test-only `DATABASE_URL`, the expected
result is HTTP `503` and the unhealthy JSON above. Restore the valid local
configuration after the check.

## 7. Required validation before any PR

Run the exact project checks:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Expected output for each command:

- `npm run typecheck`: exits `0` with no TypeScript errors.
- `npm run lint`: exits `0` with no ESLint errors.
- `npm test`: Jest reports all suites passing and exits `0`.
- `npm run build`: Next.js production build completes successfully and exits `0`.

Run a final diff safety check:

```bash
git diff --check
git status --short
git diff --stat
```

Expected final status: only the named Veronica application files and this guide
are staged or modified. The unrelated `app/api/events/route.test.ts` change must
remain unstaged unless its owner explicitly transfers it to me.

## 8. Commit after each completed work block

The #7, #9, and #10 implementation commits already exist in merged PR #20.
Do not recreate them. If a regression is found, make one narrowly named fix
commit containing only the affected files.

```bash
git add <affected-regression-files>
git diff --cached --check
git commit -m "Fix <specific event regression>"
git show --stat --oneline --summary HEAD
```

Expected result: the commit contains only the regression fix and does not
reopen or duplicate the completed issues.

### Commit #27

```bash
git add app/api/health/route.ts app/api/health/route.test.ts
git diff --cached --check
git commit -m "Add database health endpoint"
git show --stat --oneline --summary HEAD
```

Expected result: one commit named `Add database health endpoint`, containing the
health route and its focused Jest coverage only.

### Commit this guide

```bash
git add docs/VERONICA-MY-PART-ONLY.md
git diff --cached --check
git commit -m "Document Veronica event and health work"
git show --stat --oneline --summary HEAD
```

Do not create a commit if the staged diff contains another contributor's
changes. Inspect it first:

```bash
git diff --cached --name-status
git diff --cached
```

## 9. Push and open the PR

Run all validation again after the final commit:

```bash
npm run typecheck
npm run lint
npm test
npm run build
git status --short
git log --oneline --decorate -8
git push -u origin veronica-health-endpoint
```

Expected push output includes a new remote branch named
`veronica-health-endpoint`.

Open one PR against `dev`:

```bash
gh pr create `
  --base dev `
  --head veronica-health-endpoint `
  --title "feat: add database health endpoint" `
  --body "## Summary
Adds Veronica's F2 database health endpoint. Event dashboard, create-event form, and RSVP/capacity work are already delivered by merged PR #20.

## Verification
- npm run typecheck
- npm run lint
- npm test
- npm run build
- GET /api/health returns 200 when PostgreSQL is ready and 503 when unavailable

## Issues
Closes #27"
```

If `gh` is unavailable, create the PR in GitHub manually with:

- base: `dev`
- compare/head: `veronica-health-endpoint`
- the title and body above
- issue #27 linked in the description; mention #7, #9, and #10 as already
  delivered by PR #20

Before requesting review, verify the PR page shows base `dev`, the expected
files only, all checks passing, and no Docker/Compose/CI files.

## 10. Final handoff checklist

- [ ] I confirmed Node 20.x and installed with `npm ci`.
- [ ] I used `DATABASE_URL` and did not commit secrets.
- [ ] #7 event list loads real API data and displays remaining capacity.
- [ ] #9 form sends `title`, `kind`, `startsAt`, `venue`, `agenda`, and `capacity`.
- [ ] #10 prevents duplicate signups and handles a full event.
- [ ] #27 has `GET /api/health` with database readiness behavior.
- [ ] #27 has focused Jest coverage for both `200` and `503`.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `git diff --check` passes.
- [ ] Only intended files are staged.
- [ ] Commits are focused and pushed to `veronica-events-f2-health`.
- [ ] The PR targets `dev`, not `main`.
- [ ] The PR links #7, #9, #10, and #27.
- [ ] No Docker, Compose, CI, branch-protection, or unrelated teammate work is
  included.
