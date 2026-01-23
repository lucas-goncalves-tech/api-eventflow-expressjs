import { BaseError } from "./base.error";

export class ConflictError extends BaseError {
  constructor(message = "Conflito de recursos") {
    super(message, 409);
  }
}
