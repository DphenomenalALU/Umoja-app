import { ApiError } from "../shared/errors";
import { ensureCapacity } from "./capacity";

describe("ensureCapacity", () => {
  it("allows an open spot", () => {
    expect(() => ensureCapacity(20, 19)).not.toThrow();
  });

  it("allows the first sign-up for a single-spot event", () => {
    expect(() => ensureCapacity(1, 0)).not.toThrow();
  });

  it("allows unlimited attendance for a meeting", () => {
    expect(() => ensureCapacity(null, 500)).not.toThrow();
  });

  it("rejects sign-ups when all volunteer spots are taken", () => {
    expect(() => ensureCapacity(20, 20)).toThrow(ApiError);
    expect(() => ensureCapacity(20, 20)).toThrow("This event has no open spaces left.");
  });

  it("reports a full event as a 409 conflict", () => {
    expect(() => ensureCapacity(20, 20)).toThrow(expect.objectContaining({ statusCode: 409 }));
  });

  it("rejects a second sign-up for a single-spot event", () => {
    expect(() => ensureCapacity(1, 1)).toThrow(ApiError);
  });

  it("rejects sign-ups when an event is already over capacity", () => {
    expect(() => ensureCapacity(20, 21)).toThrow(ApiError);
  });
});
