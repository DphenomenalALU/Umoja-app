import { POST } from "./route";

describe("Events API Contract", () => {
  it("requires a title", async () => {
    const request = new Request("http://localhost/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Names of events must be between 3 and 120 characters." });
  });
});
