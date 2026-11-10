import { NextResponse } from "next/server";

import {
  getVolunteerHistory,
} from "@/backend/src/attendance/history-service";

export async function GET(
  request: Request,
  context: {
    params: {
      personId: string;
    };
  }
) {
  try {

    const result =
      await getVolunteerHistory(
        context.params.personId
      );

    return NextResponse.json(result);

  } catch {

    return NextResponse.json(
      { error: "Could not load history." },
      { status: 500 }
    );
  }
}