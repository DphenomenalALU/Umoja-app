import { NextResponse } from "next/server";
import { getProfileByEmail } from "@/backend/src/profiles/profile-service";
import { isApiError } from "@/backend/src/shared/errors";

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email");
  if (!email) return NextResponse.json({ error: "An email query parameter is required." }, { status: 400 });
  try {
    return NextResponse.json({ profile: await getProfileByEmail(email) });
  } catch (error) {
    if (isApiError(error)) return NextResponse.json({ error: error.message }, { status: error.statusCode });
    return NextResponse.json({ error: "Could not load this volunteer profile. Check the PostgreSQL connection." }, { status: 503 });
  }
}
