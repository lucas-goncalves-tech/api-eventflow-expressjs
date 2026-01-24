import { container, injectable } from "tsyringe";
import { AuthController } from "./auth.controller";
import { Router } from "express";
import { validate } from "../../shared/middlewares/validate.middleware";
import { signupDto } from "./dto/signup.dto";
import { signinDto } from "./dto/signin.dto";
import { authLimiter } from "../../shared/middlewares/rate-limit.middleware";

@injectable()
export class AuthRoutes {
  private readonly controller: AuthController;
  private readonly router: Router;
  constructor() {
    this.router = Router();
    this.controller = container.resolve(AuthController);
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.use(authLimiter);
    this.router.post(
      "/register",
      validate({ body: signupDto }),
      this.controller.register,
    );
    this.router.post(
      "/login",
      validate({ body: signinDto }),
      this.controller.login,
    );
  }

  public getRouter() {
    return this.router;
  }
}
