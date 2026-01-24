import rateLimit from "express-rate-limit";

const ttl = 15 * 60 * 1000;
const errorMessage = `Muitas requisições, tente novamente em ${ttl / 60 / 1000} minutos`;

export const globalLimiter = rateLimit({
  windowMs: ttl,
  max: 100,
  message: errorMessage,
});

export const authLimiter = rateLimit({
  windowMs: ttl,
  max: 5,
  message: errorMessage,
  skipSuccessfulRequests: true,
});
