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
      query += ` WHERE title ILIKE $1 OR description ILIKE $1`;
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

  async findById(id: string) {}

  async create(userId: string, data: ICreateEvent) {
    const keys: string[] = ["owner_id"];
    const values: unknown[] = [userId];

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      keys.push(key);
      values.push(value);
    }
    const index = values.map((_, i) => `$${i + 1}`);

    const result = await this.pool.query(
      `
    INSERT INTO events (${keys.join(", ")}) 
    VALUES (${index.join(", ")})
    RETURNING *`,
      values,
    );

    return result.rows[0] ?? null;
  }

  async update(id: string, eventData: Partial<IEvent>) {}

  async delete(id: string) {}
}
