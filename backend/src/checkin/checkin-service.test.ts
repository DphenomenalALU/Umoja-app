import { pool } from "../db/pool";
import { checkInSignup } from "./checkin-service";

// Replace the real connection pool so these tests never reach a database.
jest.mock("../db/pool", () => ({
  pool: { query: jest.fn() },
}));

const mockedQuery = pool.query as unknown as jest.Mock;

const attendance = (volunteerHours: number) => ({
  id: "attendance-1",
  signup_id: "signup-1",
  checked_in_at: "2026-10-31T11:00:00.000Z",
  volunteer_hours: volunteerHours.toFixed(2),
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("checkInSignup", () => {
  it("checks in an active signup and records the hours given", async () => {
    mockedQuery.mockResolvedValue({ rows: [attendance(2.5)] });

    await expect(checkInSignup("event-1", "signup-1", 2.5)).resolves.toEqual(attendance(2.5));
    expect(mockedQuery).toHaveBeenCalledWith(expect.any(String), ["signup-1", "event-1", 2.5]);
  });

  it.each([0, 24])("accepts %i volunteer hours", async (hours) => {
    mockedQuery.mockResolvedValue({ rows: [attendance(hours)] });

    await expect(checkInSignup("event-1", "signup-1", hours)).resolves.toMatchObject({ signup_id: "signup-1" });
  });

  it.each([-0.25, 24.25, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects %p volunteer hours before touching the database",
    async (hours) => {
      await expect(checkInSignup("event-1", "signup-1", hours)).rejects.toMatchObject({
        message: "Volunteer hours must be between 0 and 24.",
        statusCode: 400,
      });
      expect(mockedQuery).not.toHaveBeenCalled();
    },
  );

  it("returns a 404 when there is no active signup to check in", async () => {
    mockedQuery.mockResolvedValue({ rows: [] });

    await expect(checkInSignup("event-1", "cancelled-signup", 2)).rejects.toMatchObject({
      message: "Active signup not found, or hours cannot be added to a meeting.",
      statusCode: 404,
    });
  });
});
