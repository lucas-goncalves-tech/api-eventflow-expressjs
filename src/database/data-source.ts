import { Pool, type PoolConfig } from "pg";
import { env } from "../core/config/env";

const basePoolConfig: PoolConfig = {
  connectionString: env.DATABASE_URL,
  max: env.MAX_POOL,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 5_000,
};

const productionPool: PoolConfig = {
  ...basePoolConfig,
  min: 2,
  maxLifetimeSeconds: 60 * 30,
};

const isDev = env.NODE_ENV === "development";
const pool = new Pool(isDev ? basePoolConfig : productionPool);
if (isDev) {
  pool.on("connect", () => console.log("Nova conexão criada"));
  pool.on("acquire", () => console.log("Conexão emprestada"));
}
pool.on("remove", () => console.log("Conexão removida"));
pool.on("error", (err) => console.error("Erro no pool:", err.message));

export { pool };
