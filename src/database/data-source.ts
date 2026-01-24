import { Pool, type PoolClient, type PoolConfig } from "pg";
import { env } from "../core/config/env";
import { singleton } from "tsyringe";

const basePoolConfig: PoolConfig = {
  connectionString: env.DATABASE_URL,
  max: env.MAX_POOL,
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
    this.pool.on("error", (err) => console.error("Erro no pool:", err.message));
  }

  async query(sql: string, params: unknown[]) {
    return await this.pool.query(sql, params);
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>) {
    const client = await this.pool.connect();

    try {
      await client.query(`BEGIN`);
      const result = await callback(client);
      await client.query(`COMMIT`);
      return result;
    } catch (err) {
      console.error("Erro na transaction: ", err);
      await client.query(`ROLLBACK`);
      throw err;
    } finally {
      client.release();
    }
  }

  async end() {
    await this.pool.end();
  }
}
