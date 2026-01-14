import { Router } from "express";
import { EventRoutes } from "../modules/events/event.routes";
import { inject, injectable } from "tsyringe";
import { AuthRoutes } from "../modules/auth/auth.routes";

@injectable()
export class Routes {
  private router: Router;
  constructor(
    @inject(EventRoutes) private eventRoutes: EventRoutes,
    @inject(AuthRoutes) private authRoutes: AuthRoutes
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.use("/events", this.eventRoutes.getRouter());
    this.router.use("/auth", this.authRoutes.getRouter());
  }

  public getRouter() {
    return this.router;
  }
}
