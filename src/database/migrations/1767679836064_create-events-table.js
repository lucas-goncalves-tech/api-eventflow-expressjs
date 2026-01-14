import { MigrationBuilder, PgLiteral } from "node-pg-migrate";

export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable("events", {
    id: {
      type: "UUID",
      primaryKey: true,
      default: pgm.func(`gen_random_uuid()`),
    },
    title: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    description: {
      type: "TEXT",
    },
    starts_at: {
      type: "TIMESTAMPTZ",
      notNull: true,
    },
    ends_at: {
      type: "TIMESTAMPTZ",
      notNull: true,
    },
    location: {
      type: "VARCHAR(200)",
    },
    capacity: {
      type: "INTEGER",
      notNull: true,
      default: "100",
    },
    created_at: {
      type: "TIMESTAMPTZ",
      notNull: true,
      default: pgm.func("NOW()"),
    },
    deleted_at: {
      type: "TIMESTAMPTZ",
    },
  });

  pgm.createConstraint("events", "events_capacity_positive", {
    check: "capacity > 0",
  });
  pgm.createConstraint("events", "events_dates_valid", {
    check: "ends_at > starts_at",
  });
  pgm.createIndex("events", "starts_at", {
    name: "idx_events_starts_at",
  });
}

export async function down(pgm) {
  pgm.dropTable("events");
}
