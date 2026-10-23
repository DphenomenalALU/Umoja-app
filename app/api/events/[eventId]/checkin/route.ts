import { NextResponse } from "next/server";
import { checkInSignup } from "@/backend/src/checkin/checkin-service";
import { isApiError } from "@/backend/src/shared/errors";

export async function POST(request: Request, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const body = await request.json().catch(() => null) as { signupId?: unknown; volunteerHours?: unknown } | null;
    if (!body || typeof body.signupId !== "string" || typeof body.volunteerHours !== "number") {
      return NextResponse.json({ error: "Signup ID and volunteer hours are required." }, { status: 400 });
    }
    const { eventId } = await params;
    const attendance = await checkInSignup(eventId, body.signupId, body.volunteerHours);
    return NextResponse.json({ attendance });
  } catch (error) {
    if (isApiError(error)) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Could not check in this volunteer. Check the PostgreSQL connection." }, { status: 503 });
  }
}
