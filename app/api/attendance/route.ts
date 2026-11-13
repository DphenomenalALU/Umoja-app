import { NextResponse } from "next/server";

import {
  checkIn,
  updateVolunteerHours,
} from "@/backend/src/attendance/attendance-service";

import {
  isApiError,
} from "@/backend/src/shared/errors";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const attendance = await checkIn(
      body.signupId
    );

    return NextResponse.json(
      { attendance },
      { status: 201 }
    );

  } catch (error) {

    if (isApiError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Could not check in volunteer." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request
) {
  try {
    const body = await request.json();

    const attendance =
      await updateVolunteerHours(
        body.signupId,
        body.hours
      );

    return NextResponse.json({
      attendance,
    });

  } catch (error) {

    if (isApiError(error)) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Could not update hours." },
      { status: 500 }
    );
  }
}