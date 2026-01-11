import type { NextFunction, Request, Response } from "express";
import type z from "zod";
import { ZodError } from "zod";
import { BadRequestError } from "../errors/bad-request.error";

type SchemaProps = {
  body?: z.ZodSchema;
  params?: z.ZodSchema;
  query?: z.ZodSchema;
};

export function validate(schema: SchemaProps) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params) as (typeof req)["params"];
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query) as (typeof req)["query"];
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestError("Requisição inválida", err);
      }
      throw next(err);
    }
  };
}
