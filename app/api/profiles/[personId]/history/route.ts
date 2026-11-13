import { NextResponse } from "next/server";
import { getVolunteerHistory } from "@/backend/src/attendance/history-service";
import { hasOrganizerSession } from "@/lib/organizer-session";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      personId: string;
    }>;
  }
) {
  if (!await hasOrganizerSession()) {
    return NextResponse.json({ error: "Organizer sign-in is required to view volunteer history." }, { status: 401 });
  }
  try {
    const { personId } = await context.params;
    return NextResponse.json(await getVolunteerHistory(personId));
  } catch {
    return NextResponse.json({ error: "Could not load history." }, { status: 500 });
  }
}
