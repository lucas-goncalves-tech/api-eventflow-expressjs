import { Router } from "express";
import { EventRoutes } from "../modules/events/event.routes";
import { inject, injectable } from "tsyringe";

@injectable()
export class Routes {
  private router: Router;
  constructor(@inject(EventRoutes) private eventRoutes: EventRoutes) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.use("/events", this.eventRoutes.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
