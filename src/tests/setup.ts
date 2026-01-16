import "reflect-metadata";

import { Pool } from "pg";
import { afterAll, beforeAll, beforeEach } from "vitest";
import { env } from "../core/config/env";
import { runner } from "node-pg-migrate";
import path from "node:path";

const connectionString = env.DATABASE_URL;
const testPool = new Pool({ connectionString });

beforeAll(async () => {
  await runner({
    databaseUrl: connectionString,
    direction: "up",
    migrationsTable: "pgmigration",
    dir: path.resolve(__dirname, "../database/migrations"),
  });
});

beforeEach(async () => {
  await testPool.query(`TRUNCATE events, users CASCADE`);
});

afterAll(async () => {
  await testPool.end();
});
