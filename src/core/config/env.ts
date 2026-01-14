import z from "zod";

const enviroments = z.object({
  JWT_SECRET: z.string(),
  JWT_EXPIRES: z.string(),
  SALT_ROUNDS: z.coerce.number().default(10),
  PORT: z.coerce.number().default(3333),
  MAX_POOL: z.coerce.number().default(10),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "production"]),
});

export const env = enviroments.parse(process.env);
