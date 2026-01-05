import { Pool, type PoolConfig } from "pg";
import { env } from "../core/config/env";
import { singleton } from "tsyringe";

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

@singleton()
export class DatabasePool {
  private readonly pool = new Pool(isDev ? basePoolConfig : productionPool);
  constructor() {
    if (isDev) {
      this.pool.on("connect", () => console.log("Nova conexão criada"));
      this.pool.on("acquire", () => console.log("Conexão emprestada"));
    }
    this.pool.on("remove", () => console.log("Conexão removida"));
    this.pool.on("error", (err) => console.error("Erro no pool:", err.message));
  }

  async query(sql: string, params: unknown[]) {
    return await this.pool.query(sql, params);
  }

  async end() {
    await this.pool.end();
  }
}
