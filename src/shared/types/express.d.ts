declare global {
  namespace Express {
    interface Request {
      safeBody?: unknown;
      safeParams?: unknown;
      safeQuery?: unknown;
      user?: {
        sid: string,
        role: "USER" | "ORGANIZER" | "ADMIN"
      }
    }
  }
}

export {};
