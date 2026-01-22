import { container, injectable } from "tsyringe";
import { EventController } from "./event.controller";
import { Router } from "express";
import { validate } from "../../shared/middlewares/validate.middleware";
import { createEventDto, updateEventDto } from "./dto/event.dto";
import { eventsParamsSchema, eventsQuerySchema } from "./dto/event-params.dto";
import { authValidate } from "../../shared/middlewares/auth-validate.middleware";
import { roleValidate } from "../../shared/middlewares/role-validate.middleware";

@injectable()
export class EventRoutes {
  private controller: EventController;
  private router: Router;
  constructor() {
    this.controller = container.resolve(EventController);
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get(
      "/",
      validate({ query: eventsQuerySchema }),
      this.controller.findMany,
    );
    this.router.get(
      "/:id",
      validate({ params: eventsParamsSchema }),
      this.controller.findById,
    );
    this.router.post(
      "/",
      authValidate,
      roleValidate("ORGANIZER"),
      validate({ body: createEventDto }),
      this.controller.create,
    );
    this.router.put(
      "/:id",
      authValidate,
      roleValidate("ORGANIZER"),
      validate({ params: eventsParamsSchema, body: updateEventDto }),
      this.controller.update,
    );
    this.router.delete(
      "/:id",
      authValidate,
      roleValidate("ORGANIZER"),
      validate({ params: eventsParamsSchema }),
      this.controller.delete,
    );
  }

  public getRouter() {
    return this.router;
  }
}
