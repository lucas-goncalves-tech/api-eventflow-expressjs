import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../core/config/env";
import { UnauthorizedError } from "../errors/unauthorized.error";
import z from "zod";

const userPayloadSchema = z.looseObject({
  sid: z.uuid(),
  role: z.enum(["USER", "ORGANIZER", "ADMIN"]),
});

export type UserPayload = z.infer<typeof userPayloadSchema>;

export function generateToken(payload: {
  sid: string;
  role: "USER" | "ORGANIZER" | "ADMIN";
}) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES as SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string) {
  try {
    return userPayloadSchema.parse(jwt.verify(token, env.JWT_SECRET));
  } catch {
    throw new UnauthorizedError("Token inválido ou expirado");
  }
}
