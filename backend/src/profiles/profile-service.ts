import { pool } from "../db/pool";
import { ApiError } from "../shared/errors";

export async function getProfileByEmail(emailAddress: string) {
  const email = emailAddress.trim().toLowerCase();
  const personResult = await pool.query(
    `SELECT people.id, people.full_name, people.email, people.created_at,
      COUNT(attendance.id)::int AS events_attended,
      COALESCE(SUM(attendance.volunteer_hours), 0)::numeric(8, 2) AS volunteer_hours
     FROM people
     LEFT JOIN signups ON signups.person_id = people.id AND signups.status = 'active'
     LEFT JOIN attendance ON attendance.signup_id = signups.id
     WHERE people.email = $1
     GROUP BY people.id`,
    [email],
  );
  const profile = personResult.rows[0];
  if (!profile) throw new ApiError("Volunteer profile not found.", 404);

  const history = await pool.query(
    `SELECT events.id AS event_id, events.title, events.kind, events.starts_at,
      events.venue, attendance.checked_in_at, attendance.volunteer_hours
     FROM people
     JOIN signups ON signups.person_id = people.id AND signups.status = 'active'
     JOIN attendance ON attendance.signup_id = signups.id
     JOIN events ON events.id = signups.event_id
     WHERE people.id = $1 ORDER BY attendance.checked_in_at DESC`,
    [profile.id],
  );
  return { ...profile, history: history.rows };
}
