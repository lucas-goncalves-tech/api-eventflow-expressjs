import type { PoolClient } from "pg";
import { inject, injectable } from "tsyringe";
import { DatabasePool } from "../../database/data-source";
import type {
  ICreateTicketDTO,
  ITicket,
  ITicketRepository,
} from "./interfaces/ticket.interface";

@injectable()
export class TicketRepository implements ITicketRepository {
  constructor(
    @inject(DatabasePool)
    private pool: DatabasePool,
  ) {}

  async create(data: ICreateTicketDTO, client: PoolClient): Promise<ITicket> {
    try {
      const result = await client.query(
        `INSERT INTO tickets (event_id, user_id, price_paid, purchased_at) VALUES ($1, $2, $3, NOW()) RETURNING *`,
        [data.event_id, data.user_id, data.price_paid],
      );
      return result.rows[0];
    } catch (err) {
      console.error("Erro ao criar ticket: ", err);
      throw err;
    }
  }

  async findByEventAndUser(
    eventId: string,
    userId: string,
  ): Promise<ITicket | null> {
    const result = await this.pool.query(
      `SELECT * FROM tickets WHERE event_id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [eventId, userId],
    );
    return result.rows[0] ?? null;
  }

  async findByUser(userId: string): Promise<ITicket[]> {
    try {
      const result = await this.pool.query(
        `SELECT * FROM tickets WHERE user_id = $1 AND deleted_at IS NULL`,
        [userId],
      );
      return result.rows;
    } catch (err) {
      console.error("Erro ao encontrar tickets do usuário: ", err);
      throw err;
    }
  }
}
