import { pool } from "../db/pool";
import { createSignup, listSignups } from "./signup-service";

// Replace the real connection pool so these tests never reach a database.
jest.mock("../db/pool", () => ({
  pool: { connect: jest.fn(), query: jest.fn() },
}));

const mockedPool = pool as unknown as { connect: jest.Mock; query: jest.Mock };

type FakeEvent = {
  exists?: boolean;
  capacity?: number | null;
  activeSignups?: number;
  existingStatus?: "active" | "cancelled";
};

// A stand-in database client that answers each query in createSignup's transaction.
function fakeClient({ exists = true, capacity = 20, activeSignups = 0, existingStatus }: FakeEvent = {}) {
  const query = jest.fn(async (sql: string, params: unknown[] = []) => {
    if (sql.includes("FROM events")) {
      return { rows: exists ? [{ id: "event-1", capacity }] : [] };
    }
    if (sql.includes("INSERT INTO people")) {
      return { rows: [{ id: "person-1", full_name: params[0], email: params[1] }] };
    }
    if (sql.includes("SELECT id, status FROM signups")) {
      return { rows: existingStatus ? [{ id: "signup-1", status: existingStatus }] : [] };
    }
    if (sql.includes("COUNT(*)")) {
      return { rows: [{ count: activeSignups }] };
    }
    if (sql.includes("INSERT INTO signups")) {
      return { rows: [{ id: "signup-2", event_id: params[0], person_id: params[1], status: "active" }] };
    }
    return { rows: [] };
  });
  const client = { query, release: jest.fn() };
  mockedPool.connect.mockResolvedValue(client);

  const statements = () => query.mock.calls.map(([sql]) => sql as string);
  const savedSignup = () => statements().some((sql) => sql.includes("INSERT INTO signups"));
  return { client, statements, savedSignup };
}

const volunteer = { fullName: "Amina Njeri", email: "amina@example.org" };

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createSignup", () => {
  it("signs a volunteer up when a spot is open", async () => {
    const db = fakeClient({ capacity: 20, activeSignups: 19 });

    const signup = await createSignup("event-1", volunteer);

    expect(signup).toMatchObject({ id: "signup-2", status: "active", alreadyJoined: false });
    expect(db.savedSignup()).toBe(true);
    expect(db.statements()).toContain("COMMIT");
    expect(db.client.release).toHaveBeenCalled();
  });

  it("stores the email trimmed and lower-cased so returning volunteers are recognised", async () => {
    fakeClient();

    const signup = await createSignup("event-1", { fullName: "  Amina Njeri ", email: "  Amina@Example.ORG " });

    expect(signup.person).toMatchObject({ full_name: "Amina Njeri", email: "amina@example.org" });
  });

  it("rejects a sign-up for a full event with a 409 and saves nothing", async () => {
    const db = fakeClient({ capacity: 20, activeSignups: 20 });

    await expect(createSignup("event-1", volunteer)).rejects.toMatchObject({
      message: "This event has no open spaces left.",
      statusCode: 409,
    });
    expect(db.savedSignup()).toBe(false);
    expect(db.statements()).toContain("ROLLBACK");
    expect(db.client.release).toHaveBeenCalled();
  });

  it("lets anyone join a meeting regardless of attendance", async () => {
    const db = fakeClient({ capacity: null, activeSignups: 500 });

    await expect(createSignup("event-1", volunteer)).resolves.toMatchObject({ alreadyJoined: false });
    expect(db.savedSignup()).toBe(true);
  });

  it("tells a volunteer who already joined, even once the event is full", async () => {
    const db = fakeClient({ capacity: 20, activeSignups: 20, existingStatus: "active" });

    await expect(createSignup("event-1", volunteer)).resolves.toMatchObject({
      id: "signup-1",
      alreadyJoined: true,
    });
    expect(db.savedSignup()).toBe(false);
  });

  it("reactivates a cancelled sign-up when a spot is open", async () => {
    const db = fakeClient({ existingStatus: "cancelled" });

    await expect(createSignup("event-1", volunteer)).resolves.toMatchObject({ alreadyJoined: false });
    expect(db.savedSignup()).toBe(true);
  });

  it("returns a 404 for an unknown event", async () => {
    const db = fakeClient({ exists: false });

    await expect(createSignup("missing", volunteer)).rejects.toMatchObject({
      message: "Event not found.",
      statusCode: 404,
    });
    expect(db.statements()).toContain("ROLLBACK");
    expect(db.client.release).toHaveBeenCalled();
  });

  it.each(["A", "a".repeat(101), "   "])("rejects the name %p before touching the database", async (fullName) => {
    await expect(createSignup("event-1", { ...volunteer, fullName })).rejects.toMatchObject({
      message: "Enter a name between 2 and 100 characters.",
      statusCode: 400,
    });
    expect(mockedPool.connect).not.toHaveBeenCalled();
  });

  it.each(["", "amina", "amina@example", "amina @example.org", `${"a".repeat(250)}@example.org`])(
    "rejects the email %p before touching the database",
    async (email) => {
      await expect(createSignup("event-1", { ...volunteer, email })).rejects.toMatchObject({
        message: "Enter a valid email address.",
        statusCode: 400,
      });
      expect(mockedPool.connect).not.toHaveBeenCalled();
    },
  );
});

describe("listSignups", () => {
  it("returns a 404 for an unknown event", async () => {
    mockedPool.query.mockResolvedValue({ rows: [] });

    await expect(listSignups("missing")).rejects.toMatchObject({ statusCode: 404 });
  });

  it("returns an empty list for an event nobody has joined yet", async () => {
    mockedPool.query.mockResolvedValue({ rows: [{ event_id: "event-1", signup_id: null }] });

    await expect(listSignups("event-1")).resolves.toEqual([]);
  });

  it("returns each active sign-up", async () => {
    const row = { event_id: "event-1", signup_id: "signup-1", full_name: "Amina Njeri" };
    mockedPool.query.mockResolvedValue({ rows: [row] });

    await expect(listSignups("event-1")).resolves.toEqual([row]);
  });
});
