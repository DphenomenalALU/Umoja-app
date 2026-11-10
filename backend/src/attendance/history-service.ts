import { pool } from "../db/pool";

export async function getVolunteerHistory(
  personId: string
) {
  const history = await pool.query(
    `
    SELECT
      events.id,
      events.title,
      events.kind,
      attendance.checked_in_at,
      attendance.volunteer_hours
    FROM attendance
    JOIN signups
      ON signups.id = attendance.signup_id
    JOIN events
      ON events.id = signups.event_id
    WHERE signups.person_id = $1
    ORDER BY attendance.checked_in_at DESC
    `,
    [personId]
  );

  const totals = await pool.query(
    `
    SELECT
      COALESCE(
        SUM(attendance.volunteer_hours),
        0
      ) AS total_hours
    FROM attendance
    JOIN signups
      ON signups.id = attendance.signup_id
    WHERE signups.person_id = $1
    `,
    [personId]
  );

  return {
    totalHours: Number(
      totals.rows[0].total_hours
    ),
    history: history.rows,
  };
}