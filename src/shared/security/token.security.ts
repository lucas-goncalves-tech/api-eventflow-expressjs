import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../core/config/env";
import { UnauthorizedError } from "../errors/unauthorized.error";
import z from "zod";

const payloadSchema = z.object({
  sid: z.uuid(),
  role: z.enum(["USER", "ORGANIZER", "ADMIN"]),
  iat: z.coerce.number(),
  exp: z.coerce.number()
})

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
    return payloadSchema.parse(jwt.verify(token, env.JWT_SECRET));    
  } catch {
    throw new UnauthorizedError("Token inválido ou expirado");
  }
}
