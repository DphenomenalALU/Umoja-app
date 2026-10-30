import { checkInSignup } from "@/backend/src/checkin/checkin-service";
import { ApiError } from "@/backend/src/shared/errors";
import { POST } from "./route";

// Replace the database-backed service so these tests never reach PostgreSQL.
jest.mock("@/backend/src/checkin/checkin-service", () => ({
  checkInSignup: jest.fn(),
}));

const mockedCheckIn = checkInSignup as jest.Mock;

const checkIn = (body: unknown, eventId = "event-1") =>
  POST(
    new Request(`http://localhost/api/events/${eventId}/checkin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    { params: Promise.resolve({ eventId }) },
  );

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/events/:eventId/checkin", () => {
  it("checks in a signup and returns the attendance record", async () => {
    const attendance = { id: "attendance-1", signup_id: "signup-1", volunteer_hours: "2.50" };
    mockedCheckIn.mockResolvedValue(attendance);

    const response = await checkIn({ signupId: "signup-1", volunteerHours: 2.5 });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ attendance });
    expect(mockedCheckIn).toHaveBeenCalledWith("event-1", "signup-1", 2.5);
  });

  it.each([
    ["an empty body", {}],
    ["a missing signup ID", { volunteerHours: 2 }],
    ["missing hours", { signupId: "signup-1" }],
    ["hours sent as text", { signupId: "signup-1", volunteerHours: "2" }],
    ["a body that is not JSON", "not json"],
  ])("rejects %s with a 400", async (_case, body) => {
    const response = await checkIn(body);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Signup ID and volunteer hours are required." });
    expect(mockedCheckIn).not.toHaveBeenCalled();
  });

  it("passes on the service's error message and status", async () => {
    mockedCheckIn.mockRejectedValue(new ApiError("Volunteer hours must be between 0 and 24."));

    const response = await checkIn({ signupId: "signup-1", volunteerHours: 30 });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Volunteer hours must be between 0 and 24." });
  });

  it("returns a 404 when the signup cannot be checked in", async () => {
    mockedCheckIn.mockRejectedValue(new ApiError("Active signup not found, or hours cannot be added to a meeting.", 404));

    const response = await checkIn({ signupId: "missing", volunteerHours: 2 });

    expect(response.status).toBe(404);
  });

  it("returns a 503 when the database is unavailable", async () => {
    mockedCheckIn.mockRejectedValue(new Error("connection refused"));

    const response = await checkIn({ signupId: "signup-1", volunteerHours: 2 });

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "Could not check in this volunteer. Check the PostgreSQL connection.",
    });
  });
});
