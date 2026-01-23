import { container, injectable } from "tsyringe";
import { TicketController } from "./ticket.controller";
import { Router } from "express";
import { validate } from "../../shared/middlewares/validate.middleware";
import { ticketParamsSchema } from "./dto/ticket.dto";
import { authValidate } from "../../shared/middlewares/auth-validate.middleware";

@injectable()
export class TicketRoutes {
  private controller: TicketController;
  private router: Router;

  constructor() {
    this.controller = container.resolve(TicketController);
    this.router = Router({ mergeParams: true });
    this.setupRoutes();
  }

  private setupRoutes() {
    // GET /events/:id/tickets → disponibilidade
    this.router.get(
      "/",
      validate({ params: ticketParamsSchema }),
      this.controller.getAvailability,
    );

    // POST /events/:id/tickets → comprar ticket
    this.router.post(
      "/",
      authValidate,
      validate({ params: ticketParamsSchema }),
      this.controller.purchase,
    );
  }

  public getRouter() {
    return this.router;
  }
}
