import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../../core/config/env";
import { UnauthorizedError } from "../errors/unauthorized.error";

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
    return jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw new UnauthorizedError("Token inválido ou expirado");
  }
}
