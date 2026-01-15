import { AuthService } from "./auth.service";
import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";
import type { SignupDto } from "./dto/signup.dto";
import type { SigninDto } from "./dto/signin.dto";
import {
  SID_HEADER,
  sidCookieOptions,
} from "../../shared/constants/sid-header";

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    const { email, name, password } = req.safeBody as SignupDto;
    const user = await this.authService.register({ email, name, password });
    return res.status(201).json(user);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.safeBody as SigninDto;
    const { token } = await this.authService.login({ email, password });

    res.cookie(SID_HEADER, token, sidCookieOptions());
    return res.status(204).end();
  };
}
