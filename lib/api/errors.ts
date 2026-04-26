import axios from "axios";

export class ApiError extends Error {
  readonly statusCode?: number;
  readonly details?: unknown;

  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    const responseMessage = (error.response?.data as { message?: string })
      ?.message;
    const message =
      responseMessage ??
      error.message ??
      "Unexpected API error while calling backend.";

    return new ApiError(message, statusCode, error.response?.data);
  }

  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("Unknown API error.");
}

