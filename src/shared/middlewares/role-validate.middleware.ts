import type { NextFunction, Request, Response } from "express";
import type { Role } from "../types/generic.type";
import { ForbiddenError } from "../errors/forbidden.error";

export function roleValidate(allowedRole: Exclude<Role, "USER">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole)
      throw new Error(
        "User payload não foi recebido, causa: authValidate não foi utilizado antes de roleValidate",
      );
    switch (allowedRole) {
      case "ADMIN":
        if (userRole === "ADMIN") {
          return next();
        }
        throw new ForbiddenError();
      case "ORGANIZER":
        if (userRole === "ORGANIZER" || userRole === "ADMIN") {
          return next();
        }
        throw new ForbiddenError();
      default:
        throw new ForbiddenError();
    }
  };
}
