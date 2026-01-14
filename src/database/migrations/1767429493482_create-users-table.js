import { MigrationBuilder, PgLiteral } from "node-pg-migrate";

export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable("users", {
    id: {
      type: "UUID",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    email: {
      type: "varchar(100)",
      unique: true,
      notNull: true,
    },
    name: {
      type: "varchar(100)",
      notNull: true,
    },
    password_hash: {
      type: "varchar(255)",
      notNull: true,
    },
    role: {
      type: "varchar(15)",
      default: "USER",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("NOW()"),
    },
  });

  pgm.createConstraint("users", "user_role_check", {
    check: "role IN ('USER', 'ORGANIZER' ,'ADMIN')",
  });
}

export async function down(pgm) {
  pgm.dropTable("users", { cascade: true });
}
