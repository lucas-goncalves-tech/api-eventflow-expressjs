import { Router } from "express";
import { EventRoutes } from "../modules/events/event.routes";
import { inject, injectable } from "tsyringe";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { UserRoutes } from "../modules/user/user.routes";

@injectable()
export class Routes {
  private router: Router;
  constructor(
    @inject(EventRoutes) private eventRoutes: EventRoutes,
    @inject(AuthRoutes) private authRoutes: AuthRoutes,
    @inject(UserRoutes) private userRoutes: UserRoutes
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.use("/events", this.eventRoutes.getRouter());
    this.router.use("/auth", this.authRoutes.getRouter());
    this.router.use("/users", this.userRoutes.getRouter());
  }

  public getRouter() {
    return this.router;
  }
}
