import type { UmojaEvent } from "@/components/dashboard/types";

export type ApiEvent = {
  id: string;
  title: string;
  kind: "meeting" | "volunteer";
  starts_at: string;
  venue: string;
  agenda: string;
  capacity: number | null;
  created_at: string;
  signup_count: number;
};

export type CreateEventInput = {
  title: string;
  kind: "meeting" | "volunteer";
  startsAt: string;
  venue: string;
  agenda: string;
  capacity: number | null;
};

export type SignupResponse = {
  id: string;
  event_id?: string;
  person: {
    id: string;
    full_name: string;
    email: string;
  };
  alreadyJoined: boolean;
};

async function readJson(response: Response) {
  return response.json().catch(() => null) as Promise<Record<string, unknown> | null>;
}

export async function getEvents(): Promise<ApiEvent[]> {
  const response = await fetch("/api/events");
  const body = await readJson(response);
  if (!response.ok) {
    throw new Error(typeof body?.error === "string" ? body.error : "Could not load events.");
  }
  if (!Array.isArray(body?.events)) {
    throw new Error("The events API returned an invalid response.");
  }
  return body.events as ApiEvent[];
}

export async function createEvent(input: CreateEventInput): Promise<ApiEvent> {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await readJson(response);
  if (!response.ok) {
    throw new Error(typeof body?.error === "string" ? body.error : "Could not create the event.");
  }
  if (!body?.event || typeof body.event !== "object") {
    throw new Error("The create-event API returned an invalid response.");
  }
  return body.event as ApiEvent;
}

export async function createSignup(
  eventId: string,
  input: { fullName: string; email: string },
): Promise<SignupResponse> {
  const response = await fetch(`/api/events/${eventId}/signups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await readJson(response);
  if (!response.ok) {
    throw new Error(typeof body?.error === "string" ? body.error : "Could not join this event.");
  }
  if (!body?.signup || typeof body.signup !== "object") {
    throw new Error("The sign-up API returned an invalid response.");
  }
  return body.signup as SignupResponse;
}

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatEventTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function toDashboardEvent(event: ApiEvent): UmojaEvent {
  return {
    id: event.id,
    title: event.title,
    kind: event.kind === "volunteer" ? "Volunteer day" : "Community meeting",
    date: formatEventDate(event.starts_at),
    time: formatEventTime(event.starts_at),
    venue: event.venue,
    agenda: event.agenda,
    capacity: event.capacity,
    signupCount: event.signup_count,
    attendees: [],
  };
}