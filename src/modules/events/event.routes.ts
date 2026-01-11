import { container } from "tsyringe";
import { EventController } from "./event.controller";
import { Router } from "express";
import { validate } from "../../shared/middlewares/validate.middleware";
import { createEventDto } from "./dto/event.dto";

export class EventRoutes {
  private controller: EventController;
  private router: Router;
  constructor() {
    this.controller = container.resolve(EventController);
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post(
      "/",
      validate({ body: createEventDto }),
      this.controller.createEvent
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
