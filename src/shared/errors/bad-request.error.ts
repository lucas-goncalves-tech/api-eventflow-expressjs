import { BaseError } from "./base.error";

export class BadRequestError extends BaseError {
  constructor(message: string = "Requisição inválida", details?: unknown) {
    super(message, 400, details);
  }
}
