import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Events API Contract", () => {
  it("requires title", async () => {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    assert.equal(response.status, 400);
  });
});
