import z from "zod";

const enviroments = z.object({
  MAX_POOL: z.coerce.number().default(10),
  PORT: z.coerce.number().default(3333),
  POSTGRES_USER: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "production"]),
});

export const env = enviroments.parse(process.env);
