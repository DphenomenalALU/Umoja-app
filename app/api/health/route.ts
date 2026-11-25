import { pool } from "@/backend/src/db/pool";
import { connection } from "next/server";

export async function GET() {
  await connection();

  try {
    await pool.query("SELECT 1");
    return Response.json({ status: "healthy", database: "ready" });
  } catch {
    return Response.json(
      { status: "unhealthy", database: "unavailable" },
      { status: 503 },
    );
  }
}
