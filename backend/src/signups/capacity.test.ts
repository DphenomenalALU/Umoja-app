import { ApiError } from "../shared/errors";
import { ensureCapacity } from "./capacity";

describe("ensureCapacity", () => {
  it("allows an open spot", () => {
    expect(() => ensureCapacity(20, 19)).not.toThrow();
  });

  it("allows unlimited attendance for a meeting", () => {
    expect(() => ensureCapacity(null, 500)).not.toThrow();
  });

  it("rejects sign-ups when all volunteer spots are taken", () => {
    expect(() => ensureCapacity(20, 20)).toThrow(ApiError);
    try {
      ensureCapacity(20, 20);
    } catch (error) {
      expect((error as ApiError).statusCode).toBe(409);
    }
  });
});
