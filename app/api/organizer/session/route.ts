import { NextResponse } from "next/server";
import {
  createOrganizerSessionToken,
  hasOrganizerSession,
  isOrganizerAccessCodeValid,
  isOrganizerAccessConfigured,
  organizerSessionCookieName,
  organizerSessionCookieOptions,
} from "@/lib/organizer-session";

export async function GET() {
  return NextResponse.json({
    authorized: await hasOrganizerSession(),
    configured: isOrganizerAccessConfigured(),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { accessCode?: unknown } | null;
  if (!isOrganizerAccessConfigured()) {
    return NextResponse.json({ error: "Organizer access is not configured on this server." }, { status: 503 });
  }
  if (!body || typeof body.accessCode !== "string" || !isOrganizerAccessCodeValid(body.accessCode)) {
    return NextResponse.json({ error: "That organizer access code is not valid." }, { status: 401 });
  }

  const response = NextResponse.json({ authorized: true });
  response.cookies.set(organizerSessionCookieName, createOrganizerSessionToken(), organizerSessionCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authorized: false });
  response.cookies.set(organizerSessionCookieName, "", { ...organizerSessionCookieOptions(), maxAge: 0 });
  return response;
}
