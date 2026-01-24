import "reflect-metadata";

import { Pool } from "pg";
import { afterAll, beforeAll, beforeEach } from "vitest";
import { runner } from "node-pg-migrate";
import path from "node:path";
import bcrypt from "bcrypt";
import { env } from "../core/config/env";

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

  const hash = await bcrypt.hash("12345678", 10);
  await testPool.query(
    `
    INSERT INTO users (email, name, password_hash, role)
    VALUES ($1, $2, $3, $4)`,
    ["test@user.com", "user", hash, "USER"],
  );
  await testPool.query(
    `
    INSERT INTO users (email, name, password_hash, role)
    VALUES ($1, $2, $3, $4)`,
    ["test@organizer.com", "organizer", hash, "ORGANIZER"],
  );
  await testPool.query(
    `
    INSERT INTO users (email, name, password_hash, role)
    VALUES ($1, $2, $3, $4)`,
    ["test@organizer-second.com", "organizer-second", hash, "ORGANIZER"],
  );
  await testPool.query(
    `
    INSERT INTO users (email, name, password_hash, role)
    VALUES ($1, $2, $3, $4)`,
    ["test@admin.com", "admin", hash, "ADMIN"],
  );
});

afterAll(async () => {
  await testPool.end();
});
