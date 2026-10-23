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

const text = (length: number) => "a".repeat(length);

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

  it("ignores a capacity sent with a meeting", () => {
    expect(parseNewEvent({ ...base, kind: "meeting", capacity: 50 }).capacity).toBeNull();
  });

  it("allows an event without an agenda", () => {
    expect(parseNewEvent({ ...base, agenda: undefined }).agenda).toBe("");
  });

  it.each([null, undefined, "Garden clean-up", 42])("rejects a missing event description (%p)", (input) => {
    expect(() => parseNewEvent(input)).toThrow("An event description is required.");
  });

  describe("title", () => {
    it.each([3, 120])("accepts a %i-character title", (length) => {
      expect(parseNewEvent({ ...base, title: text(length) }).title).toHaveLength(length);
    });

    it.each([0, 2, 121])("rejects a %i-character title", (length) => {
      expect(() => parseNewEvent({ ...base, title: text(length) })).toThrow(
        "Names of events must be between 3 and 120 characters.",
      );
    });

    it("does not count surrounding spaces towards the minimum length", () => {
      expect(() => parseNewEvent({ ...base, title: "   ab   " })).toThrow(
        "Names of events must be between 3 and 120 characters.",
      );
    });
  });

  describe("kind", () => {
    it.each(["party", "Meeting", undefined])("rejects an unknown event kind (%p)", (kind) => {
      expect(() => parseNewEvent({ ...base, kind })).toThrow("Choose a meeting or volunteer event.");
    });
  });

  describe("start time", () => {
    it.each(["soon", "", 1793437200000, undefined])("rejects an invalid date (%p)", (startsAt) => {
      expect(() => parseNewEvent({ ...base, startsAt })).toThrow("Choose a valid event date and time.");
    });
  });

  describe("venue", () => {
    it.each([2, 180])("accepts a %i-character venue", (length) => {
      expect(parseNewEvent({ ...base, venue: text(length) }).venue).toHaveLength(length);
    });

    it.each([0, 1, 181])("rejects a %i-character venue", (length) => {
      expect(() => parseNewEvent({ ...base, venue: text(length) })).toThrow(
        "Venue must be between 2 and 180 characters.",
      );
    });
  });

  describe("agenda", () => {
    it("accepts a 4,000-character agenda", () => {
      expect(parseNewEvent({ ...base, agenda: text(4000) }).agenda).toHaveLength(4000);
    });

    it("rejects an agenda longer than 4,000 characters", () => {
      expect(() => parseNewEvent({ ...base, agenda: text(4001) })).toThrow(
        "Agenda must be 4,000 characters or fewer.",
      );
    });
  });

  describe("volunteer capacity", () => {
    it.each([1, 5000])("accepts a capacity of %i", (capacity) => {
      expect(parseNewEvent({ ...base, capacity }).capacity).toBe(capacity);
    });

    it.each([0, -5, 5001, 2.5, "lots", undefined])("rejects a capacity of %p", (capacity) => {
      expect(() => parseNewEvent({ ...base, capacity })).toThrow(
        "Volunteer capacity must be between 1 and 5,000.",
      );
    });

    it("reports invalid input as a 400 error", () => {
      expect(() => parseNewEvent({ ...base, capacity: 0 })).toThrow(ApiError);
      expect(() => parseNewEvent({ ...base, capacity: 0 })).toThrow(
        expect.objectContaining({ statusCode: 400 }),
      );
    });
  });
});
