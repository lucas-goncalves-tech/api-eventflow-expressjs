import { BaseError } from "./base.error";

export class GoneError extends BaseError {
  constructor(message = "Recurso não está mais disponível") {
    super(message, 410);
  }
}
