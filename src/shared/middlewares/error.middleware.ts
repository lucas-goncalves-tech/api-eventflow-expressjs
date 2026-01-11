import type { NextFunction, Request, Response } from "express";
import { BaseError } from "../errors/base.error";

export function errorGlobalHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }
  console.error(err);
  return res.status(500).json({
    message: "Erro interno do servidor",
  });
}
