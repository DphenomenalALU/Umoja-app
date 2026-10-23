import { pool } from "../db/pool";
import { ApiError } from "../shared/errors";

export async function checkInSignup(eventId: string, signupId: string, volunteerHours: number) {
  if (!Number.isFinite(volunteerHours) || volunteerHours < 0 || volunteerHours > 24) {
    throw new ApiError("Volunteer hours must be between 0 and 24.");
  }
  const result = await pool.query(
    `INSERT INTO attendance (signup_id, volunteer_hours)
     SELECT signups.id, $3
     FROM signups JOIN events ON events.id = signups.event_id
     WHERE signups.id = $1 AND signups.event_id = $2 AND signups.status = 'active'
       AND (events.kind = 'volunteer' OR $3 = 0)
     ON CONFLICT (signup_id) DO UPDATE SET checked_in_at = NOW(), volunteer_hours = EXCLUDED.volunteer_hours
     RETURNING id, signup_id, checked_in_at, volunteer_hours`,
    [signupId, eventId, volunteerHours],
  );
  if (!result.rows[0]) {
    throw new ApiError("Active signup not found, or hours cannot be added to a meeting.", 404);
  }
  return result.rows[0];
}
