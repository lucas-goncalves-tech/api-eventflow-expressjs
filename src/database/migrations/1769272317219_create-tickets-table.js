/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable("tickets", {
        id: {
            type: "UUID",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },
        user_id: {
            type: "UUID",
            references: "users(id)",
            notNull: true,            
            onDelete: "CASCADE"
        },
        event_id: {
            type: "UUID",
            notNull: true,
            references: "events(id)",            
            onDelete: "CASCADE"
        },
        price_paid: {
            type: "DECIMAL(10,2)",
            notNull: true,            
        },
        purchased_at: {
            type: "TIMESTAMPTZ",
        },
        deleted_at: {
            type: "TIMESTAMPTZ"
        }  
    })

    pgm.sql(`ALTER TABLE "tickets" ADD CONSTRAINT unique_userid_eventid UNIQUE ("user_id","event_id")`)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("tickets")
};
