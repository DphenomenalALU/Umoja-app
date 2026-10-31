# Task #8: PostgreSQL Event Create/List Demonstration

## Local Database Setup

1. Create PostgreSQL database:

```sql
CREATE DATABASE umoja;
```

2. Configure environment variables:

```env
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/umoja
```

3. Apply schema:

```bash
psql -U postgres -d umoja -f backend/migrations/001_initial_schema.sql
```

4. Start application:

```bash
npm install
npm run dev
```

---

## End-to-End Event Flow

### Step 1: Create Event

Request:

```http
POST /api/events
```

Body:

```json
{
  "title": "Community Meeting",
  "kind": "meeting",
  "startsAt": "2026-11-15T18:00:00Z",
  "venue": "Community Hall",
  "agenda": "Monthly planning session"
}
```

Expected Result:

```http
201 Created
```

Evidence:
Check the Postman-1 Image in docs/screenshots.
---

### Step 2: Verify Event Saved in PostgreSQL

Query:

```sql
SELECT * FROM events;
```

Expected Result:
- Newly created event appears in the events table

Evidence:
Check query-result.png in docs/screenshots.

---

### Step 3: Retrieve Events

Request:

```http
GET /api/events
```

Expected Result:
- Event is returned from PostgreSQL
- Events ordered by starts_at
- signup_count included

Evidence:
Check get-response.png in docs/screenshots.

---

### Step 4: Validation Check

Request:

```http
POST /api/events
```

Body:

```json
{
  "title": "A"
}
```

Expected Result:

```http
400 Bad Request
```

Evidence:
Checkvalidation-error.png in docs/screenshots.

---

### Step 5: Database Failure Handling

Stop PostgreSQL service.

Request:

```http
GET /api/events
```

Expected Result:

```http
503 Service Unavailable
```

Evidence:
Check db-failure-handling.png on docs/screenshots.

This demonstrates that the API does not return a false success when the database is unavailable.