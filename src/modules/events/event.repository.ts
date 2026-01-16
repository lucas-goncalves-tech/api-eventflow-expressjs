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
    private pool: DatabasePool
  ) {}

  async findById(id: string) {
    try {
      const result = await this.pool.query(
        `SELECT * FROM events WHERE id = $1 AND deleted_at IS NULL`,
        [id]
      );
      return result.rows[0] ?? null;
    } catch (err) {
      console.error("Não foi possivel Encontrar evento por ID", err);
      throw err;
    }
  }

  async findMany({
    search,
    limit = 10,
    page = 1,
  }: IEventsQuery): Promise<IFindManyEvents> {
    const offset = (page - 1) * limit;
    const safeLimit = Math.min(limit, 100);
    const searchLike = `%${search}%`;
    const index = search ? 2 : 1;
    const values: unknown[] = [];
    let query = `SELECT *, COUNT(*) OVER () AS total FROM events WHERE deleted_at IS NULL`;
    let result;
    try {
      if (search) {
        query += ` AND title ILIKE $1`;
        values.push(searchLike);
      }
      values.push(safeLimit, offset);
      result = await this.pool.query(
        query +
          ` ORDER BY created_at DESC LIMIT $${index} OFFSET $${index + 1}`,
        values
      );
      const total =
        result.rows.length > 0 ? parseInt(result.rows[0].total, 10) : 0;
      return {
        data: result.rows.map(({ total, ...row }) => row) as IEvent[],
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      console.error("Não foi possivel encontrar todos os eventos", err);
      throw err;
    }
  }

  async create(data: ICreateEvent) {
    try {
      const event = await this.pool.query(
        `INSERT INTO events (title, description, starts_at, ends_at, location, capacity)
            VALUES ($1, $2, $3, $4, $5, COALESCE($6, 100))
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
    } catch (err) {
      console.error("Erro ao criar evento:", err);
      throw err;
    }
  }
  async update(id: string, eventData: Partial<IEvent>) {
    const toUpdate: string[] = [];
    const values: unknown[] = [];
    let i = 2;

    for (const [key, value] of Object.entries(eventData)) {
      if (key === undefined || value === undefined) continue;
      toUpdate.push(`${key} = $${i++}`);
      values.push(value);
    }

    try {
      const result = await this.pool.query(
        `UPDATE events SET ${toUpdate.join(", ")} WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      return (result.rows[0] as IEvent) ?? null;
    } catch (err) {
      console.error("Erro ao fazer updade de events ", err);
      throw err;
    }
  }

  async delete(id: string) {
    try {
      const result = await this.pool.query(
        `UPDATE events SET deleted_at = NOW() WHERE id = $1`,
        [id]
      );
      return result.rowCount ?? null;
    } catch (err) {
      console.error("Error em soft delete event ", err);
      throw err;
    }
  }
}
