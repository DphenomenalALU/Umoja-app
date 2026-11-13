import { pool } from "../db/pool";
import { ApiError } from "../shared/errors";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function checkIn(signupId: string) {
  if (typeof signupId !== "string" || !UUID_PATTERN.test(signupId)) {
    throw new ApiError(
      "A signup ID is required.",
      400
    );
  }

  const result = await pool.query(
    `
    INSERT INTO attendance (signup_id)
    SELECT id
    FROM signups
    WHERE id = $1
      AND status = 'active'
    ON CONFLICT (signup_id)
    DO UPDATE
      SET checked_in_at = attendance.checked_in_at
    RETURNING *
    `,
    [signupId]
  );

  if (!result.rows[0]) {
    throw new ApiError(
      "Only active signups can be checked in.",
      400
    );
  }

  return result.rows[0];
}

export async function updateVolunteerHours(
  signupId: string,
  hours: number
) {
  if (
    typeof signupId !== "string" ||
    !UUID_PATTERN.test(signupId) ||
    typeof hours !== "number" ||
    !Number.isFinite(hours) ||
    hours < 0 ||
    hours > 24
  ) {
    throw new ApiError(
      "Provide a signup ID and volunteer hours between 0 and 24.",
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
