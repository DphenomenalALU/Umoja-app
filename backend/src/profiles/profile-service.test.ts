import { pool } from "../db/pool";
import { getProfileByEmail } from "./profile-service";

// Replace the real connection pool so these tests never reach a database.
jest.mock("../db/pool", () => ({
  pool: { query: jest.fn() },
}));

const mockedQuery = pool.query as unknown as jest.Mock;

const person = {
  id: "person-1",
  full_name: "Amina Njeri",
  email: "amina@example.org",
  created_at: "2026-09-01T08:00:00.000Z",
  events_attended: 2,
  volunteer_hours: "6.50",
};

const history = [
  { event_id: "event-2", title: "River clean-up", kind: "volunteer", volunteer_hours: "4.00" },
  { event_id: "event-1", title: "Garden clean-up", kind: "volunteer", volunteer_hours: "2.50" },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getProfileByEmail", () => {
  it("returns a volunteer's total hours with their attended-event history", async () => {
    mockedQuery.mockResolvedValueOnce({ rows: [person] }).mockResolvedValueOnce({ rows: history });

    await expect(getProfileByEmail("amina@example.org")).resolves.toEqual({ ...person, history });
  });

  it("finds a profile regardless of email case or surrounding spaces", async () => {
    mockedQuery.mockResolvedValueOnce({ rows: [person] }).mockResolvedValueOnce({ rows: history });

    await getProfileByEmail("  Amina@Example.ORG ");

    expect(mockedQuery).toHaveBeenNthCalledWith(1, expect.any(String), ["amina@example.org"]);
  });

  it("returns an empty history and zero hours for a volunteer who has not attended yet", async () => {
    const newcomer = { ...person, events_attended: 0, volunteer_hours: "0.00" };
    mockedQuery.mockResolvedValueOnce({ rows: [newcomer] }).mockResolvedValueOnce({ rows: [] });

    await expect(getProfileByEmail("amina@example.org")).resolves.toEqual({ ...newcomer, history: [] });
  });

  it("returns a 404 for an unknown email without loading history", async () => {
    mockedQuery.mockResolvedValueOnce({ rows: [] });

    await expect(getProfileByEmail("nobody@example.org")).rejects.toMatchObject({
      message: "Volunteer profile not found.",
      statusCode: 404,
    });
    expect(mockedQuery).toHaveBeenCalledTimes(1);
  });
});
