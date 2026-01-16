import { container } from "tsyringe";
import { UserController } from "./user.controller";
import { Router } from "express";
import { authValidate } from "../../shared/middlewares/auth-validate.middleware";

export class UserRoutes {
    private controller: UserController
    private router: Router
    constructor(){
        this.router = Router()
        this.controller = container.resolve(UserController)
        this.setupRoutes()
    }

    private setupRoutes(){
        this.router.get("/me", authValidate, this.controller.me)
    }

    getRouter(){
        return this.router
    }
}