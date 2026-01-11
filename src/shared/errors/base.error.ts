import { ZodError } from "zod";

export class BaseError extends Error {
  statusCode: number;
  details?: unknown;
  constructor(message: string, statusCode: number, details?: unknown) {
    const errors: unknown[] = [];
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    if (details instanceof ZodError) {
      errors.push(
        ...details.issues.map((issue) => ({
          message: issue.message,
          path: issue.path,
        }))
      );
      this.details = errors;
    }
  }
}
