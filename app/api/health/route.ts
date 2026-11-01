import { pool } from "@/backend/src/db/pool";

export async function GET() {
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
