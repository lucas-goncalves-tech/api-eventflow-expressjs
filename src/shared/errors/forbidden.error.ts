import { BaseError } from "./base.error";

export class ForbiddenError extends BaseError {
  constructor(message: string = "Acesso Negado") {
    super(message, 403);
  }
}
