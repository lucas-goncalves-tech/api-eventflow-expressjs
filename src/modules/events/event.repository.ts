import { inject, injectable } from "tsyringe";
import { DatabasePool } from "../../database/data-source";
import type {
  ICreateEvent,
  IEvent,
  IEventRepository,
  IEventsQuery,
  IFindManyEvents,
} from "./interfaces/event.interface";

@injectable()
export class EventRepository implements IEventRepository {
  constructor(
    @inject(DatabasePool)
    private pool: DatabasePool,
  ) {}

  async findMany({ search, limit = 10, page = 1 }: IEventsQuery) {
    const safeSearch = `%${search}%`;
    const safeLimit = limit > 100 ? 100 : limit;
    const safeOffset = (page - 1) * limit;

    const index = search ? 2 : 1;
    const values = [];

    let query = `SELECT *, COUNT(*) OVER() AS total FROM events`;
    const queryFinal = ` ORDER BY "created_at" DESC LIMIT $${index} OFFSET $${index + 1} `;

    if (search) {
      query += ` WHERE title ILIKE $1 OR description ILIKE $1 AND deleted_at IS NULL`;
      values.push(safeSearch);
    }
    values.push(safeLimit, safeOffset);
    const result = await this.pool.query(query + queryFinal, values);
    const total = result.rows[0]?.total;

    return {
      data: result.rows.map(({ total, ...rest }) => rest) as IEvent[],
      meta: {
        total: parseInt(total) || 0,
        limit,
        page,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
  }

  async findById(id: string) {
    try {
      const result = await this.pool.query(
        `SELECT * FROM events WHERE id = $1`,
        [id],
      );
      return result.rows[0] ?? null;
    } catch (err) {
      console.error("Erro ao buscar evento pelo ID: ", err);
      throw err;
    }
  }

  async create(userId: string, data: ICreateEvent) {
    const keys: string[] = ["owner_id"];
    const values: unknown[] = [userId];

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      keys.push(key);
      values.push(value);
    }
    const index = values.map((_, i) => `$${i + 1}`);

    try {
      const result = await this.pool.query(
        `
        INSERT INTO events (${keys.join(", ")}) 
        VALUES (${index.join(", ")})
        RETURNING *`,
        values,
      );

      return result.rows[0] ?? null;
    } catch (err) {
      console.error("Error ao tentar criar event; ", err);
      throw err;
    }
  }

  async update(id: string, eventData: Partial<IEvent>) {
    const keys: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(eventData)) {
      if (value === undefined) continue;
      keys.push(`${key} = $${i++}`);
      values.push(value);
    }

    try {
      const result = await this.pool.query(
        `
        UPDATE events 
        SET ${keys.join(", ")} 
        WHERE id = $${i} 
        RETURNING *`,
        [...values, id],
      );
      return result.rows[0] ?? null;
    } catch (err) {
      console.error("Error ao atualizar dados de events: ", err);
      throw err;
    }
  }

  async delete(id: string) {
    try {
      const result = await this.pool.query(
        "UPDATE events SET deleted_at = NOW() WHERE id = $1",
        [id],
      );
      return result.rowCount;
    } catch (err) {
      console.error("Error ao delete evento: ", err);
      throw err;
    }
  }
}
