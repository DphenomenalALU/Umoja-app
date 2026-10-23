import { NextResponse } from "next/server";
import { createSignup, listSignups } from "@/backend/src/signups/signup-service";
import { isApiError } from "@/backend/src/shared/errors";

export async function POST(request: Request, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const body = await request.json().catch(() => null) as { fullName?: unknown; email?: unknown } | null;
    if (!body || typeof body.fullName !== "string" || typeof body.email !== "string") {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }
    const { eventId } = await params;
    const signup = await createSignup(eventId, { fullName: body.fullName, email: body.email });
    return NextResponse.json({ signup }, { status: signup.alreadyJoined ? 200 : 201 });
  } catch (error) {
    if (isApiError(error)) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Could not join this event. Check the PostgreSQL connection." }, { status: 503 });
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params;
    return NextResponse.json({ signups: await listSignups(eventId) });
  } catch (error) {
    if (isApiError(error)) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Could not load event sign-ups. Check the PostgreSQL connection." }, { status: 503 });
  }
}
