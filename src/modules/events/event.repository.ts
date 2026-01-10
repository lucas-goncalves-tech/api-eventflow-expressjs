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
      console.log(event.rows);
      return event.rows[0];
    } catch (err) {
      console.error("Erro ao criar evento:", err);
      throw err;
    }
  }

  async findById(id: string) {
    try {
      const result = await this.pool.query(
        `SELECT * FROM events WHERE id = $1 AND deleted_at = NULL`,
        [id]
      );
      return result.rows[0] ?? null;
    } catch (err) {
      console.log("Não foi possivel Encontrar evento por ID", err);
      throw err;
    }
  }

  async FindMany(search?: string, limit: number = 10, page: number = 1) {
    const offset = (page - 1) * limit;
    const safeLimit = Math.min(limit, 100);
    const searchLike = `%${search}%`;
    const index = search ? 2 : 1;
    let query = `SELECT *, COUNT(*) OVER () AS total FROM events WHERE deleted_at IS NULL`;
    let result;
    try {
      if (search) {
        query += ` AND title ILIKE $1`;
      }

      result = await this.pool.query(
        query +
          ` ORDER BY created_at DESC LIMIT $${index} OFFSET $${index + 1}`,
        [searchLike, safeLimit, offset]
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
      console.log("NÂO foi possivel encontrar todos os eventos", err);
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

    if (toUpdate.length === 0) return null;

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
