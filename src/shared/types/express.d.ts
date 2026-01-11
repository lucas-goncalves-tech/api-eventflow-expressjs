declare global {
  namespace Express {
    interface Request {
      safeBody?: unknown;
      safeParams?: unknown;
      safeQuery?: unknown;
    }
  }
}

export {};
