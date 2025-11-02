import { env } from "@repo/env";
import { type Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

interface ErrorResponse {
  success: false;
  code: string;
  message: string;
  errors?: Record<string, string[]>;
  stack?: string;
}

export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidCredentialsError extends ApplicationError {
  constructor(message = "Invalid credentials") {
    super(message, "invalid_credentials", 401);
  }
}

export class CreateUserError extends ApplicationError {
  constructor(message = "Failed to create user") {
    super(message, "create_user_failed", 400);
  }
}

export class InternalError extends ApplicationError {
  constructor(message = "Internal server error") {
    super(message, "internal_error", 500);
  }
}

export class TokenVerificationError extends ApplicationError {
  constructor(message = "Token verification failed") {
    super(message, "token_verification_failed", 401);
  }
}

export class TokenRefreshError extends ApplicationError {
  constructor(message = "Token refresh failed") {
    super(message, "token_refresh_failed", 401);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = "Resource not found") {
    super(message, "not_found", 404);
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message = "Unauthorized") {
    super(message, "unauthorized", 401);
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message = "Forbidden") {
    super(message, "forbidden", 403);
  }
}

export class ValidationError extends ApplicationError {
  constructor(
    message = "Validation failed",
    public readonly errors?: Record<string, string[]>
  ) {
    super(message, "validation_error", 422);
  }
}

export async function handleErrors(
  _error: Error | HTTPException,
  _context: Context
): Promise<Response> {
  const isDev = env.NODE_ENV === "development";

  if (_error instanceof HTTPException) {
    const status = _error.status;
    const response: ErrorResponse = {
      success: false,
      code: `http_${status}`,
      message: _error.message,
    };

    if (isDev) response.stack = _error.stack;

    return _context.json(response, status as any);
  }

  if (_error instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of _error.issues) {
      const path = issue.path.join(".");
      if (!errors[path]) errors[path] = [];
      errors[path].push(issue.message);
    }

    const response: ErrorResponse = {
      success: false,
      code: "validation_error",
      message: "Validation failed",
      errors,
    };

    if (isDev) response.stack = _error.stack;

    return _context.json(response, 422 as any);
  }

  if (_error instanceof ApplicationError) {
    const response: ErrorResponse = {
      success: false,
      code: _error.code,
      message: _error.message,
    };

    if (_error instanceof ValidationError && _error.errors)
      response.errors = _error.errors;

    if (isDev) response.stack = _error.stack;

    return _context.json(response, _error.statusCode as any);
  }

  const response: ErrorResponse = {
    success: false,
    code: "internal_error",
    message: isDev ? _error.message : "An unexpected error occurred",
  };

  if (isDev) response.stack = _error.stack;

  return _context.json(response, 500 as any);
}

export function throwError(
  _message: string,
  _code: string,
  _statusCode = 400
): never {
  throw new ApplicationError(_message, _code, _statusCode);
}
