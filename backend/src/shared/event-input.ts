import { ApiError } from "./errors";

export type EventKind = "meeting" | "volunteer";

export type NewEvent = {
  title: string;
  kind: EventKind;
  startsAt: Date;
  venue: string;
  agenda: string;
  capacity: number | null;
};

export function parseNewEvent(input: unknown): NewEvent {
  if (!input || typeof input !== "object") {
    throw new ApiError("An event description is required.");
  }

  const value = input as Record<string, unknown>;
  const title = typeof value.title === "string" ? value.title.trim() : "";
  const venue = typeof value.venue === "string" ? value.venue.trim() : "";
  const agenda = typeof value.agenda === "string" ? value.agenda.trim() : "";
  const kind = value.kind;
  const startsAt = typeof value.startsAt === "string" ? new Date(value.startsAt) : new Date(Number.NaN);

  if (title.length < 3 || title.length > 120) {
    throw new ApiError("Names of events must be between 3 and 120 characters.");
  }
  if (kind !== "meeting" && kind !== "volunteer") {
    throw new ApiError("Choose a meeting or volunteer event.");
  }
  if (!Number.isFinite(startsAt.getTime())) {
    throw new ApiError("Choose a valid event date and time.");
  }
  if (venue.length < 2 || venue.length > 180) {
    throw new ApiError("Venue must be between 2 and 180 characters.");
  }
  if (agenda.length > 4000) {
    throw new ApiError("Agenda must be 4,000 characters or fewer.");
  }

  let capacity: number | null = null;
  if (kind === "volunteer") {
    capacity = Number(value.capacity);
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 5000) {
      throw new ApiError("Volunteer capacity must be between 1 and 5,000.");
    }
  }

  return { title, kind, startsAt, venue, agenda, capacity };
}