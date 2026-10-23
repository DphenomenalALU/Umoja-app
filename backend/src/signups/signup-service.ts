import type { PoolClient } from "pg";
import { pool } from "../db/pool";
import { ApiError } from "../shared/errors";
import { ensureCapacity } from "./capacity";

export type SignupInput = { fullName: string; email: string };

export async function listSignups(eventId: string) {
  const result = await pool.query(
    `SELECT events.id AS event_id, signups.id AS signup_id, people.id AS person_id,
      people.full_name, people.email, signups.signed_up_at,
      attendance.checked_in_at, COALESCE(attendance.volunteer_hours, 0)::numeric(5, 2) AS volunteer_hours
     FROM events
     LEFT JOIN signups ON signups.event_id = events.id AND signups.status = 'active'
     LEFT JOIN people ON people.id = signups.person_id
     LEFT JOIN attendance ON attendance.signup_id = signups.id
     WHERE events.id = $1
     ORDER BY signups.signed_up_at ASC NULLS LAST`,
    [eventId],
  );
  if (!result.rows.length) throw new ApiError("Event not found.", 404);
  return result.rows.filter((row) => row.signup_id !== null);
}

export async function createSignup(eventId: string, input: SignupInput) {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  if (fullName.length < 2 || fullName.length > 100) throw new ApiError("Enter a name between 2 and 100 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new ApiError("Enter a valid email address.");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const eventResult = await client.query(
      "SELECT id, capacity FROM events WHERE id = $1 FOR UPDATE",
      [eventId],
    );
    const event = eventResult.rows[0];
    if (!event) throw new ApiError("Event not found.", 404);

    const personResult = await client.query(
      `INSERT INTO people (full_name, email) VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
       RETURNING id, full_name, email`,
      [fullName, email],
    );
    const person = personResult.rows[0];
    const existing = await client.query(
      "SELECT id, status FROM signups WHERE event_id = $1 AND person_id = $2",
      [eventId, person.id],
    );
    if (existing.rows[0]?.status === "active") {
      await client.query("COMMIT");
      return { id: existing.rows[0].id, person, alreadyJoined: true };
    }

    const countResult = await client.query(
      "SELECT COUNT(*)::int AS count FROM signups WHERE event_id = $1 AND status = 'active'",
      [eventId],
    );
    ensureCapacity(event.capacity, countResult.rows[0].count);
    const signupResult = await client.query(
      `INSERT INTO signups (event_id, person_id, status) VALUES ($1, $2, 'active')
       ON CONFLICT (event_id, person_id) DO UPDATE SET status = 'active', signed_up_at = NOW()
       RETURNING id, event_id, person_id, status, signed_up_at`,
      [eventId, person.id],
    );
    await client.query("COMMIT");
    return { ...signupResult.rows[0], person, alreadyJoined: false };
  } catch (error) {
    await rollback(client);
    throw error;
  } finally {
    client.release();
  }
}

async function rollback(client: PoolClient) {
  try {
    await client.query("ROLLBACK");
  } catch {
    // Preserve the original domain or database error.
  }
}
