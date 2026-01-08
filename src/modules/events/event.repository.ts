import { inject } from "tsyringe";
import { DatabasePool } from "../../database/data-source";
import type { IEvent } from "./interfaces/event.interface";

export class EventRepository {
  constructor(
    @inject(DatabasePool)
    private pool: DatabasePool
  ) {}

  async create(data: IEvent) {
    try {
      const event = await this.pool.query(
        `INSERT INTO events (title, description, starts_at, ends_at, location, capacity)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
        [
          data.title,
          data.description,
          data.starts_at,
          data.ends_at,
          data.location,
          data.capacity,
        ]
      );
      return event.rows[0];
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      throw error;
    }
  }
}
