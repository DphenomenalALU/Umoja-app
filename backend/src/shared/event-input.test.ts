import { parseNewEvent } from "./event-input";
import { ApiError } from "./errors";

const base = {
  title: " Garden clean-up ",
  kind: "volunteer",
  startsAt: "2026-10-31T09:00:00.000Z",
  venue: " Riverside Gardens ",
  agenda: " Bring gloves.",
  capacity: 20,
};

describe("parseNewEvent", () => {
  it("normalizes required event details", () => {
    expect(parseNewEvent(base)).toEqual({
      title: "Garden clean-up",
      kind: "volunteer",
      startsAt: new Date("2026-10-31T09:00:00.000Z"),
      venue: "Riverside Gardens",
      agenda: "Bring gloves.",
      capacity: 20,
    });
  });

  it("does not apply a capacity limit to meetings", () => {
    expect(parseNewEvent({ ...base, kind: "meeting", capacity: undefined }).capacity).toBeNull();
  });

  it("rejects a volunteer event without a positive capacity", () => {
    expect(() => parseNewEvent({ ...base, capacity: 0 })).toThrow(ApiError);
  });

  it("rejects an invalid date", () => {
    expect(() => parseNewEvent({ ...base, startsAt: "soon" })).toThrow("Choose a valid event date and time.");
  });
});
