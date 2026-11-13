export type EventSignup = {
  event_id: string;
  signup_id: string;
  person_id: string;
  full_name: string;
  email: string;
  signed_up_at: string;
  checked_in_at: string | null;
  volunteer_hours: number | string;
};

export type VolunteerProfile = {
  id: string;
  full_name: string;
  email: string;
  events_attended: number | string;
  volunteer_hours: number | string;
};

export type VolunteerHistoryEntry = {
  id: string;
  title: string;
  kind: "meeting" | "volunteer";
  checked_in_at: string;
  volunteer_hours: number | string;
};

export type VolunteerHistory = {
  totalHours: number;
  history: VolunteerHistoryEntry[];
};

export type OrganizerSession = {
  authorized: boolean;
  configured: boolean;
};

async function readJson(response: Response) {
  return response.json().catch(() => null) as Promise<Record<string, unknown> | null>;
}

function errorMessage(body: Record<string, unknown> | null, fallback: string) {
  return typeof body?.error === "string" ? body.error : fallback;
}

export async function getOrganizerSession(): Promise<OrganizerSession> {
  const response = await fetch("/api/organizer/session", { cache: "no-store" });
  const body = await readJson(response);
  if (!response.ok || typeof body?.authorized !== "boolean" || typeof body.configured !== "boolean") {
    throw new Error(errorMessage(body, "Could not check organizer access."));
  }
  return { authorized: body.authorized, configured: body.configured };
}

export async function signInOrganizer(accessCode: string): Promise<OrganizerSession> {
  const response = await fetch("/api/organizer/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessCode }),
  });
  const body = await readJson(response);
  if (!response.ok || body?.authorized !== true) {
    throw new Error(errorMessage(body, "Could not sign in as an organizer."));
  }
  return { authorized: true, configured: true };
}

export async function signOutOrganizer() {
  const response = await fetch("/api/organizer/session", { method: "DELETE" });
  const body = await readJson(response);
  if (!response.ok || body?.authorized !== false) {
    throw new Error(errorMessage(body, "Could not sign out."));
  }
}

export async function getEventSignups(eventId: string): Promise<EventSignup[]> {
  const response = await fetch(`/api/events/${encodeURIComponent(eventId)}/signups`);
  const body = await readJson(response);
  if (!response.ok) throw new Error(errorMessage(body, "Could not load sign-ups."));
  if (!Array.isArray(body?.signups)) throw new Error("The sign-ups API returned an invalid response.");
  return body.signups as EventSignup[];
}

export async function checkInSignup(eventId: string, signupId: string, volunteerHours: number) {
  const response = await fetch(`/api/events/${encodeURIComponent(eventId)}/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signupId, volunteerHours }),
  });
  const body = await readJson(response);
  if (!response.ok) throw new Error(errorMessage(body, "Could not record attendance."));
  if (!body?.attendance || typeof body.attendance !== "object") {
    throw new Error("The check-in API returned an invalid response.");
  }
}

export async function getVolunteerProfile(email: string): Promise<VolunteerProfile> {
  const response = await fetch(`/api/profiles?email=${encodeURIComponent(email)}`);
  const body = await readJson(response);
  if (!response.ok) throw new Error(errorMessage(body, "Could not load this volunteer profile."));
  if (!body?.profile || typeof body.profile !== "object") {
    throw new Error("The profile API returned an invalid response.");
  }
  return body.profile as VolunteerProfile;
}

export async function getVolunteerHistory(personId: string): Promise<VolunteerHistory> {
  const response = await fetch(`/api/profiles/${encodeURIComponent(personId)}/history`);
  const body = await readJson(response);
  if (!response.ok) throw new Error(errorMessage(body, "Could not load volunteer history."));
  if (typeof body?.totalHours !== "number" || !Array.isArray(body.history)) {
    throw new Error("The volunteer history API returned an invalid response.");
  }
  return body as unknown as VolunteerHistory;
}
