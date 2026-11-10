import { NextResponse } from "next/server";

import {
  getVolunteerHistory,
} from "@/backend/src/attendance/history-service";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      personId: string;
    }>;
  }
) {
  try {
    const { personId } = await context.params;
    const result =
      await getVolunteerHistory(
        personId
      );

    return NextResponse.json(result);

  } catch {

    return NextResponse.json(
      { error: "Could not load history." },
      { status: 500 }
    );
  }
}
