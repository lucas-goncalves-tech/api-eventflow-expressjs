import z from "zod";

const enviroments = z.object({
    PORT: z.string().default("3333"),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    DATABASE_URL: z.string(),
    NODE_ENV: z.enum(["development", "production"]).default("production"),
});

export const env = enviroments.parse(process.env);