import { inject, injectable } from "tsyringe";
import { UserService } from "./user.service";
import type { Request, Response } from "express";

@injectable()
export class UserController {
    constructor(@inject(UserService) private readonly userService: UserService){}

    me = async (req: Request, res: Response) => {
        const {sid} = req.user!
        const user = await this.userService.me(sid);

        res.json(user)
    }
}