import { BaseError } from "./base.error";

export class BadRequestError extends BaseError {
  constructor(message: string = "Requisição inválida") {
    super(message, 400);
  }
}
