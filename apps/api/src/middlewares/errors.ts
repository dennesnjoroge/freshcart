import { ZodError } from "zod";
import type {
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import { ApiError } from "../errors/api-error.js";

export type ValidationErrors = Record<string, string[]>;

export interface ErrorResponse {
  success: false;
  message: string;
  code?: string;
  details?: ValidationErrors;
  stack?: string;
}

const DEFAULT_INTERNAL_MESSAGE =
  "Something went wrong on our end. Please try again later.";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const isProduction = process.env.NODE_ENV === "production";

  if (error instanceof ZodError) {
    const response: ErrorResponse = {
      success: false,
      message: "Validation failed.",
      code: "VALIDATION_ERROR",
      details: error.flatten().fieldErrors,
    };

    res.status(400).json(response);
    return;
  }

  const statusCode = error instanceof ApiError ? error.statusCode : 500;

  const message =
    error instanceof ApiError
      ? error.message
      : isProduction
        ? DEFAULT_INTERNAL_MESSAGE
        : error instanceof Error
          ? error.message
          : DEFAULT_INTERNAL_MESSAGE;

  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (error instanceof ApiError && error.code !== undefined) {
    response.code = error.code;
  }

  if (error instanceof ApiError && error.details !== undefined) {
    response.details = error.details;
  }

  if (!isProduction && error instanceof Error && error.stack) {
    response.stack = error.stack;
  }

  console.error({
    error,
    stack: error instanceof Error ? error.stack : undefined,
  });

  res.status(statusCode).json(response);
};
