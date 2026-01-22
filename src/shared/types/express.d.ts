import type { Role } from "./generic.type";

declare global {
  namespace Express {
    interface Request {
      safeBody?: unknown;
      safeParams?: unknown;
      safeQuery?: unknown;
      user?: {
        sid: string;
        role: Role;
      };
    }
  }
}

export {};
