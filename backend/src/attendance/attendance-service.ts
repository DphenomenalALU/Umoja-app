import { pool } from "../db/pool";
import { ApiError } from "../shared/errors";

export async function checkIn(signupId: string) {
  const signup = await pool.query(
    `
    SELECT id
    FROM signups
    WHERE id = $1
      AND status = 'active'
    `,
    [signupId]
  );

  if (!signup.rows[0]) {
    throw new ApiError(
      "Only active signups can be checked in.",
      400
    );
  }

  const result = await pool.query(
    `
    INSERT INTO attendance (signup_id)
    VALUES ($1)
    ON CONFLICT (signup_id)
    DO NOTHING
    RETURNING *
    `,
    [signupId]
  );

  return result.rows[0];
}

export async function updateVolunteerHours(
  signupId: string,
  hours: number
) {
  if (hours < 0 || hours > 24) {
    throw new ApiError(
      "Volunteer hours must be between 0 and 24.",
      400
    );
  }

  const result = await pool.query(
    `
    UPDATE attendance
    SET volunteer_hours = $1
    WHERE signup_id = $2
    RETURNING *
    `,
    [hours, signupId]
  );

  if (!result.rows[0]) {
    throw new ApiError(
      "Attendance record not found.",
      404
    );
  }

  return result.rows[0];
}