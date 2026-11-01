import { GET } from "./route";
import { pool } from "@/backend/src/db/pool";

jest.mock("@/backend/src/db/pool", () => ({
  pool: {
    query: jest.fn(),
  },
}));

const query = pool.query as jest.Mock;

describe("GET /api/health", () => {
  beforeEach(() => {
    query.mockReset();
  });

  it("returns healthy when PostgreSQL is reachable", async () => {
    query.mockResolvedValue({ rows: [], command: "SELECT", rowCount: 1, oid: 0, fields: [] });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "healthy",
      database: "ready",
    });
    expect(query).toHaveBeenCalledWith("SELECT 1");
  });

  it("returns unhealthy when PostgreSQL is unavailable", async () => {
    query.mockRejectedValue(new Error("database unavailable"));

    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      status: "unhealthy",
      database: "unavailable",
    });
  });
});
