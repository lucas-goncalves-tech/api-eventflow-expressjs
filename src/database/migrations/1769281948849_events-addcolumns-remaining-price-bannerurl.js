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
    pgm.addColumn("events", {
        price: {
            type: "DECIMAL(10,2)",
            notNull: true
        },
        remaining: {
            type: "INTEGER",
            notNull: true
        },
        banner_url: {
            type: "VARCHAR(255)"
        }
    });
    
    pgm.sql("UPDATE events SET remaining = capacity");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropColumn("events", ["price", "remaining", "banner_url"]);
};
