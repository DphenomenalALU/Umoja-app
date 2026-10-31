import { ApiError } from "../shared/errors";

export function ensureCapacity(capacity: number | null, activeSignups: number) {
  if (capacity !== null && activeSignups >= capacity) {
    throw new ApiError("This event has no open spaces left.", 409);
  }
}
