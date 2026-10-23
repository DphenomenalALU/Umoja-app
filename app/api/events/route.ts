import { NextResponse } from "next/server";
import { createEvent, listEvents } from "@/backend/src/events/event-service";
import { isApiError } from "@/backend/src/shared/errors";
import { parseNewEvent } from "@/backend/src/shared/event-input";

export async function GET() {
  try {
    return NextResponse.json({ events: await listEvents() });
  } catch {
    return NextResponse.json({ error: "Could not load events. Check the PostgreSQL connection." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const event = await createEvent(parseNewEvent(body));
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    if (isApiError(error)) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Could not create the event. Check the PostgreSQL connection." }, { status: 503 });
  }
}
