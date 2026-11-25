import { pool } from "@/backend/src/db/pool";
import { connection } from "next/server";

export async function GET() {
  await connection();

  try {
    await pool.query("SELECT 1");
    return Response.json({ status: "healthy", database: "ready" });
  } catch (error) {
    const code =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "string"
        ? error.code
        : "unknown";
    console.error("Umoja database health check failed", { code });

    return Response.json(
      { status: "unhealthy", database: "unavailable" },
      { status: 503 },
    );
  }
}
