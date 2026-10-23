import { pool } from "../db/pool";
import { ApiError } from "../shared/errors";
import type { NewEvent } from "../shared/event-input";

export async function listEvents() {
  const result = await pool.query(`
    SELECT events.id, events.title, events.kind, events.starts_at, events.venue,
      events.agenda, events.capacity, events.created_at,
      COUNT(signups.id) FILTER (WHERE signups.status = 'active')::int AS signup_count
    FROM events
    LEFT JOIN signups ON signups.event_id = events.id
    GROUP BY events.id
    ORDER BY events.starts_at ASC
  `);
  return result.rows;
}

export async function createEvent(input: NewEvent) {
  const result = await pool.query(
    `INSERT INTO events (title, kind, starts_at, venue, agenda, capacity)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, title, kind, starts_at, venue, agenda, capacity, created_at`,
    [input.title, input.kind, input.startsAt, input.venue, input.agenda, input.capacity],
  );
  return result.rows[0];
}

export async function getEventById(eventId: string) {
  const result = await pool.query(
    `SELECT events.id, events.title, events.kind, events.starts_at, events.venue,
      events.agenda, events.capacity, events.created_at,
      COUNT(signups.id) FILTER (WHERE signups.status = 'active')::int AS signup_count
     FROM events LEFT JOIN signups ON signups.event_id = events.id
     WHERE events.id = $1 GROUP BY events.id`,
    [eventId],
  );
  if (!result.rows[0]) throw new ApiError("Event not found.", 404);
  return result.rows[0];
}
