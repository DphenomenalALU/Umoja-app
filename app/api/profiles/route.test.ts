import { getProfileByEmail } from "@/backend/src/profiles/profile-service";
import { ApiError } from "@/backend/src/shared/errors";
import { GET } from "./route";

// Replace the database-backed service so these tests never reach PostgreSQL.
jest.mock("@/backend/src/profiles/profile-service", () => ({
  getProfileByEmail: jest.fn(),
}));

const mockedGetProfile = getProfileByEmail as jest.Mock;

const getProfile = (query = "") => GET(new Request(`http://localhost/api/profiles${query}`));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/profiles", () => {
  it("returns the profile for an email", async () => {
    const profile = { full_name: "Amina Njeri", volunteer_hours: "6.50", history: [] };
    mockedGetProfile.mockResolvedValue(profile);

    const response = await getProfile("?email=amina%40example.org");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ profile });
    expect(mockedGetProfile).toHaveBeenCalledWith("amina@example.org");
  });

  it.each([
    ["no email", ""],
    ["an empty email", "?email="],
  ])("rejects a request with %s", async (_case, query) => {
    const response = await getProfile(query);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "An email query parameter is required." });
    expect(mockedGetProfile).not.toHaveBeenCalled();
  });

  it("returns a 404 for an unknown volunteer", async () => {
    mockedGetProfile.mockRejectedValue(new ApiError("Volunteer profile not found.", 404));

    const response = await getProfile("?email=nobody%40example.org");

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Volunteer profile not found." });
  });

  it("returns a 503 when the database is unavailable", async () => {
    mockedGetProfile.mockRejectedValue(new Error("connection refused"));

    const response = await getProfile("?email=amina%40example.org");

    expect(response.status).toBe(503);
  });
});
