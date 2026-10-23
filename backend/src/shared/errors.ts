export class ApiError extends Error {
  constructor(message: string, public readonly statusCode = 400) {
    super(message);
    this.name = "ApiError";
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
