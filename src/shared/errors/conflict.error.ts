import { BaseError } from "./base.error";

export class ConflictError extends BaseError {
  constructor(message: string = "Entidade já cadastrada") {
    super(message, 409);
  }
}
